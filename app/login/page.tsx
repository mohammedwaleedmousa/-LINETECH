import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata={
  title:"Login",
  description:"Sign in to the LINETECH workspace.",
  robots:{index:false,follow:false},
};

export default function LoginPage(){return <main className="login-page">
  <section className="login-stage">
    <div className="login-shell">
      <div className="login-copy">
        <p className="login-kicker">LINETECH / ACCESS</p>
        <h1>Your work. One clear line.</h1>
        <p>Sign in to access your LINETECH workspace, project activity and future client tools from one focused place.</p>
        <div className="login-signals" aria-hidden="true">
          <div><span>01</span><strong>PROJECT ACCESS</strong></div>
          <div><span>02</span><strong>CLEAR STATUS</strong></div>
          <div><span>03</span><strong>ONE WORKSPACE</strong></div>
        </div>
      </div>
      <div className="login-card">
        <div className="login-card-head"><span>CLIENT ACCESS</span><h2>Welcome back.</h2><p>Enter your account details to continue.</p></div>
        <LoginForm/>
        <div className="login-card-foot"><span>Need to start a project?</span><Link href="/start" prefetch>Start Your Line →</Link></div>
      </div>
    </div>
  </section>
</main>}
