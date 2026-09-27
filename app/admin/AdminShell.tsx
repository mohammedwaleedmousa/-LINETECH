"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", index: "01" },
  { href: "/admin/projects", label: "Projects", index: "02" },
  { href: "/admin/clients", label: "Clients", index: "03" },
  { href: "/admin/team", label: "Team & Accounts", index: "04" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (response.status === 401) {
          window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
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
  }, []);

  const active = (href: string) => href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  if (checking) {
    return <main className="admin-shell admin-shell-state"><div><span>LINETECH / ADMIN</span><strong>Checking admin access…</strong></div></main>;
  }

  if (!authorized) {
    return <main className="admin-shell admin-shell-state"><div><span>LINETECH / ADMIN</span><strong>Admin access required.</strong><p>This account does not have LINETECH admin permission.</p></div></main>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-app-sidebar">
        <Link className="admin-app-brand" href="/admin">
          <span className="admin-app-mark"><i/><b/></span>
          <span><strong>LINETECH</strong><small>ADMIN OS</small></span>
        </Link>

        <nav className="admin-app-nav" aria-label="Admin navigation">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={active(item.href) ? "is-active" : ""}>
              <span>{item.index}</span><strong>{item.label}</strong><b>→</b>
            </Link>
          ))}
        </nav>

        <div className="admin-app-sidebar-foot">
          <Link href="/account">Account settings <span>↗</span></Link>
          <Link href="/">Open website <span>↗</span></Link>
        </div>
      </aside>

      <div className="admin-app-main">{children}</div>
    </div>
  );
}
