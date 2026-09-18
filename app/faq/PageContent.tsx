"use client";

import ContentHeroArt from "../ContentHeroArt";
import Link from "next/link";
import { useLanguage } from "../Localized";
import "./faq.css";

const copy = {
  en: {
    heroTitle: "Clear answers before we build.",
    heroLead: "Common questions about scope, payments, revisions, launch and the way LINETECH approaches project work.",
    heroRail: ["Starting", "Scope & payment", "Reviews & delivery", "After launch"],
    sideKicker: "WORKING TOGETHER",
    sideTitle: "Keep the process clear from the first line.",
    sideLead: "If your question is specific to your project, prepare the brief first, then share it through your preferred contact channel.",
    cta: "Start Your Line",
    faqs: [
      ["How do we start a project?","Start with the project brief. You can explain the idea in simple language; technical details can be defined after the goal and scope are clear."],
      ["Do I need a complete specification before contacting LINETECH?","No. A rough idea is enough to begin the conversation. The first step is understanding the outcome, then defining the useful scope."],
      ["How are project payments structured?","The payment structure depends on the project scope and is confirmed in the project proposal before work begins. The proposal should make the agreed stages, amounts, currency and payment method clear."],
      ["How long does a project take?","Timing depends on the type of work, scope, content readiness and feedback speed. The schedule is defined after the project is understood rather than promising one fixed duration for every project."],
      ["Can the scope change after work begins?","Yes, but changes that affect the agreed scope, timeline or deliverables are reviewed before they are added so the project stays controlled."],
      ["Are revisions included?","Revisions are handled within the agreed project scope. The exact review stages and what is included are defined before execution begins."],
      ["Who handles hosting and deployment?","For web projects, deployment can be prepared as part of the project. The exact hosting setup depends on the product and is agreed during planning."],
      ["What happens after launch?","The handover includes the agreed project assets and launch state. Ongoing maintenance or support can be scoped separately when needed."],
    ],
  },
  ar: {
    heroTitle: "إجابات واضحة قبل أن نبدأ البناء.",
    heroLead: "أسئلة شائعة حول النطاق والدفعات والتعديلات والإطلاق وطريقة تعامل لاين تك مع المشاريع.",
    heroRail: ["البداية", "النطاق والدفعات", "المراجعات والتسليم", "بعد الإطلاق"],
    sideKicker: "العمل معًا",
    sideTitle: "اجعل العملية واضحة من الخط الأول.",
    sideLead: "إذا كان سؤالك مرتبطًا بمشروعك تحديدًا، جهّز طلب المشروع أولًا ثم شاركه عبر قناة التواصل التي تفضلها.",
    cta: "ابدأ خطك",
    faqs: [
      ["كيف نبدأ مشروعًا؟","ابدأ بطلب المشروع. يمكنك شرح الفكرة بلغة بسيطة، ويمكن تحديد التفاصيل التقنية بعد أن تصبح النتيجة والنطاق واضحين."],
      ["هل أحتاج إلى مواصفات كاملة قبل التواصل مع لاين تك؟","لا. تكفي فكرة أولية لبدء الحوار. الخطوة الأولى هي فهم النتيجة المطلوبة ثم تحديد النطاق المفيد."],
      ["كيف يتم تنظيم دفعات المشروع؟","يعتمد نظام الدفعات على نطاق المشروع ويتم تأكيده داخل عرض المشروع قبل بدء العمل. يجب أن يوضح العرض المراحل والمبالغ والعملة وطريقة الدفع المتفق عليها."],
      ["كم يستغرق المشروع؟","تعتمد المدة على نوع العمل والنطاق وجاهزية المحتوى وسرعة المراجعات. يتم تحديد الجدول بعد فهم المشروع بدل إعطاء مدة ثابتة لكل المشاريع."],
      ["هل يمكن تغيير النطاق بعد بدء العمل؟","نعم، لكن أي تغيير يؤثر على النطاق أو المدة أو المخرجات المتفق عليها تتم مراجعته قبل إضافته حتى يبقى المشروع منظمًا."],
      ["هل التعديلات مشمولة؟","تتم التعديلات ضمن نطاق المشروع المتفق عليه، ويتم تحديد مراحل المراجعة وما هو مشمول قبل بدء التنفيذ."],
      ["من يتولى الاستضافة والنشر؟","في مشاريع الويب يمكن تجهيز النشر كجزء من المشروع. ويعتمد إعداد الاستضافة على نوع المنتج ويتم الاتفاق عليه أثناء التخطيط."],
      ["ماذا يحدث بعد الإطلاق؟","يشمل التسليم حالة الإطلاق وأصول المشروع المتفق عليها. ويمكن تحديد الصيانة أو الدعم المستمر بشكل منفصل عند الحاجة."],
    ],
  },
} as const;

export default function FaqPage(){
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className="info-page page-faq">
      <section className="faq-hero info-page-hero" data-content-hero="faq">
        <ContentHeroArt motif="faq" />
        <div className="faq-hero-shell">
          <div className="faq-hero-copy">
            <p className="ref-kicker">FAQ</p>
            <h1>{t.heroTitle}</h1>
            <p className="faq-hero-lead">{t.heroLead}</p>
          </div>

          <div className="faq-hero-rail" aria-label="FAQ categories">
            {t.heroRail.map((item,index)=>(
              <div key={item}>
                <span>{String(index + 1).padStart(2,"0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-shell faq-content-grid">
          <aside className="faq-aside">
            <p className="ref-kicker">{t.sideKicker}</p>
            <h2>{t.sideTitle}</h2>
            <p>{t.sideLead}</p>
            <Link className="ref-btn ghost faq-aside-button" href="/start" prefetch>
              {t.cta} <span aria-hidden="true">→</span>
            </Link>
          </aside>

          <div className="faq-list">
            {t.faqs.map(([question,answer],index)=>(
              <details className="faq-item" key={question}>
                <summary>
                  <span className="faq-question-index">{String(index + 1).padStart(2,"0")}</span>
                  <strong>{question}</strong>
                  <i aria-hidden="true"/>
                </summary>
                <div className="faq-answer">
                  <span aria-hidden="true"/>
                  <p>{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
