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
  const featured = t.projects[0];
  const nextProjects = t.projects.slice(1);

  return (
    <main className={`${styles.page} ref-page page-projects`}>
      <section className="ltx-hero-v2 ltx-projects-hero" data-project-hero>
        <div className="ltx-hero-v2-shell ltx-projects-hero-shell">
          <div className="ltx-projects-hero-top">
            <p className="ltx-hero-v2-kicker" data-project-motion="hero">{t.hero.kicker}</p>
            <p className="ltx-projects-hero-intro" data-project-motion="hero">{t.hero.lead}</p>
          </div>

          <div className="ltx-project-feature">
            <div className="ltx-project-feature-copy">
              <div className="ltx-project-feature-meta" data-project-motion="hero"><i/>{featured.n} / {featured.tag}</div>
              <h1 data-project-motion="hero">{featured.title}</h1>
              <p data-project-motion="hero">{featured.description}</p>
              <div className="ltx-hero-v2-actions" data-project-motion="hero">
                <Link className="ltx-hero-v2-btn primary" href={featured.href} prefetch>{t.work.caseStudy} <span aria-hidden="true">→</span></Link>
                <Link className="ltx-hero-v2-btn" href="/start" prefetch>{t.hero.primary} <span aria-hidden="true">→</span></Link>
              </div>
            </div>

            <div className="ltx-project-index" aria-label={t.work.kicker}>
              {nextProjects.map((project)=><Link href={project.href} key={project.n} prefetch data-project-motion="hero"><span>{project.n}</span><div><strong>{project.title}</strong><small>{project.tag}</small></div></Link>)}
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
