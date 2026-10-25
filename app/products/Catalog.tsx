"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useLanguage} from "../Localized";
import {categories,products,filterProducts,formatPrice,productHref,safeDemoUrl} from "../../lib/catalog";
import {CategoryCard,PlatformEmpty,PlatformHero,PlatformIcon} from "../PlatformUI";

export default function Catalog({category=""}:{category?:string}){
  const language=useLanguage(),ar=language==="ar";
  const [query,setQuery]=useState(""),[offer,setOffer]=useState(""),[selectedCategory,setCategory]=useState(category);
  useEffect(()=>{if(!category){const params=new URLSearchParams(window.location.search);setQuery(params.get("q")||"");const value=params.get("category");if(categories.some(c=>c.slug===value))setCategory(value!);}},[category]);
  const searching=Boolean(query.trim()||offer),filtered=filterProducts(products,query,selectedCategory,offer);
  function clear(){setQuery("");setOffer("");setCategory("");}
  return <main className="platform-page storefront-catalog">
    <PlatformHero eyebrow={ar?"المواقع والتطبيقات الجاهزة":"READY-MADE WEBSITES & APPS"} title={ar?"جرّب أولًا.\nواختر ما يناسبك.":"Try it first.\nMake it yours."} description={ar?"استكشف المواقع والتطبيقات، وافتح المعاينة المباشرة. لكل منتج خياراته للشراء مرة واحدة أو الاشتراك الشهري وخدمات ما بعد البيع.":"Explore websites and applications with direct live previews. Each product states its one-time or monthly offers and available after-sales care."} icon="websites">
      <a className="platform-button primary" href="#catalog">{ar?"استكشف الكتالوج":"Explore the catalog"}<PlatformIcon kind="arrow"/></a><Link className="platform-text-link" href="/services/request">{ar?"اطلب مشروعًا مخصصًا":"Request a custom project"}<span>↗</span></Link>
    </PlatformHero>
    <section className="platform-section" id="catalog" aria-labelledby="catalog-title">
      <div className="platform-section-heading"><h2 id="catalog-title">{ar?"ابحث عمّا يناسبك.":"Find what fits your business."}</h2><span className="platform-count">{ar?"مواقع · تطبيقات":"Websites · Applications"}</span></div>
      <form className="platform-filters" onSubmit={e=>e.preventDefault()}>
        <label className="platform-search-label"><span>{ar?"البحث عن منتج":"Search products"}</span><div className="platform-input-wrap"><PlatformIcon kind="search"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={ar?"اسم المنتج أو مجال الاستخدام…":"Product name or business area…"}/></div></label>
        <label><span>{ar?"طريقة الشراء":"Purchase option"}</span><select value={offer} onChange={e=>setOffer(e.target.value)}><option value="">{ar?"كل الخيارات":"All options"}</option><option value="purchase">{ar?"دفع مرة واحدة":"One-time purchase"}</option><option value="monthly">{ar?"اشتراك شهري":"Monthly subscription"}</option></select></label>
      </form>
      <nav className="platform-tabs" aria-label={ar?"فئات المنتجات":"Product categories"}><button type="button" aria-pressed={!selectedCategory} onClick={()=>setCategory("")}>{ar?"جميع المنتجات":"All products"}</button>{categories.map(c=><button type="button" key={c.slug} aria-pressed={selectedCategory===c.slug} onClick={()=>setCategory(c.slug)}>{c[language]}</button>)}</nav>
      {!searching&&!selectedCategory&&<div className="platform-grid platform-category-grid">{categories.map((c,index)=><CategoryCard key={c.slug} slug={c.slug} title={c[language]} index={index}/>)}</div>}
      <div className="platform-results-heading"><h3>{ar?"المنتجات المتاحة":"Available products"}</h3><span>{filtered.length} {ar?"منتج":"products"}</span></div>
      {filtered.length?<div className="platform-grid storefront-products">{filtered.map(p=><article key={p.id} className="platform-card storefront-product-card">
        {p.screenshots[0]&&<img className="storefront-cover" src={p.screenshots[0].src} alt={p.screenshots[0].alt[language]} loading="lazy"/>}
        <span className="platform-badge">{categories.find(c=>c.slug===p.category)?.[language]}</span><h2><Link href={productHref(p.slug)}>{p.title[language]}</Link></h2><p>{p.summary[language]}</p>
        <div className="storefront-offer-summary">{p.offers.map(o=><p key={o.id}><strong>{formatPrice(o.amount,o.currency,language)}</strong> · {o.billing==="monthly"?(ar?"شهريًا":"monthly"):(ar?"مرة واحدة":"one-time")}</p>)}</div>
        <div className="platform-hero-actions"><Link className="platform-button primary" href={productHref(p.slug)}>{ar?"التفاصيل والباقات":"Details & offers"}</Link>{safeDemoUrl(p.demoUrl)&&<a className="platform-button secondary" href={safeDemoUrl(p.demoUrl)!} target="_blank" rel="noopener noreferrer">{ar?"جرّب الموقع ↗":"Live preview ↗"}</a>}</div>
      </article>)}</div>:<PlatformEmpty icon={searching?"search":"layers"} title={searching?(ar?"لا توجد نتائج مطابقة.":"No matching results."):(ar?"نجهّز أولى منتجاتنا.":"Our first products are on the way.")} body={searching?(ar?"جرّب كلمات أخرى أو امسح الفلاتر.":"Try another search or clear your filters."):(ar?"ستظهر هنا المنتجات المعتمدة مع معايناتها وأسعارها. يمكنك الآن طلب تطوير موقع أو تطبيق خاص بك.":"Approved products will appear here with previews and prices. You can request a custom website or application now.")}>{searching?<button className="platform-button secondary" type="button" onClick={clear}>{ar?"مسح الفلاتر":"Clear filters"}</button>:<Link className="platform-button secondary" href="/services/request">{ar?"اطلب مشروعًا خاصًا":"Request a custom project"}</Link>}</PlatformEmpty>}
    </section>
  </main>;
}
