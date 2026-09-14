"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import styles from "./about-page.module.css";

const copy = {
  en: {
    hero: {
      kicker: "ABOUT LINETECH",
      title: "Clear ideas. Built into real products.",
      lead: "LINETECH is a technology company focused on turning practical ideas into useful digital products through disciplined design and engineering.",
      primary: "Start Your Line",
      secondary: "See Our Work",
      points: [
        ["01", "FOUNDER-LED", "Clear direction"],
        ["02", "ADEN, YEMEN", "Company foundation"],
        ["03", "LONG-TERM", "Built to grow"],
      ],
    },
    founder: {
      kicker: "FOUNDER",
      name: "Mohammed Waleed",
      role: "Founder & CEO — LINETECH",
      location: "Aden, Yemen",
      title: "Building LINETECH as a company, not a temporary studio.",
      text: "The goal is to build useful technology, keep a high standard and grow the company with a clear long-term direction. Products, systems and execution come first; presentation follows the work.",
      focusLabel: "FOUNDER FOCUS",
      focus: ["Useful products", "Strong systems", "Long-term growth"],
    },
    story: {
      kicker: "THE LINETECH IDEA",
      title: "Every idea starts with a line.",
      lead: "The line represents clarity: the point where an idea becomes structured enough to design, build and improve.",
      items: [
        ["01", "Understand", "Find the real need."],
        ["02", "Define", "Shape the right direction."],
        ["03", "Build", "Turn the direction into a product."],
        ["04", "Evolve", "Improve the product as it grows."],
      ],
    },
    principles: {
      kicker: "OUR PRINCIPLES",
      title: "A simple standard for every project.",
      lead: "We keep the rules small and practical so the work stays focused on the user, the product and the result.",
      items: [
        ["01", "Clarity first", "Define the real problem before choosing the technology."],
        ["02", "Built for use", "A product should work in the real world, not only look good."],
        ["03", "Strong foundation", "Build systems that can be maintained and improved."],
        ["04", "Disciplined execution", "Every design and engineering decision should serve the outcome."],
      ],
    },
    direction: {
      kicker: "DIRECTION",
      title: "Built in Aden. Designed to grow beyond it.",
      lead: "LINETECH starts with a strong company foundation in Aden, deeper product capability and a path toward wider markets without losing the standard that defines the work.",
      items: [
        ["01", "Foundation", "Strengthen the company, its process and delivery standard."],
        ["02", "Capability", "Build more ambitious digital products and systems."],
        ["03", "Reach", "Expand into wider markets with the same clear operating standard."],
      ],
    },
    cta: {
      kicker: "YOUR IDEA",
      title: "What line do you want to start?",
      lead: "Bring the idea. We will help turn it into something real.",
      button: "Start Your Line",
    },
  },
  ar: {
    hero: {
      kicker: "عن LINETECH",
      title: "أفكار واضحة. تتحول إلى منتجات حقيقية.",
      lead: "LINETECH شركة تقنية تركز على تحويل الأفكار العملية إلى منتجات رقمية مفيدة من خلال تصميم منضبط وهندسة عملية.",
      primary: "ابدأ خطك",
      secondary: "شاهد أعمالنا",
      points: [
        ["01", "بقيادة المؤسس", "اتجاه واضح"],
        ["02", "عدن، اليمن", "أساس الشركة"],
        ["03", "نظرة طويلة المدى", "مصممة للنمو"],
      ],
    },
    founder: {
      kicker: "المؤسس",
      name: "محمد وليد",
      role: "المؤسس والرئيس التنفيذي — LINETECH",
      location: "عدن، اليمن",
      title: "بناء LINETECH كشركة حقيقية، لا كاستوديو مؤقت.",
      text: "الهدف هو بناء تقنية مفيدة، والحفاظ على معيار عالٍ، وتنمية الشركة باتجاه واضح طويل المدى. المنتجات والأنظمة وجودة التنفيذ تأتي أولًا، ثم يأتي العرض ليعكس جودة العمل.",
      focusLabel: "تركيز المؤسس",
      focus: ["منتجات مفيدة", "أنظمة قوية", "نمو طويل المدى"],
    },
    story: {
      kicker: "فكرة LINETECH",
      title: "كل فكرة تبدأ بخط.",
      lead: "الخط يمثل الوضوح: اللحظة التي تصبح فيها الفكرة منظمة بما يكفي لتصميمها وبنائها وتطويرها.",
      items: [
        ["01", "نفهم", "نحدد الاحتياج الحقيقي."],
        ["02", "نحدد", "نرسم الاتجاه الصحيح."],
        ["03", "نبني", "نحوّل الاتجاه إلى منتج."],
        ["04", "نطور", "نحسن المنتج مع نموه."],
      ],
    },
    principles: {
      kicker: "مبادئنا",
      title: "معيار بسيط لكل مشروع.",
      lead: "نحافظ على قواعد قليلة وعملية حتى يبقى العمل مركزًا على المستخدم والمنتج والنتيجة.",
      items: [
        ["01", "الوضوح أولًا", "نحدد المشكلة الحقيقية قبل اختيار التقنية."],
        ["02", "نبني للاستخدام", "المنتج يجب أن يعمل في الواقع، لا أن يبدو جميلًا فقط."],
        ["03", "أساس قوي", "نبني أنظمة يمكن صيانتها وتطويرها."],
        ["04", "تنفيذ منضبط", "كل قرار في التصميم والهندسة يجب أن يخدم النتيجة."],
      ],
    },
    direction: {
      kicker: "الاتجاه",
      title: "بُنيت في عدن. ومصممة للنمو أبعد منها.",
      lead: "تبدأ LINETECH ببناء أساس قوي للشركة في عدن، وتعميق قدرتها على بناء المنتجات، ثم التوسع نحو أسواق أوسع دون فقدان المعيار الذي يميز العمل.",
      items: [
        ["01", "الأساس", "تقوية الشركة وآلية العمل ومعيار التنفيذ."],
        ["02", "القدرة", "بناء منتجات وأنظمة رقمية أكثر طموحًا."],
        ["03", "الانتشار", "التوسع نحو أسواق أوسع بنفس المعيار الواضح."],
      ],
    },
    cta: {
      kicker: "فكرتك",
      title: "ما الخط الذي تريد أن تبدأه؟",
      lead: "أحضر الفكرة، وسنساعدك في تحويلها إلى شيء حقيقي.",
      button: "ابدأ خطك",
    },
  },
} as const;

export default function AboutPage() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className={`${styles.page} ref-page page-about`}>
      <section className={styles.hero}>
        <div className={styles.heroMark} aria-hidden="true">
          <span className={styles.heroMarkVertical} />
          <span className={styles.heroMarkHorizontal} />
          <span className={styles.heroMarkNode} />
          <span className={styles.heroMarkWord}>LINETECH</span>
        </div>

        <div className={styles.heroShell}>
          <aside className={styles.heroRail}>
            <p className={styles.kicker} data-about-motion="hero">{t.hero.kicker}</p>
            <div className={styles.heroIndex}>
              {t.hero.points.map(([n, title, detail]) => (
                <div key={n} data-about-motion="hero">
                  <span>{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className={styles.heroStage}>
            <h1 data-about-motion="hero">{t.hero.title}</h1>
            <div className={styles.heroBottom}>
              <p className={styles.heroLead} data-about-motion="hero">{t.hero.lead}</p>
              <div className={styles.heroActions} data-about-motion="hero">
                <Link className={styles.primary} href="/start" prefetch>{t.hero.primary}<span aria-hidden="true">→</span></Link>
                <Link className={styles.secondary} href="/projects" prefetch>{t.hero.secondary}<span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={`${styles.shell} ${styles.founderGrid}`}>
          <div className={styles.founderIdentity} data-about-motion="reveal">
            <p className={styles.kicker}>{t.founder.kicker}</p>
            <h2>{t.founder.name}</h2>
            <p className={styles.founderRole}>{t.founder.role}</p>
            <span className={styles.founderLocation}>{t.founder.location}</span>
          </div>

          <div className={styles.founderStatement} data-about-motion="reveal">
            <h3>{t.founder.title}</h3>
            <p>{t.founder.text}</p>
            <div className={styles.founderFocus}>
              <span>{t.founder.focusLabel}</span>
              <div>{t.founder.focus.map((item) => <b key={item}>{item}</b>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead} data-about-motion="reveal">
            <div><p className={styles.kicker}>{t.story.kicker}</p><h2>{t.story.title}</h2></div>
            <p>{t.story.lead}</p>
          </div>
          <div className={styles.storySteps}>
            {t.story.items.map(([n, title, description]) => (
              <article className={styles.storyStep} key={n} data-about-motion="stagger">
                <span>{n}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.principlesSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead} data-about-motion="reveal">
            <div><p className={styles.kicker}>{t.principles.kicker}</p><h2>{t.principles.title}</h2></div>
            <p>{t.principles.lead}</p>
          </div>
          <div className={styles.principles}>
            {t.principles.items.map(([n, title, description]) => (
              <article className={styles.principle} key={n} data-about-motion="stagger">
                <span>{n}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.directionSection}>
        <div className={`${styles.shell} ${styles.directionGrid}`}>
          <div className={styles.directionCopy} data-about-motion="reveal">
            <p className={styles.kicker}>{t.direction.kicker}</p>
            <h2>{t.direction.title}</h2>
            <p>{t.direction.lead}</p>
          </div>
          <div className={styles.directionList}>
            {t.direction.items.map(([n, title, description]) => (
              <article className={styles.directionItem} key={n} data-about-motion="stagger">
                <span>{n}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ref-cta" data-about-motion="reveal">
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