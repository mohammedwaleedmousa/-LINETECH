"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage, useTranslation } from "../Localized";
import "./workspace.css";

type RequestRecord = {
  requestId: string;
  completedAt: string;
  status: string;
  customer: {
    name: string;
    company: string;
    contact: string;
    preferredContact: string;
  };
  project: {
    service: string;
    stage: string;
    goal: string;
    idea: string;
    audience: string;
    features: string;
    references: string;
  };
  scope: {
    budget: string;
    timing: string;
    notes: string;
  };
};

const serviceLabels: Record<string, { en: string; ar: string }> = {
  "Web Development": { en: "Web Development", ar: "تطوير المواقع" },
  "E-commerce & Systems": { en: "E-commerce & Systems", ar: "التجارة الإلكترونية والأنظمة" },
  "Brand Identity": { en: "Brand Identity", ar: "الهوية البصرية" },
  "CV & Portfolio": { en: "CV & Portfolio", ar: "السيرة الذاتية والملف المهني" },
  Other: { en: "Other", ar: "أخرى" },
};

const copy = {
  en: {
    kicker: "CLIENT WORKSPACE",
    title: "One place for the project line.",
    lead: "Your project request, progress, conversations, files and final handover are organized here in one clear workspace.",
    local: "Frontend workspace preview — this page reads the project request saved on this device.",
    noRequestTitle: "No project request on this device yet.",
    noRequestBody: "Complete a project request first. Once it is finished, this workspace will use that request as the starting point for the project view.",
    start: "Start project request",
    finder: "Find the right service",
    request: "PROJECT REQUEST",
    requestReady: "Request ready",
    completed: "Completed on this device",
    reference: "Reference",
    service: "Service",
    customer: "Customer",
    company: "Company / Brand",
    contact: "Preferred contact",
    goal: "Main goal",
    timing: "Timing",
    budget: "Budget",
    idea: "Project need",
    progress: "PROJECT FLOW",
    current: "Current position",
    phases: [
      ["01", "Request", "Your project request is prepared and ready for the next conversation."],
      ["02", "Scope & proposal", "Deliverables, timing, reviews and commercial terms are defined."],
      ["03", "Structure & build", "The agreed direction moves into design and execution."],
      ["04", "Review & launch", "Agreed revisions are completed and the project is prepared for launch."],
      ["05", "Handover", "Final files, access and agreed deliverables are handed over."],
    ],
    next: "NEXT ACTION",
    nextTitle: "Move the completed request into the project conversation.",
    nextBody: "Open the conversation area or review how the LINETECH process works before the project moves into scope.",
    chat: "Open project chat",
    process: "View how we work",
    files: "FILES & DELIVERABLES",
    filesTitle: "Nothing has been added yet.",
    filesBody: "Project files, review material and final deliverables will appear here as the project moves forward.",
    messages: "MESSAGES",
    messagesTitle: "Keep the project conversation in one place.",
    messagesBody: "Use the chat interface for project questions, files, photos or voice notes.",
    handover: "HANDOVER",
    handoverTitle: "Final ownership stays clear.",
    handoverBody: "The final handover area is designed for the agreed deployed product, source files, assets, access and credentials.",
    copyId: "Copy request ID",
    copied: "Copied",
    newRequest: "Prepare another request",
  },
  ar: {
    kicker: "مساحة العميل",
    title: "مكان واحد لمسار المشروع.",
    lead: "طلب المشروع والمراحل والمحادثات والملفات والتسليم النهائي منظمة هنا داخل مساحة عمل واحدة وواضحة.",
    local: "معاينة واجهة مساحة العميل — تقرأ هذه الصفحة طلب المشروع المحفوظ على هذا الجهاز.",
    noRequestTitle: "لا يوجد طلب مشروع على هذا الجهاز حتى الآن.",
    noRequestBody: "أكمل طلب مشروع أولًا. بعد إتمامه ستستخدم مساحة العميل هذا الطلب كنقطة بداية لعرض المشروع.",
    start: "ابدأ طلب المشروع",
    finder: "اعثر على الخدمة المناسبة",
    request: "طلب المشروع",
    requestReady: "الطلب جاهز",
    completed: "مكتمل على هذا الجهاز",
    reference: "الرقم المرجعي",
    service: "الخدمة",
    customer: "العميل",
    company: "الشركة / العلامة",
    contact: "التواصل المفضل",
    goal: "الهدف الرئيسي",
    timing: "التوقيت",
    budget: "الميزانية",
    idea: "احتياج المشروع",
    progress: "مسار المشروع",
    current: "الموضع الحالي",
    phases: [
      ["01", "الطلب", "تم تجهيز طلب المشروع وأصبح جاهزًا للانتقال إلى المحادثة التالية."],
      ["02", "النطاق والعرض", "يتم تحديد المخرجات والتوقيت والمراجعات والشروط التجارية."],
      ["03", "الهيكلة والبناء", "ينتقل الاتجاه المتفق عليه إلى التصميم والتنفيذ."],
      ["04", "المراجعة والإطلاق", "تكتمل التعديلات المتفق عليها ويجهز المشروع للإطلاق."],
      ["05", "التسليم", "يتم تسليم الملفات النهائية والصلاحيات والمخرجات المتفق عليها."],
    ],
    next: "الإجراء التالي",
    nextTitle: "انقل الطلب المكتمل إلى محادثة المشروع.",
    nextBody: "افتح مساحة المحادثة أو راجع طريقة عمل لاين تك قبل انتقال المشروع إلى مرحلة تحديد النطاق.",
    chat: "افتح محادثة المشروع",
    process: "شاهد كيف نعمل",
    files: "الملفات والمخرجات",
    filesTitle: "لم تتم إضافة ملفات بعد.",
    filesBody: "ستظهر ملفات المشروع ومواد المراجعة والمخرجات النهائية هنا مع تقدم المشروع.",
    messages: "المحادثات",
    messagesTitle: "اجعل محادثة المشروع في مكان واحد.",
    messagesBody: "استخدم واجهة المحادثة لأسئلة المشروع والملفات والصور والرسائل الصوتية.",
    handover: "التسليم",
    handoverTitle: "تبقى الملكية النهائية واضحة.",
    handoverBody: "منطقة التسليم النهائي مخصصة للمنتج المنشور والملفات المصدرية والأصول والصلاحيات وبيانات الدخول المتفق عليها.",
    copyId: "انسخ رقم الطلب",
    copied: "تم النسخ",
    newRequest: "جهز طلبًا آخر",
  },
} as const;

export default function WorkspaceClient() {
  const language = useLanguage();
  const translate = useTranslation();
  const t = copy[language];
  const [record, setRecord] = useState<RequestRecord | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("linetech-project-request-v1");
      if (raw) setRecord(JSON.parse(raw) as RequestRecord);
    } catch {}
    setLoaded(true);
  }, []);

  const completedDate = useMemo(() => {
    if (!record?.completedAt) return "";
    try {
      return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(record.completedAt));
    } catch {
      return "";
    }
  }, [record?.completedAt, language]);

  async function copyRequestId() {
    if (!record?.requestId) return;
    try {
      await navigator.clipboard.writeText(record.requestId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  if (!loaded) return <main className="workspace-page ref-page"><div className="workspace-loading" /></main>;

  return (
    <main className="workspace-page ref-page">
      <section className="workspace-hero">
        <div className="ref-shell workspace-hero-grid">
          <div>
            <p className="workspace-kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
          </div>
          <div className="workspace-hero-side">
            <p>{t.lead}</p>
            <span>{t.local}</span>
          </div>
        </div>
      </section>

      {!record ? (
        <section className="workspace-empty">
          <div className="ref-shell workspace-empty-card">
            <span>00 / NO REQUEST</span>
            <h2>{t.noRequestTitle}</h2>
            <p>{t.noRequestBody}</p>
            <div>
              <Link className="ref-btn primary" href="/start">{t.start} ↗</Link>
              <Link className="ref-btn ghost" href="/service-finder">{t.finder}</Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="workspace-overview">
            <div className="ref-shell workspace-overview-grid">
              <article className="workspace-request-card">
                <div className="workspace-card-top">
                  <div><p className="workspace-kicker">{t.request}</p><h2>{t.requestReady}</h2></div>
                  <span className="workspace-status"><i />{t.completed}</span>
                </div>

                <div className="workspace-request-id">
                  <div><span>{t.reference}</span><strong>{record.requestId}</strong></div>
                  <button type="button" onClick={copyRequestId}>{copied ? t.copied : t.copyId}</button>
                </div>

                <div className="workspace-request-meta">
                  <div><span>{t.service}</span><strong>{serviceLabels[record.project.service]?.[language] || translate(record.project.service)}</strong></div>
                  <div><span>{t.customer}</span><strong>{record.customer.name || "—"}</strong></div>
                  <div><span>{t.company}</span><strong>{record.customer.company || "—"}</strong></div>
                  <div><span>{t.contact}</span><strong>{translate(record.customer.preferredContact || "—")}</strong></div>
                  <div><span>{t.goal}</span><strong>{translate(record.project.goal || "—")}</strong></div>
                  <div><span>{t.timing}</span><strong>{translate(record.scope.timing || "—")}</strong></div>
                  <div><span>{t.budget}</span><strong>{translate(record.scope.budget || "—")}</strong></div>
                  <div><span>{t.idea}</span><strong>{record.project.idea || "—"}</strong></div>
                </div>

                <div className="workspace-request-foot">
                  <span>{completedDate}</span>
                  <Link href="/start">{t.newRequest} →</Link>
                </div>
              </article>

              <aside className="workspace-next-card">
                <p className="workspace-kicker">{t.next}</p>
                <h2>{t.nextTitle}</h2>
                <p>{t.nextBody}</p>
                <div>
                  <Link className="ref-btn primary" href="/chat">{t.chat} ↗</Link>
                  <Link className="ref-btn ghost" href="/how-we-work">{t.process}</Link>
                </div>
              </aside>
            </div>
          </section>

          <section className="workspace-flow">
            <div className="ref-shell">
              <div className="workspace-section-head">
                <p className="workspace-kicker">{t.progress}</p>
                <span>{t.current}: 01</span>
              </div>
              <div className="workspace-flow-grid">
                {t.phases.map(([n, title, description], index) => (
                  <article key={n} className={index === 0 ? "is-current" : ""}>
                    <span>{n}</span>
                    <i />
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="workspace-tools">
            <div className="ref-shell workspace-tools-grid">
              <article>
                <span>01</span><p className="workspace-kicker">{t.messages}</p><h3>{t.messagesTitle}</h3><p>{t.messagesBody}</p><Link href="/chat">{t.chat} →</Link>
              </article>
              <article>
                <span>02</span><p className="workspace-kicker">{t.files}</p><h3>{t.filesTitle}</h3><p>{t.filesBody}</p><b>—</b>
              </article>
              <article>
                <span>03</span><p className="workspace-kicker">{t.handover}</p><h3>{t.handoverTitle}</h3><p>{t.handoverBody}</p><b>—</b>
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
