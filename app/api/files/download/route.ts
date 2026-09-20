import { NextRequest, NextResponse } from "next/server";
import { accessTokenFrom, dataFetch, safeJson, storageFetch } from "@/lib/supabase/data-server";

export const runtime = "edge";

type Row = Record<string, any>;

function encodeObjectPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function GET(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  const attachmentId = request.nextUrl.searchParams.get("attachmentId");
  const fileId = request.nextUrl.searchParams.get("fileId");

  if (!attachmentId && !fileId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    let row: Row | null = null;

    if (attachmentId) {
      const response = await dataFetch(
        `/message_attachments?select=*&id=eq.${encodeURIComponent(attachmentId)}&limit=1`,
        accessToken,
      );
      const rows = await safeJson(response) as Row[] | null;
      if (!response.ok) return NextResponse.json({ ok: false }, { status: response.status });
      row = Array.isArray(rows) ? rows[0] : null;
    } else if (fileId) {
      const response = await dataFetch(
        `/project_files?select=*&id=eq.${encodeURIComponent(fileId)}&limit=1`,
        accessToken,
      );
      const rows = await safeJson(response) as Row[] | null;
      if (!response.ok) return NextResponse.json({ ok: false }, { status: response.status });
      row = Array.isArray(rows) ? rows[0] : null;
    }

    if (!row?.storage_bucket || !row?.storage_path) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    const storageResponse = await storageFetch(
      `/object/authenticated/${encodeURIComponent(row.storage_bucket)}/${encodeObjectPath(row.storage_path)}`,
      accessToken,
      { method: "GET" },
    );

    if (!storageResponse.ok) {
      return NextResponse.json({ ok: false }, { status: storageResponse.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", row.mime_type || storageResponse.headers.get("Content-Type") || "application/octet-stream");
    headers.set("Cache-Control", "private, no-store");
    if (row.file_name) {
      headers.set(
        "Content-Disposition",
        `inline; filename*=UTF-8''${encodeURIComponent(String(row.file_name))}`,
      );
    }

    return new NextResponse(storageResponse.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
