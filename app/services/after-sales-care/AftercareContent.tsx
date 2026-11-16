"use client";

import Link from "next/link";
import MarketingHero from "../../MarketingHero";
import { useLanguage } from "../../Localized";
import styles from "../../MarketingPage.module.css";

const care = [
  { en: ["01", "Maintenance & compatibility", "Review and update the agreed website or application components to keep the product compatible as its dependencies change."], ar: ["01", "الصيانة والتوافق", "مراجعة وتحديث مكونات الموقع أو التطبيق المتفق عليها للحفاظ على توافق المنتج مع تغير المتطلبات والاعتماديات."] },
  { en: ["02", "Troubleshooting & fixes", "Investigate reported issues, reproduce the problem and agree the appropriate fix within the supported scope."], ar: ["02", "تشخيص المشكلات وإصلاحها", "فحص المشكلات المبلغ عنها وإعادة إنتاجها وتحديد الإصلاح المناسب ضمن نطاق الدعم المتفق عليه."] },
  { en: ["03", "Updates & improvements", "Plan content updates and small improvements. Larger features and redesigns receive a separate scope and quotation."], ar: ["03", "التحديثات والتحسينات", "تنظيم تحديثات المحتوى والتحسينات المحدودة، مع تحديد نطاق وعرض سعر منفصل للميزات الكبيرة وإعادة التصميم."] },
  { en: ["04", "Hosting & backup coordination", "Where included in your agreement, coordinate hosting renewals, backup arrangements and recovery procedures with the relevant providers."], ar: ["04", "تنسيق الاستضافة والنسخ الاحتياطي", "عند تضمينها في الاتفاق، ننسق تجديد الاستضافة وترتيبات النسخ الاحتياطي وخطوات الاستعادة مع مقدمي الخدمات المعنيين."] },
];
const steps = [
  { en: ["Review your product", "Share the product, access requirements, existing issues and the support you need."], ar: ["مراجعة منتجك", "شاركنا المنتج ومتطلبات الوصول والمشكلات الحالية ونوع الدعم الذي تحتاجه."] },
  { en: ["Agree the care plan", "Define the covered work, support channels, response windows, responsibilities and price in writing."], ar: ["الاتفاق على خطة الدعم", "نحدد كتابيًا الأعمال المشمولة وقنوات الدعم ومواعيد الاستجابة والمسؤوليات والتكلفة."] },
  { en: ["Maintain & review", "Track agreed work, review priorities and approve any additional work before it starts."], ar: ["التنفيذ والمراجعة", "نتابع الأعمال المتفق عليها ونراجع الأولويات ونعتمد أي أعمال إضافية قبل تنفيذها."] },
];
const faqs = [
  { en: ["Can you support a product built by another developer?", "We can review it first. Support depends on the technology, source access, documentation and current condition of the product."], ar: ["هل تدعمون منتجًا نفذه مطور آخر؟", "يمكننا مراجعته أولًا. يعتمد قبول الدعم على التقنيات والوصول إلى الملفات والتوثيق وحالة المنتج الحالية."] },
  { en: ["Are hosting and third-party fees included?", "Only when explicitly listed in your agreement. Hosting, domains, licences and provider charges are otherwise quoted separately."], ar: ["هل تشمل الخطة رسوم الاستضافة والخدمات الأخرى؟", "فقط عند ذكرها صراحة في الاتفاق. بخلاف ذلك تحدد رسوم الاستضافة والدومين والتراخيص ومقدمي الخدمات بصورة منفصلة."] },
  { en: ["Is support available 24/7?", "Support hours, response windows and any urgent-incident arrangements are defined in the agreed plan. Around-the-clock support is not implied."], ar: ["هل الدعم متاح على مدار الساعة؟", "تحدد ساعات الدعم ومواعيد الاستجابة وآلية الحالات العاجلة في الخطة المتفق عليها، ولا يفترض توفر الدعم على مدار الساعة."] },
  { en: ["How much does ongoing care cost?", "The price depends on your product and the covered work. We confirm the scope, duration and price before you commit; sending an enquiry does not activate a subscription."], ar: ["كم تكلفة الدعم المستمر؟", "تعتمد التكلفة على المنتج والأعمال المشمولة. نؤكد النطاق والمدة والسعر قبل الاتفاق، ولا يؤدي إرسال الاستفسار إلى تفعيل اشتراك."] },
];

export default function AftercareContent() {
  const language = useLanguage();
  const ar = language === "ar";
  return <main className={`${styles.page} platform-page`} data-viewport-page dir={ar ? "rtl" : "ltr"}>
    <MarketingHero variant="aftercare" eyebrow={ar ? "خدمات ما بعد البيع" : "AFTER-SALES CARE"} title={ar ? "منتجك يستمر.\nونحن إلى جانبه." : "Built to launch.\nCared for beyond it."} description={ar ? "صيانة وتحديثات ودعم تقني لموقعك أو تطبيقك أو نظام أعمالك، ضمن خطة واضحة تناسب احتياجاته." : "Maintenance, updates and technical support for your website, application or business system, within a clear plan shaped around its needs."}>
      <Link className="platform-button primary" href="/contact?interest=aftercare#request">{ar ? "ناقش احتياجات الدعم" : "Discuss your care needs"}</Link>
      <a className="platform-button secondary" href="#care-scope">{ar ? "ماذا تشمل الخدمة؟" : "Explore the scope"}</a>
    </MarketingHero>
    <section className="platform-section" id="care-scope">
      <div className="platform-section-heading"><h2>{ar ? "رعاية تناسب منتجك." : "Care shaped around your product."}</h2></div>
      <p className="company-form-note">{ar ? "نختار الأعمال المناسبة لحالة منتجك، ونوضح ما هو مشمول وما يحتاج اتفاقًا منفصلًا قبل البدء." : "We identify the work your product needs and clarify what is covered and what needs a separate agreement before starting."}</p>
      <div className="platform-grid">{care.map(item => <article className="platform-card" key={item.en[0]}><p>{item[language][0]}</p><h3>{item[language][1]}</h3><p>{item[language][2]}</p></article>)}</div>
    </section>
    <section className="platform-section" id="care-process">
      <div className="platform-section-heading"><h2>{ar ? "من المراجعة إلى المتابعة." : "From review to ongoing care."}</h2></div>
      <div className="platform-grid">{steps.map((step, index) => <article className="platform-card" key={step.en[0]}><p>0{index + 1}</p><h3>{step[language][0]}</h3><p>{step[language][1]}</p></article>)}</div>
    </section>
    <section className="platform-section" id="care-faq">
      <div className="platform-section-heading"><h2>{ar ? "قبل أن نبدأ الدعم." : "Before your care plan begins."}</h2></div>
      <div className="platform-faq-list">{faqs.map(faq => <details key={faq.en[0]}><summary>{faq[language][0]}<span>+</span></summary><p>{faq[language][1]}</p></details>)}</div>
    </section>
  </main>;
}
