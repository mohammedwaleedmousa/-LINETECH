"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import CompanyProfile from "./CompanyProfile";
import styles from "./about-page.module.css";

const copy = {
  en: {
    hero: {
      kicker: "ABOUT LINETECH",
      title: "A technology company built from a clear line.",
      lead: "LINETECH turns ideas into useful digital products through clear thinking, disciplined design and practical engineering.",
      primary: "Start Your Line",
      secondary: "See Our Work",
      points: [["01", "IDEA"],["02", "STRUCTURE"],["03", "PRODUCT"],["04", "IMPACT"]],
    },
    story: {
      kicker: "THE LINETECH IDEA",
      title: "Every idea starts with a line.",
      paragraphs: [
        "The line is more than a visual element. It represents the moment an idea becomes clear enough to shape, test and build.",
        "LINETECH exists to carry that line forward — from the first thought to a product people can actually use, operate and grow with.",
      ],
      route: [["01", "UNDERSTAND"],["02", "DEFINE"],["03", "BUILD"],["04", "EVOLVE"]],
    },
    principles: {
      kicker: "OUR PRINCIPLES",
      title: "Clear thinking. Strong execution.",
      lead: "A small set of principles keeps every decision focused on the product, the user and the long-term result.",
      items: [
        ["01", "Clarity first.", "We define the real problem before choosing the technology."],
        ["02", "Build for use.", "The product should work in the real world, not only look good in a presentation."],
        ["03", "Think long term.", "Every project should leave behind a stronger and more maintainable foundation."],
        ["04", "Stay disciplined.", "Design, scope and engineering should serve the outcome, not distract from it."],
      ],
    },
    founder: {
      kicker: "FOUNDER & CEO",
      name: "Mohammed Waleed",
      role: "Founder & CEO of LINETECH · AI Engineer",
      statementTitle: "Building LINETECH as a long-term technology company.",
      paragraphs: [
        "I founded LINETECH around a simple belief: technology should make ideas clearer, businesses stronger and day-to-day work more capable — not add unnecessary complexity.",
        "As Founder & CEO, my role is to set the direction, protect the standard and stay close to the work. I lead the company across product thinking, design and engineering so each project connects a real business goal with practical execution.",
        "I want LINETECH to be known for useful products, disciplined delivery and the ability to build systems that people can actually depend on. The company is being built carefully, with a focus on quality before scale and on long-term value before short-term noise.",
      ],
      visionLabel: "THE COMPANY VISION",
      vision: "The vision is to grow LINETECH from Aden into an international technology company with stronger product capability, wider markets and a reputation for clear thinking, reliable engineering and work that creates real impact.",
    },
    direction: {
      kicker: "WHERE WE'RE GOING",
      title: "Built in Aden. Designed to grow beyond borders.",
      lead: "The direction is simple: deepen the product capability, strengthen the company and expand into wider markets without losing the clarity that started the first line.",
      items: [
        ["01", "Aden", "Build the company foundation and delivery standard."],
        ["02", "Product depth", "Take on stronger digital products and systems."],
        ["03", "Wider markets", "Serve clients and opportunities beyond the local market."],
        ["04", "International company", "Grow LINETECH into a technology company with a broader presence."],
      ],
    },
    cta: { kicker: "YOUR IDEA", title: "What line do you want to start?", lead: "Bring the idea. We will help turn it into something real.", button: "Start Your Line" },
  },
  ar: {
    hero: {
      kicker: "عن LINETECH",
      title: "شركة تقنية بُنيت من خط واضح.",
      lead: "تحوّل LINETECH الأفكار إلى منتجات رقمية مفيدة من خلال تفكير واضح، وتصميم منضبط، وهندسة عملية.",
      primary: "ابدأ خطك",
      secondary: "شاهد أعمالنا",
      points: [["01", "الفكرة"],["02", "الهيكلة"],["03", "المنتج"],["04", "الأثر"]],
    },
    story: {
      kicker: "فكرة LINETECH",
      title: "كل فكرة تبدأ بخط.",
      paragraphs: [
        "الخط ليس مجرد عنصر بصري. هو اللحظة التي تصبح فيها الفكرة واضحة بما يكفي لتشكيلها واختبارها وبنائها.",
        "وجدت LINETECH لتدفع هذا الخط إلى الأمام — من أول فكرة إلى منتج يمكن للناس استخدامه وتشغيله وتطويره فعليًا.",
      ],
      route: [["01", "نفهم"],["02", "نحدد"],["03", "نبني"],["04", "نطور"]],
    },
    principles: {
      kicker: "مبادئنا",
      title: "تفكير واضح. تنفيذ قوي.",
      lead: "مجموعة صغيرة من المبادئ تحافظ على تركيز كل قرار على المنتج والمستخدم والنتيجة طويلة المدى.",
      items: [
        ["01", "الوضوح أولًا.", "نحدد المشكلة الحقيقية قبل اختيار التقنية."],
        ["02", "نبني للاستخدام.", "المنتج يجب أن يعمل في الواقع، لا أن يبدو جيدًا في العرض فقط."],
        ["03", "نفكر على المدى الطويل.", "كل مشروع يجب أن يترك خلفه أساسًا أقوى وأسهل في التطوير والصيانة."],
        ["04", "نحافظ على الانضباط.", "التصميم والنطاق والهندسة كلها تخدم النتيجة بدل أن تشتت عنها."],
      ],
    },
    founder: {
      kicker: "المؤسس والرئيس التنفيذي",
      name: "محمد وليد",
      role: "مؤسس ورئيس تنفيذي لـ LINETECH · مهندس ذكاء اصطناعي",
      statementTitle: "أبني LINETECH كشركة تقنية طويلة المدى.",
      paragraphs: [
        "أسست LINETECH على فكرة بسيطة: التقنية يجب أن تجعل الأفكار أوضح، والأعمال أقوى، والتشغيل اليومي أكثر قدرة — لا أن تضيف تعقيدًا بلا فائدة.",
        "بصفتي المؤسس والرئيس التنفيذي، مسؤوليتي هي تحديد الاتجاه، والحفاظ على معيار الشركة، والبقاء قريبًا من تفاصيل العمل. أقود الشركة عبر التفكير بالمنتج والتصميم والهندسة حتى يرتبط كل مشروع بهدف تجاري حقيقي وتنفيذ عملي واضح.",
        "أريد أن تُعرف LINETECH بمنتجات مفيدة، وتنفيذ منضبط، وأنظمة يستطيع الناس الاعتماد عليها فعليًا. لذلك أبني الشركة بهدوء، مع تقديم الجودة على التوسع السريع، والقيمة طويلة المدى على الضجيج قصير المدى.",
      ],
      visionLabel: "رؤية الشركة",
      vision: "الرؤية هي أن تنمو LINETECH من عدن إلى شركة تقنية دولية بقدرات أقوى في بناء المنتجات، وأسواق أوسع، وسمعة تقوم على وضوح التفكير، وموثوقية الهندسة، وأعمال تصنع أثرًا حقيقيًا.",
    },
    direction: {
      kicker: "إلى أين نتجه",
      title: "بُنيت في عدن. ومصممة للنمو أبعد من الحدود.",
      lead: "الاتجاه بسيط: تعميق قدراتنا في بناء المنتجات، تقوية الشركة، والتوسع نحو أسواق أوسع دون فقدان الوضوح الذي بدأ منه الخط الأول.",
      items: [
        ["01", "عدن", "بناء أساس الشركة ومعيار واضح للتنفيذ."],
        ["02", "عمق أكبر في المنتجات", "تنفيذ منتجات وأنظمة رقمية أقوى وأكثر نضجًا."],
        ["03", "أسواق أوسع", "خدمة عملاء وفرص تتجاوز السوق المحلي."],
        ["04", "شركة دولية", "تنمية LINETECH كشركة تقنية بحضور أوسع."],
      ],
    },
    cta: { kicker: "فكرتك", title: "ما الخط الذي تريد أن تبدأه؟", lead: "أحضر الفكرة، وسنساعدك في تحويلها إلى شيء حقيقي.", button: "ابدأ خطك" },
  },
} as const;

export default function AboutPage() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <main className={`${styles.page} ref-page page-about`}>
      <section className={styles.hero}>
        <div className="about-soft-light" aria-hidden="true">
          <span className="about-soft-glow" />
          <span className="about-soft-haze" />
        </div>
        <div className={`${styles.shell} ${styles.heroShell}`}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-about-motion="hero">{t.hero.kicker}</p>
            <h1 data-about-motion="hero">{t.hero.title}</h1>
            <p className={styles.heroLead} data-about-motion="hero">{t.hero.lead}</p>
            <div className={styles.heroActions} data-about-motion="hero">
              <Link className={styles.primary} href="/start" prefetch>{t.hero.primary}<span aria-hidden="true">→</span></Link>
              <Link className={styles.secondary} href="/projects" prefetch>{t.hero.secondary}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className={styles.heroLine} data-about-motion="hero">
            {t.hero.points.map(([n, label]) => <div className={styles.heroPoint} key={n}><span>{n}</span><strong>{label}</strong></div>)}
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={`${styles.shell} ${styles.founderGrid}`}>
          <div className={styles.founderIdentity} data-about-motion="reveal">
            <p className={styles.kicker}>{t.founder.kicker}</p>
            <h2>{t.founder.name}</h2>
            <p>{t.founder.role}</p>
          </div>
          <div className={styles.founderStatement} data-about-motion="reveal">
            <h3>{t.founder.statementTitle}</h3>
            {t.founder.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <span className="founder-vision-label">{t.founder.visionLabel}</span>
            <p>{t.founder.vision}</p>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={`${styles.shell} ${styles.storyGrid}`}>
          <div className={styles.storyTitle} data-about-motion="reveal"><p className={styles.kicker}>{t.story.kicker}</p><h2>{t.story.title}</h2></div>
          <div className={styles.storyCopy} data-about-motion="reveal">
            {t.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className={styles.storyRoute}>{t.story.route.map(([n, label]) => <div key={n}><span>{n}</span><strong>{label}</strong></div>)}</div>
          </div>
        </div>
      </section>

      <CompanyProfile />

      <section className={styles.principlesSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead} data-about-motion="reveal"><div><p className={styles.kicker}>{t.principles.kicker}</p><h2>{t.principles.title}</h2></div><p>{t.principles.lead}</p></div>
          <div className={styles.principles}>{t.principles.items.map(([n, title, description]) => <article className={styles.principle} key={n} data-about-motion="stagger"><span>{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.directionSection}>
        <div className={styles.shell}>
          <div className={styles.sectionHead} data-about-motion="reveal"><div><p className={styles.kicker}>{t.direction.kicker}</p><h2>{t.direction.title}</h2></div><p>{t.direction.lead}</p></div>
          <div className={styles.directionRail}>{t.direction.items.map(([n, title, description]) => <article className={styles.directionItem} key={n} data-about-motion="stagger"><span>{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="ref-cta" data-about-motion="reveal">
        <div className="ref-shell ref-cta-inner"><div><p className="ref-kicker">{t.cta.kicker}</p><h2>{t.cta.title}</h2><p>{t.cta.lead}</p></div><Link className="ref-btn primary" href="/start" prefetch>{t.cta.button} ↗</Link></div>
      </section>
    </main>
  );
}
