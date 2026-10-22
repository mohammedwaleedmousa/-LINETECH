"use client";

import Link from "next/link";
import {FormEvent,useRef,useState} from "react";
import {useLanguage} from "../Localized";
import {PlatformHero,PlatformIcon} from "../PlatformUI";
import {CompanyApplication,companyStatusLabels} from "../../lib/companies";

export default function CompanyRequest(){
  const ar=useLanguage()==="ar";
  const [form,setForm]=useState({companyName:"",contactName:"",email:"",phone:"",description:""});
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  const [saved,setSaved]=useState<CompanyApplication|null>(null);
  const submissionKey=useRef("");const inFlight=useRef(false);
  function change(name:keyof typeof form,value:string){setForm(old=>({...old,[name]:value}));submissionKey.current="";setError("");}
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(inFlight.current)return;inFlight.current=true;setBusy(true);setError("");
    try{
      submissionKey.current ||= window.crypto.randomUUID();
      const response=await fetch("/api/company-applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,submissionKey:submissionKey.current})});
      if(response.status===401){window.location.assign("/login?next=/company-space/request");return;}
      const data=await response.json();
      if(!response.ok||!data.ok||!data.application?.id){
        setError(response.status===409?(ar?"يوجد طلب مماثل قيد المراجعة. افتح شركاتي لمتابعته.":"A matching application is already under review. Open My companies to track it."):response.status===429?(ar?"طلبات كثيرة خلال وقت قصير. انتظر دقيقة ثم حاول مجددًا.":"Too many requests. Wait a minute and try again."):response.status===400?(ar?"راجع البيانات المطلوبة وأعد الإرسال.":"Check the required details and submit again."):(ar?"تعذر إرسال الطلب الآن. بياناتك ما زالت هنا؛ حاول مرة أخرى لاحقًا.":"Your application could not be submitted. Your details are still here; try again later."));return;
      }
      setSaved(data.application);
    }catch{setError(ar?"تعذر الاتصال. تحقق من الإنترنت وحاول مجددًا.":"Could not connect. Check your connection and try again.");}
    finally{inFlight.current=false;setBusy(false);}
  }
  return <main className="platform-page">
    <PlatformHero eyebrow={ar?"مساحات الشركات":"COMPANY SPACES"} title={ar?"مساحة تجمع\nفريقك وأعمالك.":"A space for your\nteam and your work."} description={ar?"أرسل بيانات شركتك لمراجعتها من LINETECH. يظل حسابك الشخصي واحدًا، وتُنشأ مساحة الشركة بعد الموافقة.":"Submit your company details for LINETECH review. Keep one personal account; a company workspace is created after approval."} icon="grid"/>
    <section className="platform-section">
      {saved?<div className="platform-empty" role="status"><span className="platform-empty-icon"><PlatformIcon kind="shield"/></span><h2>{ar?"تم حفظ طلبك.":"Your application is saved."}</h2><p>{saved.company_name} · {companyStatusLabels[saved.status][ar?"ar":"en"]}</p><p className="company-reference">{ar?"رقم الطلب":"Application ID"}: <b dir="ltr">{saved.id}</b></p><div className="platform-empty-actions"><Link className="platform-button primary" href="/account/companies">{ar?"متابعة حالة الطلب":"Track application"}<PlatformIcon kind="arrow"/></Link></div></div>:
      <form className="company-form" onSubmit={submit}>
        <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar?"طلب إنشاء مساحة":"WORKSPACE APPLICATION"}</p><h2>{ar?"عرّفنا بشركتك." : "Tell us about your company."}</h2></div><span className="platform-count">{ar?"الحقول المعلّمة * مطلوبة":"Fields marked * are required"}</span></div>
        <fieldset disabled={busy}><div className="company-form-grid">
          <label>{ar?"اسم الشركة *":"Company name *"}<input name="companyName" autoComplete="organization" value={form.companyName} onChange={e=>change("companyName",e.target.value)} required minLength={2} maxLength={120}/></label>
          <label>{ar?"اسم مسؤول التواصل *":"Contact name *"}<input name="contactName" autoComplete="name" value={form.contactName} onChange={e=>change("contactName",e.target.value)} required minLength={2} maxLength={120}/></label>
          <label>{ar?"البريد الإلكتروني *":"Email address *"}<input name="email" type="email" autoComplete="email" dir="ltr" value={form.email} onChange={e=>change("email",e.target.value)} required maxLength={254}/></label>
          <label>{ar?"رقم الهاتف (اختياري)":"Phone number (optional)"}<input name="phone" type="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={e=>change("phone",e.target.value)} maxLength={40}/></label>
          <label className="company-form-wide">{ar?"نبذة عن الشركة واحتياجاتها *":"Company overview and needs *"}<textarea name="description" rows={5} value={form.description} onChange={e=>change("description",e.target.value)} required minLength={10} maxLength={2000}/><small>{form.description.length}/2000</small></label>
        </div></fieldset>
        {error&&<p role="alert" className="company-feedback error">{error}</p>}
        <div className="company-form-actions"><button className="platform-button primary" disabled={busy} type="submit">{busy?(ar?"جارٍ إرسال الطلب…":"Submitting…"):(ar?"إرسال الطلب للمراجعة":"Submit for review")}<PlatformIcon kind="arrow"/></button><Link className="platform-text-link" href="/account/companies">{ar?"شركاتي وطلباتي":"My companies & applications"}<span>↗</span></Link></div>
        <p className="company-form-note">{ar?"إرسال الطلب لا يفعّل اشتراكًا مدفوعًا ولا يمنح وصولًا إلى شركات أخرى.":"Submitting an application does not activate a paid subscription or grant access to other companies."}</p>
      </form>}
    </section>
  </main>;
}
