import { documentPath, safeReturnPath, isProtectedPath } from "../lib/navigation/return-path";
import type { Env } from "./core";
import {
  authFetch,
  clearCookies,
  json,
  resolveSession,
  withCookies,
  withSecurityHeaders,
} from "./core";
import { handleAuth } from "./auth";
import { handleClientApi } from "./client";
import { handleAdminApi } from "./admin";

function normalized(pathname:string) {
  return documentPath(pathname);
}

function loginRedirect(request:Request,path:string,cookies:string[] = []) {
  const login=new URL("/login",request.url);
  login.searchParams.set("next",safeReturnPath(path));
  return withCookies(Response.redirect(login.toString(),302),cookies);
}

function adminLoginRedirect(request:Request,path:string,cookies:string[] = [],denied=false) {
  const login=new URL("/admin/login",request.url);
  login.searchParams.set("next",safeReturnPath(path,"/admin"));
  if(denied) login.searchParams.set("denied","1");
  return withCookies(Response.redirect(login.toString(),302),cookies);
}

function shouldLogRequest(request:Request,path:string,status:number) {
  return path.startsWith("/api/")
    || path==="/admin"
    || path.startsWith("/admin/")
    || path==="/workspace"
    || path.startsWith("/workspace/")
    || path==="/chat"
    || path.startsWith("/chat/")
    || path==="/handover"
    || path.startsWith("/handover/")
    || path==="/account"
    || path.startsWith("/account/")
    || request.headers.get("Sec-Fetch-Mode")==="navigate"
    || status>=400;
}

function logRequest(request:Request,path:string,response:Response,requestId:string,started:number) {
  if(!shouldLogRequest(request,path,response.status)) return;

  const event={
    event:"request",
    requestId,
    method:request.method,
    path,
    status:response.status,
    durationMs:Date.now()-started,
    cfRay:request.headers.get("cf-ray") || undefined,
  };
  const line=JSON.stringify(event);

  if(response.status>=500) console.error(line);
  else if(response.status>=400) console.warn(line);
  else console.log(line);
}

async function routeRequest(request:Request,env:Env,path:string,url:URL):Promise<Response> {
  if(path==="/api/health" && request.method==="GET") {
    const upstream=await authFetch(env,"/health",{method:"GET"});
    return upstream.ok
      ? json({ok:true,backend:"linetech-worker",supabaseAuth:true})
      : json({ok:false,backend:"linetech-worker",supabaseAuth:false},503);
  }

  if(path.startsWith("/api/") && !["GET","HEAD","OPTIONS"].includes(request.method)) {
    const origin=request.headers.get("Origin");
    if(origin && origin!==url.origin) {
      return new Response(JSON.stringify({ok:false}),{
        status:403,
        headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"},
      });
    }
  }

  if(path.startsWith("/api/auth/")) {
    const response=await handleAuth(request,env,path);
    return response || new Response("Not found",{status:404});
  }

  if(path.startsWith("/api/admin/")) {
    const response=await handleAdminApi(request,env,path);
    return response || new Response("Not found",{status:404});
  }

  if(path.startsWith("/api/")) {
    const response=await handleClientApi(request,env,path);
    return response || new Response("Not found",{status:404});
  }

  if(path==="/admin/login") {
    const session=await resolveSession(request,env);
    if(session?.user.app_metadata?.role==="admin") {
      return withCookies(Response.redirect(new URL("/admin",request.url).toString(),302),session.setCookies);
    }
    return withCookies(await env.ASSETS.fetch(request),session?.setCookies||[]);
  }

  if(path==="/admin" || path.startsWith("/admin/")) {
    const session=await resolveSession(request,env);
    if(!session) {
      return adminLoginRedirect(request,url.pathname+url.search,clearCookies());
    }
    if(session.user.app_metadata?.role!=="admin") {
      return adminLoginRedirect(request,url.pathname+url.search,session.setCookies,true);
    }
    return withCookies(await env.ASSETS.fetch(request),session.setCookies);
  }

  if(
    path==="/workspace" || path.startsWith("/workspace/")
    || path==="/chat" || path.startsWith("/chat/")
    || path==="/handover" || path.startsWith("/handover/")
    || path==="/account" || path.startsWith("/account/")
  ) {
    const session=await resolveSession(request,env);
    if(!session) {
      return loginRedirect(request,url.pathname+url.search,clearCookies());
    }
    return withCookies(await env.ASSETS.fetch(request),session.setCookies);
  }

  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request:Request,env:Env):Promise<Response> {
    const started=Date.now();
    const requestId=crypto.randomUUID();
    const url=new URL(request.url);
    const path=normalized(url.pathname);

    let response:Response;
    try {
      response=await routeRequest(request,env,path,url);
    } catch(error) {
      console.error(JSON.stringify({
        event:"worker_error",
        requestId,
        method:request.method,
        path,
        message:error instanceof Error ? error.message : "Unknown worker error",
      }));

      if(path.startsWith("/api/")) {
        response=new Response(JSON.stringify({ok:false}),{
          status:503,
          headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"},
        });
      }else if(isProtectedPath(path)){
        response=new Response("Temporarily unavailable. Please try again.",{status:503,headers:{"Cache-Control":"no-store","Content-Type":"text/plain; charset=utf-8"}});
      }else{
        response=await env.ASSETS.fetch(request);
      }
    }

    const secured=withSecurityHeaders(response,request,requestId);
    logRequest(request,path,secured,requestId,started);
    return secured;
  },
};
