import {type Env,json,rateLimitAllowed,rateLimitResponse,requireAdmin,resolveSession,restFetch,safeJson} from "./core";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const applicationFields="id,company_name,contact_name,contact_email,contact_phone,description,status,decision_note,company_id,created_at,reviewed_at";
function text(value:unknown,min:number,max:number){return typeof value==="string"&&value.trim().length>=min&&value.trim().length<=max?value.trim():null;}
async function body(request:Request):Promise<{value?:Record<string,unknown>;error?:number}>{
  if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return {error:415};
  if(!request.body)return {error:400};
  const reader=request.body.getReader();let size=0;const chunks:Uint8Array[]=[];
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();return {error:413};}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}const value=JSON.parse(new TextDecoder().decode(bytes));return value&&typeof value==="object"&&!Array.isArray(value)?{value}:{error:400};}catch{return {error:400};}
}
async function result(response:Response,cookies:string[],key:string){
  const payload=await safeJson(response);
  if(!response.ok){const code=payload?.code;const status=code==="23505"||code==="40001"?409:code==="42501"?403:code==="P0002"?404:code==="22023"||code?.startsWith("23")?400:503;return json({ok:false,error:status===409?"conflict":status===503?"unavailable":"invalid_request"},status,cookies);}
  const row=Array.isArray(payload)?payload[0]:payload;
  if(!row?.id)return json({ok:false,error:"unavailable"},503,cookies);
  return json({ok:true,[key]:row},200,cookies);
}
export async function handleCompanyApi(request:Request,env:Env,path:string):Promise<Response|null>{
  if(!["/api/company-applications","/api/companies","/api/admin/company-applications"].includes(path))return null;
  const adminPath=path.startsWith("/api/admin/");
  const session=adminPath?await requireAdmin(request,env):await resolveSession(request,env);
  if(!session)return json({ok:false},adminPath?403:401);
  if(request.method==="GET"){
    const params=new URL(request.url).searchParams;
    const status=params.get("status")||"";
    if(status&&!['pending','approved','rejected'].includes(status))return json({ok:false},400,session.setCookies);
    const rawOffset=params.get("offset")||"0";const offset=Number(rawOffset);
    if(!/^\d+$/.test(rawOffset)||offset>10000)return json({ok:false},400,session.setCookies);
    const endpoint=path==="/api/companies"?`/companies?select=id,name,owner_id,created_at&order=created_at.desc&limit=100&offset=${offset}`:
      `/company_applications?select=${applicationFields}${adminPath?",applicant_id":""}${!adminPath?`&applicant_id=eq.${encodeURIComponent(String(session.user.id))}`:""}${status?`&status=eq.${status}`:""}&order=created_at.desc&limit=100&offset=${offset}`;
    const response=await restFetch(env,endpoint,session.accessToken);const rows=await safeJson(response);
    if(!response.ok||!Array.isArray(rows))return json({ok:false,error:"unavailable"},503,session.setCookies);
    return json({ok:true,[path==="/api/companies"?"companies":"applications"]:rows},200,session.setCookies);
  }
  if(request.method!=="POST"||path==="/api/companies")return json({ok:false},405,session.setCookies);
  if(!await rateLimitAllowed(adminPath?env.CHAT_RATE_LIMITER:env.PROJECT_REQUEST_RATE_LIMITER,`${adminPath?"company-review":"company-apply"}:${session.user.id}`))return rateLimitResponse(session.setCookies);
  const parsed=await body(request);if(parsed.error)return json({ok:false},parsed.error,session.setCookies);
  const input=parsed.value!;
  if(adminPath){
    const id=text(input.applicationId,36,36);const decision=input.decision;const note=text(input.note,0,1000);
    if(!id||!uuid.test(id)||(typeof decision!=="string"||!['approved','rejected'].includes(decision))||note===null||(decision==='rejected'&&note.length<3))return json({ok:false},400,session.setCookies);
    const response=await restFetch(env,"/rpc/review_company_application",session.accessToken,{method:"POST",body:JSON.stringify({p_application_id:id,p_decision:decision,p_note:note})});
    return result(response,session.setCookies,"application");
  }
  const key=text(input.submissionKey,36,36),name=text(input.companyName,2,120),contact=text(input.contactName,2,120),email=text(input.email,3,254),phone=text(input.phone??"",0,40),description=text(input.description,10,2000);
  if(!key||!uuid.test(key)||!name||!contact||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone===null||!description)return json({ok:false},400,session.setCookies);
  const response=await restFetch(env,"/rpc/submit_company_application",session.accessToken,{method:"POST",body:JSON.stringify({p_submission_key:key,p_company_name:name,p_contact_name:contact,p_contact_email:email,p_contact_phone:phone,p_description:description})});
  return result(response,session.setCookies,"application");
}
