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
  const [loading, setLoading] = useState(true);\n  const [billing, setBilling] = useState<Json>({ subscriptions: [] });\n  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [pr, ur, br] = await Promise.all([
          fetch("/api/admin/projects", { cache: "no-store" }),
          fetch("/api/admin/users", { cache: "no-store" }),
        ]);
        const [pp, up, bp] = await Promise.all([pr.json().catch(() => null), ur.json().catch(() => null), br.json().catch(() => null)]);
        if (!cancelled) {
          if (pr.ok && pp?.ok) setProjects(Array.isArray(pp.projects) ? pp.projects : []);
          if (ur.ok && up?.ok) setUsers(Array.isArray(up.users) ? up.users : []);\n          if (br.ok && bp?.ok) setBilling(bp);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return (
    <main className="admin-directory admin-clients-v2">
      <header className="admin-directory-head">
        <div><span>LINETECH / CLIENTS</span><h1>Client relationships.</h1><p>Commercial and project context in one laptop workspace.</p></div>
        <strong>{clients.length}</strong>
      </header>

      <div className="admin-client-crm">
        <aside className="admin-client-crm-list">
          <div className="admin-directory-tools">
            <input value={query} onChange={e => setQuery(e.target.value)} type="search" placeholder="Search client, company, email…" />
          </div>
          {loading ? <p className="admin-overview-empty">Loading clients…</p> : clients.map(item => {
            const subscription = (Array.isArray(billing.subscriptions) ? billing.subscriptions : []).find((row: Json) => String(row.client_id || "") === item.id);
            const active = item.projects.filter(p => !["completed","archived"].includes(p.status)).length;
            return <button key={item.id} type="button" className={selected?.id === item.id ? "is-active" : ""} onClick={() => setSelectedId(item.id)}>
              <span>{item.profile?.company || "CLIENT"}</span>
              <strong>{item.profile?.full_name || item.projects[0]?.request?.name || "Client"}</strong>
              <small>{active} active · {subscription?.status ? String(subscription.status).replaceAll("_"," ") : "no subscription"}</small>
            </button>;
          })}
          {!loading && !clients.length && <p className="admin-overview-empty">No clients match this search.</p>}
        </aside>

        <section className="admin-client-crm-detail">
          {!selected ? <p className="admin-overview-empty">Select a client.</p> : <>
            <div className="admin-client-crm-head">
              <div><span>{selected.profile?.company || "CLIENT"}</span><h2>{selected.profile?.full_name || selectedLatest?.request?.name || "Client"}</h2><p>{selected.profile?.email || selected.profile?.phone || selectedLatest?.request?.contact || "No contact saved"}</p></div>
              {selectedLatest && <Link href={`/admin/projects?project=${encodeURIComponent(selectedLatest.id)}`}>Open latest project →</Link>}
            </div>

            <div className="admin-client-crm-kpis">
              <div><span>PROJECTS</span><strong>{selected.projects.length}</strong></div>
              <div><span>ACTIVE</span><strong>{selectedActive}</strong></div>
              <div><span>COMPLETED</span><strong>{selectedCompleted}</strong></div>
              <div><span>SUBSCRIPTION</span><strong>{selectedSubscription?.status ? String(selectedSubscription.status).replaceAll("_"," ").toUpperCase() : "NOT ACTIVE"}</strong></div>
              <div><span>RECURRING</span><strong>{selectedSubscription?.recurring_price_usd != null ? `$${Number(selectedSubscription.recurring_price_usd).toLocaleString()}/mo` : "—"}</strong></div>
              <div><span>NEXT BILLING</span><strong>{selectedSubscription?.next_billing_at ? new Date(selectedSubscription.next_billing_at).toLocaleDateString() : "—"}</strong></div>
            </div>

            {selectedSubscription?.status === "past_due" && <div className="admin-client-past-due"><strong>Payment past due</strong><span>${Number(selectedSubscription.recurring_price_usd || 0).toLocaleString()} recurring value requires attention.</span></div>}

            <div className="admin-client-crm-columns">
              <section>
                <div className="admin-overview-panel-head"><div><span>PROJECT HISTORY</span><h2>Client work.</h2></div></div>
                <div className="admin-client-crm-projects">
                  {selected.projects.map(project => <Link key={project.id} href={`/admin/projects?project=${encodeURIComponent(project.id)}`}>
                    <div><span>{project.request?.reference_number || "PROJECT"}</span><strong>{project.title || project.request?.service || "Project"}</strong><small>{project.request?.selected_plan_code ? String(project.request.selected_plan_code).replaceAll("_","-").toUpperCase() : "NO PLAN"}</small></div>
                    <div><strong>{project.status.replaceAll("_"," ")}</strong><small>Phase {project.phase}/5</small></div><b>→</b>
                  </Link>)}
                  {!selected.projects.length && <p className="admin-overview-empty">No projects yet.</p>}
                </div>
              </section>

              <section>
                <div className="admin-overview-panel-head"><div><span>RELATIONSHIP</span><h2>Account context.</h2></div></div>
                <div className="admin-client-account-context">
                  <div><span>Email</span><strong>{selected.profile?.email || "—"}</strong></div>
                  <div><span>Phone</span><strong>{selected.profile?.phone || "—"}</strong></div>
                  <div><span>Company</span><strong>{selected.profile?.company || "—"}</strong></div>
                  <div><span>Plan</span><strong>{selectedSubscription?.plan?.name || selectedSubscription?.plan_code || "—"}</strong></div>
                  <div><span>Billing status</span><strong>{selectedSubscription?.status || "Not active"}</strong></div>
                  <div><span>Latest project update</span><strong>{selectedLatest?.updated_at ? new Date(selectedLatest.updated_at).toLocaleString() : "—"}</strong></div>
                </div>
              </section>
            </div>
          </>}
        </section>
      </div>
    </main>
  );
}\n}\n