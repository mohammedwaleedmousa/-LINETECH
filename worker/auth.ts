import {
  type Env,
  type AuthSession,
  authFetch,
  boundedText,
  clearCookies,
  getAuthUser,
  json,
  parseCookies,
  rateLimitAllowed,
  rateLimitResponse,
  refreshSession,
  requestTooLarge,
  resolveSession,
  safeJson,
  sessionCookies,
} from "./core";

async function body(request:Request) {
  try { return await request.json() as Record<string,any>; } catch { return {}; }
}

export async function handleAuth(request:Request,env:Env,path:string):Promise<Response|null> {
  if(path==="/api/auth/login" && request.method==="POST") {
    if(requestTooLarge(request,16*1024)) return json({ok:false},413);
    const data=await body(request);
    const emailRaw=boundedText(data.email,320);
    const password=String(data.password||"");
    if(emailRaw===null || password.length>1024) return json({ok:false},413);
    const email=(emailRaw||"").toLowerCase();
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
    if(requestTooLarge(request,16*1024)) return json({ok:false},413);
    const data=await body(request);
    const fullName=boundedText(data.fullName,120);
    const companyValue=boundedText(data.company,160);
    const emailRaw=boundedText(data.email,320);
    const password=String(data.password||"");
    if(fullName===null || companyValue===null || emailRaw===null || password.length>1024) {
      return json({ok:false},413);
    }
    const company=companyValue||null;
    const email=(emailRaw||"").toLowerCase();
    if(!fullName || !email || password.length<8) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_SIGNUP_RATE_LIMITER,`signup:${email}`))) {
      return rateLimitResponse();
    }

    const redirectUrl=new URL("/login",request.url);
    redirectUrl.searchParams.set("confirmed","1");
    const redirectTo=redirectUrl.toString();
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
    if(requestTooLarge(request,8*1024)) return json({ok:false},413);
    const data=await body(request);
    const emailRaw=boundedText(data.email,320);
    if(emailRaw===null) return json({ok:false},413);
    const email=(emailRaw||"").toLowerCase();
    if(email) {
      if(!(await rateLimitAllowed(env.AUTH_RECOVER_RATE_LIMITER,`recover:${email}`))) {
        return rateLimitResponse();
      }
      const redirectUrl=new URL("/login",request.url);
      redirectUrl.searchParams.set("recovery","1");
      const redirectTo=redirectUrl.toString();
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
    if(requestTooLarge(request,32*1024)) return json({ok:false},413);
    const data=await body(request);
    const accessToken=String(data.accessToken||"");
    const refreshToken=String(data.refreshToken||"");
    if(accessToken.length>12*1024 || refreshToken.length>12*1024) return json({ok:false},413);
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
    if(requestTooLarge(request,8*1024)) return json({ok:false},413,session.setCookies);
    const data=await body(request);
    const password=String(data.password||"");
    if(password.length>1024) return json({ok:false},413,session.setCookies);
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
    if(response.ok) {
      await authFetch(env,"/logout?scope=others",{
        method:"POST",
        headers:{Authorization:`Bearer ${session.accessToken}`},
      }).catch(()=>null);
    }
    return json({ok:response.ok},response.ok?200:response.status,session.setCookies);
  }

  if(path==="/api/auth/logout" && request.method==="POST") {
    const cookies=parseCookies(request);
    const accessToken=cookies["linetech-access-token"];
    if(accessToken) {
      await authFetch(env,"/logout?scope=local",{
        method:"POST",
        headers:{Authorization:`Bearer ${accessToken}`},
      }).catch(()=>null);
    }
    return json({ok:true},200,clearCookies());
  }

  return null;
}
