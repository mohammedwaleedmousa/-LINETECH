"use client";
import {useState,type FormEvent} from "react";
import {useLanguage} from "../Localized";
import styles from "./contact.module.css";
const services=["Web Development","Application Development","E-commerce & Systems","After-sales Care","Other"];
export default function ProjectEnquiry({initialService=""}:{initialService?:string}){
  const ar=useLanguage()==="ar";
  const [form,setForm]=useState({name:"",contact:"",service:initialService,brief:""});
  const [prepared,setPrepared]=useState(false);
  function update(key:keyof typeof form,value:string){setForm(current=>({...current,[key]:value}));setPrepared(false);}
  function prepare(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!form.name.trim()||!form.contact.trim()||!form.brief.trim())return;setPrepared(true);}
  const message=[ar?"طلب مشروع إلى LINETECH":"Project enquiry for LINETECH",`${ar?"الاسم":"Name"}: ${form.name.trim()}`,`${ar?"وسيلة التواصل":"Contact"}: ${form.contact.trim()}`,form.service?`${ar?"الخدمة":"Service"}: ${form.service}`:"",`${ar?"الفكرة":"Brief"}: ${form.brief.trim()}`].filter(Boolean).join("\n");
  return <section className={styles.request} id="request" aria-labelledby="request-title">
    <h2 id="request-title">{ar?"أخبرنا عن فكرتك":"Tell us about your idea"}</h2>
    <p>{ar?"ملخص بسيط يكفي لنبدأ. السعر والمدة والنطاق نحددها معك قبل الاتفاق.":"A short brief is enough to begin. We agree scope, price and timeline with you before work starts."}</p>
    <form onSubmit={prepare} className={styles.form}>
      <label>{ar?"اسمك *":"Your name *"}<input name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={e=>update("name",e.target.value)}/></label>
      <label>{ar?"رقم الهاتف أو البريد *":"Phone or email *"}<input name="contact" required maxLength={160} value={form.contact} onChange={e=>update("contact",e.target.value)}/></label>
      <label className={styles.full}>{ar?"الخدمة المطلوبة":"Service"}<select name="service" value={form.service} onChange={e=>update("service",e.target.value)}><option value="">{ar?"أحتاج مساعدتكم في الاختيار":"Help me choose"}</option>{initialService&&!services.includes(initialService)&&<option value={initialService}>{initialService}</option>}{services.map((service,i)=><option key={service} value={service}>{ar?["تطوير المواقع","تطوير التطبيقات","المتاجر والأنظمة","خدمات ما بعد البيع","أخرى"][i]:service}</option>)}</select></label>
      <label className={styles.full}>{ar?"اشرح فكرتك باختصار *":"A short project brief *"}<textarea name="brief" required rows={4} maxLength={3000} value={form.brief} onChange={e=>update("brief",e.target.value)}/></label>
      <p className={styles.full}>{ar?"هذه البيانات تبقى في النموذج فقط. زر التجهيز لا يرسلها؛ اختر بعدها واتساب أو البريد وراجع الرسالة قبل إرسالها.":"These details stay in this form. Preparing does not send them; choose WhatsApp or email next and review the message before sending."}</p>
      <div className={styles.full}><button className="platform-button primary" type="submit">{ar?"جهّز رسالة الطلب":"Prepare enquiry"}</button></div>
    </form>
    {prepared&&<div className={styles.prepared} role="status"><h3>{ar?"الرسالة جاهزة للمراجعة":"Your message is ready to review"}</h3><p style={{whiteSpace:"pre-line"}}>{message}</p><div className="platform-hero-actions"><a className="platform-button primary" href={"https://wa.me/967773335065?text="+encodeURIComponent(message)} target="_blank" rel="noopener noreferrer">{ar?"افتح واتساب للمراجعة":"Review in WhatsApp"}</a><a className="platform-button secondary" href={"mailto:info@linetech.company?"+new URLSearchParams({subject:"LINETECH project enquiry",body:message})}>{ar?"افتح البريد للمراجعة":"Review in email"}</a></div></div>}
  </section>;
}
