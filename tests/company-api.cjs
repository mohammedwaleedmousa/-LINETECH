const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
let session=null,admin=null,allowed=true,dbStatus=200,dbPayload={id:'11111111-1111-4111-8111-111111111111',status:'pending'},calls=[];
const core={json:(data,status=200)=>Response.json(data,{status}),rateLimitAllowed:async()=>allowed,rateLimitResponse:()=>Response.json({ok:false},{status:429}),resolveSession:async()=>session,requireAdmin:async()=>admin,safeJson:r=>r.json(),restFetch:async(_env,url,token,options={})=>{calls.push({url,token,options});return Response.json(dbPayload,{status:dbStatus})}};
const moduleBox={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('worker/companies.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:moduleBox,exports:moduleBox.exports,require:name=>{assert.equal(name,'./core');return core},Request,Response,URL,TextDecoder,Uint8Array,JSON});const handler=moduleBox.exports.handleCompanyApi;
const env={PROJECT_REQUEST_RATE_LIMITER:{}};const base='https://linetech.test';
const payload={submissionKey:'44444444-4444-4444-8444-444444444444',companyName:'Example Company',contactName:'Test Contact',email:'test@example.test',phone:'',description:'Company workspace request for testing.'};
function request(path,method='GET',body){return new Request(base+path,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});}
(async()=>{
assert.equal(await handler(request('/other'),env,'/other'),null);
assert.equal((await handler(request('/api/company-applications'),env,'/api/company-applications')).status,401);
session={user:{id:'22222222-2222-4222-8222-222222222222'},accessToken:'client-token',setCookies:[]};
assert.equal((await handler(request('/api/admin/company-applications'),env,'/api/admin/company-applications')).status,403);
for(const invalid of [{...payload,companyName:''},{...payload,email:'invalid'},{...payload,submissionKey:'wrong'},[]])assert.equal((await handler(request('/api/company-applications','POST',invalid),env,'/api/company-applications')).status,400);
assert.equal(calls.length,0);
assert.equal((await handler(request('/api/company-applications','POST',{...payload,description:'a'.repeat(20000)}),env,'/api/company-applications')).status,413);
assert.equal((await handler(new Request(base+'/api/company-applications',{method:'POST',body:'{}'}),env,'/api/company-applications')).status,415);
assert.equal((await handler(request('/api/company-applications','POST',{...payload,applicantId:'forged-id',status:'approved'}),env,'/api/company-applications')).status,200);
assert.equal(calls.length,1);assert.equal(calls[0].token,'client-token');const rpcBody=JSON.parse(calls[0].options.body);assert(!('applicantId' in rpcBody));assert(!('status' in rpcBody));assert.equal(calls[0].url,'/rpc/submit_company_application');
allowed=false;assert.equal((await handler(request('/api/company-applications','POST',payload),env,'/api/company-applications')).status,429);allowed=true;
dbStatus=409;dbPayload={code:'23505'};assert.equal((await handler(request('/api/company-applications','POST',payload),env,'/api/company-applications')).status,409);
dbStatus=404;dbPayload={code:'PGRST205'};assert.equal((await handler(request('/api/company-applications'),env,'/api/company-applications')).status,503);
dbStatus=200;dbPayload=[];assert.equal((await handler(request('/api/company-applications'),env,'/api/company-applications')).status,200);assert(calls.at(-1).url.includes('applicant_id=eq.22222222-2222-4222-8222-222222222222'));
assert.equal((await handler(request('/api/company-applications?status=invalid'),env,'/api/company-applications')).status,400);assert.equal((await handler(request('/api/company-applications?offset=-1'),env,'/api/company-applications')).status,400);
assert.equal((await handler(request('/api/companies','POST',payload),env,'/api/companies')).status,405);
admin={...session,accessToken:'admin-token'};const decision={applicationId:'11111111-1111-4111-8111-111111111111',decision:'rejected',note:''};assert.equal((await handler(request('/api/admin/company-applications','POST',decision),env,'/api/admin/company-applications')).status,400);
dbPayload={id:decision.applicationId,status:'approved'};assert.equal((await handler(request('/api/admin/company-applications','POST',{...decision,decision:'approved'}),env,'/api/admin/company-applications')).status,200);assert.equal(calls.at(-1).token,'admin-token');assert.equal(calls.at(-1).url,'/rpc/review_company_application');
console.log('PASS: company API authentication, admin gate, validation, streamed body bounds, limiter, idempotent RPC input, ownership filter and unavailable/conflict states');
})().catch(e=>{console.error(e);process.exitCode=1});
