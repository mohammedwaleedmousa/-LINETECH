import {
  type Env,
  type AuthSession,
  authFetch,
  clearCookies,
  getAuthUser,
  json,
  parseCookies,
  rateLimitAllowed,
  rateLimitResponse,
  refreshSession,
  resolveSession,
  safeJson,
  sessionCookies,
} from "./core";

async function body(request:Request) {
  try { return await request.json() as Record<string,any>; } catch { return {}; }
}

export async function handleAuth(request:Request,env:Env,path:string):Promise<Response|null> {
  if(path==="/api/auth/login" && request.method==="POST") {
    const data=await body(request);
    const email=String(data.email||"").trim().toLowerCase();
    const password=String(data.password||"");
    if(!email || !password) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_LOGIN_RATE_LIMITER,`login:${email}`))) {
      return rateLimitResponse();
    }

    const response=await authFetch(env,"/token?grant_type=password",{
      method:"POST",
      body:JSON.stringify({email,password}),
    });
    const payload=await safeJson(response);
    if(!response.ok || !payload?.access_token || !payload?.refresh_token) return json({ok:false},401);
    return json({ok:true},200,sessionCookies(payload as AuthSession,Boolean(data.remember)));
  }

  if(path==="/api/auth/signup" && request.method==="POST") {
    const data=await body(request);
    const fullName=String(data.fullName||"").trim();
    const company=String(data.company||"").trim() || null;
    const email=String(data.email||"").trim().toLowerCase();
    const password=String(data.password||"");
    if(!fullName || !email || password.length<8) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_SIGNUP_RATE_LIMITER,`signup:${email}`))) {
      return rateLimitResponse();
    }

    const redirectTo=new URL("/login",request.url).toString();
    const response=await authFetch(
      env,
      `/signup?redirect_to=${encodeURIComponent(redirectTo)}`,
      {
        method:"POST",
        body:JSON.stringify({
          email,
          password,
          data:{full_name:fullName,company},
        }),
      },
    );
    const payload=await safeJson(response);
    if(!response.ok) return json({ok:false},400);
    const hasSession=Boolean(payload?.access_token && payload?.refresh_token);
    return json(
      {ok:true,needsEmailConfirmation:!hasSession},
      200,
      hasSession ? sessionCookies(payload as AuthSession,true) : [],
    );
  }

  if(path==="/api/auth/recover" && request.method==="POST") {
    const data=await body(request);
    const email=String(data.email||"").trim().toLowerCase();
    if(email) {
      if(!(await rateLimitAllowed(env.AUTH_RECOVER_RATE_LIMITER,`recover:${email}`))) {
        return rateLimitResponse();
      }
      const redirectTo=new URL("/login",request.url).toString();
      await authFetch(
        env,
        `/recover?redirect_to=${encodeURIComponent(redirectTo)}`,
        {
          method:"POST",
          body:JSON.stringify({email}),
        },
      ).catch(()=>null);
    }
    return json({ok:true});
  }

  if(path==="/api/auth/session" && request.method==="GET") {
    const session=await resolveSession(request,env);
    return session
      ? json({ok:true,user:session.user},200,session.setCookies)
      : json({ok:false},401,clearCookies());
  }

  if(path==="/api/auth/session" && request.method==="POST") {
    const data=await body(request);
    const accessToken=String(data.accessToken||"");
    const refreshToken=String(data.refreshToken||"");
    if(!accessToken || !refreshToken) return json({ok:false},400);

    const verified=await getAuthUser(env,accessToken);
    if(!verified.response.ok || !verified.payload?.id) return json({ok:false},401);

    const session:AuthSession={
      access_token:accessToken,
      refresh_token:refreshToken,
      expires_in:Number(data.expiresIn)||3600,
      user:verified.payload,
    };
    return json({ok:true},200,sessionCookies(session,true));
  }

  if(path==="/api/auth/update-password" && request.method==="POST") {
    const session=await resolveSession(request,env);
    if(!session) return json({ok:false},401);
    const data=await body(request);
    const password=String(data.password||"");
    if(password.length<8) return json({ok:false},400,session.setCookies);
    if(!(await rateLimitAllowed(
      env.AUTH_PASSWORD_RATE_LIMITER,
      `password:${String(session.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(session.setCookies);
    }

    const response=await authFetch(env,"/user",{
      method:"PUT",
      headers:{Authorization:`Bearer ${session.accessToken}`},
      body:JSON.stringify({password}),
    });
    return json({ok:response.ok},response.ok?200:response.status,session.setCookies);
  }

  if(path==="/api/auth/logout" && request.method==="POST") {
    const cookies=parseCookies(request);
    const accessToken=cookies["linetech-access-token"];
    if(accessToken) {
      await authFetch(env,"/logout",{
        method:"POST",
        headers:{Authorization:`Bearer ${accessToken}`},
      }).catch(()=>null);
    }
    return json({ok:true},200,clearCookies());
  }

  return null;
}
