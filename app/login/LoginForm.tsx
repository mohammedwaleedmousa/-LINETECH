"use client";

import Localized from "../Localized";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginForm(){
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [message,setMessage]=useState("");

  function switchMode(next:"login"|"signup"){
    setMode(next);
    setMessage("");
  }

  function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setMessage(mode==="login"
      ? "Sign-in UI is ready. Secure authentication will be connected when the backend phase begins."
      : "Account creation UI is ready. Registration will be connected when the backend phase begins."
    );
  }

  return <Localized><div className="account-access">
    <div className="account-switch" role="tablist" aria-label="Choose account action">
      <button type="button" role="tab" aria-selected={mode==="login"} className={mode==="login"?"active":""} onClick={()=>switchMode("login")}>Sign in</button>
      <button type="button" role="tab" aria-selected={mode==="signup"} className={mode==="signup"?"active":""} onClick={()=>switchMode("signup")}>Create account</button>
    </div>

    <div className="account-mode-head">
      <span>{mode==="login"?"CLIENT ACCESS":"NEW ACCOUNT"}</span>
      <h2>{mode==="login"?"Welcome back.":"Create your workspace."}</h2>
      <p>{mode==="login"?"Enter your account details to continue.":"Create an account to prepare for your LINETECH client workspace."}</p>
    </div>

    <form className="login-form" onSubmit={handleSubmit}>
      {mode==="signup"&&<>
        <label><span>Full name</span><input type="text" name="name" autoComplete="name" placeholder="Your full name" required/></label>
        <label><span>Company / Brand</span><input type="text" name="company" autoComplete="organization" placeholder="Optional"/></label>
      </>}

      <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" required/></label>
      <label><span>Password</span><input type="password" name="password" autoComplete={mode==="login"?"current-password":"new-password"} placeholder={mode==="login"?"Enter your password":"Create a password"} required/></label>

      {mode==="signup"&&<label><span>Confirm password</span><input type="password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat your password" required/></label>}

      {mode==="login"?<div className="login-options">
        <label className="login-remember"><input type="checkbox" name="remember"/><span>Remember me</span></label>
        <button className="login-forgot" type="button" onClick={()=>setMessage("Password recovery will be activated with the authentication backend.")}>Forgot password?</button>
      </div>:<label className="signup-terms"><input type="checkbox" required/><span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</span></label>}

      <button className="login-submit" type="submit">{mode==="login"?"Sign in":"Create account"} <span>→</span></button>
      <p className="login-ui-note">Frontend preview only — account data and credentials are not sent or stored yet.</p>
      {message&&<p className="login-feedback" role="status">{message}</p>}
    </form>
  </div></Localized>;
}
