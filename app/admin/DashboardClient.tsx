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
  const [billing, setBilling] = useState<Json>({ summary: {}, subscriptions: [] });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [projectsResponse, usersResponse, billingResponse] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/admin/billing", { cache: "no-store" }),
      ]);
      const [projectPayload, userPayload, billingPayload] = await Promise.all([
        projectsResponse.json().catch(() => null),
        usersResponse.json().catch(() => null),
        billingResponse.json().catch(() => null),
      ]);
      if (!projectsResponse.ok || !projectPayload?.ok) throw new Error();
      setProjects(Array.isArray(projectPayload.projects) ? projectPayload.projects : []);
      setUsers(usersResponse.ok && userPayload?.ok && Array.isArray(userPayload.users) ? userPayload.users : []);
      setBilling(billingResponse.ok && billingPayload?.ok ? billingPayload : { summary: {}, subscriptions: [] });
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

  const attention = useMemo(() => {
    const now = Date.now();
    const day = 86_400_000;
    const subscriptionByClient = new Map(
      (Array.isArray(billing.subscriptions) ? billing.subscriptions : []).map((item: Json) => [String(item.client_id || ""), item]),
    );

    return projects
      .filter(project => !["completed", "archived"].includes(project.status))
      .map(project => {
        const due = project.due_date ? new Date(project.due_date).getTime() : NaN;
        const daysToDue = Number.isFinite(due) ? Math.ceil((due - now) / day) : null;
        const subscription = subscriptionByClient.get(String(project.client?.id || project.client_id || ""));
        const pastDue = subscription?.status === "past_due";
        const overdueDelivery = daysToDue !== null && daysToDue < 0;
        const dueSoon = daysToDue !== null && daysToDue >= 0 && daysToDue <= 7;

        let priority = 99;
        let reason = "";
        let meta = project.due_date ? date(project.due_date) : "OPEN";

        if (overdueDelivery) {
          priority = 0; reason = "Delivery overdue"; meta = `${Math.abs(daysToDue || 0)}d overdue`;
        } else if (pastDue) {
          priority = 1; reason = "Payment past due"; meta = `${Number(subscription?.recurring_price_usd || 0).toLocaleString()} due`;
        } else if (project.next_action_required) {
          priority = 2; reason = "Action required";
        } else if (project.status === "review") {
          priority = 3; reason = "In review";
        } else if (project.status === "waiting_client") {
          priority = 4; reason = "Waiting for client";
        } else if (dueSoon) {
          priority = 5; reason = "Due soon"; meta = daysToDue === 0 ? "DUE TODAY" : `${daysToDue}d left`;
        }

        return { project, priority, reason, meta };
      })
      .filter(item => item.priority < 99)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 8);
  }, [projects, billing]);

  if (loading) return <main className="admin-overview"><div className="admin-overview-state">Loading operations…</div></main>;

  return (
    <main className="admin-overview">
      <header className="admin-overview-head">
        <div><span>LINETECH / CONTROL CENTER</span><h1>Operations dashboard.</h1><p>Projects, clients and delivery status in one operational view.</p></div>
        <button type="button" onClick={() => void load()}>Refresh</button>
      </header>

      {error && <div className="admin-overview-error">{error}</div>}

      <section className="admin-kpi-grid admin-kpi-grid-v2">
        <article><span>MRR</span><strong>${Number(billing.summary?.mrr || 0).toLocaleString()}</strong><small>Active + past due recurring</small></article>
        <article><span>ACTIVE PROJECTS</span><strong>{stats.active}</strong><small>Work currently moving</small></article>
        <article><span>NEEDS ATTENTION</span><strong>{attention.length}</strong><small>Priority operations queue</small></article>
        <article><span>PAST DUE</span><strong>{billing.summary?.pastDue || 0}</strong><small>${Number(billing.summary?.overdueAmount || 0).toLocaleString()} overdue value</small></article>
        <article><span>CLIENT ACCOUNTS</span><strong>{users.length}</strong><small>Known client/team profiles</small></article>
        <article><span>COMPLETED</span><strong>{stats.completed}</strong><small>Delivered projects</small></article>
      </section>

      <section className="admin-overview-grid">
        <div className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>RECENT PROJECTS</span><h2>Latest work.</h2></div><Link href="/admin/projects">View all →</Link></div>
          <div className="admin-ops-table" role="table" aria-label="Project operations">
            <div className="admin-ops-row admin-ops-head" role="row">
              <span>Project / client</span><span>Plan</span><span>Status</span><span>Phase</span><span>Due</span><span />
            </div>
            {projects.slice(0, 10).map(project => (
              <Link className="admin-ops-row" role="row" key={project.id} href={`/admin/projects?project=${encodeURIComponent(project.id)}`}>
                <span className="admin-ops-project"><strong>{project.title || project.request?.service || "Project"}</strong><small>{project.client?.full_name || project.request?.name || "Client"} · {project.request?.reference_number || "—"}</small></span>
                <span>{project.request?.selected_plan_code ? String(project.request.selected_plan_code).replaceAll("_", "-").toUpperCase() : "—"}</span>
                <span className={`admin-ops-status is-${project.status}`}>{project.status.replaceAll("_", " ")}</span>
                <span>{project.phase}/5</span>
                <span>{project.due_date ? date(project.due_date) : "—"}</span>
                <b>→</b>
              </Link>
            ))}
            {!projects.length && <p className="admin-overview-empty">No projects yet.</p>}
          </div>
        </div>

        <div className="admin-overview-panel">
          <div className="admin-overview-panel-head"><div><span>NEEDS ATTENTION</span><h2>Next actions.</h2></div></div>
          <div className="admin-attention-list">
            {attention.map(item => (
              <Link key={item.project.id} className={`is-priority-${item.priority}`} href={`/admin/projects?project=${encodeURIComponent(item.project.id)}`}>
                <i/>
                <div><strong>{item.project.title || item.project.request?.service || "Project"}</strong><p>{item.reason}</p><small>{item.project.client?.full_name || item.project.request?.name || "Client"}</small></div>
                <span>{item.meta}</span>
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
