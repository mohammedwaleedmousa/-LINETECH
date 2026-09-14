"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLanguage } from "../Localized";

type Mode = "login" | "signup" | "forgot";

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
    loginLead: "Enter your account details to continue.",
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
    recoverButton: "Prepare recovery",
    back: "← Back to sign in",
    note: "Account access is not active yet. Details entered on this page are not submitted or stored.",
    loginReady: "Account access is not active yet, so no credentials were submitted.",
    signupReady: "Account creation is not active yet, so no account was created or stored.",
    recoveryReady: "Account recovery is not active yet, so no recovery email was sent.",
    mismatch: "Passwords do not match.",
    short: "Use at least 8 characters for the password.",
    workspace: "Open Client Workspace",
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
    loginLead: "أدخل بيانات حسابك للمتابعة.",
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
    recoverButton: "تجهيز الاستعادة",
    back: "العودة إلى تسجيل الدخول →",
    note: "الوصول إلى الحساب غير مفعّل حاليًا. البيانات المدخلة في هذه الصفحة لا يتم إرسالها أو حفظها.",
    loginReady: "الوصول إلى الحساب غير مفعّل حاليًا، لذلك لم يتم إرسال بيانات الدخول.",
    signupReady: "إنشاء الحساب غير مفعّل حاليًا، لذلك لم يتم إنشاء أو حفظ حساب.",
    recoveryReady: "استعادة الحساب غير مفعّلة حاليًا، لذلك لم يتم إرسال رسالة استعادة.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    short: "استخدم 8 أحرف على الأقل لكلمة المرور.",
    workspace: "افتح مساحة العميل",
  },
} as const;

export default function LoginForm(){
  const language = useLanguage();
  const t = copy[language];
  const [mode,setMode]=useState<Mode>("login");
  const [message,setMessage]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);

  function switchMode(next:Mode){
    setMode(next);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(mode==="forgot"){
      setMessage(t.recoveryReady);
      return;
    }
    if(mode==="signup"){
      if(password.length < 8){
        setMessage(t.short);
        return;
      }
      if(password !== confirmPassword){
        setMessage(t.mismatch);
        return;
      }
      setMessage(t.signupReady);
      return;
    }
    setMessage(t.loginReady);
  }

  const isForgot = mode === "forgot";

  return <div className="account-access">
    {!isForgot && <div className="account-switch" role="tablist" aria-label={t.accountAction}>
      <button type="button" role="tab" aria-selected={mode==="login"} className={mode==="login"?"active":""} onClick={()=>switchMode("login")}>{t.signIn}</button>
      <button type="button" role="tab" aria-selected={mode==="signup"} className={mode==="signup"?"active":""} onClick={()=>switchMode("signup")}>{t.create}</button>
    </div>}

    <div className="account-mode-head">
      <span>{mode==="login"?t.clientAccess:mode==="signup"?t.newAccount:t.recovery}</span>
      <h2>{mode==="login"?t.welcome:mode==="signup"?t.createTitle:t.recoverTitle}</h2>
      <p>{mode==="login"?t.loginLead:mode==="signup"?t.signupLead:t.recoverLead}</p>
    </div>

    <form className="login-form" onSubmit={handleSubmit}>
      {mode==="signup"&&<>
        <label><span>{t.fullName}</span><input type="text" name="name" autoComplete="name" placeholder={t.namePlaceholder} required/></label>
        <label><span>{t.company}</span><input type="text" name="company" autoComplete="organization" placeholder={t.optional}/></label>
      </>}

      <label><span>{t.email}</span><input type="email" name="email" autoComplete="email" placeholder={t.emailPlaceholder} required/></label>

      {!isForgot&&<label><span>{t.password}</span><div className="login-password-field"><input type={showPassword?"text":"password"} name="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete={mode==="login"?"current-password":"new-password"} placeholder={mode==="login"?t.enterPassword:t.createPassword} required/><button type="button" className="login-password-toggle" onClick={()=>setShowPassword(value=>!value)}>{showPassword?t.hide:t.show}</button></div></label>}

      {mode==="signup"&&<label><span>{t.confirmPassword}</span><input type={showPassword?"text":"password"} name="confirmPassword" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder={t.repeatPassword} required/></label>}

      {mode==="login"?<div className="login-options">
        <label className="login-remember"><input type="checkbox" name="remember"/><span>{t.remember}</span></label>
        <button className="login-forgot" type="button" onClick={()=>switchMode("forgot")}>{t.forgot}</button>
      </div>:mode==="signup"?<label className="signup-terms"><input type="checkbox" required/><span>{t.agree} <Link href="/terms">{t.terms}</Link> {t.and} <Link href="/privacy">{t.privacy}</Link>.</span></label>:null}

      <button className="login-submit" type="submit">{mode==="login"?t.signIn:mode==="signup"?t.create:t.recoverButton} <span>→</span></button>
      {isForgot&&<button className="login-inline-action" type="button" onClick={()=>switchMode("login")}>{t.back}</button>}
      <p className="login-ui-note">{t.note}</p>
      {message&&<div className="login-feedback-wrap" role="status"><p className="login-feedback">{message}</p><Link href="/workspace">{t.workspace} →</Link></div>}
    </form>
  </div>;
}
