// Optional browser fixtures. Build out/ first and provide Playwright.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
let base=process.env.BASE_URL;
const http=require('node:http'),path=require('node:path');
const company='11111111-1111-4111-8111-111111111111',owner='22222222-2222-4222-8222-222222222222',member='33333333-3333-4333-8333-333333333333',invitation='44444444-4444-4444-8444-444444444444';
const now=new Date().toISOString(),later=new Date(Date.now()+86400000).toISOString();
const companies=[{id:company,name:'LINETECH Test Company',owner_id:owner,created_at:now}];
(async()=>{
  let server;
  if(!base){
    const root=path.resolve(__dirname,'../out');
    server=http.createServer((req,res)=>{
      let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
      if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
      try{
        if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
        const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.txt':'text/plain','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'};
        res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
      }catch{res.writeHead(404).end();}
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    base='http://127.0.0.1:'+server.address().port;
  }
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  let checks=0;
  try{
    const context=await browser.newContext();const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('dialog',dialog=>dialog.accept());
    let teamOwner=true,unavailable=false,failInvite=false,joined=false,posts=[];
    let members=[],invitations=[],inbox=[];
    function reset(){members=[{user_id:owner,email:'owner@example.test',role:'owner',created_at:now},{user_id:member,email:'member@example.test',role:'member',created_at:now}];invitations=[];inbox=[{id:invitation,company_id:company,company_name:companies[0].name,email:'invited@example.test',expires_at:later,created_at:now},{id:'55555555-5555-4555-8555-555555555555',company_id:company,company_name:'Second Test Company',email:'invited@example.test',expires_at:later,created_at:now}];}
    reset();
    await page.route('**/api/**',async route=>{
      const req=route.request(),url=new URL(req.url());let data={ok:true},status=200;
      if(url.pathname==='/api/company-team'){
        if(req.method()==='POST'){
          const value=req.postDataJSON();posts.push(value);
          if(value.action==='invite'){
            if(failInvite){failInvite=false;return route.fulfill({status:503,json:{ok:false}});}
            invitations=[{id:invitation,email:value.email,status:'pending',expires_at:later,created_at:now}];
          }else if(value.action==='revoke')invitations[0].status='revoked';
          else if(value.action==='remove')members=members.filter(m=>m.user_id!==value.userId);
          data.result={id:invitation};
        }else if(unavailable){status=503;data={ok:false};}
        else data.team={id:company,name:companies[0].name,owner:teamOwner,members:members.map(m=>({...m,email:teamOwner?m.email:null})),invitations:teamOwner?invitations:[]};
      }else if(url.pathname==='/api/company-invitations'){
        if(req.method()==='POST'){const input=req.postDataJSON();posts.push(input);inbox=inbox.filter(i=>i.id!==input.invitationId);if(input.action==='accept')joined=true;data.result={id:input.invitationId,company_id:company};}
        else data.invitations=inbox;
      }else if(url.pathname==='/api/companies')data.companies=joined?companies:[];
      else if(url.pathname==='/api/company-applications')data.applications=[];
      else if(url.pathname==='/api/auth/session')data.user={id:owner,email:'owner@example.test',app_metadata:{role:'client'}};
      else if(url.pathname==='/api/notifications')data.notifications=[];
      else if(url.pathname==='/api/projects')data.projects=[];
      await route.fulfill({status,json:data});
    });
    async function language(lang){await page.addInitScript(value=>localStorage.setItem('linetech-language-v1',value),lang);}
    async function noOverflow(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'Page overflows horizontally');checks++;}
    for(const lang of ['ar','en']){
      await language(lang);const ar=lang==='ar';
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        await page.goto(base+'/company-space/members/?company='+company);
        await page.getByRole('button',{name:ar?'إنشاء دعوة':'Create invitation',exact:true}).waitFor();await noOverflow();
        assert.equal(await page.locator('html').getAttribute('dir'),ar?'rtl':'ltr');checks++;
        if(process.env.SCREENSHOT_DIR&&(width===390||width===1440)){
          fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});
          await page.screenshot({path:process.env.SCREENSHOT_DIR+`/team-${lang}-${width}.png`,fullPage:true});
        }
        await page.goto(base+'/account/companies/');
        await page.getByRole('button',{name:ar?'قبول الدعوة':'Accept invitation',exact:true}).first().waitFor();await noOverflow();
      }
    }
    await language('en');await page.setViewportSize({width:390,height:900});
    await page.goto(base+'/company-space/members/?company='+company);
    const email=page.getByRole('textbox',{name:'Email address',exact:true});await email.fill('invited@example.test');failInvite=true;
    await page.getByRole('button',{name:'Create invitation',exact:true}).click();
    await page.getByRole('alert').waitFor();assert.equal(await email.inputValue(),'invited@example.test');assert.equal(await page.getByRole('status').count(),0);checks++;
    await page.getByRole('button',{name:'Create invitation',exact:true}).click();
    await page.getByRole('button',{name:'Cancel invitation',exact:true}).waitFor();assert.equal(await email.inputValue(),'');
    assert((await page.getByRole('status').innerText()).includes('No email message was sent'));checks++;
    await page.getByRole('button',{name:'Cancel invitation',exact:true}).click();await page.getByText('Cancelled ·',{exact:false}).waitFor();checks++;
    await page.getByRole('button',{name:'Remove member',exact:true}).click();await page.getByText('member@example.test',{exact:true}).waitFor({state:'detached'});checks++;
    teamOwner=false;await page.reload();await page.getByText('You are a team member',{exact:true}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Create invitation',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Remove member',exact:true}).count(),0);checks++;
    unavailable=true;await page.reload();await page.getByText('Team unavailable',{exact:true}).waitFor();
    unavailable=false;await page.getByRole('button',{name:'Try again',exact:true}).click();await page.getByText('You are a team member',{exact:true}).waitFor();checks++;
    await page.goto(base+'/company-space/members/');await page.getByText('Choose a company first',{exact:true}).waitFor();checks++;
    reset();joined=false;await page.goto(base+'/account/companies/');
    await page.getByRole('button',{name:'Accept invitation',exact:true}).first().click();
    await page.getByRole('status').filter({hasText:'You joined the company.'}).waitFor();
    await page.getByRole('link',{name:'LINETECH Test Company Open company'}).waitFor();checks++;
    await page.getByRole('button',{name:'Decline',exact:true}).click();await page.getByText('No active invitations for this account.',{exact:true}).waitFor();checks++;
    assert(posts.some(x=>x.action==='invite')&&posts.some(x=>x.action==='revoke')&&posts.some(x=>x.action==='remove')&&posts.some(x=>x.action==='accept')&&posts.some(x=>x.action==='decline'));
    assert.deepEqual(errors,[]);console.log(`PASS: ${checks} company browser fixture checks; AR/EN 320/390/768/1440px, failure/retry, owner/member UI, invitation and removal lifecycle. Hosted Auth/PostgREST not tested.`);
  }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
