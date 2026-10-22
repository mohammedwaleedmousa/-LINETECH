"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import { PlatformHero, PlatformIcon } from "../PlatformUI";

const plans = [
  {code:"basic", ar:"أساسي", en:"Basic", audienceAr:"نقطة البداية", audienceEn:"Your starting point", icon:"user"},
  {code:"professional", ar:"احترافي", en:"Professional", audienceAr:"مساحة أكبر لطموحك", audienceEn:"Room for your ambition", icon:"layers"},
  {code:"company", ar:"شركات", en:"Companies", audienceAr:"لأعمالك وفريقك", audienceEn:"For your business & team", icon:"grid"},
];

export default function Pricing() {
  const ar = useLanguage() === "ar";
  return <main className="platform-page platform-pricing-page">
    <PlatformHero eyebrow={ar ? "الخطط والأسعار" : "PLANS & PRICING"} title={ar ? "مساحة لطموحك.\nوخطة لخطوتك القادمة." : "Space for your ambition.\nA plan for your next step."} description={ar ? "ثلاثة مستويات للاشتراك في منظومة LINETECH. سنعلن الأسعار والمزايا وحدود الاستخدام عند اعتماد المنتجات المشمولة." : "Three subscription tiers for the LINETECH platform. Prices, benefits and usage limits will be published once the included products are confirmed."} icon="layers">
      <a href="#plans" className="platform-button primary">{ar ? "تعرّف على المستويات" : "Explore the tiers"}<PlatformIcon kind="arrow"/></a>
      <span className="platform-availability"><i/>{ar ? "الاشتراكات قيد التجهيز" : "Subscriptions in preparation"}</span>
    </PlatformHero>
    <section className="platform-section" id="plans" aria-label={ar ? "مستويات الاشتراك" : "Subscription tiers"}>
      <div className="platform-grid platform-plan-grid">{plans.map((p, i) => <article className={`platform-card platform-plan-card ${i===1 ? "platform-plan-accent" : ""}`} key={p.code}>
        <div className="platform-card-top"><span className="platform-card-icon"><PlatformIcon kind={p.icon}/></span><span className="platform-badge">{ar ? "قريبًا" : "Coming soon"}</span></div>
        <p className="platform-plan-audience">{ar ? p.audienceAr : p.audienceEn}</p><h2>{ar ? p.ar : p.en}</h2>
        <div className="platform-plan-price"><strong>—</strong><span>{ar ? "السعر يُعلن لاحقًا" : "Pricing to be announced"}</span></div>
        <ul className="platform-plan-details">{[ar ? "المزايا المشمولة قيد الاعتماد" : "Included benefits pending approval", ar ? "حدود الاستخدام تُعلن مع الإطلاق" : "Usage limits published at launch", ar ? "تفاصيل التجديد والإلغاء ستُوضّح مسبقًا" : "Renewal and cancellation explained upfront"].map(x => <li key={x}><span className="platform-detail-dot"/>{x}</li>)}</ul>
        <Link className={`platform-button ${i===1 ? "primary" : "secondary"}`} href="/contact">{ar ? "استفسر عن المستوى" : "Ask about this tier"}<PlatformIcon kind="arrow"/></Link>
      </article>)}</div>
      <aside className="platform-service-note"><span className="platform-card-icon"><PlatformIcon kind="technical-services"/></span><div><h2>{ar ? "لديك مشروع خاص؟" : "Have a custom project?"}</h2><p>{ar ? "الخدمات المخصصة لها نطاق عمل وعرض سعر مستقل. أخبرنا بفكرتك لنحدد الحل المناسب." : "Custom services have their own scope and quote. Tell us about your idea to find the right solution."}</p></div><Link className="platform-text-link" href="/services/request">{ar ? "اطلب مشروعًا" : "Request a project"}<span>↗</span></Link></aside>
      <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar ? "قبل أن تبدأ" : "BEFORE YOU START"}</p><h2>{ar ? "تفاصيل واضحة من البداية." : "Clarity from the beginning."}</h2></div></div>
      <div className="platform-faq-list">
        <details><summary>{ar ? "متى يمكنني الاشتراك؟" : "When can I subscribe?"}<span>+</span></summary><p>{ar ? "الشراء غير متاح حاليًا. ستظهر المزايا والأسعار النهائية ووسائل الدفع قبل تفعيل الاشتراكات." : "Checkout is not available yet. Final benefits, prices and payment methods will be published before subscriptions open."}</p></details>
        <details><summary>{ar ? "كيف تعمل عضويات الشركات؟" : "How will company memberships work?"}<span>+</span></summary><p>{ar ? "النموذج المخطط يعتمد فوترة الأعضاء ومهلة دفع 7 أيام، ثم تعليق الوصول وفق السياسة المعتمدة. التفاصيل النهائية ستُنشر قبل التفعيل." : "The planned model uses per-member billing with a 7-day payment grace period, followed by access suspension under the approved policy. Final details will be published before activation."}</p></details>
        <details><summary>{ar ? "ماذا يحدث للبيانات عند التعليق؟" : "What happens to data during suspension?"}<span>+</span></summary><p>{ar ? "تعليق الاشتراك لا يعني حذف المشاريع أو الملفات تلقائيًا. ستوضّح سياسة مستقلة مدة الاحتفاظ بالبيانات واستعادة الوصول، إلى جانب شروط التجديد والإلغاء والاسترداد." : "Subscription suspension does not automatically delete projects or files. A separate policy will explain retention and restored access, alongside renewal, cancellation and refund terms."}</p></details>
      </div>
    </section>
  </main>;
}
