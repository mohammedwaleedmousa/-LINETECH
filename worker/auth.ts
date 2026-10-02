import { safeReturnPath } from "../lib/navigation/return-path";
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
  restFetch,
  requestTooLarge,
  resolveSession,
  safeJson,
  sessionCookies,
} from "./core";

async function body(request:Request) {
  try { return await request.json() as Record<string,any>; } catch { return {}; }
}


export async function handleAuth(request:Request,env:Env,path:string):Promise<Response|null> {

  if(path==="/api/auth/request-code" && request.method==="POST") {
    if(requestTooLarge(request,8*1024)) return json({ok:false},413);
    const data=await body(request);
    const emailRaw=boundedText(data.email,320);
    if(emailRaw===null) return json({ok:false},413);
    const email=(emailRaw||"").toLowerCase();
    if(!email) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_LOGIN_RATE_LIMITER,`otp-request:${email}`))) {
      return rateLimitResponse();
    }

    const response=await authFetch(env,"/otp",{
      method:"POST",
      body:JSON.stringify({
        email,
        create_user:false,
      }),
    });

    // Keep this response intentionally generic so the endpoint cannot be used
    // to discover whether an email address already has a LINETECH account.
    if(response.status===429) return rateLimitResponse();
    return json({ok:true});
  }

  if(path==="/api/auth/verify-code" && request.method==="POST") {
    if(requestTooLarge(request,8*1024)) return json({ok:false},413);
    const data=await body(request);
    const emailRaw=boundedText(data.email,320);
    const codeRaw=boundedText(data.code,12);
    if(emailRaw===null || codeRaw===null) return json({ok:false},413);
    const email=(emailRaw||"").toLowerCase();
    const code=(codeRaw||"").replace(/\s+/g,"");
    if(!email || !/^\d{6}$/.test(code)) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_LOGIN_RATE_LIMITER,`otp-verify:${email}`))) {
      return rateLimitResponse();
    }

    const response=await authFetch(env,"/verify",{
      method:"POST",
      body:JSON.stringify({
        email,
        token:code,
        type:"email",
      }),
    });
    const payload=await safeJson(response);
    if(!response.ok || !payload?.access_token || !payload?.refresh_token) {
      return json({ok:false},401);
    }

    return json({ok:true},200,sessionCookies(payload as AuthSession,true));
  }

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
    const next=safeReturnPath(data.next);
    if(!fullName || !email || password.length<8) return json({ok:false},400);
    if(!(await rateLimitAllowed(env.AUTH_SIGNUP_RATE_LIMITER,`signup:${email}`))) {
      return rateLimitResponse();
    }

    const redirectUrl=new URL("/login",request.url);
    redirectUrl.searchParams.set("confirmed","1");
    redirectUrl.searchParams.set("next",next);
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
      const redirectUrl=new URL(data.admin===true?"/admin/login":"/login",request.url);
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

  if(path==="/api/account" && request.method==="GET") {
    const session=await resolveSession(request,env);
    if(!session) return json({ok:false},401,clearCookies());

    const [response,subscriptionResponse]=await Promise.all([
      restFetch(
        env,
        `/profiles?select=id,full_name,company,phone,created_at,updated_at&id=eq.${encodeURIComponent(String(session.user.id))}&limit=1`,
        session.accessToken,
      ),
      restFetch(
        env,
        `/client_subscriptions?select=*,plan:plan_catalog(*)&client_id=eq.${encodeURIComponent(String(session.user.id))}&limit=1`,
        session.accessToken,
      ),
    ]);
    const [rows,subscriptionRows]=await Promise.all([
      safeJson(response) as Promise<Record<string,any>[]|null>,
      safeJson(subscriptionResponse) as Promise<Record<string,any>[]|null>,
    ]);
    if(!response.ok||!subscriptionResponse.ok) return json({ok:false},!response.ok?response.status:subscriptionResponse.status,session.setCookies);
    const profile=Array.isArray(rows)?rows[0]||null:null;
    const subscription=Array.isArray(subscriptionRows)?subscriptionRows[0]||null:null;
    const userMetadata=
      session.user.user_metadata && typeof session.user.user_metadata==="object"
        ? session.user.user_metadata as Record<string,unknown>
        : {};

    return json({
      ok:true,
      account:{
        id:session.user.id,
        email:session.user.email||"",
        emailConfirmedAt:session.user.email_confirmed_at||session.user.confirmed_at||null,
        createdAt:session.user.created_at||profile?.created_at||null,
        lastSignInAt:session.user.last_sign_in_at||null,
        role:session.user.app_metadata?.role||"client",
        profile:{
          fullName:profile?.full_name||String(userMetadata.full_name||""),
          company:profile?.company||String(userMetadata.company||""),
          phone:profile?.phone||String(userMetadata.phone||""),
          updatedAt:profile?.updated_at||null,
        },
        subscription:subscription ? {
          planCode:subscription.plan_code,
          status:subscription.status,
          billingCycle:subscription.billing_cycle,
          setupFeeUsd:subscription.setup_fee_usd,
          recurringPriceUsd:subscription.recurring_price_usd,
          startsAt:subscription.started_at,
          nextBillingAt:subscription.current_period_end,
          plan:subscription.plan||null,
        } : null,
      },
    },200,session.setCookies);
  }

  if(path==="/api/account" && request.method==="PATCH") {
    const session=await resolveSession(request,env);
    if(!session) return json({ok:false},401,clearCookies());
    if(requestTooLarge(request,16*1024)) return json({ok:false},413,session.setCookies);

    const data=await body(request);
    const fullName=boundedText(data.fullName,120);
    const company=boundedText(data.company,160);
    const phone=boundedText(data.phone,50);
    if(fullName===null||company===null||phone===null) return json({ok:false},413,session.setCookies);
    if(!fullName) return json({ok:false},400,session.setCookies);

    const update={
      full_name:fullName,
      company:company||null,
      phone:phone||null,
    };
    let response=await restFetch(
      env,
      `/profiles?id=eq.${encodeURIComponent(String(session.user.id))}&select=*`,
      session.accessToken,
      {
        method:"PATCH",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify(update),
      },
    );
    let rows=await safeJson(response) as Record<string,any>[]|null;
    let profile=Array.isArray(rows)?rows[0]:null;

    if(response.ok && !profile) {
      response=await restFetch(env,"/profiles?select=*",session.accessToken,{
        method:"POST",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({id:session.user.id,...update}),
      });
      rows=await safeJson(response) as Record<string,any>[]|null;
      profile=Array.isArray(rows)?rows[0]:null;
    }
    if(!response.ok||!profile) {
      return json({ok:false},response.ok?500:response.status,session.setCookies);
    }

    await authFetch(env,"/user",{
      method:"PUT",
      headers:{Authorization:`Bearer ${session.accessToken}`},
      body:JSON.stringify({data:{full_name:fullName,company:company||null,phone:phone||null}}),
    }).catch(()=>null);

    return json({
      ok:true,
      profile:{
        fullName:profile.full_name||"",
        company:profile.company||"",
        phone:profile.phone||"",
        updatedAt:profile.updated_at||null,
      },
    },200,session.setCookies);
  }

  if(path==="/api/account/email" && request.method==="POST") {
    const session=await resolveSession(request,env);
    if(!session) return json({ok:false},401,clearCookies());
    if(requestTooLarge(request,8*1024)) return json({ok:false},413,session.setCookies);

    const data=await body(request);
    const emailRaw=boundedText(data.email,320);
    if(emailRaw===null) return json({ok:false},413,session.setCookies);
    const email=(emailRaw||"").trim().toLowerCase();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ok:false},400,session.setCookies);
    }
    if(email===String(session.user.email||"").toLowerCase()) {
      return json({ok:true,unchanged:true,email},200,session.setCookies);
    }
    if(!(await rateLimitAllowed(
      env.AUTH_PASSWORD_RATE_LIMITER,
      `email-change:${String(session.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(session.setCookies);
    }

    const response=await authFetch(env,"/user",{
      method:"PUT",
      headers:{Authorization:`Bearer ${session.accessToken}`},
      body:JSON.stringify({email}),
    });
    const payload=await safeJson(response);
    if(!response.ok) {
      return json({ok:false},response.status===429?429:400,session.setCookies);
    }

    return json({
      ok:true,
      unchanged:false,
      email:payload?.email||session.user.email||"",
      pendingEmail:payload?.new_email||email,
      needsConfirmation:Boolean(payload?.new_email || payload?.email!==email),
    },200,session.setCookies);
  }

  if(path==="/api/auth/logout-others" && request.method==="POST") {
    const session=await resolveSession(request,env);
    if(!session) return json({ok:false},401,clearCookies());
    if(!(await rateLimitAllowed(
      env.AUTH_PASSWORD_RATE_LIMITER,
      `logout-others:${String(session.user.id||"unknown")}`,
    ))) {
      return rateLimitResponse(session.setCookies);
    }

    const response=await authFetch(env,"/logout?scope=others",{
      method:"POST",
      headers:{Authorization:`Bearer ${session.accessToken}`},
    });
    return json({ok:response.ok},response.ok?200:response.status,session.setCookies);
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
