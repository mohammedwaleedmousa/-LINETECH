"use client";
import Link from "next/link";
import {useState} from "react";
import {useLanguage} from "../Localized";
import {categories,products} from "../../lib/catalog";
export default function Catalog({category=""}:{category?:string}){
 const ar=useLanguage()==="ar";const [query,setQuery]=useState("");const [offer,setOffer]=useState("");
 const selected=categories.find(c=>c.slug===category);
 const filtered=products.filter(p=>(!category||p.category===category)&&(!offer||p.offer===offer)&&p.title[ar?"ar":"en"].toLowerCase().includes(query.toLowerCase()));
 return <main className="platform-page"><header className="platform-hero"><p className="ref-kicker">LINETECH / {ar?"المنتجات":"PRODUCTS"}</p><h1>{selected?selected[ar?"ar":"en"]:ar?"منتجات رقمية لأعمالك.":"Digital products for your business."}</h1><p>{ar?"حل جاهز تشتريه أو تشترك فيه، مع ترخيص وتحديثات ودعم موضّحة لكل منتج. لتنفيذ حل مخصص، انتقل إلى الخدمات.":"Ready-made products to buy or subscribe to, with product-specific licensing, updates and support. For custom delivery, explore services."}</p><Link href="/services">{ar?"تحتاج حلًا مخصصًا؟":"Need a custom solution?"} ↗</Link></header>
 <section className="platform-section"><form className="platform-filters" onSubmit={e=>e.preventDefault()}><label>{ar?"البحث":"Search"}<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={ar?"ابحث عن منتج":"Find a product"}/></label><label>{ar?"نوع العرض":"Offer type"}<select value={offer} onChange={e=>setOffer(e.target.value)}><option value="">{ar?"الكل":"All"}</option><option value="purchase">{ar?"شراء":"Purchase"}</option><option value="subscription">{ar?"اشتراك":"Subscription"}</option></select></label></form>
 <nav className="platform-tabs" aria-label={ar?"فئات المنتجات":"Product categories"}><Link href="/products" aria-current={!category?"page":undefined}>{ar?"جميع المنتجات":"All products"}</Link>{categories.map(c=><Link key={c.slug} href={`/products/category/${c.slug}`} aria-current={category===c.slug?"page":undefined}>{c[ar?"ar":"en"]}</Link>)}</nav>
 <div className="platform-empty" role="status"><h2>{ar?"لا توجد منتجات منشورة حاليًا":"No products published yet"}</h2><p>{ar?"ستظهر المنتجات والأسعار وشروطها بعد اعتمادها. لا تتوفر عمليات شراء أو اشتراكات منتجات حاليًا.":"Products, prices and terms will appear after approval. Product purchases and subscriptions are not available yet."}</p><small>{filtered.length} {ar?"نتائج":"results"}</small></div>
 <div className="platform-grid">{categories.filter(c=>!category||c.slug===category).map(c=><Link className="platform-card" href={`/products/category/${c.slug}`} key={c.slug}><h2>{c[ar?"ar":"en"]}</h2><span>{ar?"استكشف الفئة":"Explore category"} ↗</span></Link>)}</div></section></main>;
}
