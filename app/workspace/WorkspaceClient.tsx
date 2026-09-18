"use client";

import ContentHeroArt from "../ContentHeroArt";
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
    lead: "Follow the project without the noise. See the current stage, the latest change and what comes next.",
    local: "Your project request and progress stay connected here.",
    noRequestCode: "00 / NO REQUEST",
    noRequestTitle: "No project request on this device yet.",
    noRequestBody: "Complete a project request first. Once it is finished, this workspace will use it as the starting point for your project view.",
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
    latest: "Latest update",
    latestFallback: "Your project request is complete and ready to move into scope and proposal.",
    nextMilestone: "Next",
    milestonePending: "Scheduling will appear here once confirmed.",
    action: "ACTION REQUIRED",
    actionDefaultTitle: "Move the completed request into the project conversation.",
    actionDefaultBody: "Open project chat so the request can move into scope and proposal.",
    actionDefaultLabel: "Open project chat",
    noAction: "No action needed right now.",
    noActionBody: "The next update will appear here when the project moves forward.",
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
    activity: "RECENT ACTIVITY",
    activityTitle: "What changed, in order.",
    activityRequest: "Project request completed",
    activityRequestDetail: "The project request was completed and a reference number was created.",
    filesReview: "FILES & REVIEWS",
    filesReviewTitle: "Only what needs your attention.",
    filesEmpty: "No project files have been added yet.",
    filesEmptyBody: "Designs, documents and review material will appear here when they are ready.",
    fileInProgress: "In progress",
    fileReady: "Ready",
    fileReview: "Ready for review",
    fileApproved: "Approved",
    brief: "PROJECT BRIEF",
    briefTitle: "The request, without the clutter.",
    viewBrief: "View project brief",
    hideBrief: "Hide project brief",
    request: "Reference",
    service: "Service",
    customer: "Customer",
    company: "Company / Brand",
    contact: "Preferred contact",
    goal: "Main goal",
    timing: "Timing",
    budget: "Budget",
    idea: "Project need",
    copyId: "Copy request ID",
    copied: "Copied",
    newRequest: "Prepare another request",
    tools: "PROJECT TOOLS",
    conversation: "Conversation",
    files: "Files",
    handover: "Handover",
    handoverLocked: "Available at handover",
  },
  ar: {
    kicker: "مساحة العميل",
    title: "مكان واحد لمسار المشروع.",
    lead: "تابع مشروعك بدون ضوضاء. اعرف المرحلة الحالية، آخر ما تغير، وما الذي يأتي بعدها.",
    local: "طلب المشروع وتقدمه يبقيان مرتبطين هنا.",
    noRequestCode: "00 / لا يوجد طلب",
    noRequestTitle: "لا يوجد طلب مشروع على هذا الجهاز حتى الآن.",
    noRequestBody: "أكمل طلب مشروع أولًا. بعد إتمامه ستستخدم مساحة العميل هذا الطلب كنقطة بداية لعرض مشروعك.",
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
    latestFallback: "اكتمل طلب مشروعك وهو جاهز للانتقال إلى تحديد النطاق والعرض.",
    nextMilestone: "التالي",
    milestonePending: "سيظهر الموعد هنا بعد اعتماده.",
    action: "إجراء مطلوب",
    actionDefaultTitle: "انقل الطلب المكتمل إلى محادثة المشروع.",
    actionDefaultBody: "افتح محادثة المشروع حتى ينتقل الطلب إلى تحديد النطاق والعرض.",
    actionDefaultLabel: "افتح محادثة المشروع",
    noAction: "لا يوجد إجراء مطلوب الآن.",
    noActionBody: "سيظهر التحديث التالي هنا عندما يتقدم المشروع.",
    progress: "مسار المشروع",
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
    activity: "آخر النشاط",
    activityTitle: "ما الذي تغير، بترتيب واضح.",
    activityRequest: "تم إكمال طلب المشروع",
    activityRequestDetail: "تم إكمال طلب المشروع وإنشاء رقم مرجعي له.",
    filesReview: "الملفات والمراجعات",
    filesReviewTitle: "فقط ما يحتاج انتباهك.",
    filesEmpty: "لم تتم إضافة ملفات للمشروع بعد.",
    filesEmptyBody: "ستظهر التصاميم والمستندات ومواد المراجعة هنا عندما تصبح جاهزة.",
    fileInProgress: "قيد العمل",
    fileReady: "جاهز",
    fileReview: "جاهز للمراجعة",
    fileApproved: "تمت الموافقة",
    brief: "ملخص المشروع",
    briefTitle: "تفاصيل الطلب، بدون ازدحام.",
    viewBrief: "عرض تفاصيل المشروع",
    hideBrief: "إخفاء تفاصيل المشروع",
    request: "الرقم المرجعي",
    service: "الخدمة",
    customer: "العميل",
    company: "الشركة / العلامة",
    contact: "التواصل المفضل",
    goal: "الهدف الرئيسي",
    timing: "التوقيت",
    budget: "الميزانية",
    idea: "احتياج المشروع",
    copyId: "انسخ رقم الطلب",
    copied: "تم النسخ",
    newRequest: "جهز طلبًا آخر",
    tools: "أدوات المشروع",
    conversation: "المحادثة",
    files: "الملفات",
    handover: "التسليم",
    handoverLocked: "متاح عند التسليم",
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

  const completedDate = useMemo(
    () => formatDate(record?.completedAt || "", language),
    [record?.completedAt, language],
  );

  const progress = record ? progressRecord || makeDefaultProgress(record) : null;
  const currentPhase = progress ? clampPhase(progress.currentPhase) : 1;
  const currentPhaseCopy = t.phases[currentPhase - 1];
  const latestUpdate = progress?.latestUpdate || t.latestFallback;
  const nextPhase = currentPhase < 5 ? t.phases[currentPhase] : null;
  const nextMilestone = progress?.nextMilestone || nextPhase?.[1] || t.statusComplete;

  const activities = useMemo<ProgressActivity[]>(() => {
    if (!record) return [];
    if (progress?.activity?.length) return progress.activity;
    return [{
      id: "request-completed",
      title: t.activityRequest,
      detail: t.activityRequestDetail,
      at: record.completedAt,
    }];
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
    ? {
        required: true,
        title: t.actionDefaultTitle,
        detail: t.actionDefaultBody,
        label: t.actionDefaultLabel,
        href: "/chat",
      }
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

  if (!loaded) {
    return <main className="workspace-page ref-page"><div className="workspace-loading" /></main>;
  }

  return (
    <main className="workspace-page ref-page">
      <section className="workspace-hero" data-content-hero="workspace">
        <ContentHeroArt motif="workspace" />
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
          <section className="workspace-status-section">
            <div className="ref-shell">
              <div className="workspace-section-eyebrow">
                <p className="workspace-kicker">{t.tracking}</p>
                <span>{record.requestId}</span>
              </div>

              <div className="workspace-status-main">
                <div className="workspace-status-copy">
                  <span>{t.stage}</span>
                  <h2>{currentPhaseCopy[1]}</h2>
                  <p>{currentPhaseCopy[2]}</p>
                </div>

                <div className="workspace-status-side">
                  <span className={"workspace-live-status is-" + progress.status}><i />{statusLabel}</span>
                  <strong>{String(currentPhase).padStart(2, "0")} / 05</strong>
                </div>
              </div>

              <div className="workspace-progress-line" aria-label={t.phase + " " + currentPhase + " / 5"}>
                {t.phases.map((phase, index) => {
                  const number = index + 1;
                  const state = progress.status === "complete" && currentPhase === 5
                    ? "done"
                    : number < currentPhase
                      ? "done"
                      : number === currentPhase
                        ? "current"
                        : "upcoming";

                  return (
                    <div key={phase[0]} className={"is-" + state}>
                      <i />
                      <span>{phase[0]}</span>
                    </div>
                  );
                })}
              </div>

              <div className="workspace-status-meta">
                <div>
                  <span>{t.latest}</span>
                  <strong>{latestUpdate}</strong>
                  <small>{formatDate(progress.updatedAt, language)}</small>
                </div>
                <div>
                  <span>{t.nextMilestone}</span>
                  <strong>{nextMilestone}</strong>
                  <small>{progress.nextMilestoneDate ? formatDate(progress.nextMilestoneDate, language) : t.milestonePending}</small>
                </div>
                <div>
                  <span>{t.lastUpdated}</span>
                  <strong>{formatDate(progress.updatedAt, language)}</strong>
                  <small>{t.phase} {String(currentPhase).padStart(2, "0")} / 05</small>
                </div>
              </div>

              <div className={clientAction.required ? "workspace-action is-required" : "workspace-action"}>
                <div>
                  <span>{clientAction.required ? t.action : t.noAction}</span>
                  <h3>{clientAction.required ? clientAction.title || t.actionDefaultTitle : t.noActionBody}</h3>
                </div>
                {clientAction.required && clientAction.href && (
                  <Link href={clientAction.href}>{clientAction.label || t.actionDefaultLabel} →</Link>
                )}
              </div>
            </div>
          </section>

          <section className="workspace-timeline-section">
            <div className="ref-shell">
              <div className="workspace-section-heading">
                <div>
                  <p className="workspace-kicker">{t.progress}</p>
                  <h2>{currentPhaseCopy[1]}</h2>
                </div>
                <span>{t.current}: {String(currentPhase).padStart(2, "0")}</span>
              </div>

              <div className="workspace-timeline">
                {t.phases.map(([n, title], index) => {
                  const number = index + 1;
                  const isDone = progress.status === "complete" && currentPhase === 5 ? number <= 5 : number < currentPhase;
                  const isCurrent = !isDone && number === currentPhase;

                  return (
                    <div key={n} className={isDone ? "is-done" : isCurrent ? "is-current" : ""}>
                      <div className="workspace-timeline-node">
                        <i />
                        <b>{n}</b>
                      </div>
                      <span>{title}</span>
                    </div>
                  );
                })}
              </div>

              <p className="workspace-current-description">{currentPhaseCopy[2]}</p>
            </div>
          </section>

          <section className="workspace-activity-section">
            <div className="ref-shell">
              <div className="workspace-section-heading">
                <div>
                  <p className="workspace-kicker">{t.activity}</p>
                  <h2>{t.activityTitle}</h2>
                </div>
              </div>

              <div className="workspace-activity-list">
                {activities.map((item, index) => (
                  <div key={item.id || item.at + "-" + index}>
                    <i />
                    <span>{formatDate(item.at, language)}</span>
                    <strong>{item.title}</strong>
                    {item.detail && <p>{item.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="workspace-files-section" id="files">
            <div className="ref-shell">
              <div className="workspace-section-heading">
                <div>
                  <p className="workspace-kicker">{t.filesReview}</p>
                  <h2>{t.filesReviewTitle}</h2>
                </div>
              </div>

              {projectFiles.length ? (
                <div className="workspace-file-list">
                  {projectFiles.map(file => (
                    <div key={file.id}>
                      <div>
                        <strong>{file.name}</strong>
                        {file.detail && <p>{file.detail}</p>}
                        {file.updatedAt && <small>{formatDate(file.updatedAt, language)}</small>}
                      </div>
                      <span className={"file-status is-" + file.status}>{fileStatusLabel(file.status, t)}</span>
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
            </div>
          </section>

          <section className="workspace-brief-section">
            <div className="ref-shell">
              <details className="workspace-brief">
                <summary>
                  <div>
                    <p className="workspace-kicker">{t.brief}</p>
                    <h2>{t.briefTitle}</h2>
                    <div className="workspace-brief-preview">
                      <span>{serviceLabels[record.project.service]?.[language] || translate(record.project.service)}</span>
                      <span>{record.customer.company || record.customer.name || "—"}</span>
                    </div>
                  </div>
                  <span className="workspace-brief-toggle">{t.viewBrief} +</span>
                </summary>

                <div className="workspace-brief-content">
                  <div className="workspace-brief-reference">
                    <div>
                      <span>{t.request}</span>
                      <strong>{record.requestId}</strong>
                    </div>
                    <button type="button" onClick={copyRequestId}>{copied ? t.copied : t.copyId}</button>
                  </div>

                  <div className="workspace-brief-grid">
                    <div><span>{t.service}</span><strong>{serviceLabels[record.project.service]?.[language] || translate(record.project.service)}</strong></div>
                    <div><span>{t.customer}</span><strong>{record.customer.name || "—"}</strong></div>
                    <div><span>{t.company}</span><strong>{record.customer.company || "—"}</strong></div>
                    <div><span>{t.contact}</span><strong>{translate(record.customer.preferredContact || "—")}</strong></div>
                    <div><span>{t.goal}</span><strong>{translate(record.project.goal || "—")}</strong></div>
                    <div><span>{t.timing}</span><strong>{translate(record.scope.timing || "—")}</strong></div>
                    <div><span>{t.budget}</span><strong>{translate(record.scope.budget || "—")}</strong></div>
                    <div className="is-wide"><span>{t.idea}</span><strong>{record.project.idea || "—"}</strong></div>
                  </div>

                  <div className="workspace-brief-foot">
                    <span>{completedDate}</span>
                    <Link href="/start">{t.newRequest} →</Link>
                  </div>
                </div>
              </details>
            </div>
          </section>

          <section className="workspace-tools-section">
            <div className="ref-shell">
              <p className="workspace-kicker">{t.tools}</p>
              <nav className="workspace-tools-line" aria-label={t.tools}>
                <Link href="/chat"><span>01</span>{t.conversation}<b>↗</b></Link>
                <a href="#files"><span>02</span>{t.files}<b>↓</b></a>
                <div className={currentPhase < 5 ? "is-locked" : ""}>
                  <span>03</span>{t.handover}<b>{currentPhase < 5 ? t.handoverLocked : "✓"}</b>
                </div>
              </nav>
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

function fileStatusLabel(
  status: ProgressFile["status"],
  t: (typeof copy)["en"] | (typeof copy)["ar"],
) {
  if (status === "approved") return t.fileApproved;
  if (status === "review") return t.fileReview;
  if (status === "ready") return t.fileReady;
  return t.fileInProgress;
}
