import { NextRequest, NextResponse } from "next/server";
import { asSession, authFetch, readJson, setSessionCookies } from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      fullName?: string;
      company?: string;
      email?: string;
      password?: string;
    };

    const fullName = body.fullName?.trim();
    const company = body.company?.trim() || null;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!fullName || !email || !password || password.length < 8) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const authResponse = await authFetch("/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        data: { full_name: fullName, company },
        email_redirect_to: new URL("/login?confirmed=1", request.url).toString(),
      }),
    });
    const payload = await readJson(authResponse);
    if (!authResponse.ok) return NextResponse.json({ ok: false }, { status: 400 });

    const session = asSession(payload);
    const response = NextResponse.json({ ok: true, needsEmailConfirmation: !session });
    if (session) setSessionCookies(response, session, true);
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
