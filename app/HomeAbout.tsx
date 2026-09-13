"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import styles from "./HomeAbout.module.css";

const copy = {
  en: {
    kicker: "ABOUT LINETECH",
    titleA: "More than technology.",
    titleB: "A smarter tomorrow.",
    body: "LINETECH turns ideas into digital products built around real business needs. We connect clarity, design and engineering so the result is not only polished, but useful, maintainable and ready for real-world operation.",
    link: "Discover LINETECH",
    path: [
      ["01", "IDEA", "Start with the real objective."],
      ["02", "SYSTEM", "Shape the right product structure."],
      ["03", "IMPACT", "Build for meaningful use."],
    ],
    statement: "IDEAS INTO SYSTEMS",
  },
  ar: {
    kicker: "عن LINETECH",
    titleA: "أكثر من مجرد تقنية.",
    titleB: "غدٌ أكثر ذكاءً.",
    body: "تحوّل LINETECH الأفكار إلى منتجات رقمية مبنية حول احتياجات العمل الحقيقية. نربط الوضوح بالتصميم والهندسة حتى لا تكون النتيجة جميلة فقط، بل عملية وقابلة للتطوير وجاهزة للاستخدام الحقيقي.",
    link: "اكتشف LINETECH",
    path: [
      ["01", "الفكرة", "نبدأ بالهدف الحقيقي."],
      ["02", "النظام", "نشكّل بنية المنتج المناسبة."],
      ["03", "الأثر", "نبني لاستخدام يحقق قيمة."],
    ],
    statement: "من الفكرة إلى النظام",
  },
} as const;

export default function HomeAbout() {
  const language = useLanguage();
  const content = copy[language];

  return (
    <section className={`${styles.section} ref-line-section`} id="about" aria-labelledby="home-about-title">
      <div className={`${styles.shell} ref-shell`}>
        <div className={`${styles.copy} home-about-copy`}>
          <p className={styles.kicker}>{content.kicker}</p>
          <h2 id="home-about-title"><span>{content.titleA}</span><strong>{content.titleB}</strong></h2>
          <p className={styles.body}>{content.body}</p>
          <Link className={styles.link} href="/about" prefetch>{content.link}<span aria-hidden="true">→</span></Link>
        </div>

        <div className={`${styles.visual} home-about-art`} aria-hidden="true">
          <div className={styles.glow}/>
          <div className={styles.orbitA}/>
          <div className={styles.orbitB}/>
          <div className={styles.core}><i/><b/></div>
          <p>{content.statement}</p>
        </div>

        <div className={`${styles.path} home-about-path`}>
          {content.path.map(([number, title, text]) => (
            <div className={styles.step} key={number}>
              <span>{number}</span>
              <div><strong>{title}</strong><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
