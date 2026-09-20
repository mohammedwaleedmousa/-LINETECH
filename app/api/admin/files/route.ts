import { NextRequest, NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin-server";
import { dataFetch, safeJson, storageFetch } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

const categories = new Set(["brief","reference","deliverable","handover","other"]);
const statuses = new Set(["in-progress","ready","review","approved"]);

function safeName(name:string){
  return name.normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g,"-")
    .replace(/-+/g,"-")
    .replace(/^-|-$/g,"")
    .slice(0,100) || "file";
}

function encodeObjectPath(path:string){
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function POST(request:NextRequest){
  const admin = await getAdminContext(request);
  if(!admin) return NextResponse.json({ok:false},{status:403});

  try{
    const form = await request.formData();
    const file = form.get("file");
    const projectId = String(form.get("projectId") || "").trim();
    const categoryValue = String(form.get("category") || "other");
    const statusValue = String(form.get("status") || "ready");
    const detail = String(form.get("detail") || "").trim();

    if(!(file instanceof File) || !projectId){
      return NextResponse.json({ok:false},{status:400});
    }
    if(!categories.has(categoryValue) || !statuses.has(statusValue)){
      return NextResponse.json({ok:false},{status:400});
    }
    if(file.size <= 0 || file.size > 25 * 1024 * 1024){
      return NextResponse.json({ok:false},{status:413});
    }

    const projectResponse = await dataFetch(
      `/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,
      admin.accessToken,
    );
    const projectRows = await safeJson(projectResponse) as Row[] | null;
    const project = Array.isArray(projectRows) ? projectRows[0] : null;
    if(!projectResponse.ok || !project){
      return NextResponse.json({ok:false},{status:projectResponse.ok?404:projectResponse.status});
    }

    const objectPath = `${projectId}/${crypto.randomUUID()}-${safeName(file.name)}`;
    const storageResponse = await storageFetch(
      `/object/project-files/${encodeObjectPath(objectPath)}`,
      admin.accessToken,
      {
        method:"POST",
        headers:{
          "Content-Type":file.type || "application/octet-stream",
          "x-upsert":"false",
        },
        body:file,
      },
    );
    if(!storageResponse.ok){
      return NextResponse.json({ok:false},{status:storageResponse.status});
    }

    const metadataResponse = await dataFetch("/project_files?select=*",admin.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        project_id:projectId,
        uploader_id:admin.user.id,
        category:categoryValue,
        storage_bucket:"project-files",
        storage_path:objectPath,
        file_name:file.name || safeName(file.name),
        mime_type:file.type || "application/octet-stream",
        file_size:file.size,
        status:statusValue,
        detail:detail || null,
      }),
    });
    const rows = await safeJson(metadataResponse) as Row[] | null;
    if(!metadataResponse.ok || !Array.isArray(rows) || !rows[0]){
      return NextResponse.json({ok:false},{status:metadataResponse.status || 500});
    }

    const record = rows[0];

    await Promise.all([
      dataFetch("/project_activity",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          project_id:projectId,
          actor_id:admin.user.id,
          event_type:"file_added",
          title:"Project file added",
          detail:file.name,
        }),
      }),
      dataFetch("/notifications",admin.accessToken,{
        method:"POST",
        body:JSON.stringify({
          user_id:project.client_id,
          project_id:projectId,
          title:"New project file",
          body:file.name,
        }),
      }),
    ]);

    return NextResponse.json({
      ok:true,
      file:{
        ...record,
        href:`/api/files/download?fileId=${encodeURIComponent(record.id)}`,
      },
    });
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}

export async function PATCH(request:NextRequest){
  const admin = await getAdminContext(request);
  if(!admin) return NextResponse.json({ok:false},{status:403});

  try{
    const body = await request.json() as {
      fileId?:string;
      status?:string;
      detail?:string|null;
    };
    const fileId = body.fileId?.trim();
    if(!fileId) return NextResponse.json({ok:false},{status:400});

    const update:Record<string,unknown> = {};
    if(body.status !== undefined){
      if(!statuses.has(body.status)) return NextResponse.json({ok:false},{status:400});
      update.status = body.status;
    }
    if(body.detail !== undefined) update.detail = body.detail?.trim() || null;
    if(!Object.keys(update).length) return NextResponse.json({ok:false},{status:400});

    const response = await dataFetch(
      `/project_files?id=eq.${encodeURIComponent(fileId)}&select=*`,
      admin.accessToken,
      {
        method:"PATCH",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify(update),
      },
    );
    const rows = await safeJson(response) as Row[] | null;
    if(!response.ok || !Array.isArray(rows) || !rows[0]){
      return NextResponse.json({ok:false},{status:response.ok?404:response.status});
    }

    return NextResponse.json({ok:true,file:rows[0]});
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}
