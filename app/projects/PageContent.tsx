"use client";

import type { CSSProperties } from "react";
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
      title: "Selected products. Built with purpose.",
      lead: "Three focused case studies showing how different business needs became practical digital products.",
      builtLabel: "FOCUS",
      stackLabel: "CORE STACK",
      caseStudy: "View case study",
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
      title: "منتجات مختارة. مبنية لهدف واضح.",
      lead: "ثلاث دراسات حالة مركزة توضّح كيف تحولت احتياجات أعمال مختلفة إلى منتجات رقمية عملية.",
      builtLabel: "التركيز",
      stackLabel: "التقنيات الأساسية",
      caseStudy: "عرض دراسة الحالة",
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
        <div className="projects-showcase-art" aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
            <defs>
              <linearGradient id="projectsStripFill" x1="840" y1="270" x2="1510" y2="640" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0A111A" stopOpacity=".78" />
                <stop offset=".55" stopColor="#0A1018" stopOpacity=".48" />
                <stop offset="1" stopColor="#071019" stopOpacity=".22" />
              </linearGradient>
              <linearGradient id="projectsStripEdge" x1="840" y1="0" x2="1510" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8BB9F5" stopOpacity=".14" />
                <stop offset=".5" stopColor="#9BC5FF" stopOpacity=".42" />
                <stop offset="1" stopColor="#6CA8F8" stopOpacity=".12" />
              </linearGradient>
              <linearGradient id="projectsStripSweep" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset=".5" stopColor="#CFE4FF" stopOpacity=".22" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <clipPath id="projectsStripClip">
                <rect x="820" y="250" width="700" height="390" rx="26" />
              </clipPath>
            </defs>

            <g className="projects-strip-shell">
              <rect x="820" y="250" width="700" height="390" rx="26" fill="url(#projectsStripFill)" />
              <rect x="820.5" y="250.5" width="699" height="389" rx="25.5" stroke="url(#projectsStripEdge)" />

              <line x1="1053" y1="282" x2="1053" y2="608" className="projects-strip-divider" />
              <line x1="1286" y1="282" x2="1286" y2="608" className="projects-strip-divider" />

              <g className="projects-strip-commerce">
                <rect x="864" y="334" width="54" height="74" rx="7" />
                <rect x="930" y="334" width="54" height="74" rx="7" />
                <rect x="864" y="420" width="120" height="14" rx="7" />
                <rect x="864" y="448" width="84" height="10" rx="5" />
              </g>

              <g className="projects-strip-marketplace">
                <circle cx="1128" cy="372" r="14" />
                <circle cx="1190" cy="344" r="10" />
                <circle cx="1218" cy="408" r="11" />
                <path d="M1141 365L1180 349M1140 382L1207 404M1196 354L1213 397" />
                <rect x="1094" y="456" width="122" height="10" rx="5" />
              </g>

              <g className="projects-strip-system">
                <rect x="1330" y="334" width="138" height="18" rx="9" />
                <rect x="1330" y="370" width="104" height="12" rx="6" />
                <rect x="1330" y="400" width="118" height="12" rx="6" />
                <rect x="1330" y="442" width="18" height="64" rx="5" />
                <rect x="1362" y="424" width="18" height="82" rx="5" />
                <rect x="1394" y="456" width="18" height="50" rx="5" />
                <rect x="1426" y="410" width="18" height="96" rx="5" />
              </g>

              <g clipPath="url(#projectsStripClip)">
                <rect className="projects-strip-sweep" x="760" y="240" width="180" height="420" fill="url(#projectsStripSweep)" />
              </g>
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

          <div className={styles.caseStudies}>
            {t.projects.map((project) => (
              <article className={styles.caseStudy} key={project.n} data-project-motion="card">
                <div className={styles.caseTop} data-project-part="meta">
                  <div className={styles.caseIdentity}>
                    <span className={styles.caseNumber}>{project.n}</span>
                    <span className={styles.caseType}>{project.tag}</span>
                  </div>
                </div>

                <div className={styles.caseBody}>
                  <div className={styles.caseStory}>
                    <h3 data-project-part="title">{project.title}</h3>
                    <p data-project-part="description">{project.description}</p>
                  </div>

                  <div className={styles.caseBuilt} data-project-part="focus-group">
                    <p>{t.work.builtLabel}</p>
                    <div>
                      {project.built.map((item, index) => <span key={item} data-project-part="focus" style={{"--project-part-index": index} as CSSProperties}>{item}</span>)}
                    </div>
                  </div>
                </div>

                <div className={styles.caseFooter}>
                  <div data-project-part="stack">
                    <span className={styles.stackLabel}>{t.work.stackLabel}</span>
                    <div className={styles.stackLine}>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                  <Link className={styles.caseOpen} href={project.href} prefetch data-project-part="link">
                    {t.work.caseStudy}<span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
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
