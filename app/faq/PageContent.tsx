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
    sideSteps: ["Prepare your brief", "Define the scope", "Start the conversation"],
    cta: "Start Your Line",
    questionsKicker: "QUESTIONS BY STAGE",
    questionsTitle: "What you need to know, exactly when you need it.",
    questionsLead: "The essentials are grouped around the project journey so you can find the right answer without reading a wall of text.",
    groups: [
      {
        number: "01",
        label: "GETTING STARTED",
        items: [
          ["How do we start a project?","Start with the project brief. You can explain the idea in simple language; technical details can be defined after the goal and scope are clear."],
          ["Do I need a complete specification before contacting LINETECH?","No. A rough idea is enough to begin the conversation. The first step is understanding the outcome, then defining the useful scope."],
        ],
      },
      {
        number: "02",
        label: "SCOPE & PAYMENT",
        items: [
          ["How are project payments structured?","The payment structure depends on the project scope and is confirmed in the project proposal before work begins. The proposal should make the agreed stages, amounts, currency and payment method clear."],
          ["Can the scope change after work begins?","Yes, but changes that affect the agreed scope, timeline or deliverables are reviewed before they are added so the project stays controlled."],
        ],
      },
      {
        number: "03",
        label: "REVIEWS & DELIVERY",
        items: [
          ["How long does a project take?","Timing depends on the type of work, scope, content readiness and feedback speed. The schedule is defined after the project is understood rather than promising one fixed duration for every project."],
          ["Are revisions included?","Revisions are handled within the agreed project scope. The exact review stages and what is included are defined before execution begins."],
          ["Who handles hosting and deployment?","For web projects, deployment can be prepared as part of the project. The exact hosting setup depends on the product and is agreed during planning."],
        ],
      },
      {
        number: "04",
        label: "AFTER LAUNCH",
        items: [
          ["What happens after launch?","The handover includes the agreed project assets and launch state. Ongoing maintenance or support can be scoped separately when needed."],
        ],
      },
    ],
    standardKicker: "BEFORE WE BUILD",
    standardTitle: "Four things stay clear.",
    standardLead: "A strong project starts with shared expectations, not assumptions.",
    standard: [
      ["01","SCOPE","What is included and what is not."],
      ["02","PAYMENT","Stages, amounts and timing."],
      ["03","REVIEWS","When feedback happens and what is included."],
      ["04","HANDOVER","What you receive when the work is complete."],
    ],
    finalKicker: "STILL HAVE A QUESTION?",
    finalTitle: "Your project does not need to be fully figured out.",
    finalLead: "Start with the idea. We will help define the right first line, scope and next step.",
    finalButton: "Start your project request",
  },
  ar: {
    heroTitle: "إجابات واضحة قبل أن نبدأ البناء.",
    heroLead: "أسئلة شائعة حول النطاق والدفعات والتعديلات والإطلاق وطريقة تعامل لاين تك مع المشاريع.",
    heroRail: ["البداية", "النطاق والدفعات", "المراجعات والتسليم", "بعد الإطلاق"],
    sideKicker: "العمل معًا",
    sideTitle: "اجعل العملية واضحة من الخط الأول.",
    sideLead: "إذا كان سؤالك مرتبطًا بمشروعك تحديدًا، جهّز طلب المشروع أولًا ثم شاركه عبر قناة التواصل التي تفضلها.",
    sideSteps: ["جهّز طلبك", "حدّد النطاق", "ابدأ المحادثة"],
    cta: "ابدأ خطك",
    questionsKicker: "الأسئلة حسب المرحلة",
    questionsTitle: "ما تحتاج معرفته، في اللحظة التي تحتاجه فيها.",
    questionsLead: "رتبنا الأسئلة حول رحلة المشروع حتى تصل للإجابة المناسبة مباشرة بدون قراءة كتلة طويلة من النصوص.",
    groups: [
      {
        number: "01",
        label: "البداية",
        items: [
          ["كيف نبدأ مشروعًا؟","ابدأ بطلب المشروع. يمكنك شرح الفكرة بلغة بسيطة، ويمكن تحديد التفاصيل التقنية بعد أن تصبح النتيجة والنطاق واضحين."],
          ["هل أحتاج إلى مواصفات كاملة قبل التواصل مع لاين تك؟","لا. تكفي فكرة أولية لبدء الحوار. الخطوة الأولى هي فهم النتيجة المطلوبة ثم تحديد النطاق المفيد."],
        ],
      },
      {
        number: "02",
        label: "النطاق والدفعات",
        items: [
          ["كيف يتم تنظيم دفعات المشروع؟","يعتمد نظام الدفعات على نطاق المشروع ويتم تأكيده داخل عرض المشروع قبل بدء العمل. يجب أن يوضح العرض المراحل والمبالغ والعملة وطريقة الدفع المتفق عليها."],
          ["هل يمكن تغيير النطاق بعد بدء العمل؟","نعم، لكن أي تغيير يؤثر على النطاق أو المدة أو المخرجات المتفق عليها تتم مراجعته قبل إضافته حتى يبقى المشروع منظمًا."],
        ],
      },
      {
        number: "03",
        label: "المراجعات والتسليم",
        items: [
          ["كم يستغرق المشروع؟","تعتمد المدة على نوع العمل والنطاق وجاهزية المحتوى وسرعة المراجعات. يتم تحديد الجدول بعد فهم المشروع بدل إعطاء مدة ثابتة لكل المشاريع."],
          ["هل التعديلات مشمولة؟","تتم التعديلات ضمن نطاق المشروع المتفق عليه، ويتم تحديد مراحل المراجعة وما هو مشمول قبل بدء التنفيذ."],
          ["من يتولى الاستضافة والنشر؟","في مشاريع الويب يمكن تجهيز النشر كجزء من المشروع. ويعتمد إعداد الاستضافة على نوع المنتج ويتم الاتفاق عليه أثناء التخطيط."],
        ],
      },
      {
        number: "04",
        label: "بعد الإطلاق",
        items: [
          ["ماذا يحدث بعد الإطلاق؟","يشمل التسليم حالة الإطلاق وأصول المشروع المتفق عليها. ويمكن تحديد الصيانة أو الدعم المستمر بشكل منفصل عند الحاجة."],
        ],
      },
    ],
    standardKicker: "قبل أن نبدأ البناء",
    standardTitle: "أربع نقاط تبقى واضحة.",
    standardLead: "المشروع القوي يبدأ بتوقعات مشتركة وواضحة، وليس بالافتراضات.",
    standard: [
      ["01","النطاق","ما الذي يشمله المشروع وما الذي لا يشمله."],
      ["02","الدفعات","المراحل والمبالغ والتوقيت."],
      ["03","المراجعات","متى تحدث المراجعة وما هو المشمول."],
      ["04","التسليم","ما الذي تستلمه عند اكتمال العمل."],
    ],
    finalKicker: "ما زال لديك سؤال؟",
    finalTitle: "لا يحتاج مشروعك أن يكون مكتمل التفاصيل قبل أن تبدأ.",
    finalLead: "ابدأ بالفكرة، وسنساعدك في تحديد الخط الأول والنطاق والخطوة التالية.",
    finalButton: "ابدأ طلب مشروعك",
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

      <section className="faq-main">
        <div className="faq-shell">
          <header className="faq-section-head">
            <div>
              <p className="ref-kicker">{t.questionsKicker}</p>
              <h2>{t.questionsTitle}</h2>
            </div>
            <p>{t.questionsLead}</p>
          </header>

          <div className="faq-layout">
            <aside className="faq-aside">
              <p className="ref-kicker">{t.sideKicker}</p>
              <h3>{t.sideTitle}</h3>
              <p>{t.sideLead}</p>

              <div className="faq-aside-steps">
                {t.sideSteps.map((step,index)=>(
                  <div key={step}><span>{String(index + 1).padStart(2,"0")}</span><strong>{step}</strong></div>
                ))}
              </div>

              <Link className="ref-btn ghost faq-aside-button" href="/start" prefetch>
                {t.cta} <span aria-hidden="true">→</span>
              </Link>
            </aside>

            <div className="faq-groups">
              {t.groups.map((group)=>(
                <section className="faq-group" key={group.number}>
                  <header className="faq-group-head">
                    <div><span>{group.number}</span><i aria-hidden="true"/></div>
                    <p>{group.label}</p>
                    <small>{String(group.items.length).padStart(2,"0")} Q</small>
                  </header>

                  <div className="faq-questions">
                    {group.items.map(([question,answer],index)=>(
                      <details className="faq-item" key={question}>
                        <summary>
                          <span className="faq-question-index">{group.number}.{index + 1}</span>
                          <strong>{question}</strong>
                          <i aria-hidden="true"/>
                        </summary>
                        <div className="faq-answer">
                          <span aria-hidden="true">ANSWER</span>
                          <p>{answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="faq-standard">
        <div className="faq-shell">
          <div className="faq-standard-head">
            <div>
              <p className="ref-kicker">{t.standardKicker}</p>
              <h2>{t.standardTitle}</h2>
            </div>
            <p>{t.standardLead}</p>
          </div>

          <div className="faq-standard-rail">
            {t.standard.map(([number,title,text])=>(
              <article key={number}>
                <span>{number}</span>
                <i aria-hidden="true"/>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-final">
        <div className="faq-final-glow" aria-hidden="true"/>
        <div className="faq-shell faq-final-inner">
          <div>
            <p className="ref-kicker">{t.finalKicker}</p>
            <h2>{t.finalTitle}</h2>
            <p>{t.finalLead}</p>
          </div>
          <Link className="ref-btn primary" href="/start" prefetch>{t.finalButton} <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
