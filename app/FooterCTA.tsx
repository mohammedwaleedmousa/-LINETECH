"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./Localized";
import styles from "./FooterCTA.module.css";

// Home, Projects and About already own their closing CTA. Keep those intact.
const pageCopy: Record<string, { en: string[]; ar: string[]; href: string }> = {
  "/services": {
    en: ["BUILT AROUND YOUR BUSINESS", "The right solution starts with your idea.", "Tell us what your business needs. We will help shape the website, app or system around it.", "Discuss your project"],
    ar: ["حلول تناسب عملك", "الحل المناسب يبدأ بفكرتك.", "أخبرنا بما يحتاجه عملك لنحدد معًا الموقع أو التطبيق أو النظام المناسب له.", "ناقش مشروعك"], href: "/contact#request",
  },
  "/contact": {
    en: ["YOUR NEXT STEP", "A clear brief. A better beginning.", "Share your goals, requirements and questions so we can plan the next step together.", "Tell us about your idea"],
    ar: ["خطوتك التالية", "بداية واضحة لمشروع أفضل.", "شاركنا أهدافك ومتطلباتك وأسئلتك لنحدد الخطوة التالية معًا.", "أخبرنا عن فكرتك"], href: "/contact#request",
  },
  "/privacy": {
    en: ["PRIVACY & TRUST", "Your questions deserve clear answers.", "Have a question about your information or how we handle it? Get in touch with LINETECH.", "Ask about privacy"],
    ar: ["الخصوصية والثقة", "أسئلتك تستحق إجابات واضحة.", "لديك سؤال عن بياناتك أو طريقة التعامل معها؟ تواصل مع LINETECH.", "استفسر عن الخصوصية"], href: "/contact#contact-options",
  },
  "/terms": {
    en: ["CLARITY BEFORE COMMITMENT", "Clear terms. Confident collaboration.", "Let's clarify the scope, deliverables and responsibilities before your project begins.", "Discuss your requirements"],
    ar: ["وضوح قبل الاتفاق", "اتفاق واضح. تعاون بثقة.", "لنوضح النطاق والمخرجات والمسؤوليات قبل بدء مشروعك.", "ناقش متطلباتك"], href: "/contact#request",
  },
  "/services/after-sales-care": {
    en: ["CARE BEYOND LAUNCH", "Launch is only the beginning.", "Keep your website, application or business system moving forward with an agreed care plan.", "Discuss ongoing care"],
    ar: ["رعاية مستمرة بعد الإطلاق", "الإطلاق هو البداية فقط.", "واصل تطوير موقعك أو تطبيقك أو نظامك بخطة دعم نتفق على تفاصيلها معك.", "ناقش خطة الدعم"], href: "/contact?interest=aftercare#request",
  },
};

export default function FooterCTA() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const ar = useLanguage() === "ar";
  const page = pageCopy[pathname];
  if (!page) return null;
  const t = ar ? page.ar : page.en;

  return (
    <section className={styles.section} data-footer-cta aria-labelledby="footer-cta-title" dir={ar ? "rtl" : "ltr"}>
      <div className={`${styles.edge} ${styles.left}`} aria-hidden="true" />
      <div className={`${styles.edge} ${styles.right}`} aria-hidden="true" />
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>{t[0]}</p>
          <h2 id="footer-cta-title">{t[1]}</h2>
          <p className={styles.description}>{t[2]}</p>
        </div>
        <Link className={styles.button} href={page.href} prefetch>
          {t[3]}<span aria-hidden="true">{ar ? "←" : "→"}</span>
        </Link>
      </div>
    </section>
  );
}
