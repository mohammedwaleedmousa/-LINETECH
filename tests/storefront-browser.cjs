const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
async function serve(root){root=path.resolve(root);const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'};res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
});await new Promise(r=>server.listen(0,'127.0.0.1',r));return{server,url:'http://127.0.0.1:'+server.address().port};}
(async()=>{
  const live=await serve(path.join(__dirname,'../out'));
  const baseline=process.env.HOME_BASELINE_OUT?await serve(process.env.HOME_BASELINE_OUT):null;
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  let checks=0;
  try{
    const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await context.route('**/api/**',route=>{const p=new URL(route.request().url()).pathname;return route.fulfill({json:p==='/api/auth/session'?{user:{id:'fixture',app_metadata:{role:'client'}}}:p==='/api/account'?{ok:true,account:{profile:{fullName:'Test Client'},subscription:null}}:p==='/api/notifications'?{ok:true,notifications:[]}:{ok:true,projects:[]}});});
    for(const lang of ['ar','en']){
      await page.addInitScript(language=>localStorage.setItem('linetech-language-v1',language),lang);
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:900});
        for(const route of ['/products/','/pricing/','/services/','/services/app-development/','/products/view/?product=missing','/contact/','/account/subscriptions/']){
          await page.goto(live.url+route);await page.locator('main h1').first().waitFor();
          // Let language hydration and font metrics settle, without relying on a fixed delay.
          await page.waitForFunction(()=>!document.documentElement.classList.contains('language-hydrating'));
          await page.evaluate(()=>document.fonts.ready);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} ${width} ${route} overflows`);
          assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');checks++;
          const stale=await page.locator('a').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h&&/^\/(knowledge|company-space|account\/companies|services\/(guide|process|brand-identity|cv-portfolio))(\/|$|\?)/.test(h)));
          assert.deepEqual(stale,[]);
          if(route==='/pricing/')for(const text of lang==='ar'?['شراء لمرة واحدة','اشتراك شهري','خدمات ما بعد البيع']:['One-time purchase','Monthly subscription','After-sales care'])assert(await page.getByRole('heading',{name:text,exact:true}).count());
          if(route==='/products/view/?product=missing')assert(await page.getByRole('heading',{name:lang==='ar'?'المنتج غير متاح.':'Product unavailable.',exact:true}).count());
          if(process.env.SCREENSHOT_DIR&&width===390&&['/products/','/pricing/'].includes(route)){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,route.replaceAll('/','')+'-'+lang+'.png'),fullPage:true});}
        }
      }
      // Search/filter and reset on the actual compiled catalog.
      await page.goto(live.url+'/products/');await page.getByRole('button',{name:lang==='ar'?'مواقع جاهزة':'Ready-made websites',exact:true}).click();await page.locator('input[type=search]').fill('no-product');
      await page.getByRole('button',{name:lang==='ar'?'مسح الفلاتر':'Clear filters',exact:true}).click();assert.equal(await page.locator('input[type=search]').inputValue(),'');assert.equal(await page.getByRole('button',{name:lang==='ar'?'جميع المنتجات':'All products',exact:true}).getAttribute('aria-pressed'),'true');checks++;
      if(baseline){
        for(const width of [390,1440]){
          await page.setViewportSize({width,height:900});
          async function metrics(url){await page.goto(url+'/');await page.locator('.ref-hero h1').waitFor();await page.evaluate(()=>document.fonts.ready);return page.evaluate(()=>{
            const hero=document.querySelector('.ref-hero'),h=document.querySelector('.ref-hero h1'),style=getComputedStyle(h),r=hero.getBoundingClientRect();
            return{hero:{x:r.x,width:r.width,height:r.height},heading:{font:style.fontFamily,size:style.fontSize,line:style.lineHeight},sections:[...document.querySelector('main.ref-home').children].filter(e=>e.tagName==='SECTION').map(e=>e.className),serviceCards:document.querySelectorAll('.ref-service-card').length,categoryCards:document.querySelectorAll('.platform-home-section .platform-category-card').length};
          });}
          const before=await metrics(baseline.url),after=await metrics(live.url);
          assert.deepEqual(after,before,`Home baseline changed: ${lang} ${width}`);checks++;
          if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`home-${lang}-${width}.png`),fullPage:true});
        }
      }
    }
    assert.deepEqual(errors,[]);console.log(`PASS: ${checks} storefront browser checks; AR/EN at 320/390/768/1440px, active navigation, sale models, search/reset and ${baseline?'home baseline comparison':'no baseline supplied'}. Local fixture APIs only.`);
  }finally{await browser.close();await new Promise(r=>live.server.close(r));if(baseline)await new Promise(r=>baseline.server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
