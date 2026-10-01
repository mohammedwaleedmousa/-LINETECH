"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Json = Record<string, any>;

function money(value: unknown) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(value || 0));
}
function date(value?: string | null) {
  if (!value) return "—";
  try { return new Date(value).toLocaleDateString(); } catch { return "—"; }
}
function aging(row: Json) {
  const days = Number(row.days_overdue || 0);
  if (row.status === "cancelled") return { label: "CANCELLED", tone: "quiet" };
  if (row.status === "suspended") return { label: "SUSPENDED", tone: "danger" };
  if (days >= 30) return { label: `30+ DAYS · SUSPEND`, tone: "danger" };
  if (days >= 14) return { label: `${days} DAYS · PAST DUE`, tone: "warn" };
  if (days >= 7) return { label: `${days} DAYS · REMINDER`, tone: "warn" };
  if (days > 0) return { label: `${days} DAYS OVERDUE`, tone: "warn" };
  return { label: String(row.status || "active").replaceAll("_", " ").toUpperCase(), tone: "ok" };
}

export default function BillingClient() {
  const [summary, setSummary] = useState<Json>({});
  const [rows, setRows] = useState<Json[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/billing", { cache: "no-store" });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) throw new Error();
      setSummary(payload.summary || {});
      setRows(Array.isArray(payload.subscriptions) ? payload.subscriptions : []);
    } catch {
      setError("Billing data could not be loaded.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  const attention = useMemo(() => rows.filter(row => Number(row.days_overdue || 0) > 0 || ["past_due","suspended"].includes(String(row.status))), [rows]);

  if (loading) return <main className="admin-overview"><div className="admin-overview-state">Loading billing…</div></main>;

  return <main className="admin-overview admin-billing">
    <header className="admin-overview-head">
      <div><span>LINETECH / BILLING</span><h1>Subscription revenue.</h1><p>Recurring revenue, renewal dates and overdue client accounts.</p></div>
      <button type="button" onClick={() => void load()}>Refresh</button>
    </header>
    {error && <div className="admin-overview-error">{error}</div>}

    <section className="admin-kpi-grid billing-kpis">
      <article><span>MRR</span><strong>{money(summary.mrr)}</strong><small>Active + past due recurring value</small></article>
      <article><span>ACTIVE</span><strong>{summary.active || 0}</strong><small>Active paying subscriptions</small></article>
      <article><span>PAST DUE</span><strong>{summary.pastDue || 0}</strong><small>Payment attention required</small></article>
      <article><span>SUSPENDED</span><strong>{summary.suspended || 0}</strong><small>Service currently suspended</small></article>
      <article><span>OVERDUE VALUE</span><strong>{money(summary.overdueAmount)}</strong><small>Recurring value past its billing date</small></article>
      <article><span>SUBSCRIPTIONS</span><strong>{rows.length}</strong><small>All commercial subscriptions</small></article>
    </section>

    <section className="admin-overview-panel billing-table-panel">
      <div className="admin-overview-panel-head"><div><span>SUBSCRIPTIONS</span><h2>Client billing.</h2></div><small>{attention.length} need attention</small></div>
      <div className="billing-list">
        {rows.map(row => {
          const state=aging(row);
          return <article key={row.id}>
            <div className="billing-client"><span>{row.client?.company || row.client?.full_name || "Client"}</span><strong>{row.plan?.name || String(row.plan_code).toUpperCase()}</strong><small>{row.client?.email || row.client_id}</small></div>
            <div><span>MONTHLY</span><strong>{money(row.recurring_price_usd)}</strong></div>
            <div><span>NEXT BILLING</span><strong>{date(row.next_billing_at)}</strong></div>
            <div><span>STATUS</span><strong className={`billing-state is-${state.tone}`}>{state.label}</strong></div>
            <Link href={row.project?.id ? `/admin/projects?project=${encodeURIComponent(row.project.id)}` : "/admin/clients"}>{row.project?.id ? "Manage project →" : "Open client →"}</Link>
          </article>;
        })}
        {!rows.length && <p className="admin-overview-empty">No commercial subscriptions yet. Activate a plan from a client project.</p>}
      </div>
    </section>

    <section className="billing-policy">
      <span>COLLECTION POLICY</span>
      <div><strong>Day 7</strong><p>Payment reminder</p></div>
      <div><strong>Day 14</strong><p>Mark Past Due</p></div>
      <div><strong>Day 30</strong><p>Suspend website/service</p></div>
      <small>These are operational indicators in V1. Automatic emails and suspension actions are not executed until the automation layer is enabled.</small>
    </section>
  </main>;
}
