import { NextRequest, NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin-server";
import { dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

export async function GET(request: NextRequest) {
  const admin = await getAdminContext(request);
  if (!admin) return NextResponse.json({ ok: false }, { status: 403 });

  try {
    const response = await dataFetch(
      "/projects?select=*&order=updated_at.desc&limit=200",
      admin.accessToken,
    );
    const projects = await safeJson(response) as Row[] | null;
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    const rows = Array.isArray(projects) ? projects : [];
    const requestIds = [...new Set(rows.map(row => row.request_id).filter(Boolean))];
    const clientIds = [...new Set(rows.map(row => row.client_id).filter(Boolean))];

    let requests: Row[] = [];
    let profiles: Row[] = [];

    if (requestIds.length) {
      const ids = requestIds.map(id => `"${String(id).replaceAll('"','')}"`).join(",");
      const r = await dataFetch(
        `/project_requests?select=*&id=in.(${encodeURIComponent(ids)})`,
        admin.accessToken,
      );
      const payload = await safeJson(r);
      if (r.ok && Array.isArray(payload)) requests = payload as Row[];
    }

    if (clientIds.length) {
      const ids = clientIds.map(id => `"${String(id).replaceAll('"','')}"`).join(",");
      const r = await dataFetch(
        `/profiles?select=*&id=in.(${encodeURIComponent(ids)})`,
        admin.accessToken,
      );
      const payload = await safeJson(r);
      if (r.ok && Array.isArray(payload)) profiles = payload as Row[];
    }

    const requestMap = new Map(requests.map(row => [row.id,row]));
    const profileMap = new Map(profiles.map(row => [row.id,row]));

    return NextResponse.json({
      ok: true,
      projects: rows.map(project => ({
        ...project,
        request: requestMap.get(project.request_id) || null,
        client: profileMap.get(project.client_id) || null,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
