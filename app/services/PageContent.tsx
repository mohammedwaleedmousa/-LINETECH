"use client";
import Link from "next/link";
import {Suspense} from "react";
import {usePageQuery} from "../QueryState";
import {useLanguage} from "../Localized";
import {PlatformIcon} from "../PlatformUI";
import MarketingHero from "../MarketingHero";
import styles from "../MarketingPage.module.css";
import Catalog from "../products/Catalog";
import ProductDetail from "../products/ProductDetail";
import PricingOptions from "./PricingOptions";
const services=[
  {id:"web-development",icon:"websites",ar:"تطوير المواقع",en:"Website development",arBody:"مواقع شركات وصفحات تعريفية وتطبيقات ويب حسب متطلباتك.",enBody:"Company websites, landing pages and web applications tailored to your requirements.",arItems:["هيكلة الصفحات ومسار المستخدم","تصميم متجاوب وتطوير الموقع","اختبار ونشر وتسليم الملفات المتفق عليها"],enItems:["Page structure and user journeys","Responsive design and development","Testing, launch and agreed source-file handover"]},
  {id:"app-development",icon:"mobile-apps",ar:"تطوير التطبيقات",en:"Application development",arBody:"تطبيقات Android وiOS بواجهات ومسارات استخدام تلائم مشروعك.",enBody:"Android and iOS applications shaped around your users and workflows.",arItems:["تحديد الشاشات والميزات المطلوبة","تطوير التطبيق وربط الخدمات","اختبار وتجهيز متطلبات النشر والتسليم"],enItems:["Define screens and required features","Develop the app and its integrations","Test and prepare release requirements and handover"]},
  {id:"ecommerce-systems",icon:"grid",ar:"المتاجر والأنظمة",en:"Stores & business systems",arBody:"متاجر إلكترونية وأنظمة إدارة مرتبطة باحتياجات النشاط.",enBody:"Online stores and management systems built around business operations.",arItems:["المنتجات والطلبات أو سير العمل المطلوب","لوحات إدارة وصلاحيات حسب النطاق","التكاملات والتسليم والدعم حسب الاتفاق"],enItems:["Catalog, ordering or operational workflows","Management dashboards and scoped permissions","Agreed integrations, handover and support"]},
];
export default function Services(){return <Suspense fallback={null}><ServicesContent/></Suspense>;}
function ServicesContent(){
  const language=useLanguage(),ar=language==="ar";
  const {params,queryObserver}=usePageQuery();
  return <main className={`${styles.page} platform-page`} data-viewport-page>{queryObserver}
    <MarketingHero variant="services" eyebrow={ar?"الخدمات والحلول":"SERVICES & SOLUTIONS"} title={ar?"فكرتك،\nبتفاصيل تناسبك.":"Your idea.\nBuilt around you."} description={ar?"تطوير المواقع والتطبيقات والأنظمة، والمنتجات الجاهزة وخيارات الدعم في مكان واحد.":"Websites, applications and business systems, with ready-made products and ongoing care in one place."}><Link className="platform-button primary" href="/contact#request">{ar?"ابدأ مشروعك":"Start your project"}</Link><a className="platform-button secondary" href="#catalog">{ar?"المنتجات والباقات":"Products & plans"}</a></MarketingHero>
    <section className="platform-section" id="choose">
      <div className="platform-section-heading"><h2>{ar?"ماذا تريد أن تبني؟":"What would you like to build?"}</h2></div>
      <div className="platform-grid">{services.map(s=><article className="platform-card" id={s.id} key={s.id}><span className="platform-card-icon"><PlatformIcon kind={s.icon}/></span><h2>{s[language]}</h2><p>{ar?s.arBody:s.enBody}</p><details className="platform-faq-list"><summary>{ar?"ما الذي تتضمنه الخدمة؟":"What's included?"}<span>+</span></summary><ul>{(ar?s.arItems:s.enItems).map(item=><li key={item}>{item}</li>)}</ul><p>{ar?"يُحدد النطاق والتكلفة والمدة قبل بدء التنفيذ.":"Scope, cost and timeline are agreed before work begins."}</p><Link className="platform-text-link" href={"/contact?"+new URLSearchParams({service:s.en})+"#request"}>{ar?"ناقش مشروعك ←":"Discuss your project →"}</Link></details></article>)}</div>
    </section>
    {params.has("product")?<section className="platform-section" id="catalog"><ProductDetail embedded/></section>:<Catalog embedded/>}
    <PricingOptions/>
  </main>;
}
