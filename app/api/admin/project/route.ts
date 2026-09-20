import { NextRequest, NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin-server";
import { dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

const projectStatuses = new Set([
  "planned",
  "active",
  "waiting_client",
  "review",
  "completed",
  "archived",
]);

const requestStatuses = new Set([
  "submitted",
  "reviewing",
  "scoped",
  "accepted",
  "declined",
]);

export async function GET(request: NextRequest) {
  const admin = await getAdminContext(request);
  if (!admin) return NextResponse.json({ ok: false }, { status: 403 });

  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const projectResponse = await dataFetch(
      `/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,
      admin.accessToken,
    );
    const projectRows = await safeJson(projectResponse) as Row[] | null;
    if (!projectResponse.ok) {
      return NextResponse.json({ ok: false }, { status: projectResponse.status });
    }

    const project = Array.isArray(projectRows) ? projectRows[0] : null;
    if (!project) return NextResponse.json({ ok: false }, { status: 404 });

    const [requestResponse,activityResponse,filesResponse,handoverResponse] = await Promise.all([
      project.request_id
        ? dataFetch(
            `/project_requests?select=*&id=eq.${encodeURIComponent(project.request_id)}&limit=1`,
            admin.accessToken,
          )
        : Promise.resolve(null),
      dataFetch(
        `/project_activity?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.desc&limit=100`,
        admin.accessToken,
      ),
      dataFetch(
        `/project_files?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=updated_at.desc&limit=100`,
        admin.accessToken,
      ),
      dataFetch(
        `/handover_items?select=*&project_id=eq.${encodeURIComponent(projectId)}&order=created_at.asc&limit=100`,
        admin.accessToken,
      ),
    ]);

    const [requestPayload,activityPayload,filesPayload,handoverPayload] = await Promise.all([
      requestResponse ? safeJson(requestResponse) : Promise.resolve(null),
      safeJson(activityResponse),
      safeJson(filesResponse),
      safeJson(handoverResponse),
    ]);

    return NextResponse.json({
      ok: true,
      project,
      request: Array.isArray(requestPayload) ? requestPayload[0] || null : null,
      activity: Array.isArray(activityPayload) ? activityPayload : [],
      files: Array.isArray(filesPayload) ? filesPayload : [],
      handover: Array.isArray(handoverPayload) ? handoverPayload : [],
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminContext(request);
  if (!admin) return NextResponse.json({ ok: false }, { status: 403 });

  try {
    const body = await request.json() as {
      projectId?: string;
      status?: string;
      phase?: number;
      latestUpdate?: string | null;
      dueDate?: string | null;
      nextActionTitle?: string | null;
      nextActionBody?: string | null;
      nextActionRequired?: boolean;
      requestStatus?: string;
      activityTitle?: string;
      activityDetail?: string;
      notifyClient?: boolean;
      notificationTitle?: string;
      notificationBody?: string;
    };

    const projectId = body.projectId?.trim();
    if (!projectId) return NextResponse.json({ ok: false }, { status: 400 });

    const currentResponse = await dataFetch(
      `/projects?select=*&id=eq.${encodeURIComponent(projectId)}&limit=1`,
      admin.accessToken,
    );
    const currentRows = await safeJson(currentResponse) as Row[] | null;
    const current = Array.isArray(currentRows) ? currentRows[0] : null;
    if (!currentResponse.ok || !current) {
      return NextResponse.json({ ok: false }, { status: currentResponse.ok ? 404 : currentResponse.status });
    }

    const update: Record<string, unknown> = {};
    if (body.status !== undefined) {
      if (!projectStatuses.has(body.status)) return NextResponse.json({ ok: false }, { status: 400 });
      update.status = body.status;
    }
    if (body.phase !== undefined) {
      const phase = Math.round(Number(body.phase));
      if (phase < 1 || phase > 5) return NextResponse.json({ ok: false }, { status: 400 });
      update.phase = phase;
    }
    if (body.latestUpdate !== undefined) update.latest_update = body.latestUpdate || null;
    if (body.dueDate !== undefined) update.due_date = body.dueDate || null;
    if (body.nextActionTitle !== undefined) update.next_action_title = body.nextActionTitle || null;
    if (body.nextActionBody !== undefined) update.next_action_body = body.nextActionBody || null;
    if (body.nextActionRequired !== undefined) update.next_action_required = Boolean(body.nextActionRequired);

    let project = current;
    if (Object.keys(update).length) {
      const updateResponse = await dataFetch(
        `/projects?id=eq.${encodeURIComponent(projectId)}&select=*`,
        admin.accessToken,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(update),
        },
      );
      const rows = await safeJson(updateResponse) as Row[] | null;
      if (!updateResponse.ok || !Array.isArray(rows) || !rows[0]) {
        return NextResponse.json({ ok: false }, { status: updateResponse.status || 500 });
      }
      project = rows[0];
    }

    if (body.requestStatus !== undefined && current.request_id) {
      if (!requestStatuses.has(body.requestStatus)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      await dataFetch(
        `/project_requests?id=eq.${encodeURIComponent(current.request_id)}`,
        admin.accessToken,
        {
          method: "PATCH",
          body: JSON.stringify({ status: body.requestStatus }),
        },
      );
    }

    if (body.activityTitle?.trim()) {
      await dataFetch("/project_activity", admin.accessToken, {
        method: "POST",
        body: JSON.stringify({
          project_id: projectId,
          actor_id: admin.user.id,
          event_type: "project_update",
          title: body.activityTitle.trim(),
          detail: body.activityDetail?.trim() || null,
        }),
      });
    }

    if (body.notifyClient) {
      const title = body.notificationTitle?.trim() || body.activityTitle?.trim() || "Project updated";
      await dataFetch("/notifications", admin.accessToken, {
        method: "POST",
        body: JSON.stringify({
          user_id: current.client_id,
          project_id: projectId,
          title,
          body: body.notificationBody?.trim() || body.activityDetail?.trim() || null,
        }),
      });
    }

    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
