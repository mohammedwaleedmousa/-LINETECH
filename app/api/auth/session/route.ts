import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  asSession,
  getAuthUser,
  refreshAuthSession,
  setSessionCookies,
} from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    const remember = request.cookies.get(REMEMBER_COOKIE)?.value === "1";

    if (accessToken) {
      const verified = await getAuthUser(accessToken);
      if (verified.response.ok) return NextResponse.json({ ok: true, user: verified.payload });
    }

    if (!refreshToken) return NextResponse.json({ ok: false }, { status: 401 });

    const refreshed = await refreshAuthSession(refreshToken);
    if (!refreshed.session) return NextResponse.json({ ok: false }, { status: 401 });

    const response = NextResponse.json({ ok: true, user: refreshed.payload.user ?? null });
    setSessionCookies(response, refreshed.session, remember);
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      accessToken?: string;
      refreshToken?: string;
      expiresIn?: number;
    };
    if (!body.accessToken || !body.refreshToken) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const verified = await getAuthUser(body.accessToken);
    if (!verified.response.ok) return NextResponse.json({ ok: false }, { status: 401 });

    const authSession = asSession({
      access_token: body.accessToken,
      refresh_token: body.refreshToken,
      expires_in: body.expiresIn ?? 3600,
      user: verified.payload,
    });
    if (!authSession) return NextResponse.json({ ok: false }, { status: 400 });

    const response = NextResponse.json({ ok: true });
    setSessionCookies(response, authSession, true);
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
