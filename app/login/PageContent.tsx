"use client";

import ContentHeroArt from "../ContentHeroArt";
import Localized from "../Localized";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage(){return <Localized><main className="login-page">
  <section className="login-stage" data-content-hero="access">
    <ContentHeroArt motif="access" />
    <div className="login-shell login-shell-auth-only">
      <div className="login-card">
        <LoginForm/>
        <div className="login-card-foot"><span>Want to see the client area?</span><Link href="/workspace" prefetch>Open Client Workspace →</Link></div>
        <div className="login-card-foot"><span>Need to start a project first?</span><Link href="/start" prefetch>Start Your Line →</Link></div>
      </div>
    </div>
  </section>
</main></Localized>}
