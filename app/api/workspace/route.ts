import { NextRequest, NextResponse } from "next/server";
import { accessTokenFrom, dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type AnyRow = Record<string, any>;

function mapStatus(status: string) {
  if (status === "completed") return "complete";
  if (status === "review" || status === "waiting_client") return "review";
  if (status === "active") return "in-progress";
  return "ready";
}

export async function GET(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const requestResponse = await dataFetch(
      "/project_requests?select=*&order=submitted_at.desc&limit=1",
      accessToken,
    );
    const requestRows = await safeJson(requestResponse) as AnyRow[] | null;

    if (!requestResponse.ok) {
      return NextResponse.json({ ok: false }, { status: requestResponse.status });
    }

    const projectRequest = Array.isArray(requestRows) ? requestRows[0] : null;
    if (!projectRequest) {
      return NextResponse.json({ ok: true, record: null, progress: null });
    }

    const projectResponse = await dataFetch(
      `/projects?select=*&request_id=eq.${encodeURIComponent(projectRequest.id)}&limit=1`,
      accessToken,
    );
    const projectRows = await safeJson(projectResponse) as AnyRow[] | null;
    if (!projectResponse.ok) {
      return NextResponse.json({ ok: false }, { status: projectResponse.status });
    }

    const project = Array.isArray(projectRows) ? projectRows[0] : null;

    let activity: AnyRow[] = [];
    let files: AnyRow[] = [];

    if (project?.id) {
      const [activityResponse, filesResponse] = await Promise.all([
        dataFetch(
          `/project_activity?select=*&project_id=eq.${encodeURIComponent(project.id)}&order=created_at.desc&limit=20`,
          accessToken,
        ),
        dataFetch(
          `/project_files?select=*&project_id=eq.${encodeURIComponent(project.id)}&order=updated_at.desc&limit=50`,
          accessToken,
        ),
      ]);

      const [activityPayload, filesPayload] = await Promise.all([
        safeJson(activityResponse),
        safeJson(filesResponse),
      ]);

      if (activityResponse.ok && Array.isArray(activityPayload)) activity = activityPayload as AnyRow[];
      if (filesResponse.ok && Array.isArray(filesPayload)) files = filesPayload as AnyRow[];
    }

    const record = {
      requestId: projectRequest.reference_number,
      completedAt: projectRequest.submitted_at,
      status: projectRequest.status,
      customer: {
        name: projectRequest.name || "",
        company: projectRequest.company || "",
        contact: projectRequest.contact || "",
        preferredContact: projectRequest.preferred_contact || "",
      },
      project: {
        service: projectRequest.service || "",
        stage: projectRequest.stage || "",
        goal: projectRequest.goal || "",
        idea: projectRequest.idea || "",
        audience: projectRequest.audience || "",
        features: projectRequest.features || "",
        references: projectRequest.reference_links || "",
      },
      scope: {
        budget: projectRequest.budget || "",
        timing: projectRequest.timing || "",
        notes: projectRequest.notes || "",
      },
    };

    const progress = project ? {
      requestId: projectRequest.reference_number,
      currentPhase: Number(project.phase || 1),
      status: mapStatus(project.status),
      updatedAt: project.updated_at || project.created_at || projectRequest.submitted_at,
      latestUpdate: project.latest_update || undefined,
      nextMilestone: project.next_action_title || undefined,
      nextMilestoneDate: project.due_date || undefined,
      actionNeeded: {
        required: Boolean(project.next_action_required),
        title: project.next_action_title || undefined,
        detail: project.next_action_body || undefined,
        label: project.next_action_required ? "Open project chat" : undefined,
        href: project.next_action_required ? "/chat" : undefined,
      },
      activity: activity.map(item => ({
        id: item.id,
        title: item.title,
        detail: item.detail || undefined,
        at: item.created_at,
      })),
      files: files.map(file => ({
        id: file.id,
        name: file.file_name,
        status: file.status || "ready",
        detail: file.detail || undefined,
        updatedAt: file.updated_at || file.created_at,
        href: `/api/files/download?fileId=${encodeURIComponent(file.id)}`,
      })),
    } : null;

    return NextResponse.json({ ok: true, record, progress });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
