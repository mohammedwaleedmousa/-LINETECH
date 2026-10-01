"use client";

import Link from "next/link";
import Localized, { useLanguage, useTranslation } from "../Localized";
import { useEffect, useMemo, useRef, useState } from "react";
import ScopePreview from "./ScopePreview";
import "./custom-select.css";

const services = ["Web Development", "E-commerce & Systems", "Brand Identity", "CV & Portfolio", "Other"] as const;
const planOptions: Record<string, readonly string[]> = {
  "Web Development": ["START", "BUSINESS", "PRO", "CUSTOM"],
  "E-commerce & Systems": ["E-COMMERCE", "E-COMMERCE PRO", "CUSTOM"],
};
const stages = ["New idea", "Existing project", "Redesign / rebuild", "Improve an existing system"] as const;
const goals = ["Sell / generate leads", "Bookings / requests", "Internal operations", "Build credibility", "Career / portfolio", "Other"] as const;
const preferredContacts = ["WhatsApp", "Email", "Call", "Either"] as const;
const budgets = ["Need guidance", "Small focused project", "Medium project", "Large project"];
const timings = ["ASAP", "1–2 months", "3+ months", "Flexible"];
const finderStorageKey = "linetech-service-finder-v1";
const requestDraftKey = "linetech-project-request-draft-v1";
const requestSubmissionKey = "linetech-project-submission-key-v1";
const requestDraftTtlMs = 24 * 60 * 60 * 1000;

type FinderAnswerIds = Partial<Record<"outcome" | "priority" | "stage", string>>;
type StoredFinderState = {
  answerIds?: FinderAnswerIds;
  completed?: boolean;
  serviceParam?: string;
};

const requestCopy = {
  en: {
    steps: ["Idea", "Plan", "Brief", "Scope", "Submit"],
    localNote: "Your project details stay in this form while you prepare the request. When you complete it, LINETECH securely saves the request to your account workspace.",
    finderKicker: "SERVICE FINDER SAVED",
    finderTitle: "Your recommendation is already connected.",
    finderBody: "We kept the recommended service and used your previous answers to prefill the project stage and main goal where they clearly match. You only need to add the details we do not know yet.",
    reviewKicker: "04 / REVIEW & CONFIRM",
    reviewTitle: "Review your request before completing it.",
    reviewBody: "Check the important details below. You can go back and edit anything before you complete the project request.",
    customer: "Customer",
    contact: "Contact",
    service: "Service",
    stage: "Stage",
    goal: "Goal",
    budget: "Budget",
    timing: "Timing",
    request: "Project request",
    confirm: "I confirm that these project details are correct and understand that final price, scope and timeline are agreed with LINETECH before work begins.",
    complete: "Complete project request",
    completing: "Completing request…",
    back: "← Back to scope",
    doneKicker: "LINE SUBMITTED",
    doneTitle: "Your Line is submitted.",
    doneBody: "LINETECH has received your project line. Use the reference below to track it in Workspace or continue directly in Project Chat.",
    requestId: "Request ID",
    status: "Status",
    statusValue: "Submitted",
    nextStep: "Next step",
    nextStepValue: "Track in Workspace",
    contactMethod: "Preferred contact",
    copy: "Copy request details",
    copied: "Copied ✓",
    copyDone: "Request details copied. You can paste them into the project conversation if needed.",
    copyError: "Your browser blocked clipboard access. Your submitted request is still available in the Client Workspace.",
    storageError: "LINETECH could not save the request. Please try again.",
    invalidRequest: "Review the required project details and try again.",
    requestTooLarge: "Some project details are too long. Shorten the longest fields and try again.",
    serviceUnavailable: "The project service is temporarily unavailable. Your draft is still here — try again shortly.",
    rateLimited: "Too many project requests. Wait one minute and try again.",
    openWorkspace: "Open Client Workspace",
    openChat: "Open Project Chat",
  },
  ar: {
    steps: ["الفكرة", "الباقة", "التفاصيل", "النطاق", "الإرسال"],
    localNote: "تبقى تفاصيل مشروعك في هذا النموذج أثناء تجهيز الطلب. عند إتمامه، تحفظ لاين تك الطلب بأمان داخل مساحة حسابك.",
    finderKicker: "تم حفظ نتيجة موجّه الخدمات",
    finderTitle: "نتيجتك مرتبطة بالفعل بطلب المشروع.",
    finderBody: "احتفظنا بالخدمة المقترحة واستخدمنا إجاباتك السابقة لتعبئة مرحلة المشروع والهدف الرئيسي تلقائيًا عندما يكون الربط واضحًا. أكمل فقط التفاصيل التي لا نعرفها بعد.",
    reviewKicker: "04 / المراجعة والتأكيد",
    reviewTitle: "راجع طلبك قبل إتمامه.",
    reviewBody: "تأكد من أهم البيانات أدناه. يمكنك الرجوع وتعديل أي شيء قبل إتمام طلب المشروع.",
    customer: "العميل",
    contact: "التواصل",
    service: "الخدمة",
    stage: "مرحلة المشروع",
    goal: "الهدف",
    budget: "الميزانية",
    timing: "الوقت المتوقع",
    request: "طلب المشروع",
    confirm: "أؤكد أن بيانات المشروع صحيحة، وأفهم أن السعر النهائي والنطاق والمدة يتم الاتفاق عليها مع LINETECH قبل بدء التنفيذ.",
    complete: "إتمام طلب المشروع",
    completing: "جارٍ إتمام الطلب…",
    back: "العودة إلى النطاق →",
    doneKicker: "تم إرسال خط المشروع",
    doneTitle: "تم إرسال خط مشروعك.",
    doneBody: "استلمت LINETECH طلب مشروعك. استخدم الرقم المرجعي أدناه لمتابعته في مساحة العميل أو انتقل مباشرة إلى محادثة المشروع.",
    requestId: "رقم الطلب",
    status: "الحالة",
    statusValue: "تم الإرسال",
    nextStep: "الخطوة التالية",
    nextStepValue: "متابعته في مساحة العميل",
    contactMethod: "طريقة التواصل المفضلة",
    copy: "انسخ تفاصيل الطلب",
    copied: "تم النسخ ✓",
    copyDone: "تم نسخ تفاصيل الطلب. يمكنك لصقها في محادثة المشروع عند الحاجة.",
    copyError: "المتصفح منع الوصول إلى الحافظة. طلبك المرسل ما زال متاحًا داخل مساحة العميل.",
    storageError: "تعذر على لاين تك حفظ الطلب. حاول مرة أخرى.",
    invalidRequest: "راجع بيانات المشروع المطلوبة ثم حاول مرة أخرى.",
    requestTooLarge: "بعض تفاصيل المشروع طويلة جدًا. اختصر الحقول الأطول ثم حاول مرة أخرى.",
    serviceUnavailable: "خدمة المشاريع غير متاحة مؤقتًا. مسودة طلبك ما زالت محفوظة — حاول بعد قليل.",
    rateLimited: "تم إرسال طلبات كثيرة جدًا. انتظر دقيقة ثم حاول مرة أخرى.",
    openWorkspace: "افتح مساحة العميل",
    openChat: "افتح محادثة المشروع",
  },
} as const;

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  ariaLabel: string;
};

function CustomSelect({ value, onChange, options, placeholder, ariaLabel }: CustomSelectProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const display = value ? t(value) : t(placeholder || "Select");

  return (
    <div ref={rootRef} className={`linetech-select ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="linetech-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t(ariaLabel)}
        onClick={() => setOpen(current => !current)}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={!value ? "is-placeholder" : ""}>{display}</span>
        <i aria-hidden="true" />
      </button>

      {open && (
        <div className="linetech-select-menu" role="listbox" aria-label={t(ariaLabel)}>
          {options.map(option => {
            const selected = value === option;
            return (
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={`linetech-select-option ${selected ? "is-selected" : ""}`}
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <span>{t(option)}</span>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function createRequestId() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  let random = Math.floor(Math.random() * 10000);
  try {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    random = buffer[0] % 10000;
  } catch {}
  return `LT-${date}-${String(random).padStart(4, "0")}`;
}

function stageFromFinder(answerIds: FinderAnswerIds) {
  if (answerIds.stage === "new") return "New idea";
  if (answerIds.stage === "existing") return "Existing project";
  if (answerIds.stage === "rebuild") return "Redesign / rebuild";
  return "";
}

function goalFromFinder(answerIds: FinderAnswerIds) {
  if (answerIds.priority === "operations") return "Internal operations";
  if (answerIds.outcome === "sales") return "Sell / generate leads";
  if (answerIds.outcome === "career" || answerIds.priority === "presentation") return "Career / portfolio";
  if (answerIds.outcome === "identity" || answerIds.priority === "consistency" || answerIds.priority === "leads" || answerIds.outcome === "presence") return "Build credibility";
  return "";
}

export default function ProjectIntake() {
  const [step, setStep] = useState(1);
  const language = useLanguage();
  const t = useTranslation();
  const copy = requestCopy[language];
  const [copied, setCopied] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [finderLoaded, setFinderLoaded] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [completedAt, setCompletedAt] = useState("");
  const [submittedProjectId, setSubmittedProjectId] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("Either");
  const [service, setService] = useState("");
  const [plan, setPlan] = useState("");
  const [stage, setStage] = useState("");
  const [goal, setGoal] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");
  const [references, setReferences] = useState("");
  const [budget, setBudget] = useState("Need guidance");
  const [timing, setTiming] = useState("Flexible");
  const [notes, setNotes] = useState("");
  const submissionKeyRef = useRef("");

  useEffect(() => {
    const requestedPlan = new URLSearchParams(window.location.search).get("plan") || "";
    const planService = Object.entries(planOptions).find(([, options]) => options.includes(requestedPlan))?.[0] || "";
    if (!requestedPlan || !planService) return;
    setPlan(requestedPlan);
    setService(current => current || planService);
  }, []);

  useEffect(() => {
    try {
      const rawDraft =
        window.sessionStorage.getItem(requestDraftKey)
        || window.localStorage.getItem(requestDraftKey);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft) as Record<string, unknown>;
        const savedAt = typeof draft.savedAt === "number" ? draft.savedAt : Date.now();
        if (Date.now() - savedAt > requestDraftTtlMs) {
          window.sessionStorage.removeItem(requestDraftKey);
          window.localStorage.removeItem(requestDraftKey);
          window.localStorage.removeItem(requestSubmissionKey);
        } else {
          if (typeof draft.name === "string") setName(draft.name);
          if (typeof draft.company === "string") setCompany(draft.company);
          if (typeof draft.contact === "string") setContact(draft.contact);
          if (typeof draft.preferredContact === "string") setPreferredContact(draft.preferredContact);
          if (typeof draft.service === "string") setService(draft.service);
          if (typeof draft.plan === "string") setPlan(draft.plan);
          if (typeof draft.stage === "string") setStage(draft.stage);
          if (typeof draft.goal === "string") setGoal(draft.goal);
          if (typeof draft.idea === "string") setIdea(draft.idea);
          if (typeof draft.audience === "string") setAudience(draft.audience);
          if (typeof draft.features === "string") setFeatures(draft.features);
          if (typeof draft.references === "string") setReferences(draft.references);
          if (typeof draft.budget === "string") setBudget(draft.budget);
          if (typeof draft.timing === "string") setTiming(draft.timing);
          if (typeof draft.notes === "string") setNotes(draft.notes);
          if (typeof draft.step === "number") setStep(Math.min(5, Math.max(1, Math.round(draft.step))));
          if (draft.confirmed === true) setConfirmed(true);
        }
      }
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const value = params.get("service") || "";
    const fromFinder = params.get("source") === "finder";

    if (services.includes(value as (typeof services)[number])) setService(value);
    if (!fromFinder) return;

    try {
      const raw = window.localStorage.getItem(finderStorageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as StoredFinderState;
      const answerIds = saved.answerIds || {};
      const savedService = services.includes(saved.serviceParam as (typeof services)[number]) ? saved.serviceParam || "" : "";
      const resolvedService = services.includes(value as (typeof services)[number]) ? value : savedService;
      const resolvedStage = stageFromFinder(answerIds);
      const resolvedGoal = goalFromFinder(answerIds);

      if (resolvedService) setService(resolvedService);
      if (resolvedStage && stages.includes(resolvedStage as (typeof stages)[number])) setStage(resolvedStage);
      if (resolvedGoal && goals.includes(resolvedGoal as (typeof goals)[number])) setGoal(resolvedGoal);
      setFinderLoaded(Boolean(saved.completed && resolvedService));
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json().catch(() => null) as {
          user?: {
            email?: string;
            user_metadata?: { full_name?: string; company?: string };
          };
        } | null;
        if (cancelled || !payload?.user) return;
        const user = payload.user;
        setName(current => current || user.user_metadata?.full_name || "");
        setCompany(current => current || user.user_metadata?.company || "");
        setContact(current => current || user.email || "");
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const availablePlans = planOptions[service] || [];
  const needsPlan = availablePlans.length > 0;
  const canStep1 = Boolean(service);
  const canStep2 = Boolean(!needsPlan || plan);
  const canStep3 = Boolean(stage && goal && idea.trim());

  const brief = useMemo(() => [
    t("LINETECH — START YOUR LINE"),
    requestId ? `${copy.requestId}: ${requestId}` : "",
    "",
    t("ABOUT"),
    `${t("Name")}：${name || "—"}`,
    `${t("Company / Brand")}：${company || "—"}`,
    `${t("Contact")}：${contact || "—"}`,
    `${t("Preferred contact")}：${t(preferredContact)}`,
    `${t("Project type")}：${t(service || "—")}`,
    plan ? `${language === "ar" ? "الباقة" : "Plan"}：${plan}` : "",
    "",
    t("PROJECT"),
    `${t("Stage")}：${t(stage || "—")}`,
    `${t("Main goal")}：${t(goal || "—")}`,
    `${t("Audience / user")}：${audience || "—"}`,
    "",
    t("WHAT TO BUILD"),
    idea || "—",
    "",
    t("MUST-HAVE FEATURES"),
    features || "—",
    "",
    t("REFERENCES / LINKS"),
    references || "—",
    "",
    t("SCOPE"),
    `${t("Budget")}：${t(budget)}`,
    `${t("Timing")}：${t(timing)}`,
    "",
    t("OTHER NOTES"),
    notes || "—",
  ].filter(Boolean).join("\n"), [t, copy.requestId, requestId, name, company, contact, preferredContact, service, plan, language, stage, goal, audience, idea, features, references, budget, timing, notes]);

  function changeStep(next: number) {
    setStep(next);
    setActionStatus("");
    requestAnimationFrame(() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setActionStatus(copy.copyDone);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setActionStatus(copy.copyError);
    }
  }

  async function completeRequest() {
    if (!confirmed || completing) return;
    setCompleting(true);
    setActionStatus("");

    try {
      let submissionKey = submissionKeyRef.current;
      if (!submissionKey) {
        try {
          submissionKey =
            window.sessionStorage.getItem(requestSubmissionKey)
            || window.localStorage.getItem(requestSubmissionKey)
            || "";
        } catch {}
      }
      if (!submissionKey) {
        submissionKey = window.crypto.randomUUID();
        submissionKeyRef.current = submissionKey;
        try {
          window.sessionStorage.setItem(requestSubmissionKey, submissionKey);
          window.localStorage.setItem(requestSubmissionKey, submissionKey);
        } catch {}
      }

      const response = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionKey,
          name,
          company,
          contact,
          preferredContact,
          service,
          plan,
          stage,
          goal,
          idea,
          audience,
          features,
          references,
          budget,
          timing,
          notes,
        }),
      });

      if (response.status === 401) {
        try {
          const pendingDraft = JSON.stringify({
            savedAt: Date.now(),
            step: 4,
            confirmed,
            name,
            company,
            contact,
            preferredContact,
            service,
            plan,
            stage,
            goal,
            idea,
            audience,
            features,
            references,
            budget,
            timing,
            notes,
          });
          window.sessionStorage.setItem(requestDraftKey, pendingDraft);
          window.localStorage.setItem(requestDraftKey, pendingDraft);
        } catch {}
        window.location.assign("/login?next=/start");
        return;
      }

      if (response.status === 429) {
        setActionStatus(copy.rateLimited);
        return;
      }
      if (response.status === 413) {
        setActionStatus(copy.requestTooLarge);
        return;
      }
      if (response.status === 400) {
        setActionStatus(copy.invalidRequest);
        return;
      }
      if (response.status === 503) {
        setActionStatus(copy.serviceUnavailable);
        return;
      }

      const result = await response.json().catch(() => null) as {
        ok?: boolean;
        data?: {
          reference_number?: string;
          submitted_at?: string;
          project_id?: string;
        };
      } | null;

      if (!response.ok || !result?.ok || !result.data?.reference_number) {
        setActionStatus(copy.storageError);
        return;
      }

      const id = result.data.reference_number;
      const timestamp = result.data.submitted_at || new Date().toISOString();

      setRequestId(id);
      setCompletedAt(timestamp);
      setSubmittedProjectId(result.data.project_id || "");
      setCompleted(true);
      try {
        window.sessionStorage.removeItem(requestDraftKey);
        window.sessionStorage.removeItem(requestSubmissionKey);
        window.localStorage.removeItem(requestDraftKey);
        window.localStorage.removeItem(requestSubmissionKey);
      } catch {}
      submissionKeyRef.current = "";
      requestAnimationFrame(() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      setActionStatus(copy.storageError);
    } finally {
      setCompleting(false);
    }
  }

  const progressStep = completed ? 6 : step;

  return <Localized><div className={`project-brief-form project-intake ${completed ? "is-complete" : ""}`}>
    <p className="frontend-only-note">{copy.localNote}</p>

    {finderLoaded && !completed && <div className="finder-context-loaded" role="status">
      <span>{copy.finderKicker}</span>
      <div><strong>{copy.finderTitle}</strong><p>{copy.finderBody}</p></div>
      <b>{t(service)}</b>
    </div>}

    {!completed && <div className="line-step-progress" aria-label={`Step ${Math.min(step, 5)} of 5`}>
      {copy.steps.map((label, index) => {
        const n = index + 1;
        return <div key={label} className={`line-step-progress-item ${step===n?"active":""} ${progressStep>n?"done":""}`}>
          <span>{String(n).padStart(2,"0")}</span>
          <strong>{step===n ? label : ""}</strong>
        </div>;
      })}
    </div>}

    {!completed && step===1 && <section className="intake-step line-step">
      <div className="intake-step-head"><span>01 / {language==="ar"?"الفكرة":"IDEA"}</span><h3>{language==="ar"?"ما الذي تريد أن نبنيه؟":"What do you want to build?"}</h3><p>{language==="ar"?"ابدأ بنوع المشروع فقط. سنُظهر لك المسار المناسب في الخطوة التالية.":"Start with the project type only. We will shape the right path in the next step."}</p></div>
      <div className="project-type-grid">
        {services.map((item,index)=><button type="button" key={item} className={`project-type-card ${service===item?"selected":""}`} onClick={()=>{setService(item);setPlan("");}}>
          <span>0{index+1}</span><strong>{t(item)}</strong>
        </button>)}
      </div>
      <div className="intake-nav intake-nav-end"><button className="button button-light" type="button" disabled={!canStep1} onClick={()=>changeStep(2)}>{language==="ar"?"حدد المسار":"Shape the path"} <span>→</span></button></div>
    </section>}

    {!completed && step===2 && <section className="intake-step line-step">
      <div className="intake-step-head"><span>02 / {language==="ar"?"المسار":"PLAN"}</span><h3>{needsPlan ? (language==="ar"?"اختر الباقة الأقرب لك.":"Choose the closest plan.") : (language==="ar"?"مسارك جاهز.":"Your path is ready.")}</h3><p>{language==="ar"?"لا تحتاج لقراءة كل التفاصيل الآن. اختر المسار الأقرب ويمكننا ضبط النطاق لاحقًا.":"No need to study every detail now. Pick the closest path and we can refine the scope later."}</p></div>
      <div className="line-selection-summary"><span>{language==="ar"?"نوع المشروع":"PROJECT TYPE"}</span><strong>{t(service)}</strong><button type="button" onClick={()=>changeStep(1)}>{language==="ar"?"تغيير":"Change"}</button></div>
      {needsPlan ? <div className="plan-picker">
        <div className="plan-picker-head"><div><span>{language==="ar"?"اختر الباقة *":"Choose a plan *"}</span><p>{language==="ar"?"أسماء الباقات فقط حتى يبقى الطلب سريعًا وواضحًا.":"Plan names only, so the request stays fast and clear."}</p></div><Link href="/pricing">{language==="ar"?"مقارنة الباقات":"Compare plans"} →</Link></div>
        <div className="plan-option-grid">{availablePlans.map(item=><button type="button" key={item} className={plan===item?"selected":""} onClick={()=>setPlan(item)}>{item}</button>)}</div>
      </div> : <div className="custom-path-card"><span>LINETECH / CUSTOM</span><strong>{language==="ar"?"سنحدد نطاق المشروع معك.":"We will shape the project scope with you."}</strong></div>}
      <div className="intake-nav"><button className="intake-back" type="button" onClick={()=>changeStep(1)}>← {language==="ar"?"الفكرة":"Idea"}</button><button className="button button-light" type="button" disabled={!canStep2} onClick={()=>changeStep(3)}>{language==="ar"?"أضف التفاصيل":"Add the brief"} <span>→</span></button></div>
    </section>}

    {!completed && step===3 && <section className="intake-step line-step">
      <div className="intake-step-head"><span>03 / {language==="ar"?"التفاصيل":"BRIEF"}</span><h3>{language==="ar"?"حوّل الفكرة إلى طلب واضح.":"Turn the idea into a clear brief."}</h3><p>{language==="ar"?"ثلاث معلومات أساسية تكفينا للبدء. التفاصيل الإضافية اختيارية.":"Three core answers are enough to start. Extra details are optional."}</p></div>
      <div className="form-row two-col">
        <div className="custom-select-field"><span className="custom-select-label">{language==="ar"?"مرحلة المشروع *":"Project stage *"}</span><CustomSelect value={stage} onChange={setStage} options={stages} placeholder="Select current stage" ariaLabel="Project stage" /></div>
        <div className="custom-select-field"><span className="custom-select-label">{language==="ar"?"الهدف الرئيسي *":"Main goal *"}</span><CustomSelect value={goal} onChange={setGoal} options={goals} placeholder="Select the main outcome" ariaLabel="Main goal" /></div>
      </div>
      <label className="form-wide"><span>{language==="ar"?"ماذا تريد أن نبني؟ *":"What do you want to build? *"}</span><textarea value={idea} onChange={e=>setIdea(e.target.value)} maxLength={5000} placeholder={language==="ar"?"اشرح النتيجة التي تريد الوصول إليها.":"Describe the result you want to achieve."} rows={5}/></label>
      <details className="optional-details"><summary>{language==="ar"?"+ أضف تفاصيل اختيارية":"+ Add optional details"}</summary><div>
        <label className="form-wide"><span>{language==="ar"?"لمن هذا المشروع؟":"Who is it for?"}</span><textarea value={audience} onChange={e=>setAudience(e.target.value)} maxLength={1000} rows={3}/></label>
        <label className="form-wide"><span>{language==="ar"?"الخصائص الأساسية":"Must-have features"}</span><textarea value={features} onChange={e=>setFeatures(e.target.value)} maxLength={5000} rows={4}/></label>
        <label className="form-wide"><span>{language==="ar"?"روابط أو مراجع":"Links / references"}</span><textarea value={references} onChange={e=>setReferences(e.target.value)} maxLength={3000} rows={3}/></label>
      </div></details>
      <div className="intake-nav"><button className="intake-back" type="button" onClick={()=>changeStep(2)}>← {language==="ar"?"الباقة":"Plan"}</button><button className="button button-light" type="button" disabled={!canStep3} onClick={()=>changeStep(4)}>{language==="ar"?"حدد النطاق":"Set the scope"} <span>→</span></button></div>
    </section>}

    {!completed && step===4 && <section className="intake-step line-step">
      <div className="intake-step-head"><span>04 / {language==="ar"?"النطاق":"SCOPE"}</span><h3>{language==="ar"?"متى تريد البدء وما حجم المشروع؟":"When do you want to move, and at what scale?"}</h3><p>{language==="ar"?"هذه ليست موافقة نهائية على السعر؛ تساعدنا فقط على تجهيز العرض المناسب.":"This is not a final price agreement. It simply helps us prepare the right proposal."}</p></div>
      <fieldset><legend>{language==="ar"?"نطاق الميزانية":"Budget range"}</legend><div className="choice-grid intake-choice-grid">{budgets.map(v=><label key={v} className={`choice ${budget===v?"selected":""}`}><input type="radio" name="budget" checked={budget===v} onChange={()=>setBudget(v)}/><span>{t(v)}</span></label>)}</div></fieldset>
      <fieldset><legend>{language==="ar"?"موعد الإطلاق":"Launch timing"}</legend><div className="choice-grid intake-choice-grid">{timings.map(v=><label key={v} className={`choice ${timing===v?"selected":""}`}><input type="radio" name="timing" checked={timing===v} onChange={()=>setTiming(v)}/><span>{t(v)}</span></label>)}</div></fieldset>
      <div className="intake-nav"><button className="intake-back" type="button" onClick={()=>changeStep(3)}>← {language==="ar"?"التفاصيل":"Brief"}</button><button className="button button-light" type="button" onClick={()=>changeStep(5)}>{language==="ar"?"جهز خطي":"Prepare my line"} <span>→</span></button></div>
    </section>}

    {!completed && step===5 && <section className="intake-step intake-review-step line-step">
      <div className="intake-step-head"><span>05 / {language==="ar"?"الإرسال":"SUBMIT"}</span><h3>{language==="ar"?"خط مشروعك جاهز.":"Your project line is ready."}</h3><p>{language==="ar"?"أضف بيانات التواصل، راجع المسار، ثم أرسل الطلب إلى LINETECH.":"Add your contact details, review the path, then send your line to LINETECH."}</p></div>
      <div className="your-line-card"><span>LINETECH / YOUR LINE</span><strong>{t(service)}</strong><div>{plan&&<b>{plan}</b>}<i>→</i><b>{t(stage)}</b><i>→</i><b>{t(timing)}</b></div></div>
      <div className="final-contact-grid">
        <label><span>{language==="ar"?"اسمك *":"Your name *"}</span><input value={name} onChange={e=>setName(e.target.value)} maxLength={120} autoComplete="name" /></label>
        <label><span>{language==="ar"?"الشركة / العلامة":"Company / Brand"}</span><input value={company} onChange={e=>setCompany(e.target.value)} maxLength={160} autoComplete="organization" /></label>
        <label><span>{language==="ar"?"البريد أو واتساب *":"Email or WhatsApp *"}</span><input value={contact} onChange={e=>setContact(e.target.value)} maxLength={200} /></label>
        <div className="custom-select-field"><span className="custom-select-label">{language==="ar"?"طريقة التواصل":"Preferred contact"}</span><CustomSelect value={preferredContact} onChange={setPreferredContact} options={preferredContacts} ariaLabel="Preferred contact" /></div>
      </div>
      <label className="form-wide"><span>{language==="ar"?"ملاحظة أخيرة (اختياري)":"Final note (optional)"}</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={5000} rows={3}/></label>
      <label className={`request-confirm ${confirmed ? "is-checked" : ""}`}><input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} /><i aria-hidden="true">✓</i><span>{copy.confirm}</span></label>
      <div className="request-complete-actions"><button className="button button-light request-complete-button" type="button" disabled={!name.trim()||!contact.trim()||!confirmed||completing} onClick={completeRequest}>{completing ? copy.completing : (language==="ar"?"أرسل خطي":"Submit my line")} <span>→</span></button><button className="intake-back" type="button" onClick={()=>changeStep(4)}>← {language==="ar"?"النطاق":"Scope"}</button></div>
      {actionStatus && <p className="brief-action-status" role="status">{actionStatus}</p>}
    </section>}

    {completed && <section className="intake-step request-complete-panel">
      <div className="request-complete-mark" aria-hidden="true">✓</div>
      <p className="eyebrow">{copy.doneKicker}</p>
      <h3>{copy.doneTitle}</h3>
      <p className="request-complete-lead">{copy.doneBody}</p>

      <div className="request-reference"><span>{copy.requestId}</span><strong>{requestId}</strong>{completedAt && <small>{new Date(completedAt).toLocaleString(language === "ar" ? "ar" : "en")}</small>}</div>
       <div className="submitted-line-summary">
         <div><span>{copy.service}</span><strong>{t(service)}</strong></div>
         {plan && <div><span>{language==="ar"?"الباقة":"Plan"}</span><strong>{plan}</strong></div>}
       </div>

      <div className="request-status-grid">
        <div><span>{copy.status}</span><strong>{copy.statusValue}</strong></div>
        <div><span>{copy.nextStep}</span><strong>{copy.nextStepValue}</strong></div>
        <div><span>{copy.contactMethod}</span><strong>{t(preferredContact)}</strong></div>
      </div>

      {actionStatus && <p className="brief-action-status" role="status">{actionStatus}</p>}

      <div className="brief-actions request-finish-actions">
        <Link className="button button-light" href={submittedProjectId ? `/workspace?project=${encodeURIComponent(submittedProjectId)}` : "/workspace"}>{copy.openWorkspace} <span>→</span></Link>
        <Link className="brief-share request-chat-link" href={submittedProjectId ? `/chat?project=${encodeURIComponent(submittedProjectId)}` : "/chat"}>{copy.openChat} <span>→</span></Link>
        <button className="brief-share" type="button" onClick={copyBrief}>{copied ? copy.copied : copy.copy} <span>→</span></button>
      </div>
    </section>}
  </div></Localized>;
}
