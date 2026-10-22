"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import { categories } from "../lib/catalog";
import { CategoryCard, PlatformIcon } from "./PlatformUI";

export default function HomePlatform() {
  const ar = useLanguage() === "ar";
  return <>
    <section className="platform-home-section" aria-labelledby="home-products-title">
      <p className="platform-eyebrow">{ar ? "منظومة LINETECH" : "THE LINETECH PLATFORM"}</p>
      <h2 id="home-products-title">{ar ? "خطوط مختلفة.\nإمكانيات أوسع." : "Different lines. More possibilities."}</h2>
      <p>{ar ? "من موقعك الأول إلى أدوات أعمالك. استكشف فئات منتجاتنا، أو اطلب حلًا نصممه وننفذه لك." : "From your first website to your business toolkit. Explore our product categories, or request a solution designed and built for you."}</p>
      <div className="platform-grid">{categories.map((c,index) => <CategoryCard key={c.slug} slug={c.slug} title={c[ar ? "ar" : "en"]} index={index}/>)}</div>
    </section>
    <section className="platform-home-section" aria-labelledby="home-knowledge-title">
      <p className="platform-eyebrow">{ar ? "المعرفة تصنع الفرق" : "KNOWLEDGE MAKES THE DIFFERENCE"}</p>
      <h2 id="home-knowledge-title">{ar ? "فكّر أبعد. وابنِ أفضل." : "Think further. Build better."}</h2>
      <p>{ar ? "مساحة للمقالات والأبحاث والأدلة العملية. نجهّز أولى موادنا المعرفية لمشاركتها معك." : "A space for articles, research and practical guides. Our first publications are being prepared to share with you."}</p>
      <Link className="platform-text-link" href="/knowledge">{ar ? "استكشف المعرفة والأبحاث" : "Explore knowledge & research"}<span>↗</span></Link>
      <div className="platform-grid platform-next-grid">{[["/products", "استكشف المنتجات", "Explore products"], ["/services/request", "اطلب مشروعًا", "Request a project"], ["/login?mode=signup", "أنشئ حسابك الموحد", "Create your account"]].map(([href,a,e]) => <Link className="platform-card" key={href} href={href}><h3>{ar ? a : e}</h3><PlatformIcon kind="arrow"/></Link>)}</div>
    </section>
  </>;
}
