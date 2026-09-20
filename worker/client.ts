import {
  type Env,
  type ResolvedSession,
  encodeObjectPath,
  formatTime,
  json,
  restFetch,
  resolveSession,
  safeJson,
  safeName,
  storageFetch,
  withCookies,
} from "./core";

type Row=Record<string,any>;

async function requireSession(request:Request,env:Env) {
  return resolveSession(request,env);
}

async function latestProject(env:Env,session:ResolvedSession) {
  const p=await restFetch(env,"/projects?select=*&order=created_at.desc&limit=1",session.accessToken);
  const rows=await safeJson(p) as Row[]|null;
  const project=Array.isArray(rows)?rows[0]:null;
  if(!project?.id) return {project:null,conversation:null};

  const c=await restFetch(
    env,
    `/conversations?select=id,project_id&project_id=eq.${encodeURIComponent(project.id)}&limit=1`,
    session.accessToken,
  );
  const conversations=await safeJson(c) as Row[]|null;
  return {project,conversation:Array.isArray(conversations)?conversations[0]:null};
}

function mapMessage(row:Row) {
  const attachment=Array.isArray(row.message_attachments)?row.message_attachments[0]:null;
  return {
    id:row.id,
    sender:row.sender_role==="company"?"company":"client",
    kind:row.kind,
    text:row.deleted_at?undefined:row.text||undefined,
    src:attachment?.id && !row.deleted_at
      ? `/api/files/download?attachmentId=${encodeURIComponent(attachment.id)}`
      : undefined,
    fileName:attachment?.file_name||undefined,
    fileSize:attachment?.file_size??undefined,
    fileType:attachment?.mime_type||undefined,
    duration:attachment?.duration_seconds??undefined,
    edited:Boolean(row.edited_at),
    deleted:Boolean(row.deleted_at),
    time:formatTime(row.created_at),
  };
}

export async function handleClientApi(request:Request,env:Env,path:string):Promise<Response|null> {
  if(path==="/api/project-request" && request.method==="POST") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false,authRequired:true},401);

    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const required=["name","contact","preferredContact","service","stage","goal","idea"];
    if(required.some(key=>!String(data[key]||"").trim())) return json({ok:false},400,session.setCookies);

    const response=await restFetch(env,"/rpc/submit_project_request",session.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        p_name:String(data.name).trim(),
        p_company:String(data.company||"").trim(),
        p_contact:String(data.contact).trim(),
        p_preferred_contact:String(data.preferredContact).trim(),
        p_service:String(data.service).trim(),
        p_stage:String(data.stage).trim(),
        p_goal:String(data.goal).trim(),
        p_audience:String(data.audience||"").trim(),
        p_idea:String(data.idea).trim(),
        p_features:String(data.features||"").trim(),
        p_reference_links:String(data.references||"").trim(),
        p_budget:String(data.budget||"").trim(),
        p_timing:String(data.timing||"").trim(),
        p_notes:String(data.notes||"").trim(),
      }),
    });
    const payload=await safeJson(response);
    return response.ok
      ? json({ok:true,data:payload},200,session.setCookies)
      : json({ok:false},response.status,session.setCookies);
  }

  if(path==="/api/workspace" && request.method==="GET") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);

    const rr=await restFetch(env,"/project_requests?select=*&order=submitted_at.desc&limit=1",session.accessToken);
    const requestRows=await safeJson(rr) as Row[]|null;
    if(!rr.ok) return json({ok:false},rr.status,session.setCookies);
    const pr=Array.isArray(requestRows)?requestRows[0]:null;
    if(!pr) return json({ok:true,record:null,progress:null},200,session.setCookies);

    const pp=await restFetch(
      env,
      `/projects?select=*&request_id=eq.${encodeURIComponent(pr.id)}&limit=1`,
      session.accessToken,
    );
    const projectRows=await safeJson(pp) as Row[]|null;
    if(!pp.ok) return json({ok:false},pp.status,session.setCookies);
    const project=Array.isArray(projectRows)?projectRows[0]:null;

    let activity:Row[]=[];
    let files:Row[]=[];
    if(project?.id) {
      const [ar,fr]=await Promise.all([
        restFetch(env,`/project_activity?select=*&project_id=eq.${encodeURIComponent(project.id)}&order=created_at.desc&limit=20`,session.accessToken),
        restFetch(env,`/project_files?select=*&project_id=eq.${encodeURIComponent(project.id)}&order=updated_at.desc&limit=50`,session.accessToken),
      ]);
      const [ap,fp]=await Promise.all([safeJson(ar),safeJson(fr)]);
      if(ar.ok && Array.isArray(ap)) activity=ap as Row[];
      if(fr.ok && Array.isArray(fp)) files=fp as Row[];
    }

    const record={
      requestId:pr.reference_number,
      completedAt:pr.submitted_at,
      status:pr.status,
      customer:{
        name:pr.name||"",company:pr.company||"",contact:pr.contact||"",
        preferredContact:pr.preferred_contact||"",
      },
      project:{
        service:pr.service||"",stage:pr.stage||"",goal:pr.goal||"",idea:pr.idea||"",
        audience:pr.audience||"",features:pr.features||"",references:pr.reference_links||"",
      },
      scope:{budget:pr.budget||"",timing:pr.timing||"",notes:pr.notes||""},
    };

    const mapStatus=(value:string)=>{
      if(value==="completed") return "complete";
      if(value==="review"||value==="waiting_client") return "review";
      if(value==="active") return "in-progress";
      return "ready";
    };

    const progress=project?{
      requestId:pr.reference_number,
      currentPhase:Number(project.phase||1),
      status:mapStatus(project.status),
      updatedAt:project.updated_at||project.created_at||pr.submitted_at,
      latestUpdate:project.latest_update||undefined,
      nextMilestone:project.next_action_title||undefined,
      nextMilestoneDate:project.due_date||undefined,
      actionNeeded:{
        required:Boolean(project.next_action_required),
        title:project.next_action_title||undefined,
        detail:project.next_action_body||undefined,
        label:project.next_action_required?"Open project chat":undefined,
        href:project.next_action_required?"/chat":undefined,
      },
      activity:activity.map(item=>({id:item.id,title:item.title,detail:item.detail||undefined,at:item.created_at})),
      files:files.map(file=>({
        id:file.id,name:file.file_name,status:file.status||"ready",detail:file.detail||undefined,
        updatedAt:file.updated_at||file.created_at,
        href:`/api/files/download?fileId=${encodeURIComponent(file.id)}`,
      })),
    }:null;

    return json({ok:true,record,progress},200,session.setCookies);
  }

  if(path==="/api/chat/messages") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);
    const context=await latestProject(env,session);

    if(request.method==="GET") {
      if(!context.conversation) return json({ok:true,messages:[]},200,session.setCookies);
      const response=await restFetch(
        env,
        `/messages?select=*,message_attachments(*)&conversation_id=eq.${encodeURIComponent(context.conversation.id)}&order=created_at.asc`,
        session.accessToken,
      );
      const rows=await safeJson(response) as Row[]|null;
      if(!response.ok) return json({ok:false},response.status,session.setCookies);
      return json({
        ok:true,
        messages:Array.isArray(rows)?rows.map(row=>mapMessage(row)):[],
      },200,session.setCookies);
    }

    if(request.method==="POST") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const text=String(data.text||"").trim();
      if(!text) return json({ok:false},400,session.setCookies);
      if(!context.conversation?.id) return json({ok:false},409,session.setCookies);

      const response=await restFetch(env,"/messages?select=*",session.accessToken,{
        method:"POST",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({
          conversation_id:context.conversation.id,
          sender_id:session.user.id,
          sender_role:"client",
          kind:"text",
          text,
        }),
      });
      const rows=await safeJson(response) as Row[]|null;
      const row=Array.isArray(rows)?rows[0]:null;
      return response.ok && row
        ? json({ok:true,message:mapMessage({...row,message_attachments:[]})},200,session.setCookies)
        : json({ok:false},response.ok?500:response.status,session.setCookies);
    }

    if(request.method==="PATCH") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const id=String(data.messageId||"").trim();
      const text=String(data.text||"").trim();
      if(!id||!text) return json({ok:false},400,session.setCookies);

      const response=await restFetch(
        env,
        `/messages?id=eq.${encodeURIComponent(id)}&sender_id=eq.${encodeURIComponent(String(session.user.id))}&sender_role=eq.client&select=*`,
        session.accessToken,
        {
          method:"PATCH",
          headers:{Prefer:"return=representation"},
          body:JSON.stringify({text,edited_at:new Date().toISOString()}),
        },
      );
      const rows=await safeJson(response) as Row[]|null;
      const row=Array.isArray(rows)?rows[0]:null;
      return response.ok && row
        ? json({ok:true,message:mapMessage({...row,message_attachments:[]})},200,session.setCookies)
        : json({ok:false},response.ok?404:response.status,session.setCookies);
    }

    if(request.method==="DELETE") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const id=String(data.messageId||"").trim();
      if(!id) return json({ok:false},400,session.setCookies);

      const attachmentResponse=await restFetch(
        env,
        `/message_attachments?select=storage_bucket,storage_path&message_id=eq.${encodeURIComponent(id)}`,
        session.accessToken,
      );
      const attachments=await safeJson(attachmentResponse) as Row[]|null;

      const response=await restFetch(
        env,
        `/messages?id=eq.${encodeURIComponent(id)}&sender_id=eq.${encodeURIComponent(String(session.user.id))}&sender_role=eq.client`,
        session.accessToken,
        {method:"PATCH",body:JSON.stringify({text:null,deleted_at:new Date().toISOString()})},
      );

      if(response.ok && attachmentResponse.ok && Array.isArray(attachments)) {
        await Promise.all(attachments.map(attachment=>{
          if(!attachment?.storage_bucket || !attachment?.storage_path) return Promise.resolve(null);
          return storageFetch(
            env,
            `/object/${encodeURIComponent(String(attachment.storage_bucket))}/${encodeObjectPath(String(attachment.storage_path))}`,
            session.accessToken,
            {method:"DELETE"},
          ).catch(()=>null);
        }));
      }

      return json({ok:response.ok},response.ok?200:response.status,session.setCookies);
    }
  }

  if(path==="/api/chat/upload" && request.method==="POST") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);
    const context=await latestProject(env,session);
    if(!context.project?.id || !context.conversation?.id) return json({ok:false},409,session.setCookies);

    const form=await request.formData();
    const file=form.get("file");
    if(!(file instanceof File)) return json({ok:false},400,session.setCookies);
    if(file.size<=0 || file.size>25*1024*1024) return json({ok:false},413,session.setCookies);

    const kindValue=String(form.get("kind")||"");
    const kind=kindValue==="image"||kindValue==="audio"||kindValue==="document"
      ? kindValue
      : file.type.startsWith("image/")?"image":file.type.startsWith("audio/")?"audio":"document";
    const duration=Number(form.get("duration")||"0");
    const objectPath=`${context.project.id}/${crypto.randomUUID()}-${safeName(file.name||kind)}`;

    const upload=await storageFetch(
      env,
      `/object/project-files/${encodeObjectPath(objectPath)}`,
      session.accessToken,
      {
        method:"POST",
        headers:{"Content-Type":file.type||"application/octet-stream","x-upsert":"false"},
        body:file,
      },
    );
    if(!upload.ok) return json({ok:false},upload.status,session.setCookies);

    const mr=await restFetch(env,"/messages?select=*",session.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        conversation_id:context.conversation.id,
        sender_id:session.user.id,
        sender_role:"client",
        kind,
        text:null,
      }),
    });
    const messages=await safeJson(mr) as Row[]|null;
    const message=Array.isArray(messages)?messages[0]:null;
    if(!mr.ok||!message) return json({ok:false},mr.status||500,session.setCookies);

    const ar=await restFetch(env,"/message_attachments?select=*",session.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        message_id:message.id,
        storage_bucket:"project-files",
        storage_path:objectPath,
        file_name:file.name||safeName(file.name),
        mime_type:file.type||"application/octet-stream",
        file_size:file.size,
        duration_seconds:kind==="audio"&&Number.isFinite(duration)?Math.max(0,Math.round(duration)):null,
      }),
    });
    const attachments=await safeJson(ar) as Row[]|null;
    const attachment=Array.isArray(attachments)?attachments[0]:null;
    if(!ar.ok||!attachment) return json({ok:false},ar.status||500,session.setCookies);

    return json({ok:true,message:{
      id:message.id,sender:"client",kind,
      src:`/api/files/download?attachmentId=${encodeURIComponent(attachment.id)}`,
      fileName:attachment.file_name||undefined,
      fileSize:attachment.file_size??undefined,
      fileType:attachment.mime_type||undefined,
      duration:attachment.duration_seconds??undefined,
      edited:false,deleted:false,time:formatTime(message.created_at),
    }},200,session.setCookies);
  }

  if(path==="/api/files/download" && request.method==="GET") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);
    const url=new URL(request.url);
    const attachmentId=url.searchParams.get("attachmentId");
    const fileId=url.searchParams.get("fileId");
    if(!attachmentId&&!fileId) return json({ok:false},400,session.setCookies);

    const table=attachmentId?"message_attachments":"project_files";
    const id=attachmentId||fileId||"";
    const response=await restFetch(
      env,
      `/${table}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
      session.accessToken,
    );
    const rows=await safeJson(response) as Row[]|null;
    const row=Array.isArray(rows)?rows[0]:null;
    if(!response.ok||!row?.storage_bucket||!row?.storage_path) {
      return json({ok:false},response.ok?404:response.status,session.setCookies);
    }

    const stored=await storageFetch(
      env,
      `/object/authenticated/${encodeURIComponent(row.storage_bucket)}/${encodeObjectPath(row.storage_path)}`,
      session.accessToken,
      {method:"GET"},
    );
    if(!stored.ok) return json({ok:false},stored.status,session.setCookies);

    const headers=new Headers();
    headers.set("Content-Type",row.mime_type||stored.headers.get("Content-Type")||"application/octet-stream");
    headers.set("Cache-Control","private, no-store");
    if(row.file_name) headers.set("Content-Disposition",`inline; filename*=UTF-8''${encodeURIComponent(String(row.file_name))}`);
    return withCookies(new Response(stored.body,{status:200,headers}),session.setCookies);
  }

  if(path==="/api/handover" && request.method==="GET") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);

    const context=await latestProject(env,session);
    if(!context.project?.id) {
      return json({ok:true,locked:true,items:[]},200,session.setCookies);
    }

    const phase=Number(context.project.phase||1);
    const status=String(context.project.status||"");
    const unlocked=phase>=5 || status==="completed";
    if(!unlocked) {
      return json({ok:true,locked:true,items:[]},200,session.setCookies);
    }

    const response=await restFetch(
      env,
      `/handover_items?select=*&project_id=eq.${encodeURIComponent(context.project.id)}&order=created_at.asc`,
      session.accessToken,
    );
    const rows=await safeJson(response);
    return response.ok
      ? json({ok:true,locked:false,items:Array.isArray(rows)?rows:[]},200,session.setCookies)
      : json({ok:false},response.status,session.setCookies);
  }

  if(path==="/api/notifications") {
    const session=await requireSession(request,env);
    if(!session) return json({ok:false},401);

    if(request.method==="GET") {
      const response=await restFetch(env,"/notifications?select=*&order=created_at.desc&limit=50",session.accessToken);
      const rows=await safeJson(response);
      return response.ok
        ? json({ok:true,notifications:Array.isArray(rows)?rows:[]},200,session.setCookies)
        : json({ok:false},response.status,session.setCookies);
    }

    if(request.method==="PATCH") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const id=String(data.notificationId||"").trim();
      if(!id) return json({ok:false},400,session.setCookies);
      const response=await restFetch(
        env,
        `/notifications?id=eq.${encodeURIComponent(id)}&select=id,read_at`,
        session.accessToken,
        {
          method:"PATCH",
          headers:{Prefer:"return=representation"},
          body:JSON.stringify({read_at:new Date().toISOString()}),
        },
      );
      const rows=await safeJson(response) as Row[]|null;
      return response.ok && Array.isArray(rows) && rows[0]
        ? json({ok:true,notification:rows[0]},200,session.setCookies)
        : json({ok:false},response.ok?404:response.status,session.setCookies);
    }
  }

  return null;
}
