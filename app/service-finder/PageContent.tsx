"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "../Localized";
import "./service-finder.css";

type ServiceKey = "web" | "commerce" | "brand" | "cv";

type AnswerKey = "outcome" | "priority" | "stage";

type Choice = {
  id: string;
  label: string;
  scores: Partial<Record<ServiceKey, number>>;
};

const serviceMeta = {
  web: {
    serviceParam: "Web Development",
    href: "/services/web-development",
    title: { en: "Web Development", ar: "تطوير المواقع" },
    description: {
      en: "Best when the main need is a stronger company website, landing experience or custom web product.",
      ar: "الأنسب عندما تكون الأولوية لموقع شركة أقوى أو صفحة هبوط أو منتج ويب مخصص.",
    },
    covers: {
      en: ["Business websites", "Landing pages", "Custom web apps"],
      ar: ["مواقع الشركات", "صفحات الهبوط", "تطبيقات ويب مخصصة"],
    },
  },
  commerce: {
    serviceParam: "E-commerce & Systems",
    href: "/services/ecommerce-systems",
    title: { en: "E-commerce & Systems", ar: "التجارة الإلكترونية والأنظمة" },
    description: {
      en: "Best when the project involves selling online, improving customer flow or building an operational system.",
      ar: "الأنسب عندما يرتبط المشروع بالبيع أونلاين أو تحسين رحلة العميل أو بناء نظام تشغيلي.",
    },
    covers: {
      en: ["Online stores", "Dashboards", "Custom systems"],
      ar: ["متاجر إلكترونية", "لوحات تحكم", "أنظمة مخصصة"],
    },
  },
  brand: {
    serviceParam: "Brand Identity",
    href: "/services/brand-identity",
    title: { en: "Brand Identity", ar: "الهوية البصرية" },
    description: {
      en: "Best when the business needs a clearer visual direction, stronger identity and more consistent presentation.",
      ar: "الأنسب عندما يحتاج النشاط إلى اتجاه بصري أوضح وهوية أقوى وحضور أكثر اتساقًا.",
    },
    covers: {
      en: ["Logo direction", "Visual system", "Brand guidelines"],
      ar: ["اتجاه الشعار", "النظام البصري", "دليل الهوية"],
    },
  },
  cv: {
    serviceParam: "CV & Portfolio",
    href: "/services/cv-portfolio",
    title: { en: "CV & Portfolio", ar: "السيرة الذاتية والملف المهني" },
    description: {
      en: "Best when the goal is to present professional experience, work and personal value more clearly.",
      ar: "الأنسب عندما يكون الهدف تقديم الخبرة والأعمال والقيمة المهنية بصورة أوضح وأكثر احترافية.",
    },
    covers: {
      en: ["Professional CV", "Portfolio", "Personal presence"],
      ar: ["سيرة ذاتية احترافية", "Portfolio", "حضور مهني"],
    },
  },
} as const;

const copy = {
  en: {
    kicker: "SERVICE FINDER",
    title: "Start with the need, not the technical answer.",
    lead: "Answer three focused questions. We’ll map your answers to the LINETECH service that best matches the outcome you want.",
    step: "Question",
    of: "of",
    questions: [
      {
        key: "outcome" as AnswerKey,
        title: "What are you mainly trying to improve?",
        helper: "Choose the result that matters most right now.",
        choices: [
          { id: "presence", label: "My company website or digital presence", scores: { web: 4, brand: 1 } },
          { id: "sales", label: "Online sales, customer flow or business operations", scores: { commerce: 4, web: 1 } },
          { id: "identity", label: "How my brand looks and feels", scores: { brand: 4, web: 1 } },
          { id: "career", label: "How I present my experience and work", scores: { cv: 5 } },
        ] as Choice[],
      },
      {
        key: "priority" as AnswerKey,
        title: "What matters most in the first version?",
        helper: "This helps us separate presentation needs from operational needs.",
        choices: [
          { id: "leads", label: "Credibility, clarity and generating leads", scores: { web: 3, brand: 1 } },
          { id: "operations", label: "Orders, workflows, dashboards or automation", scores: { commerce: 4 } },
          { id: "consistency", label: "A stronger and more consistent identity", scores: { brand: 4 } },
          { id: "presentation", label: "A stronger professional presentation", scores: { cv: 4 } },
        ] as Choice[],
      },
      {
        key: "stage" as AnswerKey,
        title: "Where are you starting from?",
        helper: "The starting point helps us understand the type of engagement you likely need.",
        choices: [
          { id: "new", label: "A new idea or business", scores: { web: 1, brand: 2, commerce: 1 } },
          { id: "existing", label: "An existing business that needs improvement", scores: { web: 2, commerce: 2, brand: 1 } },
          { id: "rebuild", label: "An existing website or product that needs a rebuild", scores: { web: 3, commerce: 2 } },
          { id: "professional", label: "My own professional profile or career material", scores: { cv: 4 } },
        ] as Choice[],
      },
    ],
    back: "Back",
    reset: "Start again",
    resultKicker: "RECOMMENDED STARTING POINT",
    resultTitle: "The closest fit for your answers is",
    reason: "Why this fits",
    covers: "This service usually covers",
    view: "View service details",
    start: "Start this project",
    note: "This recommendation is a starting point. Final scope is defined after LINETECH reviews the project request.",
  },
  ar: {
    kicker: "موجّه الخدمات",
    title: "ابدأ بالاحتياج، وليس بالحل التقني.",
    lead: "أجب عن ثلاثة أسئلة مركزة، وسنربط إجاباتك بالخدمة الأقرب للنتيجة التي تريد تحقيقها مع لاين تك.",
    step: "السؤال",
    of: "من",
    questions: [
      {
        key: "outcome" as AnswerKey,
        title: "ما الشيء الأساسي الذي تريد تحسينه؟",
        helper: "اختر النتيجة الأهم بالنسبة لك الآن.",
        choices: [
          { id: "presence", label: "موقع شركتي أو حضورها الرقمي", scores: { web: 4, brand: 1 } },
          { id: "sales", label: "البيع أونلاين أو رحلة العميل أو عمليات العمل", scores: { commerce: 4, web: 1 } },
          { id: "identity", label: "شكل الهوية وطريقة ظهور العلامة", scores: { brand: 4, web: 1 } },
          { id: "career", label: "طريقة عرض خبرتي وأعمالي المهنية", scores: { cv: 5 } },
        ] as Choice[],
      },
      {
        key: "priority" as AnswerKey,
        title: "ما الأولوية الأهم في النسخة الأولى؟",
        helper: "هذا يوضح الفرق بين احتياج بصري واحتياج تشغيلي.",
        choices: [
          { id: "leads", label: "الموثوقية والوضوح وجذب العملاء", scores: { web: 3, brand: 1 } },
          { id: "operations", label: "الطلبات أو سير العمل أو لوحات التحكم أو الأتمتة", scores: { commerce: 4 } },
          { id: "consistency", label: "هوية أقوى وأكثر اتساقًا", scores: { brand: 4 } },
          { id: "presentation", label: "عرض مهني أقوى", scores: { cv: 4 } },
        ] as Choice[],
      },
      {
        key: "stage" as AnswerKey,
        title: "من أين تبدأ؟",
        helper: "نقطة البداية تساعدنا على فهم نوع العمل الأقرب لاحتياجك.",
        choices: [
          { id: "new", label: "فكرة أو نشاط جديد", scores: { web: 1, brand: 2, commerce: 1 } },
          { id: "existing", label: "نشاط قائم يحتاج إلى تحسين", scores: { web: 2, commerce: 2, brand: 1 } },
          { id: "rebuild", label: "موقع أو منتج حالي يحتاج إلى إعادة بناء", scores: { web: 3, commerce: 2 } },
          { id: "professional", label: "ملفي المهني أو موادي الوظيفية", scores: { cv: 4 } },
        ] as Choice[],
      },
    ],
    back: "رجوع",
    reset: "ابدأ من جديد",
    resultKicker: "نقطة البداية المقترحة",
    resultTitle: "الخدمة الأقرب لإجاباتك هي",
    reason: "لماذا تناسبك",
    covers: "هذه الخدمة تغطي عادةً",
    view: "شاهد تفاصيل الخدمة",
    start: "ابدأ هذا المشروع",
    note: "هذا اقتراح لنقطة البداية. يتم تحديد النطاق النهائي بعد مراجعة لاين تك لطلب المشروع.",
  },
} as const;

export default function PageContent() {
  const language = useLanguage();
  const t = copy[language];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, Choice>>>({});
  const done = index >= t.questions.length;

  const recommendation = useMemo(() => {
    const scores: Record<ServiceKey, number> = { web: 0, commerce: 0, brand: 0, cv: 0 };
    Object.values(answers).forEach(answer => {
      if (!answer) return;
      Object.entries(answer.scores).forEach(([key, value]) => {
        scores[key as ServiceKey] += value || 0;
      });
    });
    return (Object.keys(scores) as ServiceKey[]).sort((a, b) => scores[b] - scores[a])[0];
  }, [answers]);

  const selectedService = serviceMeta[recommendation];
  const question = t.questions[index];

  function choose(choice: Choice) {
    if (!question) return;
    setAnswers(current => ({ ...current, [question.key]: choice }));
    setIndex(current => current + 1);
  }

  function reset() {
    setAnswers({});
    setIndex(0);
  }

  return (
    <main className="finder-page ref-page">
      <section className="finder-hero">
        <div className="ref-shell finder-hero-shell">
          <div>
            <p className="finder-kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
          </div>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="finder-stage">
        <div className="ref-shell finder-shell">
          {!done && question ? (
            <>
              <div className="finder-progress" aria-label={`${t.step} ${index + 1} ${t.of} ${t.questions.length}`}>
                <span>{t.step} {String(index + 1).padStart(2, "0")} {t.of} {String(t.questions.length).padStart(2, "0")}</span>
                <div>{t.questions.map((_, i) => <i key={i} className={i <= index ? "active" : ""} />)}</div>
              </div>

              <div className="finder-question">
                <div className="finder-question-copy">
                  <h2>{question.title}</h2>
                  <p>{question.helper}</p>
                </div>
                <div className="finder-options">
                  {question.choices.map((choice, optionIndex) => (
                    <button key={choice.id} type="button" onClick={() => choose(choice)}>
                      <span>{String(optionIndex + 1).padStart(2, "0")}</span>
                      <strong>{choice.label}</strong>
                      <b aria-hidden="true">→</b>
                    </button>
                  ))}
                </div>
              </div>

              {index > 0 && <button className="finder-back" type="button" onClick={() => setIndex(current => Math.max(0, current - 1))}>{t.back}</button>}
            </>
          ) : (
            <div className="finder-result">
              <div className="finder-result-head">
                <div>
                  <p className="finder-kicker">{t.resultKicker}</p>
                  <h2>{t.resultTitle}<br/><span>{selectedService.title[language]}</span></h2>
                </div>
                <span className="finder-result-code">{recommendation.toUpperCase()} / 01</span>
              </div>

              <div className="finder-result-grid">
                <article>
                  <span>01</span>
                  <h3>{t.reason}</h3>
                  <p>{selectedService.description[language]}</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>{t.covers}</h3>
                  <ul>{selectedService.covers[language].map(item => <li key={item}>{item}</li>)}</ul>
                </article>
              </div>

              <div className="finder-result-actions">
                <Link className="ref-btn primary" href={`/start?service=${encodeURIComponent(selectedService.serviceParam)}`}>{t.start} ↗</Link>
                <Link className="ref-btn ghost" href={selectedService.href}>{t.view}</Link>
                <button type="button" onClick={reset}>{t.reset}</button>
              </div>
              <p className="finder-result-note">{t.note}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
