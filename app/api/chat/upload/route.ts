import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth-server";
import { accessTokenFrom, dataFetch, safeJson, storageFetch } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

function safeName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "file";
}

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

function encodeObjectPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
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

export async function POST(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const kindValue = String(form.get("kind") || "");
    const durationValue = Number(form.get("duration") || "0");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const kind = kindValue === "image" || kindValue === "audio" || kindValue === "document"
      ? kindValue
      : file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("audio/")
          ? "audio"
          : "document";

    if (file.size <= 0 || file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }

    const context = await getContext(accessToken);
    if (!context?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
    if (!context.project?.id || !context.conversation?.id) {
      return NextResponse.json({ ok: false }, { status: 409 });
    }

    const fileName = safeName(file.name || `${kind}-upload`);
    const objectPath = `${context.project.id}/${crypto.randomUUID()}-${fileName}`;

    const storageResponse = await storageFetch(
      `/object/project-files/${encodeObjectPath(objectPath)}`,
      accessToken,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: file,
      },
    );

    if (!storageResponse.ok) {
      return NextResponse.json({ ok: false }, { status: storageResponse.status });
    }

    const messageResponse = await dataFetch("/messages?select=*", accessToken, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        conversation_id: context.conversation.id,
        sender_id: context.user.id,
        kind,
        text: null,
      }),
    });
    const messageRows = await safeJson(messageResponse) as Row[] | null;

    if (!messageResponse.ok || !Array.isArray(messageRows) || !messageRows[0]) {
      return NextResponse.json({ ok: false }, { status: messageResponse.status || 500 });
    }

    const message = messageRows[0];

    const attachmentResponse = await dataFetch("/message_attachments?select=*", accessToken, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        message_id: message.id,
        storage_bucket: "project-files",
        storage_path: objectPath,
        file_name: file.name || fileName,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        duration_seconds: kind === "audio" && Number.isFinite(durationValue)
          ? Math.max(0, Math.round(durationValue))
          : null,
      }),
    });
    const attachmentRows = await safeJson(attachmentResponse) as Row[] | null;

    if (!attachmentResponse.ok || !Array.isArray(attachmentRows) || !attachmentRows[0]) {
      return NextResponse.json({ ok: false }, { status: attachmentResponse.status || 500 });
    }

    const attachment = attachmentRows[0];

    return NextResponse.json({
      ok: true,
      message: {
        id: message.id,
        sender: "client",
        kind,
        src: `/api/files/download?attachmentId=${encodeURIComponent(attachment.id)}`,
        fileName: attachment.file_name || undefined,
        fileSize: attachment.file_size ?? undefined,
        fileType: attachment.mime_type || undefined,
        duration: attachment.duration_seconds ?? undefined,
        edited: false,
        deleted: false,
        time: formatTime(message.created_at),
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
