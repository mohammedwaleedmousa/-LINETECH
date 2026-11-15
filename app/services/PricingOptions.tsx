"use client";
import Link from "next/link";
import {useLanguage} from "../Localized";
import {saleModels,aftercarePlans,formatPrice} from "../../lib/catalog";
export default function PricingOptions(){
  const language=useLanguage(),ar=language==="ar";
  return <section className="platform-section" id="pricing" aria-labelledby="pricing-title">
    <div className="platform-section-heading"><h2 id="pricing-title">{ar?"الباقات والدعم":"Plans & ongoing care"}</h2></div>
    <p className="company-form-note">{ar?"المشاريع المخصصة لها عرض سعر بحسب المتطلبات. وتظهر أسعار المنتجات المنشورة ضمن تفاصيلها؛ لا توجد رسوم أو اشتراكات تتفعّل بمجرد الاستفسار.":"Custom work is quoted to your requirements. Published products list their own prices; an enquiry does not activate a purchase or subscription."}</p>
    <div className="platform-grid platform-plan-grid">{saleModels.map(model=><article className="platform-card" id={model.id==="aftercare"?"aftercare":undefined} key={model.id}><h3>{model[language]}</h3><p>{ar?model.bodyAr:model.bodyEn}</p><Link className="platform-text-link" href={model.id==="aftercare"?"/contact?interest=aftercare":"/services#catalog"}>{model.id==="aftercare"?(ar?"ناقش خيارات الدعم ←":"Discuss support →"):(ar?"استعرض المنتجات ←":"Browse products →")}</Link></article>)}</div>
    {aftercarePlans.some(p=>p.published)&&<div className="platform-grid">{aftercarePlans.filter(p=>p.published).map(plan=><article className="platform-card" key={plan.id}><h3>{plan.title[language]}</h3><p>{plan.summary[language]}</p><p>{formatPrice(plan.amount,plan.currency,language)} · {ar?"شهريًا":"per month"}</p><ul>{plan.includes.map((item,i)=><li key={i}>{item[language]}</li>)}</ul><p>{plan.terms[language]}</p><Link className="platform-button secondary" href={"/contact?care="+encodeURIComponent(plan.id)}>{ar?"استفسر عن الباقة":"Ask about this plan"}</Link></article>)}</div>}
  </section>;
}
