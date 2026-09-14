"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import styles from "./company-profile.module.css";

const copy = {
  en: {
    kicker: "COMPANY PROFILE",
    title: "A technology company focused on useful digital products.",
    lead: "LINETECH combines product thinking, interface design and engineering to move an idea from a loose requirement into a clear, usable digital product.",
    modelLabel: "WORKING MODEL",
    modelTitle: "Founder-led. Scope-driven. Built around the product.",
    modelText: "Projects begin by defining the real need, the expected outcome and the responsibilities on both sides. The work then moves through a visible process from scope to handover.",
    process: "See how we work",
    capabilities: [
      ["01", "Web products", "Company websites and web experiences structured around clarity, performance and real business use."],
      ["02", "Commerce & systems", "Customer journeys, operational workflows, dashboards and digital systems shaped around how the business works."],
      ["03", "Identity systems", "Visual foundations that keep a company clear and consistent across its product and communication."],
      ["04", "Professional presence", "CV and portfolio systems that organize experience and work into a stronger professional presentation."],
    ],
    standard: [
      ["Scope before execution", "The expected deliverables and priorities are made clear before the build begins."],
      ["One visible process", "The client can understand what stage the project is in and what comes next."],
      ["Clear ownership", "The agreed files, assets, access and handover remain part of the delivery conversation."],
    ],
  },
  ar: {
    kicker: "ملف الشركة",
    title: "شركة تقنية تركز على بناء منتجات رقمية مفيدة.",
    lead: "تجمع لاين تك بين التفكير بالمنتج وتصميم الواجهات والهندسة لتحويل الفكرة من احتياج غير مرتب إلى منتج رقمي واضح وقابل للاستخدام.",
    modelLabel: "نموذج العمل",
    modelTitle: "يقودها المؤسس. يحكمها النطاق. ويتمحور العمل حول المنتج.",
    modelText: "تبدأ المشاريع بتحديد الاحتياج الحقيقي والنتيجة المطلوبة ومسؤوليات الطرفين، ثم يتحرك العمل خلال مسار واضح من تحديد النطاق حتى التسليم.",
    process: "شاهد كيف نعمل",
    capabilities: [
      ["01", "منتجات الويب", "مواقع شركات وتجارب ويب مبنية حول الوضوح والأداء والاستخدام الحقيقي في العمل."],
      ["02", "التجارة والأنظمة", "رحلات عملاء وسير عمل تشغيلي ولوحات تحكم وأنظمة رقمية مبنية حول طريقة عمل النشاط."],
      ["03", "أنظمة الهوية", "أسس بصرية تحافظ على وضوح الشركة وتناسقها عبر المنتج والتواصل."],
      ["04", "الحضور المهني", "أنظمة للسيرة الذاتية والـPortfolio ترتب الخبرة والأعمال في تقديم مهني أقوى."],
    ],
    standard: [
      ["النطاق قبل التنفيذ", "يتم توضيح المخرجات والأولويات المتوقعة قبل بدء البناء."],
      ["مسار واحد وواضح", "يستطيع العميل فهم مرحلة المشروع الحالية وما الذي يأتي بعدها."],
      ["ملكية واضحة", "تبقى الملفات والأصول والصلاحيات والتسليم المتفق عليه جزءًا واضحًا من عملية التنفيذ."],
    ],
  },
} as const;

export default function CompanyProfile() {
  const language = useLanguage();
  const t = copy[language];

  return (
    <section className={styles.section} aria-labelledby="company-profile-title">
      <div className={styles.shell}>
        <div className={styles.head} data-about-motion="reveal">
          <div><p>{t.kicker}</p><h2 id="company-profile-title">{t.title}</h2></div>
          <p>{t.lead}</p>
        </div>

        <div className={styles.capabilities}>
          {t.capabilities.map(([n, title, text]) => (
            <article key={n} data-about-motion="stagger">
              <span>{n}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>

        <div className={styles.model} data-about-motion="reveal">
          <div className={styles.modelCopy}>
            <p className={styles.label}>{t.modelLabel}</p>
            <h3>{t.modelTitle}</h3>
            <p>{t.modelText}</p>
            <Link href="/how-we-work" prefetch>{t.process}<span>→</span></Link>
          </div>
          <div className={styles.standard}>
            {t.standard.map(([title, text], index) => (
              <div key={title}><span>{String(index + 1).padStart(2,"0")}</span><section><h4>{title}</h4><p>{text}</p></section></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
