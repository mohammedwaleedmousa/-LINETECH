"use client";

import { useEffect, useState } from "react";

type User = { id: string; full_name?: string | null; company?: string | null; created_at?: string | null };

export default function TeamClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" });
        const payload = await response.json().catch(() => null);
        if (!cancelled && response.ok && payload?.ok && Array.isArray(payload.users)) setUsers(payload.users);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="admin-directory">
      <header className="admin-directory-head">
        <div><span>LINETECH / ACCOUNTS</span><h1>Team & accounts.</h1><p>Known profiles that can be assigned to project access.</p></div>
        <strong>{users.length}</strong>
      </header>

      <section className="admin-overview-panel">
        <div className="admin-overview-panel-head"><div><span>ACCOUNTS</span><h2>Available profiles.</h2></div></div>
        {loading ? <p className="admin-overview-empty">Loading accounts…</p> : (
          <div className="admin-account-list">
            {users.map(user => (
              <article key={user.id}>
                <div><strong>{user.full_name || "Unnamed account"}</strong><p>{user.company || "No company"}</p></div>
                <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
              </article>
            ))}
          </div>
        )}
        <p className="admin-team-note">Project membership and access roles are managed inside <strong>Projects → Team access</strong>.</p>
      </section>
    </main>
  );
}
