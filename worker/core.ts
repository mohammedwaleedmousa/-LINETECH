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


export type UploadKind = "image" | "audio" | "document" | "admin";

const IMAGE_MIMES=new Set(["image/jpeg","image/png","image/gif","image/webp"]);
const AUDIO_MIMES=new Set(["audio/webm","audio/ogg","audio/mp4","audio/mpeg","audio/wav","audio/x-wav"]);
const DOCUMENT_MIMES=new Set([
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);
const BLOCKED_EXTENSIONS=new Set([
  "exe","dll","msi","bat","cmd","com","scr","ps1","sh","apk","app","jar",
  "html","htm","xhtml","js","mjs","cjs","svg",
]);

function extensionOf(name:string) {
  const clean=name.trim().toLowerCase();
  const index=clean.lastIndexOf(".");
  return index>=0 ? clean.slice(index+1) : "";
}

function starts(bytes:Uint8Array,signature:number[]) {
  return signature.every((value,index)=>bytes[index]===value);
}

async function signatureMatches(file:File,mime:string) {
  const bytes=new Uint8Array(await file.slice(0,32).arrayBuffer());
  const ascii=new TextDecoder("latin1").decode(bytes);

  if(mime==="image/jpeg") return starts(bytes,[0xff,0xd8,0xff]);
  if(mime==="image/png") return starts(bytes,[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if(mime==="image/gif") return ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
  if(mime==="image/webp") return ascii.startsWith("RIFF") && ascii.slice(8,12)==="WEBP";
  if(mime==="application/pdf") return ascii.startsWith("%PDF");
  if(mime==="application/zip" || mime==="application/x-zip-compressed"
    || mime.startsWith("application/vnd.openxmlformats-officedocument.")) {
    return starts(bytes,[0x50,0x4b,0x03,0x04]) || starts(bytes,[0x50,0x4b,0x05,0x06]) || starts(bytes,[0x50,0x4b,0x07,0x08]);
  }
  if(mime==="application/msword" || mime==="application/vnd.ms-excel" || mime==="application/vnd.ms-powerpoint") {
    return starts(bytes,[0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]);
  }
  if(mime==="audio/webm") return starts(bytes,[0x1a,0x45,0xdf,0xa3]);
  if(mime==="audio/ogg") return ascii.startsWith("OggS");
  if(mime==="audio/mp4") return ascii.slice(4,8)==="ftyp";
  if(mime==="audio/mpeg") return ascii.startsWith("ID3") || (bytes[0]===0xff && (bytes[1]&0xe0)===0xe0);
  if(mime==="audio/wav" || mime==="audio/x-wav") return ascii.startsWith("RIFF") && ascii.slice(8,12)==="WAVE";

  // Plain text and CSV do not have stable magic bytes. Reject NUL bytes to avoid obvious binary payloads.
  if(mime==="text/plain" || mime==="text/csv") return !bytes.includes(0);

  return false;
}

export async function validateUpload(file:File,kind:UploadKind) {
  const mime=(file.type||"application/octet-stream").toLowerCase().split(";")[0].trim();
  const extension=extensionOf(file.name||"");
  if(!file.size || file.size<1) return {ok:false as const,status:400};
  if(BLOCKED_EXTENSIONS.has(extension)) return {ok:false as const,status:415};

  const limits:Record<UploadKind,number>={
    image:10*1024*1024,
    audio:15*1024*1024,
    document:5*1024*1024,
    admin:25*1024*1024,
  };
  if(file.size>limits[kind]) return {ok:false as const,status:413};

  const allowed=kind==="image"
    ? IMAGE_MIMES.has(mime)
    : kind==="audio"
      ? AUDIO_MIMES.has(mime)
      : kind==="document"
        ? DOCUMENT_MIMES.has(mime)
        : IMAGE_MIMES.has(mime) || AUDIO_MIMES.has(mime) || DOCUMENT_MIMES.has(mime);

  if(!allowed) return {ok:false as const,status:415};
  if(!(await signatureMatches(file,mime))) return {ok:false as const,status:415};

  return {ok:true as const,status:200,mime};
}

export function requestTooLarge(request:Request,maxBytes:number) {
  const raw=request.headers.get("Content-Length");
  if(!raw) return false;
  const size=Number(raw);
  return Number.isFinite(size) && size>maxBytes;
}

export function boundedText(value:unknown,max:number) {
  const text=String(value??"").trim();
  return text.length<=max ? text : null;
}
