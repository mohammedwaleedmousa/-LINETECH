"use client";

import Localized from "../Localized";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage(){return <Localized><main className="login-page">
  <section className="login-stage">
    <div className="login-shell">
      <div className="login-copy">
        <p className="login-kicker">LINETECH / ACCESS</p>
        <h1>Your work. One clear line.</h1>
        <p>Sign in if you already have an account, or create one to prepare your LINETECH client workspace.</p>
        <div className="login-signals" aria-hidden="true">
          <div><span>01</span><strong>PROJECT ACCESS</strong></div>
          <div><span>02</span><strong>CLEAR STATUS</strong></div>
          <div><span>03</span><strong>ONE WORKSPACE</strong></div>
        </div>
      </div>
      <div className="login-card">
        <LoginForm/>
        <div className="login-card-foot"><span>Want to see the client area?</span><Link href="/workspace" prefetch>Open Client Workspace →</Link></div>
        <div className="login-card-foot"><span>Need to start a project first?</span><Link href="/start" prefetch>Start Your Line →</Link></div>
      </div>
    </div>
  </section>
</main></Localized>}
