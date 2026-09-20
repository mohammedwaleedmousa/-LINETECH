"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../Localized";

type HandoverItem = {
  id: string;
  title: string;
  description?: string | null;
  completed?: boolean;
  completed_at?: string | null;
};

const copy = {
  en: {
    kicker: "PROJECT HANDOVER",
    title: "Everything final, in one place.",
    lead: "Final access, files and delivery items appear here when the project reaches handover.",
    locked: "Handover is not available yet.",
    lockedBody: "This area unlocks automatically when the project reaches phase 05 or is marked complete.",
    back: "Back to Workspace",
    empty: "No handover items have been added yet.",
    completed: "Completed",
    pending: "Pending",
  },
  ar: {
    kicker: "تسليم المشروع",
    title: "كل ما هو نهائي، في مكان واحد.",
    lead: "تظهر هنا بيانات الوصول والملفات وعناصر التسليم النهائية عندما يصل المشروع إلى مرحلة التسليم.",
    locked: "التسليم غير متاح بعد.",
    lockedBody: "تفتح هذه المنطقة تلقائيًا عندما يصل المشروع إلى المرحلة 05 أو يتم تحديد المشروع كمكتمل.",
    back: "العودة إلى مساحة العمل",
    empty: "لم تتم إضافة عناصر تسليم بعد.",
    completed: "مكتمل",
    pending: "قيد الانتظار",
  },
} as const;

export default function HandoverClient() {
  const language = useLanguage();
  const t = copy[language];
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(true);
  const [items, setItems] = useState<HandoverItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/handover", { cache: "no-store" });
        if (response.status === 401) {
          window.location.assign("/login?next=/handover");
          return;
        }
        const payload = await response.json().catch(() => null) as {
          ok?: boolean;
          locked?: boolean;
          items?: HandoverItem[];
        } | null;
        if (!response.ok || !payload?.ok) throw new Error();
        if (!cancelled) {
          setLocked(Boolean(payload.locked));
          setItems(Array.isArray(payload.items) ? payload.items : []);
        }
      } catch {
        if (!cancelled) setError("handover");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!loaded) return <main className="handover-page"><div className="handover-state" /></main>;

  return (
    <main className="handover-page">
      <section className="handover-shell">
        <div className="handover-head">
          <span>{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>

        {error ? (
          <div className="handover-panel">
            <strong>Unable to load handover.</strong>
            <Link href="/workspace">{t.back} →</Link>
          </div>
        ) : locked ? (
          <div className="handover-panel is-locked">
            <span>05</span>
            <h2>{t.locked}</h2>
            <p>{t.lockedBody}</p>
            <Link href="/workspace">{t.back} →</Link>
          </div>
        ) : (
          <div className="handover-content">
            <div className="handover-list">
              {items.length ? items.map((item, index) => (
                <article key={item.id} className={item.completed ? "is-complete" : ""}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{item.title}</strong>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <b>{item.completed ? t.completed : t.pending}</b>
                </article>
              )) : <div className="handover-empty">{t.empty}</div>}
            </div>
            <Link className="handover-back" href="/workspace">{t.back} →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
