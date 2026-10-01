"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", index: "01" },
  { href: "/admin/inbox", label: "Inbox", index: "02" },\n  { href: "/admin/projects", label: "Projects", index: "03" },
  { href: "/admin/clients", label: "Clients", index: "04" },
  { href: "/admin/billing", label: "Billing", index: "05" },
  { href: "/admin/team", label: "Team & Accounts", index: "06" },
  { href: "/admin/account", label: "Admin Account", index: "07" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);\n  const [inboxUnread, setInboxUnread] = useState(0);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setChecking(false);
      setAuthorized(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (response.status === 401) {
          window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }
        const payload = await response.json().catch(() => null) as {
          user?: { app_metadata?: { role?: string } };
        } | null;
        if (!cancelled) setAuthorized(response.ok && payload?.user?.app_metadata?.role === "admin");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isLogin]);

  useEffect(() => {
    if (!authorized || isLogin) return;
    let cancelled=false;
    const load=async()=>{const r=await fetch("/api/admin/inbox",{cache:"no-store"});const p=await r.json().catch(()=>null);if(!cancelled&&r.ok&&p?.ok)setInboxUnread(Number(p.unreadCount||0))};
    void load();
    return()=>{cancelled=true};
  }, [authorized,isLogin,pathname]);

  const active = (href: string) => href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
  const current = nav.find(item => active(item.href)) || nav[0];

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  }

  if (isLogin) return <>{children}</>;

  if (checking) {
    return <main className="admin-shell admin-shell-state"><div><span>LINETECH / ADMIN</span><strong>Checking admin access…</strong></div></main>;
  }

  if (!authorized) {
    return <main className="admin-shell admin-shell-state"><div><span>LINETECH / ADMIN</span><strong>Admin access required.</strong><p>This account does not have LINETECH admin permission.</p></div></main>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-app-sidebar">
        <Link className="admin-app-brand" href="/admin" aria-label="LINETECH Admin">
          <span className="admin-app-wordmark"><strong>LINETECH</strong><small>ADMIN OS</small></span>
        </Link>

        <nav className="admin-app-nav" aria-label="Admin navigation">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={active(item.href) ? "is-active" : ""}>
              <span>{item.index}</span><strong>{item.label}{item.href === "/admin/inbox" && inboxUnread > 0 ? <em className="admin-nav-badge">{inboxUnread > 99 ? "99+" : inboxUnread}</em> : null}</strong><b>→</b>
            </Link>
          ))}
        </nav>

        <div className="admin-app-sidebar-foot">
          <Link href="/admin/account">Admin account <span>↗</span></Link>
          <Link href="/">Open website <span>↗</span></Link>
          <button type="button" onClick={() => void signOut()}>Sign out <span>↗</span></button>
        </div>
      </aside>

      <div className="admin-app-main">
        <header className="admin-app-topbar">
          <div>
            <span>ADMIN PORTAL</span>
            <strong>{current.label}</strong>
          </div>
          <div className="admin-app-topbar-actions">
            <Link href="/admin/account" aria-label="Admin account">Account</Link>
            <button type="button" onClick={() => void signOut()}>Sign out</button>
          </div>
        </header>
        <div className="admin-app-content">{children}</div>
      </div>
    </div>
  );
}
