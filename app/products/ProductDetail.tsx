"use client";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {useLanguage} from "../Localized";
import {PlatformEmpty,PlatformHero} from "../PlatformUI";
import {products,aftercarePlans,formatPrice,inquiryHref,safeDemoUrl} from "../../lib/catalog";
export default function ProductDetail(){return <Suspense fallback={null}><Detail/></Suspense>;}
function Detail(){
  const language=useLanguage(),ar=language==="ar",slug=useSearchParams().get("product");
  const product=products.find(p=>p.published&&p.slug===slug);
  if(!product)return <main className="platform-page"><PlatformHero eyebrow={ar?"المنتجات":"PRODUCTS"} title={ar?"المنتج غير متاح.":"Product unavailable."} description={ar?"قد يكون الرابط غير صحيح أو أن المنتج لم يُنشر بعد.":"The link may be incorrect or the product is not published."}/><section className="platform-section"><PlatformEmpty title={ar?"استكشف المنتجات المتاحة":"Explore available products"} body={ar?"تظهر المنتجات المنشورة وخيارات شرائها في الكتالوج.":"Published products and purchase options appear in the catalog."}><Link className="platform-button primary" href="/products">{ar?"العودة للمنتجات":"Back to products"}</Link></PlatformEmpty></section></main>;
  const demo=safeDemoUrl(product.demoUrl),care=aftercarePlans.filter(p=>p.published&&product.aftercareIds.includes(p.id));
  return <main className="platform-page storefront-detail">
    <PlatformHero eyebrow={ar?"المنتجات / التفاصيل والمعاينة":"PRODUCTS / DETAILS & PREVIEW"} title={product.title[language]} description={product.summary[language]} icon={product.category}>{demo&&<a className="platform-button primary" href={demo} target="_blank" rel="noopener noreferrer">{ar?"افتح المعاينة مباشرة ↗":"Open live preview ↗"}</a>}<a className="platform-button secondary" href="#product-offers">{ar?"خيارات الشراء":"Purchase options"}</a></PlatformHero>
    <section className="platform-section"><div className="storefront-detail-intro"><h2>{ar?"عن المنتج":"About this product"}</h2><p>{product.description[language]}</p><p>{product.platforms.join(" · ")}</p></div>
      {product.screenshots.length>0&&<div className="storefront-gallery">{product.screenshots.map(s=><figure key={s.src}><img src={s.src} alt={s.alt[language]} loading="lazy"/><figcaption>{s.alt[language]}</figcaption></figure>)}</div>}
      <h2>{ar?"المميزات":"Features"}</h2><ul className="storefront-feature-list">{product.features.map((f,i)=><li key={i}>{f[language]}</li>)}</ul>
      <div className="platform-section-heading" id="product-offers"><h2>{ar?"اختر طريقة الشراء":"Choose a purchase option"}</h2></div><div className="platform-grid">{product.offers.map(offer=><article className="platform-card" key={offer.id}><span className="platform-badge">{offer.billing==="monthly"?(ar?"اشتراك شهري":"Monthly subscription"):(ar?"دفع مرة واحدة":"One-time purchase")}</span><h2>{offer.title[language]}</h2><p className="storefront-price">{formatPrice(offer.amount,offer.currency,language)}</p><ul>{offer.includes.map((item,i)=><li key={i}>{item[language]}</li>)}</ul><p><strong>{ar?"الترخيص: ":"Licence: "}</strong>{offer.license[language]}</p><p>{offer.renewal[language]}</p><Link className="platform-button primary" href={inquiryHref(product,offer)}>{offer.billing==="monthly"?(ar?"استفسر عن الاشتراك":"Ask about subscribing"):(ar?"استفسر عن الشراء":"Ask about purchasing")}</Link></article>)}</div>
      <div className="platform-section-heading"><h2>{ar?"خدمات ما بعد البيع":"After-sales care"}</h2></div>{care.length?<div className="platform-grid">{care.map(plan=><article className="platform-card" key={plan.id}><h3>{plan.title[language]}</h3><p>{plan.summary[language]}</p><p>{formatPrice(plan.amount,plan.currency,language)} · {ar?"شهريًا":"per month"}</p><ul>{plan.includes.map((item,i)=><li key={i}>{item[language]}</li>)}</ul><p>{plan.terms[language]}</p><Link className="platform-button secondary" href={"/contact?"+new URLSearchParams({product:product.slug,care:plan.id})}>{ar?"استفسر عن الباقة":"Ask about this care plan"}</Link></article>)}</div>:<p>{ar?"تواصل معنا لتحديد الصيانة والدعم والاستضافة المناسبة لهذا المنتج.":"Contact us to agree on maintenance, support and hosting for this product."}</p>}
    </section>
  </main>;
}
