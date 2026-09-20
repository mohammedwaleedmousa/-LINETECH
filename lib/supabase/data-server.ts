import { NextRequest } from "next/server";
import { ACCESS_COOKIE } from "./auth-server";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase data API is not configured.");
  return { url, key };
}

export function accessTokenFrom(request: NextRequest) {
  return request.cookies.get(ACCESS_COOKIE)?.value || "";
}

export async function dataFetch(
  path: string,
  accessToken: string,
  init: RequestInit = {},
) {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  return fetch(`${url}/rest/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function storageFetch(
  path: string,
  accessToken: string,
  init: RequestInit = {},
) {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch(`${url}/storage/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
