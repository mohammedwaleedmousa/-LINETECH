import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, authFetch, clearSessionCookies } from "@/lib/supabase/auth-server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    try {
      await authFetch("/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {}
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
