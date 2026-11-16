"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./Localized";
import styles from "./FooterCTA.module.css";

// Home, Projects and About already own their closing CTA. Keep those intact.
const pagesNeedingCTA = new Set(["/services", "/contact", "/privacy", "/terms"]);

export default function FooterCTA() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const ar = useLanguage() === "ar";
  if (!pagesNeedingCTA.has(pathname)) return null;

  return (
    <section className={styles.section} data-footer-cta aria-labelledby="footer-cta-title" dir={ar ? "rtl" : "ltr"}>
      <div className={`${styles.edge} ${styles.left}`} aria-hidden="true" />
      <div className={`${styles.edge} ${styles.right}`} aria-hidden="true" />
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>{ar ? "لنبنِ معًا" : "LET'S BUILD TOGETHER"}</p>
          <h2 id="footer-cta-title">{ar ? "كل فكرة تبدأ بخط." : "Every idea starts with a line."}</h2>
          <p className={styles.description}>{ar ? "اشرح فكرتك، واختر الخدمة، ثم أكمل طلب مشروع واضحًا." : "Describe your idea, choose a service and complete a clear project request."}</p>
        </div>
        <Link className={styles.button} href="/contact#request" prefetch>
          {ar ? "ابدأ طلب مشروعك" : "Start your project request"}<span aria-hidden="true">{ar ? "←" : "→"}</span>
        </Link>
      </div>
    </section>
  );
}
