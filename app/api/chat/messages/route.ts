import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth-server";
import { accessTokenFrom, dataFetch, safeJson } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Aden",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

async function getContext(accessToken: string) {
  const userResponse = await getAuthUser(accessToken);
  if (!userResponse.response.ok) return null;
  const user = userResponse.payload as Row;

  const projectResponse = await dataFetch(
    "/projects?select=id&order=created_at.desc&limit=1",
    accessToken,
  );
  const projects = await safeJson(projectResponse) as Row[] | null;
  const project = Array.isArray(projects) ? projects[0] : null;
  if (!project?.id) return { user, project: null, conversation: null };

  const conversationResponse = await dataFetch(
    `/conversations?select=id,project_id&project_id=eq.${encodeURIComponent(project.id)}&limit=1`,
    accessToken,
  );
  const conversations = await safeJson(conversationResponse) as Row[] | null;
  const conversation = Array.isArray(conversations) ? conversations[0] : null;
  return { user, project, conversation };
}

function mapMessage(row: Row, currentUserId: string) {
  const attachment = Array.isArray(row.message_attachments)
    ? row.message_attachments[0]
    : null;

  return {
    id: row.id,
    sender: row.sender_id === currentUserId ? "client" : "company",
    kind: row.kind,
    text: row.deleted_at ? undefined : row.text || undefined,
    src: attachment?.id && !row.deleted_at
      ? `/api/files/download?attachmentId=${encodeURIComponent(attachment.id)}`
      : undefined,
    fileName: attachment?.file_name || undefined,
    fileSize: attachment?.file_size ?? undefined,
    fileType: attachment?.mime_type || undefined,
    duration: attachment?.duration_seconds ?? undefined,
    edited: Boolean(row.edited_at),
    deleted: Boolean(row.deleted_at),
    time: formatTime(row.created_at),
  };
}

export async function GET(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const context = await getContext(accessToken);
    if (!context) return NextResponse.json({ ok: false }, { status: 401 });
    if (!context.conversation) {
      return NextResponse.json({ ok: true, messages: [] });
    }

    const response = await dataFetch(
      `/messages?select=*,message_attachments(*)&conversation_id=eq.${encodeURIComponent(context.conversation.id)}&order=created_at.asc`,
      accessToken,
    );
    const rows = await safeJson(response) as Row[] | null;
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    const userId = String(context.user.id || "");
    const messages = Array.isArray(rows) ? rows.map(row => mapMessage(row, userId)) : [];
    return NextResponse.json({ ok: true, messages });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const body = await request.json() as { text?: string };
    const text = body.text?.trim();
    if (!text) return NextResponse.json({ ok: false }, { status: 400 });

    const context = await getContext(accessToken);
    if (!context) return NextResponse.json({ ok: false }, { status: 401 });
    if (!context.conversation?.id || !context.user?.id) {
      return NextResponse.json({ ok: false }, { status: 409 });
    }

    const response = await dataFetch("/messages?select=*", accessToken, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        conversation_id: context.conversation.id,
        sender_id: context.user.id,
        kind: "text",
        text,
      }),
    });
    const rows = await safeJson(response) as Row[] | null;
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    const row = Array.isArray(rows) ? rows[0] : null;
    return NextResponse.json({
      ok: true,
      message: row ? mapMessage({ ...row, message_attachments: [] }, String(context.user.id)) : null,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const body = await request.json() as { messageId?: string; text?: string };
    const messageId = body.messageId?.trim();
    const text = body.text?.trim();
    if (!messageId || !text) return NextResponse.json({ ok: false }, { status: 400 });

    const context = await getContext(accessToken);
    if (!context?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

    const response = await dataFetch(
      `/messages?id=eq.${encodeURIComponent(messageId)}&sender_id=eq.${encodeURIComponent(String(context.user.id))}&select=*`,
      accessToken,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ text, edited_at: new Date().toISOString() }),
      },
    );
    const rows = await safeJson(response) as Row[] | null;
    if (!response.ok || !Array.isArray(rows) || !rows[0]) {
      return NextResponse.json({ ok: false }, { status: response.ok ? 404 : response.status });
    }

    return NextResponse.json({
      ok: true,
      message: mapMessage({ ...rows[0], message_attachments: [] }, String(context.user.id)),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const body = await request.json() as { messageId?: string };
    const messageId = body.messageId?.trim();
    if (!messageId) return NextResponse.json({ ok: false }, { status: 400 });

    const context = await getContext(accessToken);
    if (!context?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

    const response = await dataFetch(
      `/messages?id=eq.${encodeURIComponent(messageId)}&sender_id=eq.${encodeURIComponent(String(context.user.id))}`,
      accessToken,
      {
        method: "PATCH",
        body: JSON.stringify({
          text: null,
          deleted_at: new Date().toISOString(),
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
