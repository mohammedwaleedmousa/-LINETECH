"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import styles from "./HomeProjects.module.css";

const copy = {
  en: {
    kicker: "FEATURED PROJECTS",
    title: "Selected work, kept simple.",
    lead: "A quick look at a few products and systems built by LINETECH.",
    all: "View all projects",
    button: "Explore project details",
    projects: [
      {
        tag: "E-COMMERCE",
        title: "Flamingo Park",
        text: "A mobile-first commerce experience for product discovery, ordering and store operations.",
        href: "/projects/flamingo-park",
      },
      {
        tag: "MARKETPLACE",
        title: "Etqan",
        text: "A services marketplace that organizes discovery, providers and customer journeys.",
        href: "/projects/etqan",
      },
      {
        tag: "BUSINESS SYSTEM",
        title: "LedgerPro",
        text: "A practical business system for financial records, workflows and operational visibility.",
        href: "/projects/ledgerpro",
      },
    ],
  },
  ar: {
    kicker: "مشاريع مختارة",
    title: "مشاريع واضحة، بدون تعقيد.",
    lead: "نظرة سريعة على عدد من المنتجات والأنظمة التي قامت LINETECH ببنائها.",
    all: "عرض جميع المشاريع",
    button: "استكشف تفاصيل المشروع",
    projects: [
      {
        tag: "تجارة إلكترونية",
        title: "Flamingo Park",
        text: "تجربة تجارة إلكترونية Mobile-first لاكتشاف المنتجات والطلبات وتشغيل المتجر.",
        href: "/projects/flamingo-park",
      },
      {
        tag: "سوق خدمات",
        title: "Etqan",
        text: "منصة خدمات تنظّم اكتشاف الخدمات ومقدميها ورحلة العميل بشكل أوضح.",
        href: "/projects/etqan",
      },
      {
        tag: "نظام أعمال",
        title: "LedgerPro",
        text: "نظام أعمال عملي لتنظيم السجلات المالية وسير العمل ووضوح العمليات.",
        href: "/projects/ledgerpro",
      },
    ],
  },
} as const;

export default function HomeProjects() {
  const language = useLanguage();
  const content = copy[language];

  return (
    <section className={`${styles.section} ref-line-section`} id="projects" aria-labelledby="home-projects-title">
      <div className="ref-shell">
        <div className={styles.heading}>
          <div>
            <p className={styles.kicker}>{content.kicker}</p>
            <h2 id="home-projects-title">{content.title}</h2>
          </div>
          <div className={styles.side}>
            <p>{content.lead}</p>
            <Link href="/projects" prefetch>{content.all} <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className={`${styles.grid} ref-project-grid home-project-compact-grid`}>
          {content.projects.map((project, index) => (
            <article className={`${styles.card} home-project-card`} key={project.title}>
              <div className={styles.top}>
                <span className={styles.tag}>{project.tag}</span>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.signal} aria-hidden="true"><i/><i/><i/><b/></div>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
              <Link className={styles.button} href={project.href} prefetch>
                {content.button}<span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
