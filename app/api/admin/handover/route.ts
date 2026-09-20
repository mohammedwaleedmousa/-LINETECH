import { NextRequest, NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin-server";
import { dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

export async function GET(request:NextRequest){
  const admin = await getAdminContext(request);
  if(!admin) return NextResponse.json({ok:false},{status:403});
  const projectId = request.nextUrl.searchParams.get("projectId");
  if(!projectId) return NextResponse.json({ok:false},{status:400});

  const response = await dataFetch(
    `/handover_items?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.asc`,
    admin.accessToken,
  );
  const rows = await safeJson(response);
  return response.ok
    ? NextResponse.json({ok:true,items:Array.isArray(rows)?rows:[]})
    : NextResponse.json({ok:false},{status:response.status});
}

export async function POST(request:NextRequest){
  const admin = await getAdminContext(request);
  if(!admin) return NextResponse.json({ok:false},{status:403});

  try{
    const body = await request.json() as {
      projectId?:string;
      title?:string;
      description?:string;
    };
    const projectId = body.projectId?.trim();
    const title = body.title?.trim();
    if(!projectId || !title) return NextResponse.json({ok:false},{status:400});

    const response = await dataFetch("/handover_items?select=*",admin.accessToken,{
      method:"POST",
      headers:{Prefer:"return=representation"},
      body:JSON.stringify({
        project_id:projectId,
        title,
        description:body.description?.trim() || null,
      }),
    });
    const rows = await safeJson(response) as Row[] | null;
    if(!response.ok || !Array.isArray(rows) || !rows[0]){
      return NextResponse.json({ok:false},{status:response.status || 500});
    }

    return NextResponse.json({ok:true,item:rows[0]});
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}

export async function PATCH(request:NextRequest){
  const admin = await getAdminContext(request);
  if(!admin) return NextResponse.json({ok:false},{status:403});

  try{
    const body = await request.json() as {
      itemId?:string;
      title?:string;
      description?:string|null;
      completed?:boolean;
    };
    const itemId = body.itemId?.trim();
    if(!itemId) return NextResponse.json({ok:false},{status:400});

    const update:Record<string,unknown> = {};
    if(body.title !== undefined){
      const title = body.title.trim();
      if(!title) return NextResponse.json({ok:false},{status:400});
      update.title = title;
    }
    if(body.description !== undefined) update.description = body.description?.trim() || null;
    if(body.completed !== undefined){
      update.completed = Boolean(body.completed);
      update.completed_at = body.completed ? new Date().toISOString() : null;
    }

    const response = await dataFetch(
      `/handover_items?id=eq.${encodeURIComponent(itemId)}&select=*`,
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

    return NextResponse.json({ok:true,item:rows[0]});
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}
