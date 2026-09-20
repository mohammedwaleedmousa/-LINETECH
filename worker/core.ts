export type RateLimitBinding = {
  limit(input: { key: string }): Promise<{ success: boolean }>;
};

export type Env = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  AUTH_LOGIN_RATE_LIMITER: RateLimitBinding;
  AUTH_SIGNUP_RATE_LIMITER: RateLimitBinding;
  AUTH_RECOVER_RATE_LIMITER: RateLimitBinding;
  AUTH_PASSWORD_RATE_LIMITER: RateLimitBinding;
  PROJECT_REQUEST_RATE_LIMITER: RateLimitBinding;
  CHAT_RATE_LIMITER: RateLimitBinding;
  UPLOAD_RATE_LIMITER: RateLimitBinding;
};

export type AuthUser = {
  id?: string;
  email?: string;
  app_metadata?: { role?: string; [key: string]: unknown };
  [key: string]: unknown;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: AuthUser;
};

export type ResolvedSession = {
  accessToken: string;
  user: AuthUser;
  setCookies: string[];
};

const ACCESS_COOKIE = "linetech-access-token";
const REFRESH_COOKIE = "linetech-refresh-token";
const REMEMBER_COOKIE = "linetech-remember";

function config(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("LINETECH Supabase environment is not configured.");
  }
  return { url: env.SUPABASE_URL, key: env.SUPABASE_PUBLISHABLE_KEY };
}

export function parseCookies(request: Request) {
  const raw = request.headers.get("Cookie") || "";
  const result: Record<string,string> = {};
  for (const part of raw.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const name = part.slice(0,index).trim();
    const value = part.slice(index+1).trim();
    if (name) result[name] = decodeURIComponent(value);
  }
  return result;
}

function cookie(name:string,value:string,maxAge?:number) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ];
  if (typeof maxAge === "number") parts.push(`Max-Age=${Math.max(0,Math.floor(maxAge))}`);
  return parts.join("; ");
}

export function sessionCookies(session:AuthSession,remember:boolean) {
  return [
    cookie(ACCESS_COOKIE,session.access_token,session.expires_in || 3600),
    cookie(REFRESH_COOKIE,session.refresh_token,remember ? 60*60*24*30 : undefined),
    cookie(REMEMBER_COOKIE,remember ? "1" : "0",remember ? 60*60*24*30 : undefined),
  ];
}

export function clearCookies() {
  return [
    cookie(ACCESS_COOKIE,"",0),
    cookie(REFRESH_COOKIE,"",0),
    cookie(REMEMBER_COOKIE,"",0),
  ];
}

export function withCookies(response:Response,cookies:string[] = []) {
  if (!cookies.length) return response;
  const headers = new Headers(response.headers);
  cookies.forEach(value=>headers.append("Set-Cookie",value));
  return new Response(response.body,{
    status:response.status,
    statusText:response.statusText,
    headers,
  });
}

export function json(data:unknown,status=200,cookies:string[] = []) {
  const response = new Response(JSON.stringify(data),{
    status,
    headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"},
  });
  return withCookies(response,cookies);
}


async function hashedRateLimitKey(value:string) {
  const bytes=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(digest))
    .map(byte=>byte.toString(16).padStart(2,"0"))
    .join("");
}

export async function rateLimitAllowed(limiter:RateLimitBinding|undefined,key:string) {
  if(!limiter) return true;
  try {
    const result=await limiter.limit({key:await hashedRateLimitKey(key)});
    return Boolean(result.success);
  } catch(error) {
    console.warn(JSON.stringify({
      event:"rate_limiter_unavailable",
      message:error instanceof Error ? error.message : "Unknown rate limiter error",
    }));
    // Fail open if Cloudflare's limiter binding is temporarily unavailable.
    return true;
  }
}

export function rateLimitResponse(cookies:string[] = []) {
  const response=new Response(JSON.stringify({ok:false,rateLimited:true}),{
    status:429,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "Retry-After":"60",
    },
  });
  return withCookies(response,cookies);
}

export async function safeJson(response:Response):Promise<any> {
  try { return await response.json(); } catch { return null; }
}

export async function authFetch(env:Env,path:string,init:RequestInit={}) {
  const {url,key}=config(env);
  const headers=new Headers(init.headers);
  headers.set("apikey",key);
  if(!headers.has("Content-Type")) headers.set("Content-Type","application/json");
  return fetch(`${url}/auth/v1${path}`,{...init,headers});
}

export async function restFetch(env:Env,path:string,token:string,init:RequestInit={}) {
  const {url,key}=config(env);
  const headers=new Headers(init.headers);
  headers.set("apikey",key);
  headers.set("Authorization",`Bearer ${token}`);
  if(!headers.has("Content-Type")) headers.set("Content-Type","application/json");
  return fetch(`${url}/rest/v1${path}`,{...init,headers});
}

export async function storageFetch(env:Env,path:string,token:string,init:RequestInit={}) {
  const {url,key}=config(env);
  const headers=new Headers(init.headers);
  headers.set("apikey",key);
  headers.set("Authorization",`Bearer ${token}`);
  return fetch(`${url}/storage/v1${path}`,{...init,headers});
}

export async function getAuthUser(env:Env,token:string) {
  const response=await authFetch(env,"/user",{method:"GET",headers:{Authorization:`Bearer ${token}`}});
  return {response,payload:await safeJson(response) as AuthUser|null};
}

export async function refreshSession(env:Env,refreshToken:string) {
  const response=await authFetch(env,"/token?grant_type=refresh_token",{
    method:"POST",
    body:JSON.stringify({refresh_token:refreshToken}),
  });
  const payload=await safeJson(response);
  if(!response.ok || !payload?.access_token || !payload?.refresh_token) return null;
  return payload as AuthSession;
}

export async function resolveSession(request:Request,env:Env):Promise<ResolvedSession|null> {
  const cookies=parseCookies(request);
  const accessToken=cookies[ACCESS_COOKIE];
  if(accessToken) {
    const current=await getAuthUser(env,accessToken);
    if(current.response.ok && current.payload?.id) {
      return {accessToken,user:current.payload,setCookies:[]};
    }
  }

  const refreshToken=cookies[REFRESH_COOKIE];
  if(!refreshToken) return null;
  const refreshed=await refreshSession(env,refreshToken);
  if(!refreshed?.access_token) return null;

  let user=refreshed.user;
  if(!user?.id) {
    const checked=await getAuthUser(env,refreshed.access_token);
    if(!checked.response.ok || !checked.payload?.id) return null;
    user=checked.payload;
  }
  if(!user?.id) return null;

  return {
    accessToken:refreshed.access_token,
    user,
    setCookies:sessionCookies(refreshed,cookies[REMEMBER_COOKIE]==="1"),
  };
}

export async function requireAdmin(request:Request,env:Env) {
  const session=await resolveSession(request,env);
  if(!session || session.user.app_metadata?.role!=="admin") return null;
  return session;
}

export function encodeObjectPath(path:string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export function safeName(name:string) {
  return name.normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g,"-")
    .replace(/-+/g,"-")
    .replace(/^-|-$/g,"")
    .slice(0,100) || "file";
}

export function formatTime(value:string) {
  try {
    return new Intl.DateTimeFormat("en",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Aden"}).format(new Date(value));
  } catch { return ""; }
}


const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export function withSecurityHeaders(response:Response,request:Request,requestId?:string) {
  const headers=new Headers(response.headers);
  headers.set("Content-Security-Policy",CONTENT_SECURITY_POLICY);
  headers.set("X-Frame-Options","DENY");
  headers.set("X-Content-Type-Options","nosniff");
  headers.set("Referrer-Policy","strict-origin-when-cross-origin");
  headers.set("Permissions-Policy","camera=(), geolocation=(), payment=(), usb=(), microphone=(self)");
  headers.set("Cross-Origin-Opener-Policy","same-origin");
  headers.set("Cross-Origin-Resource-Policy","same-origin");
  headers.set("X-XSS-Protection","0");
  if(new URL(request.url).protocol==="https:") {
    headers.set("Strict-Transport-Security","max-age=31536000");
  }
  if(requestId) headers.set("X-Request-ID",requestId);

  return new Response(response.body,{
    status:response.status,
    statusText:response.statusText,
    headers,
  });
}
