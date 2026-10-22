"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../Localized";
import { categories, products } from "../../lib/catalog";
import { CategoryCard, PlatformEmpty, PlatformHero, PlatformIcon } from "../PlatformUI";

export default function Catalog({ category = "" }: { category?: string }) {
  const ar = useLanguage() === "ar";
  const [query, setQuery] = useState("");
  const [offer, setOffer] = useState("");
  const selected = categories.find(c => c.slug === category);
  const searching = Boolean(query.trim() || offer);
  const filtered = products.filter(p => (!category || p.category === category) && (!offer || p.offer === offer) && p.title[ar ? "ar" : "en"].toLowerCase().includes(query.trim().toLowerCase()));
  function clear() { setQuery(""); setOffer(""); }

  return <main className="platform-page">
    <PlatformHero eyebrow={ar ? "المنتجات الرقمية" : "DIGITAL PRODUCTS"} title={selected ? selected[ar ? "ar" : "en"] : ar ? "فكرتك التالية،\nتبدأ من هنا." : "Your next idea\nstarts here."} description={ar ? "استكشف حلولًا رقمية جاهزة لخطوتك القادمة. لكل منتج تفاصيل واضحة للترخيص والتحديثات والدعم عند إطلاقه." : "Explore digital solutions for your next step. Each product will include clear licensing, updates and support details at launch."} icon={selected?.slug || "layers"}>
      <a className="platform-button primary" href="#catalog">{ar ? "استكشف الكتالوج" : "Explore the catalog"}<PlatformIcon kind="arrow"/></a>
      <Link className="platform-text-link" href="/services">{ar ? "تحتاج حلًا مخصصًا؟" : "Need a custom solution?"}<span>↗</span></Link>
    </PlatformHero>
    <section className="platform-section" id="catalog" aria-labelledby="catalog-title">
      <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar ? "اختر نقطة البداية" : "CHOOSE YOUR STARTING POINT"}</p><h2 id="catalog-title">{ar ? "ابحث عمّا يناسبك." : "Find your next building block."}</h2></div><span className="platform-count">{ar ? "٦ فئات رقمية" : "6 digital categories"}</span></div>
      <form className="platform-filters" onSubmit={e => e.preventDefault()}>
        <label className="platform-search-label"><span>{ar ? "البحث عن منتج" : "Search products"}</span><div className="platform-input-wrap"><PlatformIcon kind="search"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ar ? "موقع، قالب، أداة…" : "Website, template, tool…"}/></div></label>
        <label><span>{ar ? "نوع العرض" : "Offer type"}</span><select value={offer} onChange={e => setOffer(e.target.value)}><option value="">{ar ? "جميع العروض" : "All offers"}</option><option value="purchase">{ar ? "شراء لمرة واحدة" : "One-time purchase"}</option><option value="subscription">{ar ? "اشتراك" : "Subscription"}</option></select></label>
      </form>
      <nav className="platform-tabs" aria-label={ar ? "فئات المنتجات" : "Product categories"}><Link href="/products" aria-current={!category ? "page" : undefined}>{ar ? "جميع المنتجات" : "All products"}</Link>{categories.map(c => <Link key={c.slug} href={`/products/category/${c.slug}`} aria-current={category === c.slug ? "page" : undefined}>{c[ar ? "ar" : "en"]}</Link>)}</nav>
      {!selected && !searching && <div className="platform-grid platform-category-grid">{categories.map((c, index) => <CategoryCard key={c.slug} slug={c.slug} title={c[ar ? "ar" : "en"]} index={index}/>)}</div>}
      <div className="platform-results-heading"><h3>{selected ? selected[ar ? "ar" : "en"] : ar ? "كتالوج المنتجات" : "Product catalog"}</h3><span>{filtered.length} {ar ? "منتج" : "products"}</span></div>
      <PlatformEmpty icon={searching ? "search" : selected?.slug || "layers"} title={searching ? ar ? "لا توجد نتائج مطابقة." : "No matching results." : ar ? "نجهّز أولى منتجاتنا." : "Our first products are on the way."} body={searching ? ar ? "جرّب كلمات أخرى أو امسح الفلاتر لعرض الكتالوج." : "Try another search or clear your filters to view the catalog." : ar ? "ستظهر المنتجات المتاحة هنا عند إطلاقها. يمكنك الآن طلب تنفيذ حل خاص بأعمالك." : "Available products will appear here at launch. You can already request a solution tailored to your business."}>
        {searching ? <button className="platform-button secondary" type="button" onClick={clear}>{ar ? "مسح الفلاتر" : "Clear filters"}</button> : <Link className="platform-button secondary" href="/services/request">{ar ? "اطلب حلًا مخصصًا" : "Request a custom solution"}<PlatformIcon kind="arrow"/></Link>}
      </PlatformEmpty>
    </section>
  </main>;
}
