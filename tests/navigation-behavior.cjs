const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function load(file, dependencies = {}) {
  const module = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,{module,exports:module.exports,require(name){if(name in dependencies)return dependencies[name];throw Error(`Unexpected import ${name}`);},URL,Request,Response,crypto:require('node:crypto').webcrypto,console:{log(){},warn(){},error(){}}});
  return module.exports;
}
const navigation = load('lib/navigation/return-path.ts');
assert.equal(navigation.safeReturnPath('/account/projects/messages/index.txt?_rsc=abc&project=123'),'/account/projects/messages?project=123');
assert.equal(navigation.safeReturnPath('/account/projects/?project=123#activity'),'/account/projects?project=123#activity');
for(const input of ['//outside.test','https://outside.test','/\\outside.test','/api/auth/logout','/_next/file','/login','/admin/login',null]) assert.equal(navigation.safeReturnPath(input),'/account/projects');
let session = null;
let fail = false;
let assets = 0;
const core = {resolveSession:async()=>{if(fail)throw Error('auth unavailable');return session;},clearCookies:()=>[],withCookies:r=>r,withSecurityHeaders:r=>r};
const worker = load('worker/index.ts',{'../lib/navigation/return-path':navigation,'./core':core,'./auth':{},'./client':{},'./admin':{},'./companies':{handleCompanyApi:async()=>null}}).default;
const env = {ASSETS:{fetch:async()=>{assets++;return new Response('protected asset');}}};
async function request(p){return worker.fetch(new Request('https://linetech.test'+p),env);}
(async()=>{
  for(const [oldPath,newPath] of [["/workspace","/account/projects"],["/chat","/account/projects/messages"],["/handover","/account/projects/handover"],["/start","/services/request"],["/service-finder","/services/guide"],["/how-we-work","/services/process"]]) {
    const result=await request(oldPath+"/index.html?project=123");
    assert.equal(result.status,308);
    const target=new URL(result.headers.get("location"));
    assert.equal(target.pathname,newPath);
    assert.equal(target.searchParams.get("project"),"123");
    assert.equal(assets,0);
  }
  for(const path of ["/account/profile","/account/orders","/account/billing","/account/companies","/company-space","/company-space/members","/company-space/billing"]) {
    const result=await request(path);
    assert.equal(result.status,302);
    assert.equal(new URL(result.headers.get("location")).pathname,"/login");
    assert.equal(assets,0);
  }

  for(const p of ['/account/projects','/account/projects/messages/index.txt?_rsc=abc&project=123','/account/projects/handover/','/account/','/admin/']){
    const r=await request(p);assert.equal(r.status,302);assert.equal(assets,0);
    const login=new URL(r.headers.get('location'));assert.equal(login.searchParams.get('next'),navigation.safeReturnPath(p));
  }
  fail=true;
  for(const p of ['/admin/','/admin/index.txt','/account/','/account/projects/messages/','/account/projects/','/account/projects/handover/']){
    const r=await request(p);assert.equal(r.status,503);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(assets,0);
  }
  assert.equal((await request('/pricing/')).status,200);assert.equal(assets,1);
  assert.equal((await request('/about/')).status,200);assert.equal(assets,2);
  const category=await request('/products/category/websites/');assert.equal(category.status,200);assert.equal(assets,3);
  assert.equal((await request('/unlisted-public-page/')).status,404);assert.equal(assets,3);
  assert.equal((await request('/thank-you/')).status,200);assert.equal(assets,4);
  fail=false;session={user:{app_metadata:{role:'client'}},setCookies:[]};
  assert.equal((await request('/admin/')).status,302);assert.equal(assets,4);
  assert.equal((await request('/account/projects/')).status,200);assert.equal(assets,5);
  session.user.app_metadata.role='admin';assert.equal((await request('/admin/')).status,200);assert.equal(assets,6);
  let existing = null;
  let saved;
  const calls = [];
  const adminCore = {
    requireAdmin:async()=>({accessToken:'test',setCookies:[]}),
    boundedText:(v,n)=>typeof v==='string'?v.slice(0,n):'',
    requestTooLarge:()=>false,
    safeJson:r=>r.json(),
    json:(data,status=200)=>Response.json(data,{status}),
    restFetch:async(_env,url,_token,options={})=>{
      calls.push(url);
      if(options.body){saved=JSON.parse(options.body);return Response.json([{id:'subscription',...saved}]);}
      if(url.startsWith('/plan_catalog'))return Response.json([{code:'start',setup_price_usd:149,monthly_price_usd:19}]);
      return Response.json(existing?[existing]:[]);
    },
  };
  const adminApi=load('worker/admin.ts',{'./core':adminCore}).handleAdminApi;
  async function saveSubscription(){return adminApi(new Request('https://linetech.test/api/admin/subscription',{method:'PUT',body:JSON.stringify({clientId:'12345678-1234-1234-1234-123456789abc',planCode:'start',status:'active',billingCycle:'monthly'})}),{},'/api/admin/subscription');}
  assert.equal((await saveSubscription()).status,200);
  assert.ok(saved.started_at && saved.current_period_start && saved.current_period_end);
  assert.ok(new Date(saved.current_period_end)>new Date(saved.current_period_start));
  assert.equal(saved.setup_fee_usd,149);assert.equal(saved.recurring_price_usd,19);
  existing={id:'subscription',started_at:'2026-01-01T00:00:00Z',current_period_start:'2026-10-01T00:00:00Z',current_period_end:'2026-11-01T00:00:00Z'};
  assert.equal((await saveSubscription()).status,200);
  for(const key of ['started_at','current_period_start','current_period_end'])assert.equal(saved[key],existing[key]);
  assert.ok(calls.every(url=>!url.includes('starts_at')&&!url.includes('next_billing_at')));
  assert.ok(!('starts_at' in saved)&&!('next_billing_at' in saved));
  console.log('PASS: safe return URLs, fail-closed access, roles, and subscription create/update dates');
})().catch(error=>{console.error(error);process.exitCode=1;});
