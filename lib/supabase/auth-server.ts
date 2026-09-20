import { NextResponse } from "next/server";

export const ACCESS_COOKIE = "linetech-access-token";
export const REFRESH_COOKIE = "linetech-refresh-token";
export const REMEMBER_COOKIE = "linetech-remember";

export type SupabaseAuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
  user?: { id?: string; email?: string };
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase auth is not configured.");
  return { url, key };
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function asSession(payload: Record<string, unknown>): SupabaseAuthSession | null {
  if (typeof payload.access_token !== "string" || typeof payload.refresh_token !== "string") return null;

  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_in: typeof payload.expires_in === "number" && payload.expires_in > 0 ? payload.expires_in : 3600,
    token_type: typeof payload.token_type === "string" ? payload.token_type : undefined,
    user: payload.user && typeof payload.user === "object" ? payload.user as SupabaseAuthSession["user"] : undefined,
  };
}

function cookieBase() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function setSessionCookies(response: NextResponse, session: SupabaseAuthSession, remember: boolean) {
  const base = cookieBase();
  response.cookies.set(ACCESS_COOKIE, session.access_token, { ...base, maxAge: session.expires_in });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    ...base,
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
  response.cookies.set(REMEMBER_COOKIE, remember ? "1" : "0", {
    ...base,
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
}

export function clearSessionCookies(response: NextResponse) {
  const base = cookieBase();
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, REMEMBER_COOKIE]) {
    response.cookies.set(name, "", { ...base, maxAge: 0 });
  }
}

export async function getAuthUser(accessToken: string) {
  const response = await authFetch("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return { response, payload: await readJson(response) };
}

export async function refreshAuthSession(refreshToken: string) {
  const response = await authFetch("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const payload = await readJson(response);
  return { response, payload, session: response.ok ? asSession(payload) : null };
}
