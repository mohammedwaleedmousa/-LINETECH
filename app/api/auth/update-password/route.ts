import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, authFetch } from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const body = await request.json() as { password?: string };
    if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });
    if (!body.password || body.password.length < 8) return NextResponse.json({ ok: false }, { status: 400 });

    const authResponse = await authFetch("/user", {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ password: body.password }),
    });

    return NextResponse.json({ ok: authResponse.ok }, { status: authResponse.ok ? 200 : authResponse.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
