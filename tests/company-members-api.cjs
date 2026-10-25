const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const {randomUUID}=require('node:crypto');
let session=null,allowed=true,payload=[],status=200,calls=[];
const core={json:(data,status=200,cookies=[])=>{const response=Response.json(data,{status});cookies.forEach(c=>response.headers.append('Set-Cookie',c));return response;},
  resolveSession:async()=>session,requireAdmin:async()=>null,rateLimitAllowed:async()=>allowed,rateLimitResponse:()=>Response.json({ok:false},{status:429}),safeJson:async r=>{try{return await r.json();}catch{return null;}},
  restFetch:async(_env,path,token,init)=>{calls.push({path,token,body:JSON.parse(init.body)});return Response.json(payload,{status});}};
const box={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('worker/companies.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:box,exports:box.exports,require:name=>{assert.equal(name,'./core');return core;},Request,Response,URL,TextDecoder,Uint8Array,JSON});
const handler=box.exports.handleCompanyApi;
const company=randomUUID(),invitation=randomUUID(),user=randomUUID();
const base='https://linetech.test',team='/api/company-team',inbox='/api/company-invitations';
async function request(path,method='GET',body){return handler(new Request(base+path,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined}),{},new URL(base+path).pathname);}
(async()=>{
  for(const path of [team,inbox])assert.equal((await request(path)).status,401);
  session={user:{id:user},accessToken:'user-token',setCookies:['refreshed=session; HttpOnly']};
  for(const path of [team+'?company=wrong',team])assert.equal((await request(path)).status,400);
  for(const body of [[],{}, {companyId:company,action:'owner'},{companyId:company,action:'invite',email:'wrong'}, {companyId:company,action:'revoke',invitationId:'wrong'},{companyId:company,action:'remove',userId:'wrong'}])assert.equal((await request(team,'POST',body)).status,400);
  for(const body of [{invitationId:'wrong',action:'accept'},{invitationId:invitation,action:'owner'}])assert.equal((await request(inbox,'POST',body)).status,400);
  assert.equal(calls.length,0);
  assert.equal((await request(team,'POST',{companyId:company,action:'invite',email:'x'.repeat(20000)})).status,413);
  assert.equal((await handler(new Request(base+team,{method:'POST',body:'{}'}),{},team)).status,415);
  assert.equal((await request(team,'DELETE')).status,405);
  payload={id:company,name:'Company',owner:false,members:[],invitations:[]};
  let response=await request(team+'?company='+company);
  assert.equal(response.status,200);assert(response.headers.get('Set-Cookie').includes('refreshed=session'));
  assert.equal(calls.at(-1).path,'/rpc/company_team');assert.deepEqual(calls.at(-1).body,{p_company_id:company});
  payload=[];assert.equal((await request(inbox)).status,200);assert.equal(calls.at(-1).path,'/rpc/my_company_invitations');
  payload={id:invitation};
  assert.equal((await request(team,'POST',{companyId:company,action:'invite',email:'test@example.test',ownerId:'forged',role:'owner',status:'accepted'})).status,200);
  assert.deepEqual(calls.at(-1).body,{p_company_id:company,p_action:'invite',p_email:'test@example.test',p_invitation_id:null,p_user_id:null});
  assert.equal(calls.at(-1).token,'user-token');
  assert.equal((await request(team,'POST',{companyId:company,action:'revoke',invitationId:invitation})).status,200);
  assert.equal((await request(team,'POST',{companyId:company,action:'remove',userId:user})).status,200);
  for(const action of ['accept','decline']){
    assert.equal((await request(inbox,'POST',{invitationId:invitation,action,email:'forged@example.test',userId:'forged',role:'owner'})).status,200);
    assert.deepEqual(calls.at(-1).body,{p_invitation_id:invitation,p_action:action});
  }
  allowed=false;const n=calls.length;assert.equal((await request(inbox,'POST',{invitationId:invitation,action:'accept'})).status,429);assert.equal(calls.length,n);allowed=true;
  for(const [code,http] of [['42501',403],['40001',409],['P0002',404],['PGRST202',503]]){
    status=400;payload={code};assert.equal((await request(inbox,'POST',{invitationId:invitation,action:'accept'})).status,http);
  }
  status=200;payload={};assert.equal((await request(inbox)).status,503);assert.equal((await request(team+'?company='+company)).status,503);
  console.log('PASS: team/invitation API auth, cookies, validated RPC-only inputs, bounded bodies, throttling, spoof resistance and fail-closed responses');
})().catch(error=>{console.error(error);process.exitCode=1;});
