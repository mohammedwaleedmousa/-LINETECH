"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import styles from "./projects-page.module.css";

const copy = {
  en: {
    hero: {
      kicker: "FEATURED PROJECTS",
      title: "Built for real use.",
      lead: "Selected digital products shaped around real users, workflows and business needs — from commerce and marketplaces to operational systems.",
      primary: "Start a Project",
      secondary: "View Services",
    },
    work: {
      kicker: "SELECTED WORK",
      title: "Three products. Three different operating problems.",
      lead: "Each case study shows how LINETECH turns a practical need into a structured digital product with a clear user journey and a maintainable foundation.",
      caseStudy: "View case study",
      stack: "TECHNOLOGY",
    },
    projects: [
      {
        n: "01",
        tag: "E-COMMERCE",
        title: "Flamingo Park",
        description: "A mobile-first commerce experience built around product discovery, faster ordering and clearer store operations.",
        built: ["Catalog & discovery", "Product experience", "Store operations"],
        stack: ["React + Vite", "Tailwind CSS", "Supabase", "Cloudflare Pages"],
        href: "/projects/flamingo-park",
      },
      {
        n: "02",
        tag: "SERVICES MARKETPLACE",
        title: "Etqan",
        description: "A services marketplace structured around clearer discovery, provider visibility, customer journeys and scalable administration.",
        built: ["Service discovery", "Provider structure", "Admin operations"],
        stack: ["React + Vite", "Tailwind CSS", "Supabase", "Cloudflare"],
        href: "/projects/etqan",
      },
      {
        n: "03",
        tag: "BUSINESS SYSTEM",
        title: "LedgerPro",
        description: "A business system designed to organize financial records, repeatable workflows and clearer operational visibility.",
        built: ["Records structure", "Operational workflows", "Dashboard visibility"],
        stack: ["React + Vite", "Node.js + Express", "Sequelize", "PostgreSQL"],
        href: "/projects/ledgerpro",
      },
    ],
    map: {
      kicker: "PROJECT MAP",
      title: "Selected systems",
      typesLabel: "PRODUCT TYPES",
      types: ["Commerce", "Marketplace", "Business system"],
      stackLabel: "STACKS ACROSS SELECTED WORK",
      stack: ["React + Vite", "Tailwind", "Supabase", "Node.js", "PostgreSQL", "Cloudflare"],
    },
    cta: {
      kicker: "LET'S BUILD TOGETHER",
      title: "Your project can be the next line.",
      lead: "Start with the idea. We will help shape the product.",
      button: "Contact Us",
    },
  },
  ar: {
    hero: {
      kicker: "مشاريع مختارة",
      title: "مبنية للاستخدام الحقيقي.",
      lead: "منتجات رقمية مختارة صُممت حول مستخدمين حقيقيين وسير عمل واحتياجات أعمال فعلية — من التجارة والمنصات إلى أنظمة التشغيل.",
      primary: "ابدأ مشروعك",
      secondary: "عرض الخدمات",
    },
    work: {
      kicker: "أعمال مختارة",
      title: "ثلاثة منتجات. ثلاث مشكلات تشغيلية مختلفة.",
      lead: "توضح كل دراسة حالة كيف تحوّل LINETECH احتياجًا عمليًا إلى منتج رقمي منظم برحلة مستخدم واضحة وأساس قابل للصيانة والتطوير.",
      caseStudy: "استكشف دراسة الحالة",
      stack: "التقنيات",
    },
    projects: [
      {
        n: "01",
        tag: "تجارة إلكترونية",
        title: "Flamingo Park",
        description: "تجربة تجارة إلكترونية Mobile-first مبنية حول اكتشاف المنتجات وتسريع الطلبات وتوضيح عمليات تشغيل المتجر.",
        built: ["الكتالوج والاكتشاف", "تجربة المنتج", "تشغيل المتجر"],
        stack: ["React + Vite", "Tailwind CSS", "Supabase", "Cloudflare Pages"],
        href: "/projects/flamingo-park",
      },
      {
        n: "02",
        tag: "منصة خدمات",
        title: "Etqan",
        description: "منصة خدمات منظمة حول اكتشاف أوضح ومقدمي خدمات ظاهرين ورحلة عميل مفهومة وإدارة قابلة للتوسع.",
        built: ["اكتشاف الخدمات", "هيكلة مقدمي الخدمة", "عمليات الإدارة"],
        stack: ["React + Vite", "Tailwind CSS", "Supabase", "Cloudflare"],
        href: "/projects/etqan",
      },
      {
        n: "03",
        tag: "نظام أعمال",
        title: "LedgerPro",
        description: "نظام أعمال صُمم لتنظيم السجلات المالية وسير العمل المتكرر وإعطاء رؤية تشغيلية أوضح.",
        built: ["هيكلة السجلات", "سير العمل التشغيلي", "وضوح لوحة التحكم"],
        stack: ["React + Vite", "Node.js + Express", "Sequelize", "PostgreSQL"],
        href: "/projects/ledgerpro",
      },
    ],
    map: {
      kicker: "خريطة المشاريع",
      title: "أنظمة مختارة",
      typesLabel: "أنواع المنتجات",
      types: ["تجارة إلكترونية", "منصة خدمات", "نظام أعمال"],
      stackLabel: "تقنيات مستخدمة عبر الأعمال المختارة",
      stack: ["React + Vite", "Tailwind", "Supabase", "Node.js", "PostgreSQL", "Cloudflare"],
    },
    cta: {
      kicker: "لنبنِ معًا",
      title: "مشروعك يمكن أن يكون الخط التالي.",
      lead: "ابدأ بالفكرة، وسنساعدك في تحويلها إلى منتج واضح.",
      button: "تواصل معنا",
    },
  },
} as const;

export default function ProjectsPage() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className={`${styles.page} ref-page page-projects`}>
      <section className={styles.hero} data-project-hero>
        <div className={styles.heroField} data-project-field aria-hidden="true">
          <svg viewBox="0 0 1600 700" preserveAspectRatio="none" fill="none" focusable="false">
            <defs>
              <radialGradient id="project-field-glow" cx="0" cy="0" r="1" gradientTransform="translate(1180 270) rotate(90) scale(250 350)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3882F6" stopOpacity=".12" />
                <stop offset="1" stopColor="#3882F6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse className={styles.heroGlow} cx="1180" cy="270" rx="350" ry="250" />
            <path className={`${styles.heroRoute} ${styles.heroRouteDashed}`} d="M640 510C790 430 850 310 1020 320s250 122 420 28 210-158 300-132" />
            <path className={styles.heroRoute} d="M820 130c120 74 194 94 302 58s190-12 278 76 180 122 300 88" />
            <path className={styles.heroRoute} d="M970 570c75-88 148-116 238-86s168 18 228-48 118-92 204-70" />
            <g className={styles.heroNodes}>
              <circle cx="1020" cy="320" r="4"/><circle cx="1202" cy="360" r="3"/><circle cx="1440" cy="348" r="4"/>
              <circle cx="1122" cy="188" r="3"/><circle cx="1400" cy="264" r="3.5"/><circle cx="1208" cy="484" r="3"/>
            </g>
          </svg>
        </div>

        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-project-motion="hero">{t.hero.kicker}</p>
            <h1 data-project-motion="hero">{t.hero.title}</h1>
            <p className={styles.heroLead} data-project-motion="hero">{t.hero.lead}</p>
            <div className={styles.heroActions} data-project-motion="hero">
              <Link className={styles.primary} href="/start" prefetch>{t.hero.primary}<span aria-hidden="true">→</span></Link>
              <Link className={styles.secondary} href="/services" prefetch>{t.hero.secondary}<span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <div className={styles.heroIndex}>
            {t.projects.map((project) => (
              <div key={project.n} data-project-motion="hero">
                <span>{project.n}</span>
                <strong>{project.title}</strong>
                <small>{project.tag}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.workSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead} data-project-motion="reveal">
            <div>
              <p className={styles.kicker}>{t.work.kicker}</p>
              <h2>{t.work.title}</h2>
            </div>
            <p>{t.work.lead}</p>
          </div>

          <div className={styles.projectsList}>
            {t.projects.map((project) => (
              <article className={styles.projectCard} key={project.n} data-project-motion="card">
                <div className={styles.projectIdentity}>
                  <span className={styles.projectNumber}>{project.n}</span>
                  <span className={styles.projectType}>{project.tag}</span>
                </div>

                <div className={styles.projectMain}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className={styles.projectBuild}>
                    {project.built.map(item => <span key={item}>{item}</span>)}
                  </div>
                </div>

                <div className={styles.projectMeta}>
                  <div>
                    <p className={styles.stackLabel}>{t.work.stack}</p>
                    <div className={styles.stack}>{project.stack.map(item => <span key={item}>{item}</span>)}</div>
                  </div>
                  <Link className={styles.caseLink} href={project.href} prefetch>{t.work.caseStudy}<span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mapSection} data-project-motion="reveal">
        <div className={styles.mapInner}>
          <div className={styles.mapLabel}>
            <span>{t.map.kicker}</span>
            <strong>{t.map.title}</strong>
          </div>
          <div className={styles.mapTypes}>
            <p>{t.map.typesLabel}</p>
            <div>{t.map.types.map(item => <span key={item}>{item}</span>)}</div>
          </div>
          <div className={styles.mapStack}>
            <p>{t.map.stackLabel}</p>
            <div>{t.map.stack.map(item => <span key={item}>{item}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="ref-cta" data-project-motion="reveal">
        <div className="ref-shell ref-cta-inner">
          <div>
            <p className="ref-kicker">{t.cta.kicker}</p>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.lead}</p>
          </div>
          <Link className="ref-btn primary" href="/start" prefetch>{t.cta.button} ↗</Link>
        </div>
      </section>
    </main>
  );
}
