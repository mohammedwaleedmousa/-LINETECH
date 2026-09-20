import { NextRequest, NextResponse } from "next/server";
import { asSession, authFetch, readJson, setSessionCookies } from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string; remember?: boolean };
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    if (!email || !password) return NextResponse.json({ ok: false }, { status: 400 });

    const authResponse = await authFetch("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const payload = await readJson(authResponse);
    if (!authResponse.ok) return NextResponse.json({ ok: false }, { status: 401 });

    const session = asSession(payload);
    if (!session) return NextResponse.json({ ok: false }, { status: 502 });

    const response = NextResponse.json({ ok: true });
    setSessionCookies(response, session, Boolean(body.remember));
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
