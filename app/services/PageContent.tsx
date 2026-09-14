"use client";

import Link from "next/link";
import HomeHeroArt from "../HomeHeroArt";
import { useLanguage } from "../Localized";
import styles from "./services-page.module.css";
import outcomeStyles from "./services-outcome.module.css";

const copy = {
  en: {
    hero: {
      kicker: "OUR SERVICES",
      title: "Solutions for a smarter tomorrow.",
      lead: "We connect product thinking, design and engineering to build digital experiences that are clear, useful and ready for real-world operation.",
      primary: "Start Your Line",
      secondary: "View Our Work",
      index: ["Web Development", "E-commerce & Systems", "Brand Identity", "CV & Portfolio"],
    },
    services: {
      kicker: "WHAT WE BUILD",
      title: "Four focused services. One clear standard.",
      lead: "Each service is shaped around the outcome you need. No unnecessary complexity, no decorative work without purpose.",
      explore: "Explore service",
      items: [
        {
          n: "01",
          title: "Web Development",
          description: "High-performance websites and web products designed around clarity, speed and long-term scalability.",
          capabilities: ["Business websites", "Landing pages", "Custom web apps"],
          href: "/services/web-development",
        },
        {
          n: "02",
          title: "E-commerce & Systems",
          description: "Commerce experiences and operational systems built around real customer journeys and business workflows.",
          capabilities: ["Online stores", "Dashboards", "Custom systems"],
          href: "/services/ecommerce-systems",
        },
        {
          n: "03",
          title: "Brand Identity",
          description: "A focused visual system that gives your business a distinctive, consistent and credible presence.",
          capabilities: ["Logo direction", "Visual system", "Brand guidelines"],
          href: "/services/brand-identity",
        },
        {
          n: "04",
          title: "CV & Portfolio",
          description: "Professional presentation that communicates your experience, work and value with clarity.",
          capabilities: ["Professional CV", "Portfolio", "Personal presence"],
          href: "/services/cv-portfolio",
        },
      ],
    },
    decision: {
      kicker: "START WITH THE OUTCOME",
      title: "Start with the result. We’ll map the right service.",
      lead: "You do not need to know the technical solution first. Choose the outcome closest to what you want to achieve, and we’ll point you to the right starting line.",
      panel: "OUTCOME ROUTER",
      status: "SELECT A DIRECTION",
      helper: "Still not sure? Answer three focused questions and we’ll recommend the closest starting service.",
      helperLink: "Use Service Finder",
      choices: [
        { n: "01", title: "Build a stronger digital presence for my company", target: "WEB DEVELOPMENT", href: "/services/web-development" },
        { n: "02", title: "Sell online or make business operations easier", target: "E-COMMERCE & SYSTEMS", href: "/services/ecommerce-systems" },
        { n: "03", title: "Make my brand feel clearer, stronger and more credible", target: "BRAND IDENTITY", href: "/services/brand-identity" },
        { n: "04", title: "Present my experience and work more professionally", target: "CV & PORTFOLIO", href: "/services/cv-portfolio" },
      ],
    },
    process: {
      kicker: "OUR PROCESS",
      title: "One line from idea to launch.",
      lead: "A compact process keeps scope, decisions and execution aligned from the first conversation to delivery.",
      steps: [
        ["01", "Understand", "We understand the business, the idea and the real need."],
        ["02", "Define", "We define the scope, priorities and the right direction."],
        ["03", "Design", "We shape the experience before development begins."],
        ["04", "Build & Launch", "We build, test, launch and prepare the next step."],
      ],
    },
    cta: {
      kicker: "START YOUR LINE",
      title: "Tell us what you need. We’ll define the right first line.",
      lead: "You do not need to know the technical answer before you contact us. Start with the outcome you want to achieve.",
      button: "Start Your Line",
    },
  },
  ar: {
    hero: {
      kicker: "خدماتنا",
      title: "حلول لغدٍ أكثر ذكاءً.",
      lead: "نربط التفكير بالمنتج والتصميم والهندسة لبناء تجارب رقمية واضحة وعملية وجاهزة للاستخدام الحقيقي.",
      primary: "ابدأ خطك",
      secondary: "شاهد أعمالنا",
      index: ["تطوير المواقع", "التجارة الإلكترونية والأنظمة", "الهوية البصرية", "السيرة الذاتية والملف المهني"],
    },
    services: {
      kicker: "ماذا نبني",
      title: "أربع خدمات مركزة. معيار واحد واضح.",
      lead: "كل خدمة تُبنى حول النتيجة التي تحتاجها. بدون تعقيد غير ضروري، وبدون تصميم لا يخدم هدفًا حقيقيًا.",
      explore: "استكشف الخدمة",
      items: [
        {
          n: "01",
          title: "تطوير المواقع",
          description: "مواقع ومنتجات ويب عالية الأداء مبنية حول الوضوح والسرعة وقابلية التوسع على المدى الطويل.",
          capabilities: ["مواقع الشركات", "صفحات الهبوط", "تطبيقات ويب مخصصة"],
          href: "/services/web-development",
        },
        {
          n: "02",
          title: "التجارة الإلكترونية والأنظمة",
          description: "تجارب بيع وأنظمة تشغيل مبنية حول رحلة العميل الحقيقية وسير العمل داخل النشاط.",
          capabilities: ["متاجر إلكترونية", "لوحات تحكم", "أنظمة مخصصة"],
          href: "/services/ecommerce-systems",
        },
        {
          n: "03",
          title: "الهوية البصرية",
          description: "نظام بصري واضح يمنح نشاطك حضورًا مميزًا ومتناسقًا وموثوقًا عبر جميع نقاط التواصل.",
          capabilities: ["اتجاه الشعار", "النظام البصري", "دليل الهوية"],
          href: "/services/brand-identity",
        },
        {
          n: "04",
          title: "السيرة الذاتية والملف المهني",
          description: "تقديم مهني يوضح خبرتك وأعمالك وقيمتك بطريقة مرتبة ومقنعة.",
          capabilities: ["سيرة ذاتية احترافية", "Portfolio", "حضور مهني"],
          href: "/services/cv-portfolio",
        },
      ],
    },
    decision: {
      kicker: "ابدأ بالنتيجة",
      title: "ابدأ بالنتيجة، ونحن نحدد لك الخدمة المناسبة.",
      lead: "لا تحتاج أن تعرف الحل التقني أولًا. اختر النتيجة الأقرب لما تريد تحقيقه، وسنوجهك إلى نقطة البداية الصحيحة.",
      panel: "موجّه النتائج",
      status: "اختر الاتجاه",
      helper: "ما زلت غير متأكد؟ أجب عن ثلاثة أسئلة مركزة وسنقترح لك أقرب خدمة كبداية.",
      helperLink: "استخدم موجّه الخدمات",
      choices: [
        { n: "01", title: "أريد حضورًا رقميًا أقوى لشركتي", target: "تطوير المواقع", href: "/services/web-development" },
        { n: "02", title: "أريد البيع أونلاين أو تسهيل عمليات العمل", target: "التجارة الإلكترونية والأنظمة", href: "/services/ecommerce-systems" },
        { n: "03", title: "أريد هوية أوضح وأقوى وأكثر موثوقية", target: "الهوية البصرية", href: "/services/brand-identity" },
        { n: "04", title: "أريد تقديم خبرتي وأعمالي بصورة أكثر احترافية", target: "السيرة الذاتية والملف المهني", href: "/services/cv-portfolio" },
      ],
    },
    process: {
      kicker: "طريقتنا في العمل",
      title: "خط واحد من الفكرة إلى الإطلاق.",
      lead: "عملية مختصرة تبقي النطاق والقرارات والتنفيذ واضحة من أول محادثة حتى التسليم.",
      steps: [
        ["01", "نفهم", "نفهم النشاط والفكرة والاحتياج الحقيقي."],
        ["02", "نحدد", "نحدد النطاق والأولويات والاتجاه المناسب."],
        ["03", "نصمم", "نشكّل التجربة قبل بدء التطوير."],
        ["04", "نبني ونطلق", "نبني ونختبر ونطلق ونجهز الخطوة التالية."],
      ],
    },
    cta: {
      kicker: "ابدأ خطك",
      title: "قل لنا ماذا تريد أن تحقق، وسنحدد لك الخط الأول الصحيح.",
      lead: "لا تحتاج أن تعرف الحل التقني قبل التواصل معنا. ابدأ فقط بالنتيجة التي تريد الوصول إليها.",
      button: "ابدأ خطك",
    },
  },
} as const;

export default function ServicesPage() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className={`${styles.page} ref-page page-services`}>
      <section className={styles.hero}>
        <div className={styles.neuronField} aria-hidden="true"><HomeHeroArt /></div>
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{t.hero.kicker}</p>
            <h1>{t.hero.title}</h1>
            <p className={styles.heroLead}>{t.hero.lead}</p>
            <div className={styles.heroActions}>
              <Link className={styles.primary} href="/start" prefetch>{t.hero.primary}<span aria-hidden="true">→</span></Link>
              <Link className={styles.secondary} href="/projects" prefetch>{t.hero.secondary}<span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className={styles.heroIndex} aria-label={t.hero.kicker}>
            {t.hero.index.map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>{t.services.kicker}</p>
              <h2>{t.services.title}</h2>
            </div>
            <p>{t.services.lead}</p>
          </div>

          <div className={styles.servicesGrid}>
            {t.services.items.map((service) => (
              <article className={styles.serviceCard} key={service.n}>
                <div className={styles.serviceTop}>
                  <span className={styles.serviceNumber}>{service.n}</span>
                  <span className={styles.serviceSignal} aria-hidden="true"><i/><i/><i/><b/></span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className={styles.capabilities}>{service.capabilities.map(item => <span key={item}>{item}</span>)}</div>
                <Link className={styles.serviceLink} href={service.href} prefetch>{t.services.explore}<span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={outcomeStyles.section}>
        <div className={outcomeStyles.shell}>
          <div className={outcomeStyles.header}>
            <div>
              <p className={outcomeStyles.kicker}>{t.decision.kicker}</p>
              <h2>{t.decision.title}</h2>
            </div>
            <p className={outcomeStyles.lead}>{t.decision.lead}</p>
          </div>

          <div className={outcomeStyles.panel}>
            <div className={outcomeStyles.panelTop}>
              <span><i aria-hidden="true" />{t.decision.panel}</span>
              <span>{t.decision.status}</span>
            </div>

            <div className={outcomeStyles.choices}>
              {t.decision.choices.map((choice) => (
                <Link className={outcomeStyles.choice} href={choice.href} prefetch key={choice.n}>
                  <div className={outcomeStyles.choiceTop}>
                    <span className={outcomeStyles.number}>{choice.n}</span>
                    <span className={outcomeStyles.target}>{choice.target}</span>
                  </div>
                  <h3>{choice.title}</h3>
                  <div className={outcomeStyles.choiceFooter}>
                    <span>{t.services.explore}</span>
                    <strong aria-hidden="true">→</strong>
                  </div>
                </Link>
              ))}
            </div>

            <div className={outcomeStyles.helper}>
              <p>{t.decision.helper}</p>
              <Link href="/service-finder" prefetch>{t.decision.helperLink}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.shell}>
          <div className={styles.processTop}>
            <div>
              <p className={styles.kicker}>{t.process.kicker}</p>
              <h2>{t.process.title}</h2>
            </div>
            <p>{t.process.lead}</p>
          </div>
          <div className={styles.timeline}>
            {t.process.steps.map(([number, title, text]) => (
              <article className={styles.step} key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-cta">
        <div className="ref-shell ref-cta-inner">
          <div>
            <p className="ref-kicker">{t.cta.kicker}</p>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.lead}</p>
          </div>
          <Link className="ref-btn primary" href="/start" prefetch>{t.cta.button} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
