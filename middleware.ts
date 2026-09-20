import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REMEMBER_COOKIE,
  clearSessionCookies,
  getAuthUser,
  refreshAuthSession,
  setSessionCookies,
} from "@/lib/supabase/auth-server";

export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    const remember = request.cookies.get(REMEMBER_COOKIE)?.value === "1";

    if (accessToken) {
      const verified = await getAuthUser(accessToken);
      if (verified.response.ok) return NextResponse.next();
    }

    if (refreshToken) {
      const refreshed = await refreshAuthSession(refreshToken);
      if (refreshed.session) {
        const response = NextResponse.next();
        setSessionCookies(response, refreshed.session, remember);
        return response;
      }
    }
  } catch {}

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);

  const response = NextResponse.redirect(loginUrl);
  clearSessionCookies(response);
  return response;
}

export const config = {
  matcher: ["/workspace/:path*", "/chat/:path*"],
};
