"use client";

import Localized, { useTranslation } from "../Localized";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const serviceOptions = [
  "Web Development",
  "E-commerce & Systems",
  "Brand Identity",
  "CV & Portfolio",
  "Other",
];

export default function ProjectBriefForm() {
  const t = useTranslation();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("Not sure yet");
  const [timing, setTiming] = useState("Flexible");

  useEffect(() => {
    try {
      const value = new URLSearchParams(window.location.search).get("service") || "";
      if (serviceOptions.includes(value)) setService(value);
    } catch {}
  }, []);

  const brief = useMemo(() => [
    t("LINETECH — START YOUR LINE"),
    "",
    `${t("Name")}：${name || "—"}`,
    `${t("Company / Brand")}：${company || "—"}`,
    `${t("Contact")}：${contact || "—"}`,
    `${t("Project type")}：${t(service || "—")}`,
    `${t("Budget status")}：${t(budget)}`,
    `${t("Target timing")}：${t(timing)}`,
    "",
    t("IDEA"),
    idea || "—",
    "",
    t("AUDIENCE / USER"),
    audience || "—",
    "",
    t("Generated from the LINETECH project intake."),
  ].join("\n"), [t, name, company, contact, service, idea, audience, budget, timing]);

  async function copyBrief(event: FormEvent) {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function shareBrief() {
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(brief);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      } catch {}
      return;
    }
    try {
      await navigator.share({ title: t("LINETECH Project Brief"), text: brief });
    } catch {}
  }

  return (
    <Localized><form className="project-brief-form" onSubmit={copyBrief}>
      <p className="frontend-only-note">This brief stays on your device. Nothing is sent or stored by this form; you choose when to copy or share it.</p>

      <div className="form-row two-col">
        <label><span>Your name *</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required /></label>
        <label><span>Company / Brand</span><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" /></label>
      </div>

      <div className="form-row two-col">
        <label><span>Email or WhatsApp *</span><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="How should we reach you?" required /></label>
        <label><span>Project type *</span><select value={service} onChange={(e) => setService(e.target.value)} required><option value="" disabled>Select a service</option>{serviceOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>

      <label className="form-wide"><span>What do you want to build? *</span><textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe the idea, the problem, and what you want the final result to do." rows={7} required /></label>
      <label className="form-wide"><span>Who is it for?</span><textarea value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Customers, companies, a team, job recruiters, a specific market..." rows={4} /></label>

      <div className="form-row two-col">
        <fieldset><legend>Budget status</legend><div className="choice-grid">{["Not sure yet", "Defined", "Need guidance"].map((item) => <label className={`choice ${budget === item ? "selected" : ""}`} key={item}><input type="radio" name="budget" value={item} checked={budget === item} onChange={() => setBudget(item)} /><span>{item}</span></label>)}</div></fieldset>
        <fieldset><legend>Launch timing</legend><div className="choice-grid">{["ASAP", "1–2 months", "3+ months", "Flexible"].map((item) => <label className={`choice ${timing === item ? "selected" : ""}`} key={item}><input type="radio" name="timing" value={item} checked={timing === item} onChange={() => setTiming(item)} /><span>{item}</span></label>)}</div></fieldset>
      </div>

      <div className="brief-preview">
        <div><p className="eyebrow">READY BRIEF</p><h3>Your first line is ready.</h3><p>Copy or share this brief when you are ready to continue the conversation with LINETECH.</p></div>
        <div className="brief-actions">
          <button className="button button-light" type="submit">{copied ? "Copied ✓" : "Copy project brief"} <span>↗</span></button>
          <button className="brief-share" type="button" onClick={shareBrief}>Share brief <span>→</span></button>
          <Link className="brief-share" href="/thank-you" prefetch>Preview next step <span>→</span></Link>
        </div>
      </div>
    </form></Localized>
  );
}
