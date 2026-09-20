import {
  type Env,
  encodeObjectPath,
  formatTime,
  json,
  requireAdmin,
  restFetch,
  safeJson,
  safeName,
  storageFetch,
} from "./core";

type Row=Record<string,any>;
const projectStatuses=new Set(["planned","active","waiting_client","review","completed","archived"]);
const requestStatuses=new Set(["submitted","reviewing","scoped","accepted","declined"]);
const fileStatuses=new Set(["in-progress","ready","review","approved"]);
const categories=new Set(["brief","reference","deliverable","handover","other"]);

export async function handleAdminApi(request:Request,env:Env,path:string):Promise<Response|null> {
  if(!path.startsWith("/api/admin/")) return null;
  const admin=await requireAdmin(request,env);
  if(!admin) return json({ok:false},403);

  if(path==="/api/admin/projects" && request.method==="GET") {
    const response=await restFetch(env,"/projects?select=*&order=updated_at.desc&limit=200",admin.accessToken);
    const projects=await safeJson(response) as Row[]|null;
    if(!response.ok) return json({ok:false},response.status,admin.setCookies);
    const rows=Array.isArray(projects)?projects:[];

    const requestIds=[...new Set(rows.map(x=>x.request_id).filter(Boolean))];
    const clientIds=[...new Set(rows.map(x=>x.client_id).filter(Boolean))];
    let requests:Row[]=[]; let profiles:Row[]=[];

    if(requestIds.length) {
      const ids=requestIds.join(",");
      const r=await restFetch(env,`/project_requests?select=*&id=in.(${encodeURIComponent(ids)})`,admin.accessToken);
      const p=await safeJson(r); if(r.ok&&Array.isArray(p)) requests=p as Row[];
    }
    if(clientIds.length) {
      const ids=clientIds.join(",");
      const r=await restFetch(env,`/profiles?select=*&id=in.(${encodeURIComponent(ids)})`,admin.accessToken);
      const p=await safeJson(r); if(r.ok&&Array.isArray(p)) profiles=p as Row[];
    }

    const requestMap=new Map(requests.map(x=>[x.id,x]));
    const profileMap=new Map(profiles.map(x=>[x.id,x]));
    return json({ok:true,projects:rows.map(project=>({
      ...project,
      request:requestMap.get(project.request_id)||null,
      client:profileMap.get(project.client_id)||null,
    }))},200,admin.setCookies);
  }

  if(path==="/api/admin/project" && request.method==="GET") {
    const projectId=new URL(request.url).searchParams.get("projectId");
    if(!projectId) return json({ok:false},400,admin.setCookies);

    const pr=await restFetch(env,`/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken);
    const projects=await safeJson(pr) as Row[]|null;
    const project=Array.isArray(projects)?projects[0]:null;
    if(!pr.ok||!project) return json({ok:false},pr.ok?404:pr.status,admin.setCookies);

    const [rr,ar,fr,hr]=await Promise.all([
      project.request_id
        ? restFetch(env,`/project_requests?select=*&id=eq.${encodeURIComponent(project.request_id)}&limit=1`,admin.accessToken)
        : Promise.resolve(null),
      restFetch(env,`/project_activity?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.desc&limit=100`,admin.accessToken),
      restFetch(env,`/project_files?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=updated_at.desc&limit=100`,admin.accessToken),
      restFetch(env,`/handover_items?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.asc&limit=100`,admin.accessToken),
    ]);
    const [rp,ap,fp,hp]=await Promise.all([
      rr?safeJson(rr):Promise.resolve(null),safeJson(ar),safeJson(fr),safeJson(hr)
    ]);
    return json({
      ok:true,project,
      request:Array.isArray(rp)?rp[0]||null:null,
      activity:Array.isArray(ap)?ap:[],
      files:Array.isArray(fp)?fp:[],
      handover:Array.isArray(hp)?hp:[],
    },200,admin.setCookies);
  }

  if(path==="/api/admin/project" && request.method==="PATCH") {
    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const projectId=String(data.projectId||"").trim();
    if(!projectId) return json({ok:false},400,admin.setCookies);

    const cr=await restFetch(env,`/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken);
    const currentRows=await safeJson(cr) as Row[]|null;
    const current=Array.isArray(currentRows)?currentRows[0]:null;
    if(!cr.ok||!current) return json({ok:false},cr.ok?404:cr.status,admin.setCookies);

    const update:Record<string,unknown>={};
    if(data.status!==undefined) {
      if(!projectStatuses.has(String(data.status))) return json({ok:false},400,admin.setCookies);
      update.status=data.status;
    }
    if(data.phase!==undefined) {
      const phase=Math.round(Number(data.phase));
      if(phase<1||phase>5) return json({ok:false},400,admin.setCookies);
      update.phase=phase;
    }
    if(data.latestUpdate!==undefined) update.latest_update=data.latestUpdate||null;
    if(data.dueDate!==undefined) update.due_date=data.dueDate||null;
    if(data.nextActionTitle!==undefined) update.next_action_title=data.nextActionTitle||null;
    if(data.nextActionBody!==undefined) update.next_action_body=data.nextActionBody||null;
    if(data.nextActionRequired!==undefined) update.next_action_required=Boolean(data.nextActionRequired);

    let project=current;
    if(Object.keys(update).length) {
      const ur=await restFetch(env,`/projects?id=eq.${encodeURIComponent(projectId)}&select=*`,admin.accessToken,{
        method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(update),
      });
      const rows=await safeJson(ur) as Row[]|null;
      if(!ur.ok||!Array.isArray(rows)||!rows[0]) return json({ok:false},ur.status||500,admin.setCookies);
      project=rows[0];
    }

    if(data.requestStatus!==undefined && current.request_id) {
      if(!requestStatuses.has(String(data.requestStatus))) return json({ok:false},400,admin.setCookies);
      await restFetch(env,`/project_requests?id=eq.${encodeURIComponent(current.request_id)}`,admin.accessToken,{
        method:"PATCH",body:JSON.stringify({status:data.requestStatus}),
      });
    }

    if(String(data.activityTitle||"").trim()) {
      await restFetch(env,"/project_activity",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          project_id:projectId,actor_id:admin.user.id,event_type:"project_update",
          title:String(data.activityTitle).trim(),
          detail:String(data.activityDetail||"").trim()||null,
        }),
      });
    }

    if(data.notifyClient) {
      await restFetch(env,"/notifications",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          user_id:current.client_id,project_id:projectId,
          title:String(data.notificationTitle||data.activityTitle||"Project updated").trim(),
          body:String(data.notificationBody||data.activityDetail||"").trim()||null,
        }),
      });
    }
    return json({ok:true,project},200,admin.setCookies);
  }

  if(path==="/api/admin/files" && request.method==="POST") {
    const form=await request.formData();
    const file=form.get("file");
    const projectId=String(form.get("projectId")||"").trim();
    const category=String(form.get("category")||"other");
    const status=String(form.get("status")||"ready");
    const detail=String(form.get("detail")||"").trim();
    if(!(file instanceof File)||!projectId||!categories.has(category)||!fileStatuses.has(status)) {
      return json({ok:false},400,admin.setCookies);
    }
    if(file.size<=0||file.size>25*1024*1024) return json({ok:false},413,admin.setCookies);

    const pr=await restFetch(env,`/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken);
    const projects=await safeJson(pr) as Row[]|null;
    const project=Array.isArray(projects)?projects[0]:null;
    if(!pr.ok||!project) return json({ok:false},pr.ok?404:pr.status,admin.setCookies);

    const objectPath=`${projectId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const upload=await storageFetch(env,`/object/project-files/${encodeObjectPath(objectPath)}`,admin.accessToken,{
      method:"POST",
      headers:{"Content-Type":file.type||"application/octet-stream","x-upsert":"false"},
      body:file,
    });
    if(!upload.ok) return json({ok:false},upload.status,admin.setCookies);

    const mr=await restFetch(env,"/project_files?select=*",admin.accessToken,{
      method:"POST",headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        project_id:projectId,uploader_id:admin.user.id,category,
        storage_bucket:"project-files",storage_path:objectPath,
        file_name:file.name||safeName(file.name),mime_type:file.type||"application/octet-stream",
        file_size:file.size,status,detail:detail||null,
      }),
    });
    const rows=await safeJson(mr) as Row[]|null;
    const record=Array.isArray(rows)?rows[0]:null;
    if(!mr.ok||!record) return json({ok:false},mr.status||500,admin.setCookies);

    await Promise.all([
      restFetch(env,"/project_activity",admin.accessToken,{method:"POST",body:JSON.stringify({
        project_id:projectId,actor_id:admin.user.id,event_type:"file_added",title:"Project file added",detail:file.name,
      })}),
      restFetch(env,"/notifications",admin.accessToken,{method:"POST",body:JSON.stringify({
        user_id:project.client_id,project_id:projectId,title:"New project file",body:file.name,
      })}),
    ]);
    return json({ok:true,file:{...record,href:`/api/files/download?fileId=${encodeURIComponent(record.id)}`}},200,admin.setCookies);
  }

  if(path==="/api/admin/files" && request.method==="PATCH") {
    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const fileId=String(data.fileId||"").trim();
    if(!fileId) return json({ok:false},400,admin.setCookies);
    const update:Record<string,unknown>={};
    if(data.status!==undefined) {
      if(!fileStatuses.has(String(data.status))) return json({ok:false},400,admin.setCookies);
      update.status=data.status;
    }
    if(data.detail!==undefined) update.detail=String(data.detail||"").trim()||null;
    if(!Object.keys(update).length) return json({ok:false},400,admin.setCookies);

    const response=await restFetch(env,`/project_files?id=eq.${encodeURIComponent(fileId)}&select=*`,admin.accessToken,{
      method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(update),
    });
    const rows=await safeJson(response) as Row[]|null;
    return response.ok&&Array.isArray(rows)&&rows[0]
      ? json({ok:true,file:rows[0]},200,admin.setCookies)
      : json({ok:false},response.ok?404:response.status,admin.setCookies);
  }

  if(path==="/api/admin/handover") {
    if(request.method==="GET") {
      const projectId=new URL(request.url).searchParams.get("projectId");
      if(!projectId) return json({ok:false},400,admin.setCookies);
      const response=await restFetch(env,`/handover_items?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.asc`,admin.accessToken);
      const rows=await safeJson(response);
      return response.ok
        ? json({ok:true,items:Array.isArray(rows)?rows:[]},200,admin.setCookies)
        : json({ok:false},response.status,admin.setCookies);
    }

    if(request.method==="POST") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const projectId=String(data.projectId||"").trim();
      const title=String(data.title||"").trim();
      if(!projectId||!title) return json({ok:false},400,admin.setCookies);
      const response=await restFetch(env,"/handover_items?select=*",admin.accessToken,{
        method:"POST",headers:{Prefer:"return=representation"},
        body:JSON.stringify({project_id:projectId,title,description:String(data.description||"").trim()||null}),
      });
      const rows=await safeJson(response) as Row[]|null;
      return response.ok&&Array.isArray(rows)&&rows[0]
        ? json({ok:true,item:rows[0]},200,admin.setCookies)
        : json({ok:false},response.status||500,admin.setCookies);
    }

    if(request.method==="PATCH") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const itemId=String(data.itemId||"").trim();
      if(!itemId) return json({ok:false},400,admin.setCookies);
      const update:Record<string,unknown>={};
      if(data.title!==undefined) {
        const title=String(data.title||"").trim();
        if(!title) return json({ok:false},400,admin.setCookies);
        update.title=title;
      }
      if(data.description!==undefined) update.description=String(data.description||"").trim()||null;
      if(data.completed!==undefined) {
        update.completed=Boolean(data.completed);
        update.completed_at=data.completed?new Date().toISOString():null;
      }
      const response=await restFetch(env,`/handover_items?id=eq.${encodeURIComponent(itemId)}&select=*`,admin.accessToken,{
        method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(update),
      });
      const rows=await safeJson(response) as Row[]|null;
      return response.ok&&Array.isArray(rows)&&rows[0]
        ? json({ok:true,item:rows[0]},200,admin.setCookies)
        : json({ok:false},response.ok?404:response.status,admin.setCookies);
    }
  }

  if(path==="/api/admin/chat") {
    const url=new URL(request.url);
    const projectId=url.searchParams.get("projectId");
    if(!projectId) return json({ok:false},400,admin.setCookies);

    const conversationResponse=await restFetch(
      env,
      `/conversations?select=id,project_id&project_id=eq.${encodeURIComponent(projectId)}&limit=1`,
      admin.accessToken,
    );
    const conversations=await safeJson(conversationResponse) as Row[]|null;
    const conversation=Array.isArray(conversations)?conversations[0]:null;
    if(!conversationResponse.ok||!conversation) {
      return json({ok:false},conversationResponse.ok?404:conversationResponse.status,admin.setCookies);
    }

    if(request.method==="GET") {
      const response=await restFetch(
        env,
        `/messages?select=*,message_attachments(*)&conversation_id=eq.${encodeURIComponent(conversation.id)}&order=created_at.asc`,
        admin.accessToken,
      );
      const rows=await safeJson(response) as Row[]|null;
      if(!response.ok) return json({ok:false},response.status,admin.setCookies);

      return json({
        ok:true,
        messages:(Array.isArray(rows)?rows:[]).map(row=>{
          const attachment=Array.isArray(row.message_attachments)?row.message_attachments[0]:null;
          return {
            id:row.id,
            sender:row.sender_id===admin.user.id?"company":"client",
            kind:row.kind,
            text:row.deleted_at?undefined:row.text||undefined,
            src:attachment?.id&&!row.deleted_at
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
        }),
      },200,admin.setCookies);
    }

    if(request.method==="POST") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const text=String(data.text||"").trim();
      if(!text) return json({ok:false},400,admin.setCookies);

      const response=await restFetch(env,"/messages?select=*",admin.accessToken,{
        method:"POST",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({
          conversation_id:conversation.id,
          sender_id:admin.user.id,
          kind:"text",
          text,
        }),
      });
      const rows=await safeJson(response) as Row[]|null;
      const message=Array.isArray(rows)?rows[0]:null;
      if(!response.ok||!message) {
        return json({ok:false},response.status||500,admin.setCookies);
      }

      const projectResponse=await restFetch(
        env,
        `/projects?select=client_id&id=eq.${encodeURIComponent(projectId)}&limit=1`,
        admin.accessToken,
      );
      const projects=await safeJson(projectResponse) as Row[]|null;
      const project=Array.isArray(projects)?projects[0]:null;
      if(project?.client_id) {
        await restFetch(env,"/notifications",admin.accessToken,{
          method:"POST",
          body:JSON.stringify({
            user_id:project.client_id,
            project_id:projectId,
            title:"New project message",
            body:text.slice(0,180),
          }),
        });
      }

      return json({
        ok:true,
        message:{
          id:message.id,
          sender:"company",
          kind:"text",
          text:message.text,
          edited:false,
          deleted:false,
          time:formatTime(message.created_at),
        },
      },200,admin.setCookies);
    }
  }

  if(path==="/api/admin/members") {
    const url=new URL(request.url);
    const projectId=url.searchParams.get("projectId");

    if(request.method==="GET") {
      if(!projectId) return json({ok:false},400,admin.setCookies);
      const response=await restFetch(
        env,
        `/project_members?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.asc`,
        admin.accessToken,
      );
      const rows=await safeJson(response) as Row[]|null;
      if(!response.ok) return json({ok:false},response.status,admin.setCookies);

      const members=Array.isArray(rows)?rows:[];
      const ids=[...new Set(members.map(item=>item.user_id).filter(Boolean))];
      let profiles:Row[]=[];
      if(ids.length) {
        const profileResponse=await restFetch(
          env,
          `/profiles?select=*&id=in.(${encodeURIComponent(ids.join(","))})`,
          admin.accessToken,
        );
        const payload=await safeJson(profileResponse);
        if(profileResponse.ok&&Array.isArray(payload)) profiles=payload as Row[];
      }
      const profileMap=new Map(profiles.map(item=>[item.id,item]));
      return json({
        ok:true,
        members:members.map(member=>({
          ...member,
          profile:profileMap.get(member.user_id)||null,
        })),
      },200,admin.setCookies);
    }

    if(request.method==="POST") {
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const targetProjectId=String(data.projectId||"").trim();
      const userId=String(data.userId||"").trim();
      const memberRole=String(data.memberRole||"staff").trim()||"staff";
      if(!targetProjectId||!userId) return json({ok:false},400,admin.setCookies);

      const response=await restFetch(env,"/project_members?on_conflict=project_id,user_id&select=*",admin.accessToken,{
        method:"POST",
        headers:{Prefer:"resolution=merge-duplicates,return=representation"},
        body:JSON.stringify({
          project_id:targetProjectId,
          user_id:userId,
          member_role:memberRole,
        }),
      });
      const rows=await safeJson(response) as Row[]|null;
      return response.ok&&Array.isArray(rows)&&rows[0]
        ? json({ok:true,member:rows[0]},200,admin.setCookies)
        : json({ok:false},response.status||500,admin.setCookies);
    }

    if(request.method==="DELETE") {
      const targetProjectId=url.searchParams.get("projectId");
      const userId=url.searchParams.get("userId");
      if(!targetProjectId||!userId) return json({ok:false},400,admin.setCookies);

      const response=await restFetch(
        env,
        `/project_members?project_id=eq.${encodeURIComponent(targetProjectId)}&user_id=eq.${encodeURIComponent(userId)}`,
        admin.accessToken,
        {method:"DELETE"},
      );
      return json({ok:response.ok},response.ok?200:response.status,admin.setCookies);
    }
  }

  return json({ok:false},405,admin.setCookies);
}
