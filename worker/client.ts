import {
  type Env,
  type ResolvedSession,
  boundedText,
  encodeObjectPath,
  formatTime,
  json,
  rateLimitAllowed,
  rateLimitResponse,
  restFetch,
  resolveSession,
  requestTooLarge,
  safeJson,
  safeName,
  storageFetch,
  validateUpload,
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
    if(!(await rateLimitAllowed(
      env.PROJECT_REQUEST_RATE_LIMITER,
      `project-request:${String(session.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(session.setCookies);
    }

    if(requestTooLarge(request,64*1024)) return json({ok:false},413,session.setCookies);
    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const submissionKey=boundedText(data.submissionKey,36);
    if(
      !submissionKey
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionKey)
    ) return json({ok:false},400,session.setCookies);

    const fields={
      name:boundedText(data.name,120),
      company:boundedText(data.company,160),
      contact:boundedText(data.contact,200),
      preferredContact:boundedText(data.preferredContact,40),
      service:boundedText(data.service,100),
      stage:boundedText(data.stage,100),
      goal:boundedText(data.goal,200),
      audience:boundedText(data.audience,1000),
      idea:boundedText(data.idea,5000),
      features:boundedText(data.features,5000),
      references:boundedText(data.references,3000),
      budget:boundedText(data.budget,100),
      timing:boundedText(data.timing,120),
      notes:boundedText(data.notes,5000),
    };
    if(Object.values(fields).some(value=>value===null)) return json({ok:false},413,session.setCookies);
    const required=["name","contact","preferredContact","service","stage","goal","idea"] as const;
    if(required.some(key=>!fields[key])) return json({ok:false},400,session.setCookies);

    const response=await restFetch(env,"/rpc/submit_project_request",session.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        p_submission_key:submissionKey,
        p_name:fields.name,
        p_company:fields.company,
        p_contact:fields.contact,
        p_preferred_contact:fields.preferredContact,
        p_service:fields.service,
        p_stage:fields.stage,
        p_goal:fields.goal,
        p_audience:fields.audience,
        p_idea:fields.idea,
        p_features:fields.features,
        p_reference_links:fields.references,
        p_budget:fields.budget,
        p_timing:fields.timing,
        p_notes:fields.notes,
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
      if(!(await rateLimitAllowed(
        env.CHAT_RATE_LIMITER,
        `chat:${String(session.user.id||"unknown")}`,
      ))) {
        return rateLimitResponse(session.setCookies);
      }
      if(requestTooLarge(request,32*1024)) return json({ok:false},413,session.setCookies);
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const text=boundedText(data.text,5000);
      if(text===null) return json({ok:false},413,session.setCookies);
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
      if(!(await rateLimitAllowed(
        env.CHAT_RATE_LIMITER,
        `chat:${String(session.user.id||"unknown")}`,
      ))) {
        return rateLimitResponse(session.setCookies);
      }
      if(requestTooLarge(request,32*1024)) return json({ok:false},413,session.setCookies);
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const id=String(data.messageId||"").trim();
      const text=boundedText(data.text,5000);
      if(text===null) return json({ok:false},413,session.setCookies);
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
      if(!(await rateLimitAllowed(
        env.CHAT_RATE_LIMITER,
        `chat:${String(session.user.id||"unknown")}`,
      ))) {
        return rateLimitResponse(session.setCookies);
      }
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
    if(!(await rateLimitAllowed(
      env.UPLOAD_RATE_LIMITER,
      `upload:${String(session.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(session.setCookies);
    }

    if(requestTooLarge(request,16*1024*1024)) return json({ok:false},413,session.setCookies);
    const form=await request.formData();
    const file=form.get("file");
    if(!(file instanceof File)) return json({ok:false},400,session.setCookies);

    const kindValue=String(form.get("kind")||"");
    const kind=kindValue==="image"||kindValue==="audio"||kindValue==="document"
      ? kindValue
      : file.type.startsWith("image/")?"image":file.type.startsWith("audio/")?"audio":"document";
    const validated=await validateUpload(file,kind);
    if(!validated.ok) return json({ok:false},validated.status,session.setCookies);
    const duration=Number(form.get("duration")||"0");
    const objectPath=`${context.project.id}/${crypto.randomUUID()}-${safeName(file.name||kind)}`;

    const upload=await storageFetch(
      env,
      `/object/project-files/${encodeObjectPath(objectPath)}`,
      session.accessToken,
      {
        method:"POST",
        headers:{"Content-Type":validated.mime,"x-upsert":"false"},
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
    if(!mr.ok||!message) {
      await storageFetch(
        env,
        `/object/project-files/${encodeObjectPath(objectPath)}`,
        session.accessToken,
        {method:"DELETE"},
      ).catch(()=>null);
      return json({ok:false},mr.status||500,session.setCookies);
    }

    const ar=await restFetch(env,"/message_attachments?select=*",session.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        message_id:message.id,
        storage_bucket:"project-files",
        storage_path:objectPath,
        file_name:file.name||safeName(file.name),
        mime_type:validated.mime,
        file_size:file.size,
        duration_seconds:kind==="audio"&&Number.isFinite(duration)?Math.max(0,Math.round(duration)):null,
      }),
    });
    const attachments=await safeJson(ar) as Row[]|null;
    const attachment=Array.isArray(attachments)?attachments[0]:null;
    if(!ar.ok||!attachment) {
      await Promise.all([
        storageFetch(
          env,
          `/object/project-files/${encodeObjectPath(objectPath)}`,
          session.accessToken,
          {method:"DELETE"},
        ).catch(()=>null),
        restFetch(
          env,
          `/messages?id=eq.${encodeURIComponent(String(message.id))}&sender_id=eq.${encodeURIComponent(String(session.user.id))}&sender_role=eq.client`,
          session.accessToken,
          {method:"PATCH",body:JSON.stringify({deleted_at:new Date().toISOString()})},
        ).catch(()=>null),
      ]);
      return json({ok:false},ar.status||500,session.setCookies);
    }

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
    if(row.file_name) {
      const mime=String(row.mime_type||"").toLowerCase();
      const disposition=mime.startsWith("image/")||mime.startsWith("audio/") ? "inline" : "attachment";
      headers.set("Content-Disposition",`${disposition}; filename*=UTF-8''${encodeURIComponent(String(row.file_name))}`);
    }
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
