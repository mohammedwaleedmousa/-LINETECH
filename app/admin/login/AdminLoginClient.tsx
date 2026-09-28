"use client";

import { FormEvent, useEffect, useState } from "react";

type Mode = "login" | "forgot" | "reset";

function safeAdminNext(value: string | null) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  if (value.startsWith("/admin/login")) return "/admin";
  try {
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin || !parsed.pathname.startsWith("/admin")) return "/admin";
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return "/admin";
  }
}

export default function AdminLoginClient() {
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const expiresIn = Number(hash.get("expires_in") || "3600");
    const search = new URLSearchParams(window.location.search);
    const isRecovery = hash.get("type") === "recovery" || search.get("recovery") === "1";
    const denied = search.get("denied") === "1";

    if (denied) setMessage("This account does not have LINETECH admin access.");
    if (!accessToken || !refreshToken) {
      if (isRecovery) setMode("reset");
      return;
    }

    void (async () => {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken, expiresIn }),
      });
      if (!response.ok) {
        setMessage("The admin session could not be restored.");
        return;
      }

      const session = await fetch("/api/auth/session", { cache: "no-store" });
      const payload = await session.json().catch(() => null) as {
        user?: { app_metadata?: { role?: string } };
      } | null;

      if (!session.ok || payload?.user?.app_metadata?.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        setMessage("This account does not have LINETECH admin access.");
        return;
      }

      window.history.replaceState({}, "", window.location.pathname + window.location.search);
      if (isRecovery) setMode("reset");
      else window.location.assign(safeAdminNext(search.get("next")));
    })();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const next = safeAdminNext(new URLSearchParams(window.location.search).get("next"));
    setMessage("");

    if (mode === "reset") {
      if (password.length < 8) {
        setMessage("Use at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "forgot") {
        const response = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, admin: true }),
        });
        setMessage(response.ok
          ? "If this admin account exists, a recovery email has been sent."
          : "Recovery could not be prepared right now.");
        return;
      }

      if (mode === "reset") {
        const response = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!response.ok) {
          setMessage("Password update failed. Open the recovery link again and retry.");
          return;
        }
        setMessage("Password updated. Redirecting to admin…");
        window.setTimeout(() => window.location.assign("/admin"), 500);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          remember: form.get("remember") === "on",
        }),
      });
      if (response.status === 429) {
        setMessage("Too many attempts. Wait one minute and try again.");
        return;
      }
      if (!response.ok) {
        setMessage("Unable to sign in with those admin credentials.");
        return;
      }

      const session = await fetch("/api/auth/session", { cache: "no-store" });
      const payload = await session.json().catch(() => null) as {
        user?: { app_metadata?: { role?: string } };
      } | null;

      if (!session.ok || payload?.user?.app_metadata?.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        setMessage("This account does not have LINETECH admin access.");
        return;
      }

      window.location.assign(next);
    } catch {
      setMessage("Admin sign-in could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand">
        <div className="admin-login-wordmark">
          <span><strong>LINETECH</strong><small>ADMINISTRATION</small></span>
        </div>
        <div className="admin-login-brand-copy">
          <span>PRIVATE CONTROL SURFACE</span>
          <h1>Admin access only.</h1>
          <p>Projects, clients, files, delivery and internal operations stay separate from the client workspace.</p>
        </div>
        <small>LINETECH / ADMIN OS</small>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-box">
          <div className="admin-login-head">
            <span>{mode === "login" ? "SECURE SIGN IN" : mode === "forgot" ? "ACCOUNT RECOVERY" : "NEW PASSWORD"}</span>
            <h2>{mode === "login" ? "Enter administration." : mode === "forgot" ? "Recover admin access." : "Reset admin password."}</h2>
          </div>

          <form onSubmit={submit}>
            {mode !== "reset" && (
              <label>
                <span>Email</span>
                <input type="email" name="email" autoComplete="email" maxLength={320} required />
              </label>
            )}
            {mode !== "forgot" && (
              <label>
                <span>{mode === "reset" ? "New password" : "Password"}</span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={mode === "reset" ? 8 : undefined}
                  maxLength={1024}
                  required
                />
              </label>
            )}
            {mode === "reset" && (
              <label>
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={1024}
                  required
                />
              </label>
            )}

            {mode === "login" && (
              <div className="admin-login-options">
                <label><input type="checkbox" name="remember"/><span>Remember this device</span></label>
                <button type="button" onClick={() => { setMode("forgot"); setMessage(""); }}>Forgot password?</button>
              </div>
            )}

            <button className="admin-login-submit" type="submit" disabled={submitting}>
              {submitting ? "Working…" : mode === "login" ? "Sign in to Admin" : mode === "forgot" ? "Send recovery email" : "Update password"}
              <span>→</span>
            </button>

            {mode === "forgot" && <button className="admin-login-back" type="button" onClick={() => { setMode("login"); setMessage(""); }}>← Back to admin sign in</button>}
            {message && <p className="admin-login-message" role="status">{message}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
