"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Json = Record<string, any>;
type Project = {
  id: string;
  title?: string | null;
  status: string;
  phase: number;
  updated_at?: string | null;
  client_id?: string | null;
  request?: Json | null;
  client?: Json | null;
};

export default function ClientsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Json[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [pr, ur] = await Promise.all([
          fetch("/api/admin/projects", { cache: "no-store" }),
          fetch("/api/admin/users", { cache: "no-store" }),
        ]);
        const [pp, up] = await Promise.all([pr.json().catch(() => null), ur.json().catch(() => null)]);
        if (!cancelled) {
          if (pr.ok && pp?.ok) setProjects(Array.isArray(pp.projects) ? pp.projects : []);
          if (ur.ok && up?.ok) setUsers(Array.isArray(up.users) ? up.users : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const clients = useMemo(() => {
    const userMap = new Map(users.map(user => [String(user.id), user]));
    const grouped = new Map<string, { id: string; profile: Json; projects: Project[] }>();
    for (const project of projects) {
      const id = String(project.client_id || project.client?.id || "");
      if (!id) continue;
      const current = grouped.get(id) || { id, profile: project.client || userMap.get(id) || {}, projects: [] };
      current.projects.push(project);
      if (!current.profile?.full_name && project.client) current.profile = project.client;
      grouped.set(id, current);
    }
    for (const user of users) {
      const id = String(user.id || "");
      if (id && !grouped.has(id)) grouped.set(id, { id, profile: user, projects: [] });
    }
    const q = query.trim().toLowerCase();
    return [...grouped.values()]
      .filter(item => {
        if (!q) return true;
        const haystack = [item.profile?.full_name, item.profile?.company, item.profile?.email, item.profile?.phone, ...item.projects.map(p => p.title || p.request?.service)].filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(q);
      })
      .sort((a,b) => (b.projects[0]?.updated_at || "").localeCompare(a.projects[0]?.updated_at || ""));
  }, [projects, users, query]);

  return (
    <main className="admin-directory">
      <header className="admin-directory-head">
        <div><span>LINETECH / CLIENTS</span><h1>Client directory.</h1><p>Every account and the project relationship behind it.</p></div>
        <strong>{clients.length}</strong>
      </header>

      <div className="admin-directory-tools">
        <input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Search client, company, email, project…" />
      </div>

      {loading ? <p className="admin-overview-empty">Loading clients…</p> : (
        <div className="admin-client-directory-grid">
          {clients.map(item => {
            const latest = item.projects[0];
            const active = item.projects.filter(p => !["completed","archived"].includes(p.status)).length;
            return (
              <article key={item.id}>
                <div className="admin-client-directory-top">
                  <span>{item.profile?.company || "CLIENT"}</span>
                  <strong>{item.profile?.full_name || latest?.request?.name || "Client"}</strong>
                  <p>{item.profile?.email || item.profile?.phone || latest?.request?.contact || "No contact saved"}</p>
                </div>
                <div className="admin-client-directory-stats">
                  <div><strong>{item.projects.length}</strong><span>projects</span></div>
                  <div><strong>{active}</strong><span>active</span></div>
                </div>
                <div className="admin-client-directory-projects">
                  {item.projects.slice(0,3).map(project => (
                    <Link key={project.id} href={`/admin/projects?project=${encodeURIComponent(project.id)}`}>
                      <span>{project.request?.reference_number || "PROJECT"}</span>
                      <strong>{project.title || project.request?.service || "Project"}</strong>
                      <small>{project.request?.selected_plan_code ? `${String(project.request.selected_plan_code).replaceAll("_", "-").toUpperCase()} · ` : ""}{project.status} · P{project.phase}</small>
                    </Link>
                  ))}
                  {!item.projects.length && <p>No projects yet.</p>}
                </div>
                {latest && <Link className="admin-client-open" href={`/admin/projects?project=${encodeURIComponent(latest.id)}`}>Open latest project →</Link>}
              </article>
            );
          })}
          {!clients.length && <p className="admin-overview-empty">No clients match this search.</p>}
        </div>
      )}
    </main>
  );
}
