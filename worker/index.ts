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
import {publicRoutes,utilityRoutes,legacyRoutes,isRetired} from "../lib/navigation/route-policy";
import { handleAdminApi } from "./admin";

function normalized(pathname:string) {
  return documentPath(pathname);
}

const publicSitemapRoutes = new Set<string>(publicRoutes);

// Required account entry points and internal handoff utility remain functional,
// but are deliberately not part of public discovery or the XML sitemap.
const requiredUtilityRoutes = new Set<string>(utilityRoutes);

function isPublicRouteAllowed(path:string) {
  if (publicSitemapRoutes.has(path) || requiredUtilityRoutes.has(path)) return true;
  if (path.startsWith("/_next/") || path.startsWith("/api/")) return true;
  // Static assets are not document routes and must continue to be served.
  if (/\.[a-z0-9]{1,8}$/i.test(path)) return true;
  return false;
}

function hiddenRouteResponse() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
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
    || path==="/account/projects"
    || path.startsWith("/account/projects/")
    || path==="/account/projects/messages"
    || path.startsWith("/account/projects/messages/")
    || path==="/account/projects/handover"
    || path.startsWith("/account/projects/handover/")
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
  if(isRetired(path)){
    if(path.startsWith("/api/"))return json({ok:false,error:"feature_removed"},410);
    return new Response('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LINETECH</title><body><main><h1>هذا القسم لم يعد متاحًا</h1><p>يمكنك استكشاف المواقع والتطبيقات أو طلب مشروع خاص.</p><p lang="en" dir="ltr">This section has been retired. Explore our products or request a custom project.</p><a href="/products">المنتجات / Products</a> · <a href="/services">الخدمات / Services</a></main></body></html>',{status:410,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
  if(legacyRoutes[path]){
    const target=new URL(legacyRoutes[path],request.url);
    for(const [key,value] of url.searchParams)if(!target.searchParams.has(key)&&key!=="_rsc")target.searchParams.append(key,value);
    return Response.redirect(target.toString(),308);
  }

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
    path==="/account/projects" || path.startsWith("/account/projects/")
    || path==="/account/projects/messages" || path.startsWith("/account/projects/messages/")
    || path==="/account/projects/handover" || path.startsWith("/account/projects/handover/")
    || path==="/account" || path.startsWith("/account/")
  ) {
    const session=await resolveSession(request,env);
    if(!session) {
      return loginRedirect(request,url.pathname+url.search,clearCookies());
    }
    return withCookies(await env.ASSETS.fetch(request),session.setCookies);
  }

  if (!isPublicRouteAllowed(path)) return hiddenRouteResponse();
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
