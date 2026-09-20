import { NextRequest, NextResponse } from "next/server";
import { accessTokenFrom, dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

export async function GET(request:NextRequest){
  const accessToken = accessTokenFrom(request);
  if(!accessToken) return NextResponse.json({ok:false},{status:401});

  try{
    const response = await dataFetch(
      "/notifications?select=*&order=created_at.desc&limit=50",
      accessToken,
    );
    const rows = await safeJson(response);
    return response.ok
      ? NextResponse.json({ok:true,notifications:Array.isArray(rows)?rows:[]})
      : NextResponse.json({ok:false},{status:response.status});
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}

export async function PATCH(request:NextRequest){
  const accessToken = accessTokenFrom(request);
  if(!accessToken) return NextResponse.json({ok:false},{status:401});

  try{
    const body = await request.json() as {notificationId?:string};
    const notificationId = body.notificationId?.trim();
    if(!notificationId) return NextResponse.json({ok:false},{status:400});

    const response = await dataFetch(
      `/notifications?id=eq.${encodeURIComponent(notificationId)}&select=id,read_at`,
      accessToken,
      {
        method:"PATCH",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({read_at:new Date().toISOString()}),
      },
    );
    const rows = await safeJson(response) as Row[] | null;
    if(!response.ok || !Array.isArray(rows) || !rows[0]){
      return NextResponse.json({ok:false},{status:response.ok?404:response.status});
    }

    return NextResponse.json({ok:true,notification:rows[0]});
  }catch{
    return NextResponse.json({ok:false},{status:503});
  }
}
