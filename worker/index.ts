import type { Env } from "./core";
import { clearCookies, resolveSession, withCookies } from "./core";
import { handleAuth } from "./auth";
import { handleClientApi } from "./client";
import { handleAdminApi } from "./admin";

function normalized(pathname:string) {
  if(pathname.length>1 && pathname.endsWith("/")) return pathname.slice(0,-1);
  return pathname;
}

export default {
  async fetch(request:Request,env:Env):Promise<Response> {
    const url=new URL(request.url);
    const path=normalized(url.pathname);

    try {
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

      if(path==="/workspace" || path.startsWith("/workspace/") || path==="/chat" || path.startsWith("/chat/")) {
        const session=await resolveSession(request,env);
        if(!session) {
          const login=new URL("/login",request.url);
          login.searchParams.set("next",url.pathname+url.search);
          const response=Response.redirect(login.toString(),302);
          return withCookies(response,clearCookies());
        }
        const asset=await env.ASSETS.fetch(request);
        return withCookies(asset,session.setCookies);
      }

      return env.ASSETS.fetch(request);
    } catch {
      if(path.startsWith("/api/")) {
        return new Response(JSON.stringify({ok:false}),{
          status:503,
          headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"},
        });
      }
      return env.ASSETS.fetch(request);
    }
  },
};
