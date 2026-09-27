"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../Localized";

type Mode = "login" | "signup" | "forgot" | "reset";
type LoginStep = "email" | "code";

function safeInternalNext(value:string|null) {
  if(!value || !value.startsWith("/") || value.startsWith("//")) return "/workspace";
  try {
    const parsed=new URL(value,window.location.origin);
    if(parsed.origin!==window.location.origin) return "/workspace";
    return parsed.pathname+parsed.search+parsed.hash;
  } catch {
    return "/workspace";
  }
}

const copy = {
  en: {
    signIn: "Sign in",
    create: "Create account",
    clientAccess: "CLIENT ACCESS",
    newAccount: "NEW ACCOUNT",
    recovery: "ACCOUNT RECOVERY",
    accountAction: "Choose account action",
    welcome: "Welcome back.",
    createTitle: "Create your workspace.",
    recoverTitle: "Recover your account.",
    loginLead: "Enter your email and we’ll send a 6-digit verification code. No password needed.",
    signupLead: "Prepare your LINETECH client access with the details below.",
    recoverLead: "Enter your email address to prepare the recovery step.",
    fullName: "Full name",
    company: "Company / Brand",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    namePlaceholder: "Your full name",
    optional: "Optional",
    emailPlaceholder: "you@company.com",
    enterPassword: "Enter your password",
    createPassword: "Create a password",
    repeatPassword: "Repeat your password",
    show: "Show",
    hide: "Hide",
    remember: "Remember me",
    forgot: "Forgot password?",
    agree: "I agree to the",
    terms: "Terms",
    privacy: "Privacy Policy",
    and: "and",
    recoverButton: "Send recovery email",
    resetButton: "Update password",
    resetTitle: "Choose a new password.",
    resetLead: "Enter and confirm your new password to finish account recovery.",
    back: "← Back to sign in",
    note: "Your account credentials are handled securely through LINETECH Auth.",
    loginReady: "Signed in successfully.",
    signupReady: "Account created successfully.",
    signupConfirm: "Account created. Check your email to confirm your address before signing in.",
    recoveryReady: "If an account exists for this email, a recovery message has been sent.",
    resetReady: "Password updated successfully.",
    loginError: "Unable to sign in with those details.",
    signupError: "Unable to create the account. Check the details and try again.",
    recoveryError: "Unable to prepare account recovery right now.",
    resetError: "Unable to update the password. Open the recovery link again and retry.",
    mismatch: "Passwords do not match.",
    short: "Use at least 8 characters for the password.",
    rateLimited: "Too many attempts. Wait one minute and try again.",
    workspace: "Open Client Workspace",
    confirmedReady: "Email confirmed. You can sign in now.",
    sendCode: "Send verification code",
    verificationCode: "Verification code",
    codePlaceholder: "000000",
    codeTitle: "Check your email.",
    codeLead: "Enter the 6-digit code we sent to your email address.",
    codeSent: "A 6-digit verification code has been sent to your email.",
    verifyCode: "Verify & sign in",
    invalidCode: "The code is incorrect or has expired. Request a new code and try again.",
    resendCode: "Resend code",
    changeEmail: "Change email",
    codeHint: "The code is one-time use and expires shortly.",
  },
  ar: {
    signIn: "تسجيل الدخول",
    create: "إنشاء حساب",
    clientAccess: "دخول العميل",
    newAccount: "حساب جديد",
    recovery: "استعادة الحساب",
    accountAction: "اختر إجراء الحساب",
    welcome: "مرحبًا بعودتك.",
    createTitle: "أنشئ مساحة عملك.",
    recoverTitle: "استعد حسابك.",
    loginLead: "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق من 6 أرقام. لا تحتاج إلى كلمة مرور.",
    signupLead: "جهّز وصولك إلى مساحة عميل لاين تك من خلال البيانات التالية.",
    recoverLead: "أدخل بريدك الإلكتروني لتجهيز خطوة الاستعادة.",
    fullName: "الاسم الكامل",
    company: "الشركة / العلامة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    namePlaceholder: "اسمك الكامل",
    optional: "اختياري",
    emailPlaceholder: "you@company.com",
    enterPassword: "أدخل كلمة المرور",
    createPassword: "أنشئ كلمة مرور",
    repeatPassword: "أعد كتابة كلمة المرور",
    show: "إظهار",
    hide: "إخفاء",
    remember: "تذكرني",
    forgot: "نسيت كلمة المرور؟",
    agree: "أوافق على",
    terms: "الشروط",
    privacy: "سياسة الخصوصية",
    and: "و",
    recoverButton: "إرسال رسالة الاستعادة",
    resetButton: "تحديث كلمة المرور",
    resetTitle: "اختر كلمة مرور جديدة.",
    resetLead: "أدخل كلمة المرور الجديدة وأكدها لإكمال استعادة الحساب.",
    back: "العودة إلى تسجيل الدخول →",
    note: "يتم التعامل مع بيانات حسابك بشكل آمن عبر نظام مصادقة لاين تك.",
    loginReady: "تم تسجيل الدخول بنجاح.",
    signupReady: "تم إنشاء الحساب بنجاح.",
    signupConfirm: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد العنوان قبل تسجيل الدخول.",
    recoveryReady: "إذا كان هناك حساب بهذا البريد، فقد تم إرسال رسالة الاستعادة.",
    resetReady: "تم تحديث كلمة المرور بنجاح.",
    loginError: "تعذر تسجيل الدخول بهذه البيانات.",
    signupError: "تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.",
    recoveryError: "تعذر تجهيز استعادة الحساب حاليًا.",
    resetError: "تعذر تحديث كلمة المرور. افتح رابط الاستعادة من جديد وحاول مرة أخرى.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    short: "استخدم 8 أحرف على الأقل لكلمة المرور.",
    rateLimited: "محاولات كثيرة جدًا. انتظر دقيقة ثم حاول مرة أخرى.",
    workspace: "افتح مساحة العميل",
    confirmedReady: "تم تأكيد البريد الإلكتروني. يمكنك تسجيل الدخول الآن.",
    sendCode: "إرسال رمز التحقق",
    verificationCode: "رمز التحقق",
    codePlaceholder: "000000",
    codeTitle: "تحقق من بريدك.",
    codeLead: "أدخل رمز التحقق المكوّن من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني.",
    codeSent: "تم إرسال رمز تحقق من 6 أرقام إلى بريدك الإلكتروني.",
    verifyCode: "تأكيد الرمز وتسجيل الدخول",
    invalidCode: "الرمز غير صحيح أو انتهت صلاحيته. اطلب رمزًا جديدًا وحاول مرة أخرى.",
    resendCode: "إعادة إرسال الرمز",
    changeEmail: "تغيير البريد",
    codeHint: "الرمز صالح للاستخدام مرة واحدة وتنتهي صلاحيته بعد وقت قصير.",
  },
} as const;

export default function LoginForm(){
  const language = useLanguage();
  const t = copy[language];
  const router = useRouter();
  const [mode,setMode]=useState<Mode>("login");
  const [loginStep,setLoginStep]=useState<LoginStep>("email");
  const [loginEmail,setLoginEmail]=useState("");
  const [otpCode,setOtpCode]=useState("");
  const [message,setMessage]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [submitting,setSubmitting]=useState(false);

  function switchMode(next:Mode){
    setMode(next);
    setLoginStep("email");
    setLoginEmail("");
    setOtpCode("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  useEffect(()=>{
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const expiresIn = Number(hash.get("expires_in") || "3600");
    const search = new URLSearchParams(window.location.search);
    const isRecovery = hash.get("type") === "recovery" || search.get("recovery") === "1";
    const isConfirmed = search.get("confirmed") === "1";

    if(!accessToken || !refreshToken){
      if(isRecovery) switchMode("reset");
      else if(isConfirmed) setMessage(t.confirmedReady);
      return;
    }

    void (async()=>{
      const response = await fetch("/api/auth/session",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({accessToken,refreshToken,expiresIn}),
      });

      if(!response.ok){
        setMessage(isRecovery ? t.resetError : t.loginError);
        return;
      }

      window.history.replaceState({}, "", window.location.pathname + window.location.search);
      if(isRecovery){
        switchMode("reset");
      }else{
        router.replace("/workspace");
        router.refresh();
      }
    })();
  },[router,language]);

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(submitting) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    setMessage("");

    if(mode==="signup" || mode==="reset"){
      if(password.length < 8){
        setMessage(t.short);
        return;
      }
      if(password !== confirmPassword){
        setMessage(t.mismatch);
        return;
      }
    }

    setSubmitting(true);
    try{
      if(mode==="forgot"){
        const response = await fetch("/api/auth/recover",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email}),
        });
        if(response.status===429){
          setMessage(t.rateLimited);
          return;
        }
        setMessage(response.ok ? t.recoveryReady : t.recoveryError);
        return;
      }

      if(mode==="reset"){
        const response = await fetch("/api/auth/update-password",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({password}),
        });
        if(response.status===429){
          setMessage(t.rateLimited);
          return;
        }
        if(!response.ok){
          setMessage(t.resetError);
          return;
        }
        setMessage(t.resetReady);
        router.replace("/workspace");
        router.refresh();
        return;
      }

      if(mode==="signup"){
        const response = await fetch("/api/auth/signup",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            fullName:String(form.get("name") || "").trim(),
            company:String(form.get("company") || "").trim(),
            email,
            password,
          }),
        });
        const result = await response.json().catch(()=>({}));
        if(response.status===429){
          setMessage(t.rateLimited);
          return;
        }
        if(!response.ok){
          setMessage(t.signupError);
          return;
        }
        if(result.needsEmailConfirmation){
          setMessage(t.signupConfirm);
          return;
        }
        setMessage(t.signupReady);
        router.replace("/workspace");
        router.refresh();
        return;
      }

      if(loginStep==="email"){
        const response = await fetch("/api/auth/request-code",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email}),
        });

        if(response.status===429){
          setMessage(t.rateLimited);
          return;
        }
        if(!response.ok){
          setMessage(t.loginError);
          return;
        }

        setLoginEmail(email);
        setOtpCode("");
        setLoginStep("code");
        setMessage(t.codeSent);
        return;
      }

      const code=otpCode.replace(/\s+/g,"");
      if(!/^\d{6}$/.test(code)){
        setMessage(t.invalidCode);
        return;
      }

      const response = await fetch("/api/auth/verify-code",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:loginEmail,code}),
      });

      if(response.status===429){
        setMessage(t.rateLimited);
        return;
      }
      if(!response.ok){
        setMessage(t.invalidCode);
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      window.location.assign(safeInternalNext(next));
    }catch{
      setMessage(
        mode==="signup" ? t.signupError :
        mode==="forgot" ? t.recoveryError :
        mode==="reset" ? t.resetError :
        t.loginError
      );
    }finally{
      setSubmitting(false);
    }
  }

  async function resendLoginCode(){
    if(submitting || !loginEmail) return;
    setSubmitting(true);
    setMessage("");
    try{
      const response=await fetch("/api/auth/request-code",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:loginEmail}),
      });
      if(response.status===429){
        setMessage(t.rateLimited);
        return;
      }
      setMessage(response.ok?t.codeSent:t.loginError);
    }catch{
      setMessage(t.loginError);
    }finally{
      setSubmitting(false);
    }
  }

  const isForgot = mode === "forgot";
  const isReset = mode === "reset";


  return <div className="account-access">
    {!isForgot && !isReset && <div className="account-switch" role="tablist" aria-label={t.accountAction}>
      <button type="button" role="tab" aria-selected={mode==="login"} className={mode==="login"?"active":""} onClick={()=>switchMode("login")}>{t.signIn}</button>
      <button type="button" role="tab" aria-selected={mode==="signup"} className={mode==="signup"?"active":""} onClick={()=>switchMode("signup")}>{t.create}</button>
    </div>}

    <div className="account-mode-head">
      <span>{mode==="login"?t.clientAccess:mode==="signup"?t.newAccount:t.recovery}</span>
      <h2>{mode==="login"&&loginStep==="code"?t.codeTitle:mode==="login"?t.welcome:mode==="signup"?t.createTitle:mode==="reset"?t.resetTitle:t.recoverTitle}</h2>
      <p>{mode==="login"&&loginStep==="code"?t.codeLead:mode==="login"?t.loginLead:mode==="signup"?t.signupLead:mode==="reset"?t.resetLead:t.recoverLead}</p>
    </div>

    <form className="login-form" onSubmit={handleSubmit}>
      {mode==="signup"&&<>
        <label><span>{t.fullName}</span><input type="text" name="name" autoComplete="name" placeholder={t.namePlaceholder} required/></label>
        <label><span>{t.company}</span><input type="text" name="company" autoComplete="organization" placeholder={t.optional}/></label>
      </>}

      {!isReset&&!(mode==="login"&&loginStep==="code")&&<label><span>{t.email}</span><input type="email" name="email" autoComplete="email" placeholder={t.emailPlaceholder} required/></label>}

      {mode==="login"&&loginStep==="code"&&<>
        <div className="login-code-destination"><span>{t.email}</span><strong>{loginEmail}</strong></div>
        <label><span>{t.verificationCode}</span><input className="login-otp-code" type="text" inputMode="numeric" name="code" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otpCode} onChange={event=>setOtpCode(event.target.value.replace(/\D/g,"").slice(0,6))} placeholder={t.codePlaceholder} required/></label>
        <p className="login-code-hint">{t.codeHint}</p>
      </>}

      {!isForgot&&mode!=="login"&&<label><span>{t.password}</span><div className="login-password-field"><input type={showPassword?"text":"password"} name="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="new-password" placeholder={t.createPassword} required/><button type="button" className="login-password-toggle" onClick={()=>setShowPassword(value=>!value)}>{showPassword?t.hide:t.show}</button></div></label>}

      {(mode==="signup"||mode==="reset")&&<label><span>{t.confirmPassword}</span><input type={showPassword?"text":"password"} name="confirmPassword" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder={t.repeatPassword} required/></label>}

      {mode==="signup"?<label className="signup-terms"><input type="checkbox" required/><span>{t.agree} <Link href="/terms">{t.terms}</Link> {t.and} <Link href="/privacy">{t.privacy}</Link>.</span></label>:null}

      <button className="login-submit" type="submit" disabled={submitting}>{mode==="login"?(loginStep==="code"?t.verifyCode:t.sendCode):mode==="signup"?t.create:mode==="reset"?t.resetButton:t.recoverButton} <span>→</span></button>
      {mode==="login"&&loginStep==="code"&&<div className="login-code-actions"><button className="login-inline-action" type="button" disabled={submitting} onClick={()=>void resendLoginCode()}>{t.resendCode}</button><button className="login-inline-action" type="button" disabled={submitting} onClick={()=>{setLoginStep("email");setOtpCode("");setMessage("");}}>{t.changeEmail}</button></div>}
      {isForgot&&<button className="login-inline-action" type="button" onClick={()=>switchMode("login")}>{t.back}</button>}
      <p className="login-ui-note">{t.note}</p>
      {message&&<div className="login-feedback-wrap" role="status"><p className="login-feedback">{message}</p><Link href="/workspace">{t.workspace} →</Link></div>}
    </form>
  </div>;
}
