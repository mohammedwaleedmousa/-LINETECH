"use client";

import ContentHeroArt from "../ContentHeroArt";

import Link from "next/link";
import { useLanguage } from "../Localized";
import "./how-we-work.css";

const copy = {
  en: {
    kicker: "HOW WE WORK",
    title: "A clear project path, from first request to handover.",
    lead: "LINETECH projects move through defined stages so scope, decisions, reviews and delivery stay visible from the beginning.",
    phases: [
      {
        n: "01",
        title: "Project request",
        summary: "We start by understanding the need before deciding the technical answer.",
        you: "Your goal, current situation, must-have needs and useful references.",
        us: "Review the request, identify the closest service and clarify missing context.",
        receive: "A clear starting point for the project conversation.",
      },
      {
        n: "02",
        title: "Scope & proposal",
        summary: "The project becomes specific before execution begins.",
        you: "Feedback on priorities, constraints, timing and what matters most.",
        us: "Define deliverables, boundaries, review points, commercial terms and the proposed path.",
        receive: "An agreed scope and proposal before work starts.",
      },
      {
        n: "03",
        title: "Structure & direction",
        summary: "We shape the product or visual system before heavy execution.",
        you: "Required content, assets, brand material and key decisions when requested.",
        us: "Organize information, flows, hierarchy and the direction the project will follow.",
        receive: "A visible structure and direction to review before deeper production.",
      },
      {
        n: "04",
        title: "Design & build",
        summary: "The approved direction becomes a real digital product or final visual system.",
        you: "Focused feedback at the agreed review points.",
        us: "Design, develop, test and refine the agreed deliverables.",
        receive: "Working project stages you can review against the agreed scope.",
      },
      {
        n: "05",
        title: "Review & launch",
        summary: "We close the agreed revisions and prepare the project for real use.",
        you: "Final review, approvals and any launch information that belongs to your side.",
        us: "Complete agreed revisions, verify the final experience and prepare launch or final delivery.",
        receive: "The approved version ready for launch or final handover.",
      },
      {
        n: "06",
        title: "Handover",
        summary: "The project leaves execution with clear ownership and access.",
        you: "Confirm receipt and any agreed handover details.",
        us: "Deliver the agreed files, assets, access, credentials and deployment state.",
        receive: "The final agreed product and handover package.",
      },
    ],
    labels: { you: "YOU PROVIDE", us: "LINETECH DOES", receive: "YOU RECEIVE" },
    standards: {
      kicker: "WORKING STANDARD",
      title: "Clarity before complexity.",
      items: [
        ["Scope before execution", "Deliverables and boundaries are defined before build work begins."],
        ["Planned reviews", "Feedback is collected at clear checkpoints instead of random changes throughout the project."],
        ["No hidden handover", "Files, access and ownership items are included according to the agreed scope."],
        ["Support is defined", "Any ongoing maintenance or support is agreed separately instead of being left vague."],
      ],
    },
    cta: {
      kicker: "START THE PROCESS",
      title: "Know what you need? Start the project request.",
      lead: "If you are still choosing between services, use the Service Finder first.",
      start: "Start project request",
      finder: "Find the right service",
    },
  },
  ar: {
    kicker: "كيف نعمل",
    title: "مسار مشروع واضح، من أول طلب حتى التسليم.",
    lead: "تمر مشاريع لاين تك بمراحل محددة حتى يبقى النطاق والقرارات والمراجعات والتسليم واضحًا من البداية.",
    phases: [
      {
        n: "01",
        title: "طلب المشروع",
        summary: "نبدأ بفهم الاحتياج قبل تحديد الحل التقني.",
        you: "هدفك، الوضع الحالي، المتطلبات الأساسية وأي مراجع مفيدة.",
        us: "نراجع الطلب، نحدد الخدمة الأقرب ونوضح أي معلومات ناقصة.",
        receive: "نقطة بداية واضحة لمحادثة المشروع.",
      },
      {
        n: "02",
        title: "النطاق والعرض",
        summary: "يصبح المشروع محددًا قبل أن يبدأ التنفيذ.",
        you: "ملاحظاتك حول الأولويات والقيود والتوقيت وما يهمك أكثر.",
        us: "نحدد المخرجات والحدود ونقاط المراجعة والشروط التجارية والمسار المقترح.",
        receive: "نطاق وعرض متفق عليهما قبل بدء العمل.",
      },
      {
        n: "03",
        title: "الهيكلة والاتجاه",
        summary: "نرتب المنتج أو النظام البصري قبل الدخول في التنفيذ الثقيل.",
        you: "المحتوى والأصول ومواد الهوية والقرارات الأساسية عند طلبها.",
        us: "ننظم المعلومات والتدفقات والتسلسل والاتجاه الذي سيتبعه المشروع.",
        receive: "هيكل واتجاه واضحان للمراجعة قبل الإنتاج الأعمق.",
      },
      {
        n: "04",
        title: "التصميم والبناء",
        summary: "يتحول الاتجاه المعتمد إلى منتج رقمي حقيقي أو نظام بصري نهائي.",
        you: "ملاحظات مركزة في نقاط المراجعة المتفق عليها.",
        us: "نصمم ونطور ونختبر ونحسن المخرجات المتفق عليها.",
        receive: "مراحل عمل فعلية يمكنك مراجعتها مقابل النطاق المتفق عليه.",
      },
      {
        n: "05",
        title: "المراجعة والإطلاق",
        summary: "نغلق التعديلات المتفق عليها ونجهز المشروع للاستخدام الحقيقي.",
        you: "المراجعة النهائية والموافقات وأي بيانات إطلاق تقع ضمن مسؤوليتك.",
        us: "نكمل التعديلات المتفق عليها ونتحقق من التجربة النهائية ونجهز الإطلاق أو التسليم.",
        receive: "النسخة المعتمدة الجاهزة للإطلاق أو التسليم النهائي.",
      },
      {
        n: "06",
        title: "التسليم",
        summary: "يخرج المشروع من مرحلة التنفيذ بملكية وصلاحيات واضحة.",
        you: "تأكيد الاستلام وأي تفاصيل تسليم تم الاتفاق عليها.",
        us: "نسلم الملفات والأصول والصلاحيات وبيانات الدخول وحالة النشر المتفق عليها.",
        receive: "المنتج النهائي وحزمة التسليم المتفق عليها.",
      },
    ],
    labels: { you: "ما تقدمه أنت", us: "ما تفعله لاين تك", receive: "ما تستلمه" },
    standards: {
      kicker: "معيار العمل",
      title: "الوضوح قبل التعقيد.",
      items: [
        ["نطاق قبل التنفيذ", "يتم تحديد المخرجات والحدود قبل بدء البناء."],
        ["مراجعات مخططة", "تُجمع الملاحظات في نقاط واضحة بدل التغييرات العشوائية طوال المشروع."],
        ["تسليم واضح", "تدخل الملفات والصلاحيات وعناصر الملكية ضمن التسليم حسب النطاق المتفق عليه."],
        ["الدعم محدد", "أي صيانة أو دعم مستمر يتم الاتفاق عليه بشكل منفصل وواضح."],
      ],
    },
    cta: {
      kicker: "ابدأ العملية",
      title: "تعرف ما الذي تحتاجه؟ ابدأ طلب المشروع.",
      lead: "إذا كنت ما زلت تختار بين الخدمات، استخدم موجّه الخدمات أولًا.",
      start: "ابدأ طلب المشروع",
      finder: "اعثر على الخدمة المناسبة",
    },
  },
} as const;

export default function PageContent() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className="work-page ref-page">
      <section className="work-hero" data-content-hero="process">
        <ContentHeroArt motif="process" />
        <div className="ref-shell work-hero-grid">
          <div>
            <p className="work-kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
          </div>
          <p>{t.lead}</p>
        </div>
      </section>

      <section className="work-flow">
        <div className="ref-shell">
          {t.phases.map((phase) => (
            <article className="work-phase" key={phase.n}>
              <div className="work-phase-index"><span>{phase.n}</span><i/></div>
              <div className="work-phase-title"><h2>{phase.title}</h2><p>{phase.summary}</p></div>
              <div className="work-phase-detail">
                <div><span>{t.labels.you}</span><p>{phase.you}</p></div>
                <div><span>{t.labels.us}</span><p>{phase.us}</p></div>
                <div><span>{t.labels.receive}</span><p>{phase.receive}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="work-standard">
        <div className="ref-shell">
          <div className="work-standard-head">
            <div><p className="work-kicker">{t.standards.kicker}</p><h2>{t.standards.title}</h2></div>
          </div>
          <div className="work-standard-grid">
            {t.standards.items.map(([title, text], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-cta">
        <div className="ref-shell work-cta-inner">
          <div><p className="work-kicker">{t.cta.kicker}</p><h2>{t.cta.title}</h2><p>{t.cta.lead}</p></div>
          <div className="work-cta-actions">
            <Link className="ref-btn primary" href="/start">{t.cta.start} ↗</Link>
            <Link className="ref-btn ghost" href="/service-finder">{t.cta.finder}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
