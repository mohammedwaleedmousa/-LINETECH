"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage, useTranslation } from "../Localized";
import "./workspace.css";
import "./workspace-tracking.css";

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

type ProgressStatus = "ready" | "in-progress" | "review" | "complete";

type ProgressActivity = {
  id: string;
  title: string;
  detail?: string;
  at: string;
};

type ProgressFile = {
  id: string;
  name: string;
  status: "in-progress" | "ready" | "review" | "approved";
  detail?: string;
  updatedAt?: string;
  href?: string;
};

type ProgressAction = {
  required: boolean;
  title?: string;
  detail?: string;
  label?: string;
  href?: string;
};

type ProjectProgress = {
  requestId: string;
  currentPhase: number;
  status: ProgressStatus;
  updatedAt: string;
  latestUpdate?: string;
  nextMilestone?: string;
  nextMilestoneDate?: string;
  actionNeeded?: ProgressAction;
  activity?: ProgressActivity[];
  files?: ProgressFile[];
};

const progressStorageKey = "linetech-project-progress-v1";

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
    lead: "See where your project is now, what changed most recently, what comes next and whether LINETECH needs anything from you.",
    local: "Your project request and current project view are organized here.",
    noRequestCode: "00 / NO REQUEST",
    noRequestTitle: "No project request on this device yet.",
    noRequestBody: "Complete a project request first. Once it is finished, this workspace will use that request as the starting point for the project view.",
    start: "Start project request",
    finder: "Find the right service",
    tracking: "PROJECT STATUS",
    stage: "Current stage",
    phase: "Phase",
    lastUpdated: "Last updated",
    statusReady: "Request completed",
    statusInProgress: "In progress",
    statusReview: "Waiting for review",
    statusComplete: "Project complete",
    latest: "LATEST UPDATE",
    latestFallback: "Your project request was completed and is ready to move into scope and proposal.",
    nextMilestone: "NEXT MILESTONE",
    nextMilestoneFallback: "Scope & proposal",
    milestonePending: "A date will appear here when this milestone is scheduled.",
    action: "ACTION NEEDED FROM YOU",
    actionDefaultTitle: "Move the completed request into the project conversation.",
    actionDefaultBody: "Open project chat so the request can move into scope and proposal.",
    actionDefaultLabel: "Open project chat",
    noAction: "No action needed from you right now.",
    noActionBody: "You can follow the next update here when the project moves forward.",
    request: "PROJECT REQUEST",
    requestReady: "Request details",
    completed: "Saved request",
    reference: "Reference",
    service: "Service",
    customer: "Customer",
    company: "Company / Brand",
    contact: "Preferred contact",
    goal: "Main goal",
    timing: "Timing",
    budget: "Budget",
    idea: "Project need",
    progress: "PROJECT TIMELINE",
    current: "Current phase",
    phaseDone: "Completed",
    phaseCurrent: "Current",
    phaseUpcoming: "Upcoming",
    phases: [
      ["01", "Request", "Project request, goals and initial context are prepared."],
      ["02", "Scope & proposal", "Deliverables, timing, reviews and commercial terms are defined."],
      ["03", "Structure & build", "The agreed direction moves into design and execution."],
      ["04", "Review & launch", "Agreed revisions are completed and the project is prepared for launch."],
      ["05", "Handover", "Final files, access and agreed deliverables are handed over."],
    ],
    activity: "PROJECT ACTIVITY",
    activityTitle: "A clear record of what changed.",
    activityRequest: "Project request completed",
    activityRequestDetail: "The project request was completed and a reference number was created.",
    filesReview: "FILES & REVIEWS",
    filesReviewTitle: "Review material stays connected to the project stage.",
    filesEmpty: "No project files have been added for review yet.",
    filesEmptyBody: "When a design, document or deliverable is ready, it can appear here with its review status.",
    fileInProgress: "In progress",
    fileReady: "Ready",
    fileReview: "Ready for review",
    fileApproved: "Approved",
    next: "PROJECT CONVERSATION",
    nextTitle: "Keep the project context in one place.",
    nextBody: "Use the project conversation for questions, references, files and decisions while tracking the project status here.",
    chat: "Open project chat",
    process: "View how we work",
    files: "FILES & DELIVERABLES",
    filesTitle: "Project material stays organized.",
    filesBody: "Review material and final deliverables are connected to the project stages above.",
    messages: "MESSAGES",
    messagesTitle: "Keep the project conversation in one place.",
    messagesBody: "Use the chat interface for project questions, files, photos or voice notes.",
    handover: "HANDOVER",
    handoverTitle: "Final ownership stays clear.",
    handoverBody: "The final handover area is reserved for the agreed product, source files, assets, access and credentials.",
    handoverLocked: "Available at handover",
    copyId: "Copy request ID",
    copied: "Copied",
    newRequest: "Prepare another request",
  },
  ar: {
    kicker: "مساحة العميل",
    title: "مكان واحد لمسار المشروع.",
    lead: "شاهد أين وصل مشروعك الآن، وآخر تحديث، وما هي الخطوة القادمة، وهل تحتاج لاين تك شيئًا منك.",
    local: "طلب المشروع وحالته الحالية منظمان هنا داخل مساحة واحدة.",
    noRequestCode: "00 / لا يوجد طلب",
    noRequestTitle: "لا يوجد طلب مشروع على هذا الجهاز حتى الآن.",
    noRequestBody: "أكمل طلب مشروع أولًا. بعد إتمامه ستستخدم مساحة العميل هذا الطلب كنقطة بداية لعرض المشروع.",
    start: "ابدأ طلب المشروع",
    finder: "اعثر على الخدمة المناسبة",
    tracking: "حالة المشروع",
    stage: "المرحلة الحالية",
    phase: "المرحلة",
    lastUpdated: "آخر تحديث",
    statusReady: "تم إكمال الطلب",
    statusInProgress: "قيد التنفيذ",
    statusReview: "بانتظار المراجعة",
    statusComplete: "اكتمل المشروع",
    latest: "آخر تحديث",
    latestFallback: "تم إكمال طلب مشروعك وهو جاهز للانتقال إلى تحديد النطاق والعرض.",
    nextMilestone: "المحطة القادمة",
    nextMilestoneFallback: "النطاق والعرض",
    milestonePending: "سيظهر التاريخ هنا عند تحديد موعد هذه المرحلة.",
    action: "المطلوب منك",
    actionDefaultTitle: "انقل الطلب المكتمل إلى محادثة المشروع.",
    actionDefaultBody: "افتح محادثة المشروع حتى ينتقل الطلب إلى تحديد النطاق والعرض.",
    actionDefaultLabel: "افتح محادثة المشروع",
    noAction: "لا يوجد إجراء مطلوب منك الآن.",
    noActionBody: "يمكنك متابعة التحديث القادم هنا عند تقدم المشروع.",
    request: "طلب المشروع",
    requestReady: "تفاصيل الطلب",
    completed: "طلب محفوظ",
    reference: "الرقم المرجعي",
    service: "الخدمة",
    customer: "العميل",
    company: "الشركة / العلامة",
    contact: "التواصل المفضل",
    goal: "الهدف الرئيسي",
    timing: "التوقيت",
    budget: "الميزانية",
    idea: "احتياج المشروع",
    progress: "الجدول الزمني للمشروع",
    current: "المرحلة الحالية",
    phaseDone: "مكتملة",
    phaseCurrent: "الحالية",
    phaseUpcoming: "قادمة",
    phases: [
      ["01", "الطلب", "تم تجهيز طلب المشروع والأهداف والسياق الأولي."],
      ["02", "النطاق والعرض", "يتم تحديد المخرجات والتوقيت والمراجعات والشروط التجارية."],
      ["03", "الهيكلة والبناء", "ينتقل الاتجاه المتفق عليه إلى التصميم والتنفيذ."],
      ["04", "المراجعة والإطلاق", "تكتمل التعديلات المتفق عليها ويجهز المشروع للإطلاق."],
      ["05", "التسليم", "يتم تسليم الملفات النهائية والصلاحيات والمخرجات المتفق عليها."],
    ],
    activity: "نشاط المشروع",
    activityTitle: "سجل واضح لكل ما تغير.",
    activityRequest: "تم إكمال طلب المشروع",
    activityRequestDetail: "تم إكمال طلب المشروع وإنشاء رقم مرجعي له.",
    filesReview: "الملفات والمراجعات",
    filesReviewTitle: "تبقى مواد المراجعة مرتبطة بمرحلة المشروع.",
    filesEmpty: "لم تتم إضافة ملفات للمراجعة بعد.",
    filesEmptyBody: "عندما يصبح تصميم أو مستند أو مخرج جاهزًا، يمكن أن يظهر هنا مع حالة المراجعة.",
    fileInProgress: "قيد العمل",
    fileReady: "جاهز",
    fileReview: "جاهز للمراجعة",
    fileApproved: "تمت الموافقة",
    next: "محادثة المشروع",
    nextTitle: "اجعل سياق المشروع في مكان واحد.",
    nextBody: "استخدم محادثة المشروع للأسئلة والمراجع والملفات والقرارات، وتابع حالة المشروع من هذه الصفحة.",
    chat: "افتح محادثة المشروع",
    process: "شاهد كيف نعمل",
    files: "الملفات والمخرجات",
    filesTitle: "تبقى مواد المشروع منظمة.",
    filesBody: "ترتبط مواد المراجعة والمخرجات النهائية بمراحل المشروع الموضحة أعلاه.",
    messages: "المحادثات",
    messagesTitle: "اجعل محادثة المشروع في مكان واحد.",
    messagesBody: "استخدم واجهة المحادثة لأسئلة المشروع والملفات والصور والرسائل الصوتية.",
    handover: "التسليم",
    handoverTitle: "تبقى الملكية النهائية واضحة.",
    handoverBody: "منطقة التسليم النهائي مخصصة للمنتج والملفات المصدرية والأصول والصلاحيات وبيانات الدخول المتفق عليها.",
    handoverLocked: "متاح عند التسليم",
    copyId: "انسخ رقم الطلب",
    copied: "تم النسخ",
    newRequest: "جهز طلبًا آخر",
  },
} as const;

function clampPhase(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function makeDefaultProgress(record: RequestRecord): ProjectProgress {
  return {
    requestId: record.requestId,
    currentPhase: 1,
    status: "ready",
    updatedAt: record.completedAt,
    activity: [],
    files: [],
  };
}

export default function WorkspaceClient() {
  const language = useLanguage();
  const translate = useTranslation();
  const t = copy[language];
  const [record, setRecord] = useState<RequestRecord | null>(null);
  const [progressRecord, setProgressRecord] = useState<ProjectProgress | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("linetech-project-request-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as RequestRecord;
        setRecord(parsed);

        const progressRaw = window.localStorage.getItem(progressStorageKey);
        if (progressRaw) {
          const parsedProgress = JSON.parse(progressRaw) as ProjectProgress;
          if (parsedProgress?.requestId === parsed.requestId) {
            setProgressRecord({
              ...parsedProgress,
              currentPhase: clampPhase(parsedProgress.currentPhase),
              status: parsedProgress.status || "ready",
              updatedAt: parsedProgress.updatedAt || parsed.completedAt,
              activity: Array.isArray(parsedProgress.activity) ? parsedProgress.activity : [],
              files: Array.isArray(parsedProgress.files) ? parsedProgress.files : [],
            });
          } else {
            const fallback = makeDefaultProgress(parsed);
            setProgressRecord(fallback);
            window.localStorage.setItem(progressStorageKey, JSON.stringify(fallback));
          }
        } else {
          const fallback = makeDefaultProgress(parsed);
          setProgressRecord(fallback);
          window.localStorage.setItem(progressStorageKey, JSON.stringify(fallback));
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  const completedDate = useMemo(() => formatDate(record?.completedAt || "", language), [record?.completedAt, language]);
  const progress = record ? progressRecord || makeDefaultProgress(record) : null;
  const currentPhase = progress ? clampPhase(progress.currentPhase) : 1;
  const phaseIndex = currentPhase - 1;
  const currentPhaseCopy = t.phases[phaseIndex];
  const latestUpdate = progress?.latestUpdate || t.latestFallback;
  const nextPhase = currentPhase < 5 ? t.phases[currentPhase] : null;
  const nextMilestone = progress?.nextMilestone || nextPhase?.[1] || t.statusComplete;
  const activities = useMemo<ProgressActivity[]>(() => {
    if (!record) return [];
    if (progress?.activity?.length) return progress.activity;
    return [{ id: "request-completed", title: t.activityRequest, detail: t.activityRequestDetail, at: record.completedAt }];
  }, [record, progress?.activity, t.activityRequest, t.activityRequestDetail]);
  const projectFiles = progress?.files || [];

  const statusLabel = progress?.status === "complete"
    ? t.statusComplete
    : progress?.status === "review"
      ? t.statusReview
      : progress?.status === "in-progress"
        ? t.statusInProgress
        : t.statusReady;

  const defaultAction: ProgressAction = currentPhase === 1
    ? { required: true, title: t.actionDefaultTitle, detail: t.actionDefaultBody, label: t.actionDefaultLabel, href: "/chat" }
    : { required: false };
  const clientAction = progress?.actionNeeded || defaultAction;

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
            <span>{t.noRequestCode}</span>
            <h2>{t.noRequestTitle}</h2>
            <p>{t.noRequestBody}</p>
            <div>
              <Link className="ref-btn primary" href="/start">{t.start} ↗</Link>
              <Link className="ref-btn ghost" href="/service-finder">{t.finder}</Link>
            </div>
          </div>
        </section>
      ) : progress ? (
        <>
          <section className="workspace-tracking">
            <div className="ref-shell">
              <div className="workspace-tracking-head">
                <p className="workspace-kicker">{t.tracking}</p>
                <span>{record.requestId}</span>
              </div>

              <div className="workspace-tracking-grid">
                <article className="workspace-stage-card">
                  <div className="workspace-stage-top">
                    <div>
                      <span>{t.stage}</span>
                      <h2>{currentPhaseCopy[1]}</h2>
                    </div>
                    <span className={`workspace-live-status is-${progress.status}`}><i />{statusLabel}</span>
                  </div>
                  <p>{currentPhaseCopy[2]}</p>
                  <div className="workspace-stage-meter" aria-label={`${t.phase} ${currentPhase} / 5`}>
                    {t.phases.map((phase, index) => {
                      const number = index + 1;
                      const state = progress.status === "complete" && currentPhase === 5
                        ? "done"
                        : number < currentPhase
                          ? "done"
                          : number === currentPhase
                            ? "current"
                            : "upcoming";
                      return <div key={phase[0]} className={`is-${state}`}><i /><span>{phase[0]}</span></div>;
                    })}
                  </div>
                  <div className="workspace-stage-foot">
                    <span>{t.phase} {String(currentPhase).padStart(2, "0")} / 05</span>
                    <span>{t.lastUpdated}: {formatDate(progress.updatedAt, language)}</span>
                  </div>
                </article>

                <div className="workspace-tracking-side">
                  <article>
                    <span>{t.latest}</span>
                    <h3>{latestUpdate}</h3>
                    <small>{formatDate(progress.updatedAt, language)}</small>
                  </article>
                  <article>
                    <span>{t.nextMilestone}</span>
                    <h3>{nextMilestone}</h3>
                    <small>{progress.nextMilestoneDate ? formatDate(progress.nextMilestoneDate, language) : t.milestonePending}</small>
                  </article>
                  <article className={clientAction.required ? "needs-action" : "no-action"}>
                    <span>{t.action}</span>
                    <h3>{clientAction.required ? clientAction.title || t.actionDefaultTitle : t.noAction}</h3>
                    <p>{clientAction.required ? clientAction.detail || t.actionDefaultBody : t.noActionBody}</p>
                    {clientAction.required && clientAction.href && <Link href={clientAction.href}>{clientAction.label || t.actionDefaultLabel} →</Link>}
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="workspace-flow">
            <div className="ref-shell">
              <div className="workspace-section-head">
                <p className="workspace-kicker">{t.progress}</p>
                <span>{t.current}: {String(currentPhase).padStart(2, "0")}</span>
              </div>
              <div className="workspace-flow-grid workspace-flow-tracking">
                {t.phases.map(([n, title, description], index) => {
                  const number = index + 1;
                  const isDone = progress.status === "complete" && currentPhase === 5 ? number <= 5 : number < currentPhase;
                  const isCurrent = !isDone && number === currentPhase;
                  const stateLabel = isDone ? t.phaseDone : isCurrent ? t.phaseCurrent : t.phaseUpcoming;
                  return (
                    <article key={n} className={`${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}>
                      <div className="workspace-phase-label"><span>{n}</span><b>{stateLabel}</b></div>
                      <i />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="workspace-workstream">
            <div className="ref-shell workspace-workstream-grid">
              <article className="workspace-activity-card">
                <p className="workspace-kicker">{t.activity}</p>
                <h2>{t.activityTitle}</h2>
                <div className="workspace-activity-list">
                  {activities.map((item, index) => (
                    <div key={item.id || `${item.at}-${index}`}>
                      <i />
                      <div>
                        <span>{formatDate(item.at, language)}</span>
                        <strong>{item.title}</strong>
                        {item.detail && <p>{item.detail}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="workspace-files-card">
                <p className="workspace-kicker">{t.filesReview}</p>
                <h2>{t.filesReviewTitle}</h2>
                {projectFiles.length ? (
                  <div className="workspace-file-list">
                    {projectFiles.map(file => (
                      <div key={file.id}>
                        <div>
                          <strong>{file.name}</strong>
                          {file.detail && <p>{file.detail}</p>}
                          {file.updatedAt && <small>{formatDate(file.updatedAt, language)}</small>}
                        </div>
                        <span className={`file-status is-${file.status}`}>{fileStatusLabel(file.status, t)}</span>
                        {file.href && <a href={file.href} target="_blank" rel="noreferrer">↗</a>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="workspace-files-empty">
                    <span>—</span>
                    <strong>{t.filesEmpty}</strong>
                    <p>{t.filesEmptyBody}</p>
                  </div>
                )}
              </article>
            </div>
          </section>

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

          <section className="workspace-tools">
            <div className="ref-shell workspace-tools-grid">
              <article>
                <span>01</span><p className="workspace-kicker">{t.messages}</p><h3>{t.messagesTitle}</h3><p>{t.messagesBody}</p><Link href="/chat">{t.chat} →</Link>
              </article>
              <article>
                <span>02</span><p className="workspace-kicker">{t.files}</p><h3>{t.filesTitle}</h3><p>{t.filesBody}</p><b>—</b>
              </article>
              <article className={currentPhase < 5 ? "is-locked" : ""}>
                <span>03</span><p className="workspace-kicker">{t.handover}</p><h3>{t.handoverTitle}</h3><p>{t.handoverBody}</p><b>{currentPhase < 5 ? t.handoverLocked : "✓"}</b>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

function formatDate(value: string, language: "ar" | "en") {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function fileStatusLabel(status: ProgressFile["status"], t: (typeof copy)["en"] | (typeof copy)["ar"]) {
  if (status === "approved") return t.fileApproved;
  if (status === "review") return t.fileReview;
  if (status === "ready") return t.fileReady;
  return t.fileInProgress;
}
