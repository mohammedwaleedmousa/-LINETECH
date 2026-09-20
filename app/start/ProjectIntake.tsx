"use client";

import Localized, { useLanguage, useTranslation } from "../Localized";
import { useEffect, useMemo, useRef, useState } from "react";
import ScopePreview from "./ScopePreview";
import "./custom-select.css";

const services = ["Web Development", "E-commerce & Systems", "Brand Identity", "CV & Portfolio", "Other"] as const;
const stages = ["New idea", "Existing project", "Redesign / rebuild", "Improve an existing system"] as const;
const goals = ["Sell / generate leads", "Bookings / requests", "Internal operations", "Build credibility", "Career / portfolio", "Other"] as const;
const preferredContacts = ["WhatsApp", "Email", "Call", "Either"] as const;
const budgets = ["Need guidance", "Small focused project", "Medium project", "Large project"];
const timings = ["ASAP", "1–2 months", "3+ months", "Flexible"];
const finderStorageKey = "linetech-service-finder-v1";
const requestDraftKey = "linetech-project-request-draft-v1";

type FinderAnswerIds = Partial<Record<"outcome" | "priority" | "stage", string>>;
type StoredFinderState = {
  answerIds?: FinderAnswerIds;
  completed?: boolean;
  serviceParam?: string;
};

const requestCopy = {
  en: {
    steps: ["About you", "Project", "Scope", "Review"],
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
    doneKicker: "REQUEST COMPLETE",
    doneTitle: "Your project request is ready.",
    doneBody: "Your project request has been saved to your LINETECH workspace with a reference number. You can now follow its status and continue in the project conversation.",
    requestId: "Request ID",
    status: "Status",
    statusValue: "Submitted",
    nextStep: "Next step",
    nextStepValue: "Track in Workspace",
    contactMethod: "Preferred contact",
    share: "Share request with LINETECH",
    copy: "Copy request details",
    copied: "Copied ✓",
    edit: "Edit request",
    shareDone: "The request was shared through the channel you selected.",
    copyDone: "Request details copied. Paste them into your LINETECH conversation.",
    copyError: "Your browser blocked clipboard access. Use Share instead.",
    storageError: "LINETECH could not save the request. Please try again.",
  },
  ar: {
    steps: ["بياناتك", "المشروع", "النطاق", "المراجعة"],
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
    doneKicker: "تم إتمام الطلب",
    doneTitle: "طلب مشروعك جاهز.",
    doneBody: "تم حفظ طلب مشروعك داخل مساحة عملك في لاين تك مع رقم مرجعي. يمكنك الآن متابعة حالته والاستمرار في محادثة المشروع.",
    requestId: "رقم الطلب",
    status: "الحالة",
    statusValue: "تم الإرسال",
    nextStep: "الخطوة التالية",
    nextStepValue: "متابعته في مساحة العميل",
    contactMethod: "طريقة التواصل المفضلة",
    share: "شارك الطلب مع LINETECH",
    copy: "انسخ تفاصيل الطلب",
    copied: "تم النسخ ✓",
    edit: "تعديل الطلب",
    shareDone: "تمت مشاركة الطلب عبر القناة التي اخترتها.",
    copyDone: "تم نسخ تفاصيل الطلب. الصقها في محادثتك مع LINETECH.",
    copyError: "المتصفح منع الوصول إلى الحافظة. استخدم المشاركة بدلًا من ذلك.",
    storageError: "تعذر على لاين تك حفظ الطلب. حاول مرة أخرى.",
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
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("Either");
  const [service, setService] = useState("");
  const [stage, setStage] = useState("");
  const [goal, setGoal] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");
  const [references, setReferences] = useState("");
  const [budget, setBudget] = useState("Need guidance");
  const [timing, setTiming] = useState("Flexible");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const rawDraft = window.sessionStorage.getItem(requestDraftKey);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft) as Record<string, unknown>;
        if (typeof draft.name === "string") setName(draft.name);
        if (typeof draft.company === "string") setCompany(draft.company);
        if (typeof draft.contact === "string") setContact(draft.contact);
        if (typeof draft.preferredContact === "string") setPreferredContact(draft.preferredContact);
        if (typeof draft.service === "string") setService(draft.service);
        if (typeof draft.stage === "string") setStage(draft.stage);
        if (typeof draft.goal === "string") setGoal(draft.goal);
        if (typeof draft.idea === "string") setIdea(draft.idea);
        if (typeof draft.audience === "string") setAudience(draft.audience);
        if (typeof draft.features === "string") setFeatures(draft.features);
        if (typeof draft.references === "string") setReferences(draft.references);
        if (typeof draft.budget === "string") setBudget(draft.budget);
        if (typeof draft.timing === "string") setTiming(draft.timing);
        if (typeof draft.notes === "string") setNotes(draft.notes);
        if (typeof draft.step === "number") setStep(Math.min(4, Math.max(1, Math.round(draft.step))));
        if (draft.confirmed === true) setConfirmed(true);
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

  const canStep1 = Boolean(name.trim() && contact.trim() && service);
  const canStep2 = Boolean(stage && goal && idea.trim());

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
  ].filter(Boolean).join("\n"), [t, copy.requestId, requestId, name, company, contact, preferredContact, service, stage, goal, audience, idea, features, references, budget, timing, notes]);

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

  async function shareBrief() {
    if (navigator.share) {
      try {
        await navigator.share({ title: t("LINETECH Project Brief"), text: brief });
        setActionStatus(copy.shareDone);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        await copyBrief();
      }
      return;
    }
    await copyBrief();
  }

  async function completeRequest() {
    if (!confirmed || completing) return;
    setCompleting(true);
    setActionStatus("");

    try {
      const response = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          contact,
          preferredContact,
          service,
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
          window.sessionStorage.setItem(requestDraftKey, JSON.stringify({
            step: 4,
            confirmed,
            name,
            company,
            contact,
            preferredContact,
            service,
            stage,
            goal,
            idea,
            audience,
            features,
            references,
            budget,
            timing,
            notes,
          }));
        } catch {}
        window.location.assign("/login?next=/start");
        return;
      }

      const result = await response.json().catch(() => null) as {
        ok?: boolean;
        data?: {
          reference_number?: string;
          submitted_at?: string;
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
      setCompleted(true);
      try { window.sessionStorage.removeItem(requestDraftKey); } catch {}
      requestAnimationFrame(() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      setActionStatus(copy.storageError);
    } finally {
      setCompleting(false);
    }
  }

  function editRequest() {
    setCompleted(false);
    setConfirmed(false);
    setActionStatus("");
    setStep(4);
  }

  const progressStep = completed ? 5 : step;

  return <Localized><div className={`project-brief-form project-intake ${completed ? "is-complete" : ""}`}>
    <p className="frontend-only-note">{copy.localNote}</p>

    <div className="intake-progress intake-progress-four" aria-label={`Step ${Math.min(step, 4)} of 4`}>
      {copy.steps.map((label, index) => {
        const n = index + 1;
        return <div key={label} className={`intake-progress-item ${step===n&&!completed?"active":""} ${progressStep>n?"done":""}`}><span>{String(n).padStart(2,"0")}</span><strong>{label}</strong></div>;
      })}
    </div>

    {finderLoaded && !completed && <div className="finder-context-loaded" role="status">
      <span>{copy.finderKicker}</span>
      <div><strong>{copy.finderTitle}</strong><p>{copy.finderBody}</p></div>
      <b>{t(service)}</b>
    </div>}

    {!completed && step===1 && <section className="intake-step">
      <div className="intake-step-head"><span>01 / ABOUT YOU</span><h3>Who are we building with?</h3><p>Start with the essentials so the project has a clear owner and communication path.</p></div>
      <div className="form-row two-col">
        <label><span>Your name *</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" /></label>
        <label><span>Company / Brand</span><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Optional" /></label>
      </div>
      <div className="form-row two-col">
        <label><span>Email or WhatsApp *</span><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="How should we reach you?" /></label>
        <div className="custom-select-field"><span className="custom-select-label">Preferred contact</span><CustomSelect value={preferredContact} onChange={setPreferredContact} options={preferredContacts} ariaLabel="Preferred contact" /></div>
      </div>
      <div className="custom-select-field form-wide"><span className="custom-select-label">Project type *</span><CustomSelect value={service} onChange={setService} options={services} placeholder="Select a service" ariaLabel="Project type" /></div>
      <div className="intake-nav intake-nav-end"><button className="button button-light" type="button" disabled={!canStep1} onClick={()=>changeStep(2)}>Continue to project <span>→</span></button></div>
    </section>}

    {!completed && step===2 && <section className="intake-step">
      <div className="intake-step-head"><span>02 / THE PROJECT</span><h3>What needs to become real?</h3><p>Tell us the goal, current stage and the few things the solution must do well.</p></div>
      <div className="form-row two-col">
        <div className="custom-select-field"><span className="custom-select-label">Project stage *</span><CustomSelect value={stage} onChange={setStage} options={stages} placeholder="Select current stage" ariaLabel="Project stage" /></div>
        <div className="custom-select-field"><span className="custom-select-label">Main goal *</span><CustomSelect value={goal} onChange={setGoal} options={goals} placeholder="Select the main outcome" ariaLabel="Main goal" /></div>
      </div>
      <label className="form-wide"><span>What do you want to build? *</span><textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Describe the idea, problem and final result." rows={6}/></label>
      <label className="form-wide"><span>Who is it for?</span><textarea value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Customers, companies, a team, recruiters, a specific market..." rows={3}/></label>
      <label className="form-wide"><span>Must-have features</span><textarea value={features} onChange={e=>setFeatures(e.target.value)} placeholder="List the 3–5 things the project cannot work without." rows={4}/></label>
      <label className="form-wide"><span>Existing links / references</span><textarea value={references} onChange={e=>setReferences(e.target.value)} placeholder="Current site, competitor links or examples you like." rows={3}/></label>
      <div className="intake-nav"><button className="intake-back" type="button" onClick={()=>changeStep(1)}>← Back</button><button className="button button-light" type="button" disabled={!canStep2} onClick={()=>changeStep(3)}>Continue to scope <span>→</span></button></div>
    </section>}

    {!completed && step===3 && <section className="intake-step">
      <div className="intake-step-head"><span>03 / SCOPE</span><h3>How should we frame the first move?</h3><p>These details help separate a small focused engagement from a larger product build.</p></div>
      <fieldset><legend>Budget range</legend><div className="choice-grid intake-choice-grid">{budgets.map(v=><label key={v} className={`choice ${budget===v?"selected":""}`}><input type="radio" name="budget" checked={budget===v} onChange={()=>setBudget(v)}/><span>{v}</span></label>)}</div></fieldset>
      <fieldset><legend>Launch timing</legend><div className="choice-grid intake-choice-grid">{timings.map(v=><label key={v} className={`choice ${timing===v?"selected":""}`}><input type="radio" name="timing" checked={timing===v} onChange={()=>setTiming(v)}/><span>{v}</span></label>)}</div></fieldset>
      <label className="form-wide"><span>Anything else we should know?</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Constraints, preferences, deadlines or context." rows={4}/></label>
      <div className="brief-summary"><div><span>Service</span><strong>{service||"—"}</strong></div><div><span>Stage</span><strong>{stage||"—"}</strong></div><div><span>Goal</span><strong>{goal||"—"}</strong></div><div><span>Timing</span><strong>{timing}</strong></div></div>
      <ScopePreview service={service} stage={stage} goal={goal} budget={budget} timing={timing} />
      <div className="intake-nav"><button className="intake-back" type="button" onClick={()=>changeStep(2)}>← Back to project</button><button className="button button-light" type="button" onClick={()=>changeStep(4)}>Continue <span>→</span></button></div>
    </section>}

    {!completed && step===4 && <section className="intake-step intake-review-step">
      <div className="intake-step-head"><span>{copy.reviewKicker}</span><h3>{copy.reviewTitle}</h3><p>{copy.reviewBody}</p></div>

      <div className="request-review-grid">
        <article><span>{copy.customer}</span><strong>{name}</strong><p>{company || "—"}</p></article>
        <article><span>{copy.contact}</span><strong>{contact}</strong><p>{t(preferredContact)}</p></article>
        <article><span>{copy.service}</span><strong>{t(service)}</strong><p>{t(stage)}</p></article>
        <article><span>{copy.goal}</span><strong>{t(goal)}</strong><p>{t(timing)}</p></article>
        <article><span>{copy.budget}</span><strong>{t(budget)}</strong><p>{t(timing)}</p></article>
        <article className="request-review-wide"><span>{copy.request}</span><strong>{idea}</strong>{notes && <p>{notes}</p>}</article>
      </div>

      <label className={`request-confirm ${confirmed ? "is-checked" : ""}`}>
        <input type="checkbox" checked={confirmed} onChange={event=>setConfirmed(event.target.checked)} />
        <i aria-hidden="true">✓</i>
        <span>{copy.confirm}</span>
      </label>

      <div className="request-complete-actions">
        <button className="button button-light request-complete-button" type="button" disabled={!confirmed || completing} onClick={completeRequest}>{completing ? copy.completing : copy.complete} <span>→</span></button>
        <button className="intake-back" type="button" onClick={()=>changeStep(3)}>{copy.back}</button>
      </div>
    </section>}

    {completed && <section className="intake-step request-complete-panel">
      <div className="request-complete-mark" aria-hidden="true">✓</div>
      <p className="eyebrow">{copy.doneKicker}</p>
      <h3>{copy.doneTitle}</h3>
      <p className="request-complete-lead">{copy.doneBody}</p>

      <div className="request-reference"><span>{copy.requestId}</span><strong>{requestId}</strong>{completedAt && <small>{new Date(completedAt).toLocaleString(language === "ar" ? "ar" : "en")}</small>}</div>

      <div className="request-status-grid">
        <div><span>{copy.status}</span><strong>{copy.statusValue}</strong></div>
        <div><span>{copy.nextStep}</span><strong>{copy.nextStepValue}</strong></div>
        <div><span>{copy.contactMethod}</span><strong>{t(preferredContact)}</strong></div>
      </div>

      {actionStatus && <p className="brief-action-status" role="status">{actionStatus}</p>}

      <div className="brief-actions request-finish-actions">
        <button className="button button-light" type="button" onClick={shareBrief}>{copy.share} <span>↗</span></button>
        <button className="brief-share" type="button" onClick={copyBrief}>{copied ? copy.copied : copy.copy} <span>→</span></button>
        <button className="brief-share request-edit-button" type="button" onClick={editRequest}>{copy.edit}</button>
      </div>
    </section>}
  </div></Localized>;
}
