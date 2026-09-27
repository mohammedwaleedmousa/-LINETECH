"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../Localized";
import ClientProjectSwitcher from "../ClientProjectSwitcher";

type HandoverItem = {
  id: string;
  title: string;
  description?: string | null;
  completed?: boolean;
  completed_at?: string | null;
};

type HandoverFile = {
  id: string;
  name: string;
  category?: string;
  status?: string;
  detail?: string;
  updatedAt?: string;
  href?: string;
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
    files: "FINAL FILES",
    filesTitle: "Your delivery files.",
    noFiles: "No final files are available yet.",
    download: "Download",
    refresh: "Refresh handover",
    retry: "Try again",
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
    files: "الملفات النهائية",
    filesTitle: "ملفات تسليم مشروعك.",
    noFiles: "لا توجد ملفات نهائية متاحة حتى الآن.",
    download: "تحميل",
    refresh: "تحديث التسليم",
    retry: "إعادة المحاولة",
  },
} as const;

function requestedProjectSuffix() {
  if (typeof window === "undefined") return "";
  const project = new URLSearchParams(window.location.search).get("project") || "";
  return /^[0-9a-f-]{36}$/i.test(project) ? `?project=${encodeURIComponent(project)}` : "";
}

function projectHref(path: string, projectId?: string | null) {
  return projectId ? `${path}?project=${encodeURIComponent(projectId)}` : path;
}

export default function HandoverClient() {
  const language = useLanguage();
  const t = copy[language];
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(true);
  const [items, setItems] = useState<HandoverItem[]>([]);
  const [files, setFiles] = useState<HandoverFile[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const loadHandover = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setError("");
    try {
      const response = await fetch(`/api/handover${requestedProjectSuffix()}`, { cache: "no-store" });
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      const payload = await response.json().catch(() => null) as {
        ok?: boolean;
        projectId?: string | null;
        locked?: boolean;
        items?: HandoverItem[];
        files?: HandoverFile[];
      } | null;
      if (!response.ok || !payload?.ok) throw new Error();
      setCurrentProjectId(payload.projectId || null);
      setLocked(Boolean(payload.locked));
      setItems(Array.isArray(payload.items) ? payload.items : []);
      setFiles(Array.isArray(payload.files) ? payload.files : []);
    } catch {
      setError("handover");
    } finally {
      setLoaded(true);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadHandover();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void loadHandover();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [loadHandover]);

  if (!loaded) return <main className="handover-page"><div className="handover-state" /></main>;

  return (
    <main className="handover-page">
      <section className="handover-shell">
        <div className="handover-head">
          <span>{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <ClientProjectSwitcher currentProjectId={currentProjectId} className="handover-project-switcher" />
        </div>

        {error ? (
          <div className="handover-panel">
            <strong>{language === "ar" ? "تعذر تحميل التسليم." : "Unable to load handover."}</strong>
            <div className="handover-panel-actions">
              <button type="button" onClick={() => void loadHandover(true)} disabled={refreshing}>{refreshing ? "…" : t.retry}</button>
              <Link href={projectHref("/workspace", currentProjectId)}>{t.back} →</Link>
            </div>
          </div>
        ) : locked ? (
          <div className="handover-panel is-locked">
            <span>05</span>
            <h2>{t.locked}</h2>
            <p>{t.lockedBody}</p>
            <Link href={projectHref("/workspace", currentProjectId)}>{t.back} →</Link>
          </div>
        ) : (
          <div className="handover-content">
            <div className="handover-toolbar">
              <span>{items.filter(item => item.completed).length}/{items.length || 0} {t.completed}</span>
              <button type="button" onClick={() => void loadHandover(true)} disabled={refreshing}>{refreshing ? "…" : t.refresh}</button>
            </div>

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

            <section className="handover-files">
              <div className="handover-files-head">
                <span>{t.files}</span>
                <h2>{t.filesTitle}</h2>
              </div>
              {files.length ? (
                <div className="handover-file-list">
                  {files.map(file => (
                    <article key={file.id}>
                      <div>
                        <strong>{file.name}</strong>
                        {file.detail && <p>{file.detail}</p>}
                        <small>{file.status || "ready"}</small>
                      </div>
                      {file.href && <a href={file.href} target="_blank" rel="noreferrer">{t.download} ↓</a>}
                    </article>
                  ))}
                </div>
              ) : <div className="handover-empty">{t.noFiles}</div>}
            </section>

            <Link className="handover-back" href={projectHref("/workspace", currentProjectId)}>{t.back} →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
