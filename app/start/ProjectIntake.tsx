"use client";

import Localized, { useTranslation } from "../Localized";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const services = ["Web Development", "E-commerce & Systems", "Brand Identity", "CV & Portfolio", "Other"] as const;
const stages = ["New idea", "Existing project", "Redesign / rebuild", "Improve an existing system"] as const;
const goals = ["Sell / generate leads", "Bookings / requests", "Internal operations", "Build credibility", "Career / portfolio", "Other"] as const;
const preferredContacts = ["WhatsApp", "Email", "Call", "Either"] as const;
const budgets = ["Need guidance", "Small focused project", "Medium project", "Large project"];
const timings = ["ASAP", "1–2 months", "3+ months", "Flexible"];
const progressSteps = [{ n: 1, label: "About you" }, { n: 2, label: "Project" }, { n: 3, label: "Scope" }];

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

export default function ProjectIntake() {
  const [step, setStep] = useState(1);
  const t = useTranslation();
  const [copied, setCopied] = useState(false);
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
    const value = new URLSearchParams(window.location.search).get("service") || "";
    if (services.includes(value as (typeof services)[number])) setService(value);
  }, []);

  const canStep1 = Boolean(name.trim() && contact.trim() && service);
  const canStep2 = Boolean(stage && goal && idea.trim());

  const brief = useMemo(() => [
    t("LINETECH — START YOUR LINE"),
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
  ].join("\n"), [t, name, company, contact, preferredContact, service, stage, goal, audience, idea, features, references, budget, timing, notes]);

  function changeStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  async function shareBrief() {
    if (navigator.share) {
      try { await navigator.share({ title: t("LINETECH Project Brief"), text: brief }); } catch {}
      return;
    }
    await copyBrief();
  }

  return <Localized><div className="project-brief-form project-intake">
    <p className="frontend-only-note">This brief stays on your device. Nothing is sent or stored by this form.</p>

    <div className="intake-progress" aria-label={`Step ${step} of 3`}>
      {progressSteps.map(({n,label}) => <div key={n} className={`intake-progress-item ${step===n?"active":""} ${step>n?"done":""}`}><span>{String(n).padStart(2,"0")}</span><strong>{label}</strong></div>)}
    </div>

    {step===1 && <section className="intake-step">
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

    {step===2 && <section className="intake-step">
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

    {step===3 && <section className="intake-step">
      <div className="intake-step-head"><span>03 / SCOPE</span><h3>How should we frame the first move?</h3><p>These details help separate a small focused engagement from a larger product build.</p></div>
      <fieldset><legend>Budget range</legend><div className="choice-grid intake-choice-grid">{budgets.map(v=><label key={v} className={`choice ${budget===v?"selected":""}`}><input type="radio" name="budget" checked={budget===v} onChange={()=>setBudget(v)}/><span>{v}</span></label>)}</div></fieldset>
      <fieldset><legend>Launch timing</legend><div className="choice-grid intake-choice-grid">{timings.map(v=><label key={v} className={`choice ${timing===v?"selected":""}`}><input type="radio" name="timing" checked={timing===v} onChange={()=>setTiming(v)}/><span>{v}</span></label>)}</div></fieldset>
      <label className="form-wide"><span>Anything else we should know?</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Constraints, preferences, deadlines or context." rows={4}/></label>
      <div className="brief-summary"><div><span>Service</span><strong>{service||"—"}</strong></div><div><span>Stage</span><strong>{stage||"—"}</strong></div><div><span>Goal</span><strong>{goal||"—"}</strong></div><div><span>Timing</span><strong>{timing}</strong></div></div>
      <div className="brief-preview"><div><p className="eyebrow">READY BRIEF</p><h3>Your first line is ready.</h3><p>Review, copy or share this brief when you are ready to continue with LINETECH.</p></div><div className="brief-actions"><button className="button button-light" type="button" onClick={copyBrief}>{copied?"Copied ✓":"Copy project brief"} <span>↗</span></button><button className="brief-share" type="button" onClick={shareBrief}>Share brief <span>→</span></button><Link className="brief-share" href="/thank-you" prefetch>Preview next step <span>→</span></Link></div></div>
      <div className="intake-nav intake-nav-bottom"><button className="intake-back" type="button" onClick={()=>changeStep(2)}>← Back to project</button></div>
    </section>}
  </div></Localized>;
}
