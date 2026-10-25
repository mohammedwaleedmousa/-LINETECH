"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
const homeCategories=[
 {slug:"websites",en:"Company websites",ar:"مواقع الشركات",href:"/products?category=websites"},
 {slug:"websites",en:"Online stores",ar:"المتاجر الإلكترونية",href:"/products?category=websites&q=store"},
 {slug:"websites",en:"Web applications",ar:"تطبيقات الويب",href:"/products?category=websites&q=web"},
 {slug:"mobile-apps",en:"Android applications",ar:"تطبيقات Android",href:"/products?category=mobile-apps&q=Android"},
 {slug:"mobile-apps",en:"iOS applications",ar:"تطبيقات iOS",href:"/products?category=mobile-apps&q=iOS"},
 {slug:"mobile-apps",en:"Cross-platform applications",ar:"تطبيقات متعددة المنصات",href:"/products?category=mobile-apps"},
];
import { CategoryCard, PlatformIcon } from "./PlatformUI";

export default function HomePlatform() {
  const ar = useLanguage() === "ar";
  return <>
    <section className="platform-home-section" aria-labelledby="home-products-title">
      <p className="platform-eyebrow">{ar ? "منظومة LINETECH" : "THE LINETECH PLATFORM"}</p>
      <h2 id="home-products-title">{ar ? "خطوط مختلفة.\nإمكانيات أوسع." : "Different lines. More possibilities."}</h2>
      <p>{ar ? "من موقعك الأول إلى أدوات أعمالك. استكشف فئات منتجاتنا، أو اطلب حلًا نصممه وننفذه لك." : "From your first website to your business toolkit. Explore our product categories, or request a solution designed and built for you."}</p>
      <div className="platform-grid">{homeCategories.map((c,index) => <CategoryCard key={c.en} href={c.href} slug={c.slug} title={c[ar ? "ar" : "en"]} index={index}/>)}</div>
    </section>
    <section className="platform-home-section" aria-labelledby="home-care-title">
      <p className="platform-eyebrow">{ar ? "الدعم يكمل رحلتك" : "SUPPORT FOR YOUR NEXT STEP"}</p>
      <h2 id="home-care-title">{ar ? "أطلق مشروعك. وواصل بثقة." : "Launch your idea. Keep moving."}</h2>
      <p>{ar ? "خيارات للصيانة والدعم والتحديثات والاستضافة، حسب احتياجات منتجك أو مشروعك." : "Maintenance, support, updates and hosting options shaped around your product or custom project."}</p>
      <Link className="platform-text-link" href="/pricing#aftercare">{ar ? "استكشف خدمات ما بعد البيع" : "Explore after-sales care"}<span>↗</span></Link>
      <div className="platform-grid platform-next-grid">{[["/products", "استكشف المنتجات", "Explore products"], ["/services/request", "اطلب مشروعًا", "Request a project"], ["/login?mode=signup", "أنشئ حسابك الموحد", "Create your account"]].map(([href,a,e]) => <Link className="platform-card" key={href} href={href}><h3>{ar ? a : e}</h3><PlatformIcon kind="arrow"/></Link>)}</div>
    </section>
  </>;
}
