"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AccountData = {
  id: string;
  email: string;
  emailConfirmedAt?: string | null;
  createdAt?: string | null;
  lastSignInAt?: string | null;
  role?: string;
  profile: {
    fullName: string;
    company: string;
    phone: string;
    updatedAt?: string | null;
  };
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export default function AdminAccountClient() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const response = await fetch("/api/account", { cache: "no-store" });
      if (response.status === 401) {
        window.location.assign("/admin/login?next=/admin/account");
        return;
      }
      const payload = await response.json().catch(() => null) as { ok?: boolean; account?: AccountData } | null;
      if (!response.ok || !payload?.ok || !payload.account) throw new Error();
      if (payload.account.role !== "admin") {
        window.location.assign("/admin/login?denied=1");
        return;
      }
      setAccount(payload.account);
    } catch {
      setError("Admin account settings could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const initials = useMemo(() => {
    const source = account?.profile.fullName || account?.email || "LA";
    return source.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("");
  }, [account]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy("profile");
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(form.get("fullName") || "").trim(),
          company: String(form.get("company") || "").trim(),
          phone: String(form.get("phone") || "").trim(),
        }),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; profile?: AccountData["profile"] } | null;
      if (!response.ok || !payload?.ok || !payload.profile) throw new Error();
      setAccount(current => current ? { ...current, profile: payload.profile! } : current);
      setNotice("Admin profile updated.");
    } catch {
      setError("Profile update failed.");
    } finally {
      setBusy("");
    }
  }

  async function updateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy("email");
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(form.get("email") || "").trim().toLowerCase() }),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; unchanged?: boolean } | null;
      if (!response.ok || !payload?.ok) throw new Error();
      setNotice(payload.unchanged ? "This is already the current admin email." : "Email change requested. Check your inbox if confirmation is required.");
    } catch {
      setError("Email change failed.");
    } finally {
      setBusy("");
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setBusy("password");
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error();
      event.currentTarget.reset();
      setNotice("Admin password updated. Other sessions were signed out.");
    } catch {
      setError("Password update failed.");
    } finally {
      setBusy("");
    }
  }

  async function logoutOthers() {
    setBusy("sessions");
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/auth/logout-others", { method: "POST" });
      if (!response.ok) throw new Error();
      setNotice("Other admin sessions were signed out.");
    } catch {
      setError("Could not sign out other sessions.");
    } finally {
      setBusy("");
    }
  }

  async function logoutCurrent() {
    setBusy("logout");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  }

  if (loading) return <main className="admin-account-page"><div className="admin-overview-state">Loading admin account…</div></main>;
  if (!account) return <main className="admin-account-page"><div className="admin-overview-error">{error || "Admin account unavailable."}</div></main>;

  return (
    <main className="admin-account-page">
      <header className="admin-directory-head">
        <div><span>LINETECH / ADMIN ACCOUNT</span><h1>Administrator settings.</h1><p>Credentials and profile settings for the private administration surface.</p></div>
        <div className="admin-account-avatar">{initials}</div>
      </header>

      {(notice || error) && <div className={error ? "admin-overview-error" : "admin-account-notice"}>{error || notice}</div>}

      <section className="admin-account-grid">
        <article className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>PROFILE</span><h2>Administrator profile.</h2></div></div>
          <form className="admin-account-form" onSubmit={saveProfile}>
            <label><span>Full name</span><input name="fullName" maxLength={120} defaultValue={account.profile.fullName} required /></label>
            <label><span>Company</span><input name="company" maxLength={160} defaultValue={account.profile.company} /></label>
            <label><span>Phone</span><input name="phone" type="tel" maxLength={50} defaultValue={account.profile.phone} /></label>
            <button type="submit" disabled={busy === "profile"}>{busy === "profile" ? "Saving…" : "Save profile"}</button>
          </form>
        </article>

        <article className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>EMAIL</span><h2>Sign-in address.</h2></div></div>
          <div className="admin-account-current"><span>Current email</span><strong>{account.email}</strong><small>{account.emailConfirmedAt ? "Confirmed" : "Confirmation pending"}</small></div>
          <form className="admin-account-form" onSubmit={updateEmail}>
            <label><span>New email</span><input name="email" type="email" maxLength={320} placeholder={account.email} required /></label>
            <button type="submit" disabled={busy === "email"}>{busy === "email" ? "Updating…" : "Update email"}</button>
          </form>
        </article>

        <article className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>SECURITY</span><h2>Change password.</h2></div></div>
          <form className="admin-account-form" onSubmit={updatePassword}>
            <label><span>New password</span><input name="password" type="password" minLength={8} maxLength={1024} required /></label>
            <label><span>Confirm password</span><input name="confirmPassword" type="password" minLength={8} maxLength={1024} required /></label>
            <button type="submit" disabled={busy === "password"}>{busy === "password" ? "Updating…" : "Update password"}</button>
          </form>
        </article>

        <article className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>SESSIONS</span><h2>Administrator sessions.</h2></div></div>
          <div className="admin-account-session">
            <div><span>Current browser</span><strong>Active</strong></div>
            <div><span>Last sign-in</span><strong>{formatDate(account.lastSignInAt)}</strong></div>
            <div><span>Account created</span><strong>{formatDate(account.createdAt)}</strong></div>
          </div>
          <div className="admin-account-session-actions">
            <button type="button" onClick={() => void logoutOthers()} disabled={busy === "sessions"}>Sign out other sessions</button>
            <button type="button" className="is-danger" onClick={() => void logoutCurrent()} disabled={busy === "logout"}>Sign out this admin</button>
          </div>
        </article>
      </section>

      <section className="admin-account-reference">
        <span>ADMIN ACCOUNT ID</span>
        <strong>{account.id}</strong>
        <small>Role: {account.role || "admin"}</small>
      </section>
    </main>
  );
}
