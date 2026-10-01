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
  due_date?: string | null;
  next_action_required?: boolean;
  request?: Json | null;
  client?: Json | null;
};

function date(value?: string | null) {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString(); } catch { return value; }
}

export default function DashboardClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Json[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [projectsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
      ]);
      const [projectPayload, userPayload] = await Promise.all([
        projectsResponse.json().catch(() => null),
        usersResponse.json().catch(() => null),
      ]);
      if (!projectsResponse.ok || !projectPayload?.ok) throw new Error();
      setProjects(Array.isArray(projectPayload.projects) ? projectPayload.projects : []);
      setUsers(usersResponse.ok && userPayload?.ok && Array.isArray(userPayload.users) ? userPayload.users : []);
    } catch {
      setError("Admin dashboard could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    waiting: projects.filter(p => p.status === "waiting_client").length,
    review: projects.filter(p => p.status === "review").length,
    completed: projects.filter(p => p.status === "completed").length,
    clients: new Set(projects.map(p => p.client?.id || p.id && p.client?.id).filter(Boolean)).size || users.length,
  }), [projects, users]);

  const attention = useMemo(() =>
    projects.filter(p => p.next_action_required || p.status === "waiting_client" || p.status === "review").slice(0, 6),
  [projects]);

  if (loading) return <main className="admin-overview"><div className="admin-overview-state">Loading operations…</div></main>;

  return (
    <main className="admin-overview">
      <header className="admin-overview-head">
        <div><span>LINETECH / CONTROL CENTER</span><h1>Operations dashboard.</h1><p>Projects, clients and delivery status in one operational view.</p></div>
        <button type="button" onClick={() => void load()}>Refresh</button>
      </header>

      {error && <div className="admin-overview-error">{error}</div>}

      <section className="admin-kpi-grid">
        <article><span>ALL PROJECTS</span><strong>{stats.total}</strong><small>Current project records</small></article>
        <article><span>ACTIVE</span><strong>{stats.active}</strong><small>Work currently moving</small></article>
        <article><span>WAITING CLIENT</span><strong>{stats.waiting}</strong><small>Blocked on client input</small></article>
        <article><span>IN REVIEW</span><strong>{stats.review}</strong><small>Review / approval stage</small></article>
        <article><span>COMPLETED</span><strong>{stats.completed}</strong><small>Delivered projects</small></article>
        <article><span>ACCOUNTS</span><strong>{users.length}</strong><small>Known client/team profiles</small></article>
      </section>

      <section className="admin-overview-grid">
        <div className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>RECENT PROJECTS</span><h2>Latest work.</h2></div><Link href="/admin/projects">View all →</Link></div>
          <div className="admin-dashboard-list">
            {projects.slice(0, 7).map(project => (
              <Link key={project.id} href={`/admin/projects?project=${encodeURIComponent(project.id)}`}>
                <span>{project.request?.reference_number || "PROJECT"}</span>
                <strong>{project.title || project.request?.service || "Project"}</strong>
                <small>{project.client?.full_name || project.request?.name || "Client"} · {project.request?.selected_plan_code ? `${String(project.request.selected_plan_code).replaceAll("_", "-").toUpperCase()} · ` : ""}{project.status} · Phase {project.phase}/5</small>
                <b>→</b>
              </Link>
            ))}
            {!projects.length && <p className="admin-overview-empty">No projects yet.</p>}
          </div>
        </div>

        <div className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>NEEDS ATTENTION</span><h2>Next actions.</h2></div></div>
          <div className="admin-attention-list">
            {attention.map(project => (
              <Link key={project.id} href={`/admin/projects?project=${encodeURIComponent(project.id)}`}>
                <i/>
                <div><strong>{project.title || project.request?.service || "Project"}</strong><p>{project.status === "waiting_client" ? "Waiting for client" : project.status === "review" ? "In review" : "Action required"}</p></div>
                <span>{project.due_date ? date(project.due_date) : "OPEN"}</span>
              </Link>
            ))}
            {!attention.length && <p className="admin-overview-empty">Nothing urgent right now.</p>}
          </div>
        </div>
      </section>

      <section className="admin-quick-grid">
        <Link href="/admin/projects"><span>01</span><strong>Project operations</strong><p>Status, phase, files, chat, handover and team access.</p><b>Open →</b></Link>
        <Link href="/admin/clients"><span>02</span><strong>Client directory</strong><p>See client relationships and all projects per client.</p><b>Open →</b></Link>
        <Link href="/admin/team"><span>03</span><strong>Accounts & team</strong><p>Review known accounts and manage access from projects.</p><b>Open →</b></Link>
      </section>
    </main>
  );
}
