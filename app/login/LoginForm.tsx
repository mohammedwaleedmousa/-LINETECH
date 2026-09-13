"use client";

import { FormEvent, useState } from "react";

export default function LoginForm(){
  const [message,setMessage]=useState("");

  function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setMessage("Login UI is ready. Secure authentication will be connected when the backend phase begins.");
  }

  return <form className="login-form" onSubmit={handleSubmit}>
    <label><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" required/></label>
    <label><span>Password</span><input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" required/></label>
    <div className="login-options">
      <label className="login-remember"><input type="checkbox" name="remember"/><span>Remember me</span></label>
      <button className="login-forgot" type="button" onClick={()=>setMessage("Password recovery will be activated with the authentication backend.")}>Forgot password?</button>
    </div>
    <button className="login-submit" type="submit">Sign in <span>→</span></button>
    <p className="login-ui-note">Frontend preview only — credentials are not sent or stored yet.</p>
    {message&&<p className="login-feedback" role="status">{message}</p>}
  </form>;
}
