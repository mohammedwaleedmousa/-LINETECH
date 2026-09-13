"use client";

import { useLanguage } from "./Localized";
import styles from "./HomeWhy.module.css";

const copy = {
  en: {
    kicker: "WHY LINETECH",
    title: "Technology shaped around the business.",
    lead: "We do not treat design, development and delivery as separate pieces. The work is shaped as one system around the goal, the customer and the way the business actually operates.",
    items: [
      {
        icon: "01",
        title: "Business-first thinking",
        text: "We start with the real objective, workflow and customer journey before choosing the structure or technology.",
      },
      {
        icon: "02",
        title: "Design + engineering together",
        text: "Interface, identity and implementation are developed as one product experience instead of disconnected layers.",
      },
      {
        icon: "03",
        title: "Built for real operation",
        text: "Performance, responsive use, handover and day-to-day business needs are considered as part of the build from the start.",
      },
    ],
  },
  ar: {
    kicker: "لماذا LINETECH",
    title: "تقنية مبنية حول احتياج العمل.",
    lead: "لا نتعامل مع التصميم والتطوير والتسليم كأجزاء منفصلة. نبني الحل كنظام واحد يدور حول الهدف والعميل وطريقة عمل المشروع في الواقع.",
    items: [
      {
        icon: "01",
        title: "نفكر في العمل أولًا",
        text: "نبدأ بالهدف الحقيقي، وطريقة العمل، ورحلة العميل قبل اختيار الهيكل أو التقنية المناسبة.",
      },
      {
        icon: "02",
        title: "التصميم والهندسة معًا",
        text: "نطوّر الواجهة والهوية والتنفيذ كتجربة منتج واحدة، بدل أن تكون طبقات منفصلة عن بعضها.",
      },
      {
        icon: "03",
        title: "مبني للاستخدام الحقيقي",
        text: "الأداء، وتوافق الأجهزة، والتسليم، واحتياجات التشغيل اليومية تدخل في التخطيط منذ بداية البناء.",
      },
    ],
  },
} as const;

export default function HomeWhy() {
  const language = useLanguage();
  const content = copy[language];

  return (
    <section className={`${styles.section} home-why-section`} aria-labelledby="home-why-title">
      <div className={styles.shell}>
        <div className={`${styles.intro} home-why-intro`}>
          <div>
            <p className={styles.kicker}>{content.kicker}</p>
            <h2 className={styles.title} id="home-why-title">{content.title}</h2>
          </div>
          <p className={styles.lead}>{content.lead}</p>
        </div>

        <div className={`${styles.grid} home-why-grid`}>
          {content.items.map((item, index) => (
            <article className={styles.card} key={item.title}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.icon} aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <i className={styles.line} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
