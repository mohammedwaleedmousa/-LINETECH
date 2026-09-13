"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import styles from "./HomeProof.module.css";

const copy = {
  en: {
    kicker: "PROOF, NOT PROMISES",
    title: "Built work you can inspect.",
    lead: "Instead of invented numbers, we show the product structure, working capabilities and technology behind selected LINETECH projects.",
    open: "Open case study",
    evidence: "DOCUMENTED BUILD",
    projects: [
      {
        index: "01",
        type: "E-COMMERCE",
        title: "Flamingo Park",
        text: "A mobile-first commerce platform built around customer discovery and day-to-day store operations.",
        points: ["Catalog & discovery", "Product experience", "Order journey", "Store operations"],
        stack: ["React + Vite", "Supabase", "Cloudflare Pages"],
        href: "/projects/flamingo-park",
      },
      {
        index: "02",
        type: "SERVICES MARKETPLACE",
        title: "Etqan",
        text: "A marketplace structure designed around service discovery, provider visibility and platform administration.",
        points: ["Service discovery", "Provider structure", "Customer journey", "Admin operations"],
        stack: ["React + Vite", "Supabase", "Cloudflare"],
        href: "/projects/etqan",
      },
      {
        index: "03",
        type: "BUSINESS SYSTEM",
        title: "LedgerPro",
        text: "A business system focused on financial records, repeatable workflows and clearer operational visibility.",
        points: ["Records structure", "Operational workflows", "Dashboard visibility", "Scalable foundation"],
        stack: ["React + Vite", "Node.js + Express", "PostgreSQL"],
        href: "/projects/ledgerpro",
      },
    ],
  },
  ar: {
    kicker: "الدليل قبل الوعود",
    title: "أعمال مبنية يمكنك فحصها.",
    lead: "بدل الأرقام غير الحقيقية، نعرض بنية المنتج والوظائف التي تم بناؤها والتقنيات المستخدمة في مشاريع مختارة من LINETECH.",
    open: "افتح دراسة الحالة",
    evidence: "بناء موثّق",
    projects: [
      {
        index: "01",
        type: "تجارة إلكترونية",
        title: "Flamingo Park",
        text: "منصة تجارة إلكترونية Mobile-first مبنية حول اكتشاف المنتجات وتشغيل المتجر في العمل اليومي.",
        points: ["الكتالوج واكتشاف المنتجات", "تجربة صفحة المنتج", "رحلة الطلب", "إدارة المتجر"],
        stack: ["React + Vite", "Supabase", "Cloudflare Pages"],
        href: "/projects/flamingo-park",
      },
      {
        index: "02",
        type: "سوق خدمات",
        title: "Etqan",
        text: "منصة خدمات مبنية حول اكتشاف الخدمات ووضوح مقدمي الخدمة وإدارة المنصة.",
        points: ["اكتشاف الخدمات", "هيكلة مقدمي الخدمة", "رحلة العميل", "إدارة المنصة"],
        stack: ["React + Vite", "Supabase", "Cloudflare"],
        href: "/projects/etqan",
      },
      {
        index: "03",
        type: "نظام أعمال",
        title: "LedgerPro",
        text: "نظام أعمال يركّز على السجلات المالية وسير العمل المتكرر ووضوح العمليات اليومية.",
        points: ["هيكلة السجلات", "سير العمل التشغيلي", "وضوح لوحة التحكم", "أساس قابل للتوسع"],
        stack: ["React + Vite", "Node.js + Express", "PostgreSQL"],
        href: "/projects/ledgerpro",
      },
    ],
  },
} as const;

export default function HomeProof() {
  const language = useLanguage();
  const content = copy[language];

  return (
    <section className={`${styles.section} home-proof-section`} aria-labelledby="home-proof-title">
      <div className={styles.shell}>
        <div className={`${styles.intro} home-proof-intro`}>
          <div>
            <p className={styles.kicker}>{content.kicker}</p>
            <h2 id="home-proof-title">{content.title}</h2>
          </div>
          <p>{content.lead}</p>
        </div>

        <div className={`${styles.list} home-proof-list`}>
          {content.projects.map((project) => (
            <article className={styles.card} key={project.title}>
              <div className={styles.meta}>
                <span>{project.index}</span>
                <p>{project.type}</p>
                <i aria-hidden="true" />
              </div>

              <div className={styles.summary}>
                <div className={styles.proofLabel}><span aria-hidden="true" />{content.evidence}</div>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </div>

              <div className={styles.points}>
                {project.points.map((point) => <span key={point}>{point}</span>)}
              </div>

              <div className={styles.footer}>
                <div className={styles.stack}>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <Link href={project.href} prefetch>{content.open} <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
