"use client";

import Link from "next/link";
import Localized, { useLanguage } from "../Localized";
import ProjectIntake from "./ProjectIntake";
import WorkspaceAfterRequest from "./WorkspaceAfterRequest";
import "./start.css";
import "./intake.css";
import "./brief-premium.css";
import "./custom-select.css";
import "./journey.css";

const briefNotesCopy = {
  en: [
    ["01", "Your project information stays in your browser until you choose to share it."],
    ["02", "Four focused steps take you from basic details to a reviewed project request."],
    ["03", "Completing the request creates a reference number and opens the path to your Client Workspace."],
  ],
  ar: [
    ["01", "تبقى معلومات مشروعك داخل المتصفح حتى تختار مشاركتها."],
    ["02", "أربع خطوات مركزة تنقلك من البيانات الأساسية إلى طلب مشروع تمت مراجعته."],
    ["03", "إتمام الطلب ينشئ رقمًا مرجعيًا ويفتح لك المسار إلى مساحة العميل."],
  ],
} as const;

const journeyCopy = {
  en: {
    kicker: "FROM SERVICE TO HANDOVER",
    title: "One clear path from idea to delivery.",
    lead: "LINETECH projects are custom services. You choose the closest service, prepare and complete a project request, hand it to LINETECH, agree the scope, then move through build and handover.",
    steps: [
      ["01", "Choose service", "Review the four services and choose the closest fit for what you want to achieve."],
      ["02", "Prepare request", "Add the goal, current stage, must-have features, timing and any useful references."],
      ["03", "Review & complete", "Review the final request, confirm the details and complete it to receive a reference number."],
      ["04", "Share & scope", "Hand the completed request to LINETECH, then agree deliverables, timing, reviews and commercial terms."],
      ["05", "Build & review", "Design and development move through the agreed stages, with review points kept clear."],
      ["06", "Handover", "You receive the deployed product plus the agreed files, assets, access and credentials."],
    ],
    ctaLead: "Choose the service, complete your project request and hand it to LINETECH when you are ready to begin.",
    ctaButton: "Start your request ↗",
  },
  ar: {
    kicker: "من الخدمة إلى التسليم",
    title: "مسار واضح من الفكرة إلى التسليم.",
    lead: "مشاريع لاين تك خدمات مخصصة. تختار الخدمة الأقرب لاحتياجك، تجهز طلب المشروع وتتمّه، تسلمه إلى لاين تك، نتفق على النطاق، ثم ننتقل إلى التنفيذ والتسليم.",
    steps: [
      ["01", "اختر الخدمة", "راجع الخدمات الأربع واختر الخدمة الأقرب للنتيجة التي تريد الوصول إليها."],
      ["02", "جهز الطلب", "أضف الهدف، مرحلة المشروع، المتطلبات الأساسية، التوقيت وأي مراجع مفيدة."],
      ["03", "راجع وأتم الطلب", "راجع الطلب النهائي، أكد صحة البيانات ثم أتمه للحصول على رقم مرجعي."],
      ["04", "سلّم الطلب وحدد النطاق", "سلّم الطلب المكتمل إلى لاين تك ثم نتفق على المخرجات والتوقيت والمراجعات والشروط التجارية."],
      ["05", "البناء والمراجعة", "يمر التصميم والتطوير بالمراحل المتفق عليها مع نقاط مراجعة واضحة."],
      ["06", "التسليم", "تستلم المنتج المنشور مع الملفات والأصول والصلاحيات وبيانات الدخول المتفق عليها."],
    ],
    ctaLead: "اختر الخدمة، أتم طلب مشروعك، ثم سلّمه إلى لاين تك عندما تكون جاهزًا للبدء.",
    ctaButton: "ابدأ طلبك ↖",
  },
} as const;

export default function StartPage() {
  const language = useLanguage();
  const journey = journeyCopy[language];
  const briefNotes = briefNotesCopy[language];

  return (
    <Localized>
      <main className="ref-page page-contact">
        <section className="contact-hero">
          <div className="contact-signal" aria-hidden="true">
            <span className="contact-signal-line contact-signal-line-main" />
            <span className="contact-signal-line contact-signal-line-top" />
            <span className="contact-signal-line contact-signal-line-bottom" />
            <i className="contact-signal-node node-one" />
            <i className="contact-signal-node node-two" />
            <i className="contact-signal-node node-three" />
            <i className="contact-signal-pulse" />
          </div>

          <div className="ref-shell contact-hero-shell">
            <div className="contact-hero-copy">
              <p className="ref-kicker">START YOUR LINE</p>
              <h1>Tell us what you want to build.</h1>
              <p className="contact-hero-lead">Start with the idea — even if it is still rough. We will use the brief to turn it into a clear first line.</p>
              <div className="contact-hero-actions">
                <a className="ref-btn primary" href="#brief">Start the brief ↘</a>
                <Link className="ref-btn ghost" href="/services" prefetch>View services</Link>
              </div>
            </div>

            <div className="contact-hero-index" aria-hidden="true">
              <span>01</span><i />
              <span>02</span><i />
              <span>03</span>
            </div>
          </div>
        </section>

        <section id="brief" className="contact-brief-section">
          <div className="ref-shell contact-brief-grid">
            <aside className="contact-brief-intro">
              <p className="ref-kicker">PROJECT BRIEF</p>
              <h2>One clear line before we build.</h2>
              <p>Fill in what you know. You do not need technical knowledge or every answer yet.</p>

              <div className="contact-brief-notes">
                {briefNotes.map(([number, text]) => (
                  <div key={number}>
                    <span>{number}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </aside>

            <div className="contact-intake-panel">
              <ProjectIntake />
              <WorkspaceAfterRequest />
            </div>
          </div>
        </section>

        <section className="contact-next-section contact-client-journey">
          <div className="ref-shell">
            <div className="contact-section-head">
              <div>
                <p className="ref-kicker">{journey.kicker}</p>
                <h2>{journey.title}</h2>
              </div>
              <p>{journey.lead}</p>
            </div>

            <div className="contact-next-rail">
              {journey.steps.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-final-cta">
          <div className="ref-shell contact-final-cta-inner">
            <div>
              <p className="ref-kicker">LINETECH</p>
              <h2>Every idea starts with a line.</h2>
              <p>{journey.ctaLead}</p>
            </div>
            <a className="ref-btn primary" href="#brief">{journey.ctaButton}</a>
          </div>
        </section>
      </main>
    </Localized>
  );
}
