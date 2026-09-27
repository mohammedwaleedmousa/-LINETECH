import {
  type Env,
  boundedText,
  encodeObjectPath,
  formatTime,
  json,
  rateLimitAllowed,
  rateLimitResponse,
  requestTooLarge,
  requireAdmin,
  restFetch,
  safeJson,
  safeName,
  storageFetch,
  validateUpload,
} from "./core";

type Row=Record<string,any>;
const projectStatuses=new Set(["planned","active","waiting_client","review","completed","archived"]);
const requestStatuses=new Set(["submitted","reviewing","scoped","accepted","declined"]);
const fileStatuses=new Set(["in-progress","ready","review","approved"]);
const categories=new Set(["brief","reference","deliverable","handover","other"]);

function clientProjectPath(path:string,projectId:string) {
  return `${path}?project=${encodeURIComponent(projectId)}`;
}

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

  if(path==="/api/admin/client" && request.method==="GET") {
    const userId=new URL(request.url).searchParams.get("userId")||"";
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
      return json({ok:false},400,admin.setCookies);
    }

    const [profileResponse,projectsResponse,requestsResponse,messagesResponse]=await Promise.all([
      restFetch(
        env,
        `/profiles?select=id,full_name,company,phone,email,created_at,updated_at&id=eq.${encodeURIComponent(userId)}&limit=1`,
        admin.accessToken,
      ),
      restFetch(
        env,
        `/projects?select=id,title,status,phase,updated_at,due_date,created_at,request_id&client_id=eq.${encodeURIComponent(userId)}&order=updated_at.desc&limit=100`,
        admin.accessToken,
      ),
      restFetch(
        env,
        `/project_requests?select=id,reference_number,status,service,name,company,contact,submitted_at&owner_id=eq.${encodeURIComponent(userId)}&order=submitted_at.desc&limit=100`,
        admin.accessToken,
      ),
      restFetch(
        env,
        `/messages?select=id,conversation_id,kind,text,created_at,deleted_at&sender_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=50`,
        admin.accessToken,
      ),
    ]);

    const [profileRows,projectRows,requestRows,messageRows]=await Promise.all([
      safeJson(profileResponse) as Promise<Row[]|null>,
      safeJson(projectsResponse) as Promise<Row[]|null>,
      safeJson(requestsResponse) as Promise<Row[]|null>,
      safeJson(messagesResponse) as Promise<Row[]|null>,
    ]);

    if(!profileResponse.ok||!projectsResponse.ok||!requestsResponse.ok||!messagesResponse.ok) {
      const status=!profileResponse.ok
        ? profileResponse.status
        : !projectsResponse.ok
          ? projectsResponse.status
          : !requestsResponse.ok
            ? requestsResponse.status
            : messagesResponse.status;
      return json({ok:false},status,admin.setCookies);
    }

    const profile=Array.isArray(profileRows)?profileRows[0]||null:null;
    const projects=Array.isArray(projectRows)?projectRows:[];
    const requests=Array.isArray(requestRows)?requestRows:[];
    const messages=Array.isArray(messageRows)?messageRows:[];

    const projectIds=projects.map(item=>String(item.id||"")).filter(Boolean);
    let conversations:Row[]=[];
    if(projectIds.length) {
      const conversationResponse=await restFetch(
        env,
        `/conversations?select=id,project_id&project_id=in.(${encodeURIComponent(projectIds.join(","))})`,
        admin.accessToken,
      );
      const conversationRows=await safeJson(conversationResponse);
      if(conversationResponse.ok&&Array.isArray(conversationRows)) conversations=conversationRows as Row[];
    }

    const requestMap=new Map(requests.map(item=>[String(item.id),item]));
    const conversationMap=new Map(conversations.map(item=>[String(item.id),String(item.project_id)]));
    const projectMap=new Map(projects.map(item=>[String(item.id),item]));

    const activity=[
      ...messages.map(message=>{
        const projectId=conversationMap.get(String(message.conversation_id))||null;
        const project=projectId?projectMap.get(projectId):null;
        return {
          id:`message:${message.id}`,
          type:"message",
          projectId,
          projectTitle:project?.title||"Project",
          title:message.deleted_at?"Client deleted a message":"Client sent a message",
          detail:message.deleted_at
            ? null
            : message.kind==="text"
              ? String(message.text||"").slice(0,240)
              : `Shared ${String(message.kind||"attachment")}`,
          at:message.created_at,
        };
      }),
      ...requests.map(item=>({
        id:`request:${item.id}`,
        type:"request",
        projectId:projects.find(project=>String(project.request_id)===String(item.id))?.id||null,
        projectTitle:item.service||"Project request",
        title:"Project request submitted",
        detail:item.reference_number||null,
        at:item.submitted_at,
      })),
      ...projects.map(item=>({
        id:`project:${item.id}`,
        type:"project",
        projectId:item.id,
        projectTitle:item.title||"Project",
        title:"Project record updated",
        detail:`${item.status||"planned"} · Phase ${Number(item.phase||1)}/5`,
        at:item.updated_at||item.created_at,
      })),
    ]
      .filter(item=>item.at)
      .sort((a,b)=>new Date(String(b.at)).getTime()-new Date(String(a.at)).getTime())
      .slice(0,24);

    const activeProjects=projects.filter(item=>!["completed","archived"].includes(String(item.status||""))).length;
    const completedProjects=projects.filter(item=>String(item.status||"")==="completed").length;
    const fallbackContact=requests.find(item=>String(item.contact||"").trim())?.contact||null;

    return json({
      ok:true,
      client:{
        id:userId,
        fullName:profile?.full_name||requests[0]?.name||"Client",
        company:profile?.company||requests[0]?.company||null,
        email:profile?.email||null,
        phone:profile?.phone||null,
        contact:fallbackContact,
        createdAt:profile?.created_at||requests.at(-1)?.submitted_at||null,
        updatedAt:profile?.updated_at||null,
      },
      stats:{
        projectCount:projects.length,
        activeProjects,
        completedProjects,
        requestCount:requests.length,
        messageCount:messages.length,
      },
      projects:projects.map(project=>({
        ...project,
        request:requestMap.get(String(project.request_id))||null,
      })),
      activity,
    },200,admin.setCookies);
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
    if(requestTooLarge(request,64*1024)) return json({ok:false},413,admin.setCookies);
    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const projectId=boundedText(data.projectId,100);
    if(!projectId) return json({ok:false},400,admin.setCookies);

    const textFields={
      latestUpdate:boundedText(data.latestUpdate,5000),
      dueDate:boundedText(data.dueDate,40),
      nextActionTitle:boundedText(data.nextActionTitle,300),
      nextActionBody:boundedText(data.nextActionBody,3000),
      activityTitle:boundedText(data.activityTitle,300),
      activityDetail:boundedText(data.activityDetail,3000),
      notificationTitle:boundedText(data.notificationTitle,300),
      notificationBody:boundedText(data.notificationBody,3000),
    };
    if(Object.values(textFields).some(value=>value===null)) return json({ok:false},413,admin.setCookies);

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
    if(data.latestUpdate!==undefined) update.latest_update=textFields.latestUpdate||null;
    if(data.dueDate!==undefined) update.due_date=textFields.dueDate||null;
    if(data.nextActionTitle!==undefined) update.next_action_title=textFields.nextActionTitle||null;
    if(data.nextActionBody!==undefined) update.next_action_body=textFields.nextActionBody||null;
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

    if(textFields.activityTitle) {
      await restFetch(env,"/project_activity",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          project_id:projectId,actor_id:admin.user.id,event_type:"project_update",
          title:textFields.activityTitle,
          detail:textFields.activityDetail||null,
        }),
      });
    }

    if(data.notifyClient && current.client_id) {
      const handoverReady=Number(project.phase||1)>=5 || String(project.status||"")==="completed";
      await restFetch(env,"/notifications",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          user_id:current.client_id,
          project_id:projectId,
          title:textFields.notificationTitle||textFields.activityTitle||(handoverReady?"Project handover ready":"Project updated"),
          body:textFields.notificationBody||textFields.activityDetail||null,
          action_kind:handoverReady?"handover":"project_update",
          destination:clientProjectPath(handoverReady?"/handover":"/workspace",projectId),
        }),
      });
    }
    return json({ok:true,project},200,admin.setCookies);
  }

  if(path==="/api/admin/files" && request.method==="POST") {
    if(requestTooLarge(request,26*1024*1024)) return json({ok:false},413,admin.setCookies);
    const form=await request.formData();
    const file=form.get("file");
    const projectId=String(form.get("projectId")||"").trim();
    const category=String(form.get("category")||"other");
    const status=String(form.get("status")||"ready");
    const detail=boundedText(form.get("detail"),1000);
    if(!(file instanceof File)||!projectId||!categories.has(category)||!fileStatuses.has(status)||detail===null) {
      return json({ok:false},400,admin.setCookies);
    }
    const validated=await validateUpload(file,"admin");
    if(!validated.ok) return json({ok:false},validated.status,admin.setCookies);

    const pr=await restFetch(env,`/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken);
    const projects=await safeJson(pr) as Row[]|null;
    const project=Array.isArray(projects)?projects[0]:null;
    if(!pr.ok||!project) return json({ok:false},pr.ok?404:pr.status,admin.setCookies);

    const objectPath=`${projectId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const upload=await storageFetch(env,`/object/project-files/${encodeObjectPath(objectPath)}`,admin.accessToken,{
      method:"POST",
      headers:{"Content-Type":validated.mime,"x-upsert":"false"},
      body:file,
    });
    if(!upload.ok) return json({ok:false},upload.status,admin.setCookies);

    const mr=await restFetch(env,"/project_files?select=*",admin.accessToken,{
      method:"POST",headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        project_id:projectId,uploader_id:admin.user.id,category,
        storage_bucket:"project-files",storage_path:objectPath,
        file_name:file.name||safeName(file.name),mime_type:validated.mime,
        file_size:file.size,status,detail:detail||null,
      }),
    });
    const rows=await safeJson(mr) as Row[]|null;
    const record=Array.isArray(rows)?rows[0]:null;
    if(!mr.ok||!record) {
      await storageFetch(
        env,
        `/object/project-files/${encodeObjectPath(objectPath)}`,
        admin.accessToken,
        {method:"DELETE"},
      ).catch(()=>null);
      return json({ok:false},mr.status||500,admin.setCookies);
    }

    await Promise.all([
      restFetch(env,"/project_activity",admin.accessToken,{method:"POST",body:JSON.stringify({
        project_id:projectId,actor_id:admin.user.id,event_type:"file_added",title:"Project file added",detail:file.name,
      })}),
      restFetch(env,"/notifications",admin.accessToken,{method:"POST",body:JSON.stringify({
        user_id:project.client_id,
        project_id:projectId,
        title:(category==="handover"||category==="deliverable")?"New delivery file":"New project file",
        body:file.name,
        action_kind:(category==="handover"||category==="deliverable")?"handover":"file",
        destination:clientProjectPath(
          (category==="handover"||category==="deliverable") && (Number(project.phase||1)>=5 || String(project.status||"")==="completed")
            ? "/handover"
            : "/workspace",
          projectId,
        ),
      })}),
    ]);
    return json({ok:true,file:{...record,href:`/api/files/download?fileId=${encodeURIComponent(record.id)}`}},200,admin.setCookies);
  }

  if(path==="/api/admin/files" && request.method==="PATCH") {
    if(requestTooLarge(request,32*1024)) return json({ok:false},413,admin.setCookies);
    const data=await request.json().catch(()=>({})) as Record<string,any>;
    const fileId=boundedText(data.fileId,100);
    if(!fileId) return json({ok:false},400,admin.setCookies);

    const currentResponse=await restFetch(
      env,
      `/project_files?select=*&id=eq.${encodeURIComponent(fileId)}&limit=1`,
      admin.accessToken,
    );
    const currentRows=await safeJson(currentResponse) as Row[]|null;
    const current=Array.isArray(currentRows)?currentRows[0]:null;
    if(!currentResponse.ok||!current) {
      return json({ok:false},currentResponse.ok?404:currentResponse.status,admin.setCookies);
    }

    const update:Record<string,unknown>={};
    if(data.status!==undefined) {
      if(!fileStatuses.has(String(data.status))) return json({ok:false},400,admin.setCookies);
      update.status=data.status;
    }
    if(data.detail!==undefined) {
      const detail=boundedText(data.detail,1000);
      if(detail===null) return json({ok:false},413,admin.setCookies);
      update.detail=detail||null;
    }
    if(!Object.keys(update).length) return json({ok:false},400,admin.setCookies);

    const response=await restFetch(env,`/project_files?id=eq.${encodeURIComponent(fileId)}&select=*`,admin.accessToken,{
      method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(update),
    });
    const rows=await safeJson(response) as Row[]|null;
    const file=response.ok&&Array.isArray(rows)?rows[0]:null;
    if(!file) return json({ok:false},response.ok?404:response.status,admin.setCookies);

    if(data.status!==undefined && String(current.status)!==String(file.status)) {
      const projectResponse=await restFetch(
        env,
        `/projects?select=client_id,status,phase&id=eq.${encodeURIComponent(String(file.project_id))}&limit=1`,
        admin.accessToken,
      );
      const projectRows=await safeJson(projectResponse) as Row[]|null;
      const project=Array.isArray(projectRows)?projectRows[0]:null;
      await Promise.all([
        restFetch(env,"/project_activity",admin.accessToken,{
          method:"POST",
          body:JSON.stringify({
            project_id:file.project_id,
            actor_id:admin.user.id,
            event_type:"file_status_updated",
            title:"Project file status updated",
            detail:`${file.file_name}: ${file.status}`,
          }),
        }).catch(()=>null),
        project?.client_id
          ? restFetch(env,"/notifications",admin.accessToken,{
              method:"POST",
              body:JSON.stringify({
                user_id:project.client_id,
                project_id:file.project_id,
                title:(file.category==="handover"||file.category==="deliverable")?"Delivery file updated":"Project file updated",
                body:`${file.file_name}: ${file.status}`,
                action_kind:(file.category==="handover"||file.category==="deliverable")?"handover":"file",
                destination:clientProjectPath(
                  (file.category==="handover"||file.category==="deliverable") && (Number(project.phase||1)>=5 || String(project.status||"")==="completed")
                    ? "/handover"
                    : "/workspace",
                  String(file.project_id),
                ),
              }),
            }).catch(()=>null)
          : Promise.resolve(null),
      ]);
    }

    return json({ok:true,file},200,admin.setCookies);
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
      if(requestTooLarge(request,64*1024)) return json({ok:false},413,admin.setCookies);
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const projectId=boundedText(data.projectId,100);
      const title=boundedText(data.title,300);
      const description=boundedText(data.description,5000);
      if(projectId===null||title===null||description===null) return json({ok:false},413,admin.setCookies);
      if(!projectId||!title) return json({ok:false},400,admin.setCookies);
      const response=await restFetch(env,"/handover_items?select=*",admin.accessToken,{
        method:"POST",headers:{Prefer:"return=representation"},
        body:JSON.stringify({project_id:projectId,title,description:description||null}),
      });
      const rows=await safeJson(response) as Row[]|null;
      const item=response.ok&&Array.isArray(rows)?rows[0]:null;
      if(!item) return json({ok:false},response.status||500,admin.setCookies);

      const projectResponse=await restFetch(
        env,
        `/projects?select=client_id,status,phase&id=eq.${encodeURIComponent(projectId)}&limit=1`,
        admin.accessToken,
      );
      const projectRows=await safeJson(projectResponse) as Row[]|null;
      const project=Array.isArray(projectRows)?projectRows[0]:null;
      const handoverOpen=project && (Number(project.phase||1)>=5 || String(project.status||"")==="completed");
      if(handoverOpen && project.client_id) {
        await restFetch(env,"/notifications",admin.accessToken,{
          method:"POST",
          body:JSON.stringify({
            user_id:project.client_id,
            project_id:projectId,
            title:"Handover updated",
            body:title,
            action_kind:"handover",
            destination:clientProjectPath("/handover",projectId),
          }),
        }).catch(()=>null);
      }

      return json({ok:true,item},200,admin.setCookies);
    }

    if(request.method==="PATCH") {
      if(requestTooLarge(request,64*1024)) return json({ok:false},413,admin.setCookies);
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const itemId=boundedText(data.itemId,100);
      if(!itemId) return json({ok:false},400,admin.setCookies);
      const update:Record<string,unknown>={};
      if(data.title!==undefined) {
        const title=boundedText(data.title,300);
        if(title===null) return json({ok:false},413,admin.setCookies);
        if(!title) return json({ok:false},400,admin.setCookies);
        update.title=title;
      }
      if(data.description!==undefined) {
        const description=boundedText(data.description,5000);
        if(description===null) return json({ok:false},413,admin.setCookies);
        update.description=description||null;
      }
      if(data.completed!==undefined) {
        update.completed=Boolean(data.completed);
        update.completed_at=data.completed?new Date().toISOString():null;
      }
      const response=await restFetch(env,`/handover_items?id=eq.${encodeURIComponent(itemId)}&select=*`,admin.accessToken,{
        method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(update),
      });
      const rows=await safeJson(response) as Row[]|null;
      const item=response.ok&&Array.isArray(rows)?rows[0]:null;
      if(!item) return json({ok:false},response.ok?404:response.status,admin.setCookies);

      const projectResponse=await restFetch(
        env,
        `/projects?select=client_id,status,phase&id=eq.${encodeURIComponent(String(item.project_id))}&limit=1`,
        admin.accessToken,
      );
      const projectRows=await safeJson(projectResponse) as Row[]|null;
      const project=Array.isArray(projectRows)?projectRows[0]:null;
      const handoverOpen=project && (Number(project.phase||1)>=5 || String(project.status||"")==="completed");
      if(handoverOpen && project.client_id) {
        await restFetch(env,"/notifications",admin.accessToken,{
          method:"POST",
          body:JSON.stringify({
            user_id:project.client_id,
            project_id:item.project_id,
            title:item.completed?"Handover item completed":"Handover updated",
            body:item.title,
            action_kind:"handover",
            destination:clientProjectPath("/handover",String(item.project_id)),
          }),
        }).catch(()=>null);
      }

      return json({ok:true,item},200,admin.setCookies);
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
            sender:row.sender_role==="company"?"company":"client",
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
      if(requestTooLarge(request,32*1024)) return json({ok:false},413,admin.setCookies);
      const data=await request.json().catch(()=>({})) as Record<string,any>;
      const text=boundedText(data.text,5000);
      if(text===null) return json({ok:false},413,admin.setCookies);
      if(!text) return json({ok:false},400,admin.setCookies);

      const response=await restFetch(env,"/messages?select=*",admin.accessToken,{
        method:"POST",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({
          conversation_id:conversation.id,
          sender_id:admin.user.id,
          sender_role:"company",
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
            action_kind:"message",
            destination:clientProjectPath("/chat",projectId),
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

  if(path==="/api/admin/chat/upload" && request.method==="POST") {
    if(!(await rateLimitAllowed(
      env.UPLOAD_RATE_LIMITER,
      `admin-chat-upload:${String(admin.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(admin.setCookies);
    }
    if(requestTooLarge(request,16*1024*1024)) return json({ok:false},413,admin.setCookies);

    const form=await request.formData();
    const projectId=String(form.get("projectId")||"").trim();
    const file=form.get("file");
    const requestedKind=String(form.get("kind")||"");
    const duration=Number(form.get("duration")||"0");
    if(!projectId || !(file instanceof File)) return json({ok:false},400,admin.setCookies);

    const kind=requestedKind==="image"||requestedKind==="audio"||requestedKind==="document"
      ? requestedKind
      : file.type.startsWith("image/")?"image":file.type.startsWith("audio/")?"audio":"document";
    const validated=await validateUpload(file,kind);
    if(!validated.ok) return json({ok:false},validated.status,admin.setCookies);

    const [projectResponse,conversationResponse]=await Promise.all([
      restFetch(env,`/projects?select=id,client_id&id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken),
      restFetch(env,`/conversations?select=id,project_id&project_id=eq.${encodeURIComponent(projectId)}&limit=1`,admin.accessToken),
    ]);
    const [projectRows,conversationRows]=await Promise.all([
      safeJson(projectResponse) as Promise<Row[]|null>,
      safeJson(conversationResponse) as Promise<Row[]|null>,
    ]);
    const project=Array.isArray(projectRows)?projectRows[0]:null;
    const conversation=Array.isArray(conversationRows)?conversationRows[0]:null;
    if(!projectResponse.ok||!conversationResponse.ok||!project?.id||!conversation?.id) {
      return json({ok:false},404,admin.setCookies);
    }

    const objectPath=`${projectId}/${crypto.randomUUID()}-${safeName(file.name||kind)}`;
    const upload=await storageFetch(
      env,
      `/object/project-files/${encodeObjectPath(objectPath)}`,
      admin.accessToken,
      {
        method:"POST",
        headers:{"Content-Type":validated.mime,"x-upsert":"false"},
        body:file,
      },
    );
    if(!upload.ok) return json({ok:false},upload.status,admin.setCookies);

    const messageResponse=await restFetch(env,"/messages?select=*",admin.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        conversation_id:conversation.id,
        sender_id:admin.user.id,
        sender_role:"company",
        kind,
        text:null,
      }),
    });
    const messageRows=await safeJson(messageResponse) as Row[]|null;
    const message=Array.isArray(messageRows)?messageRows[0]:null;
    if(!messageResponse.ok||!message) {
      await storageFetch(
        env,
        `/object/project-files/${encodeObjectPath(objectPath)}`,
        admin.accessToken,
        {method:"DELETE"},
      ).catch(()=>null);
      return json({ok:false},messageResponse.status||500,admin.setCookies);
    }

    const attachmentResponse=await restFetch(env,"/message_attachments?select=*",admin.accessToken,{
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
    const attachmentRows=await safeJson(attachmentResponse) as Row[]|null;
    const attachment=Array.isArray(attachmentRows)?attachmentRows[0]:null;
    if(!attachmentResponse.ok||!attachment) {
      await Promise.all([
        storageFetch(
          env,
          `/object/project-files/${encodeObjectPath(objectPath)}`,
          admin.accessToken,
          {method:"DELETE"},
        ).catch(()=>null),
        restFetch(
          env,
          `/messages?id=eq.${encodeURIComponent(String(message.id))}`,
          admin.accessToken,
          {method:"DELETE"},
        ).catch(()=>null),
      ]);
      return json({ok:false},attachmentResponse.status||500,admin.setCookies);
    }

    if(project.client_id) {
      await restFetch(env,"/notifications",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          user_id:project.client_id,
          project_id:projectId,
          title:kind==="image"?"New project image":kind==="audio"?"New voice message":"New project file",
          body:file.name||undefined,
          action_kind:"message",
          destination:clientProjectPath("/chat",projectId),
        }),
      }).catch(()=>null);
    }

    return json({ok:true,message:{
      id:message.id,
      sender:"company",
      kind,
      src:`/api/files/download?attachmentId=${encodeURIComponent(attachment.id)}`,
      fileName:attachment.file_name||undefined,
      fileSize:attachment.file_size??undefined,
      fileType:attachment.mime_type||undefined,
      duration:attachment.duration_seconds??undefined,
      edited:false,
      deleted:false,
      time:formatTime(message.created_at),
    }},200,admin.setCookies);
  }

  if(path==="/api/admin/users" && request.method==="GET") {
    const response=await restFetch(
      env,
      "/profiles?select=id,full_name,company,created_at&order=created_at.asc&limit=500",
      admin.accessToken,
    );
    const rows=await safeJson(response);
    return response.ok
      ? json({ok:true,users:Array.isArray(rows)?rows:[]},200,admin.setCookies)
      : json({ok:false},response.status,admin.setCookies);
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
