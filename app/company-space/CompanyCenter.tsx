"use client";

import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense,useEffect,useState} from "react";
import {useLanguage} from "../Localized";
import {PlatformHero,PlatformEmpty,PlatformIcon} from "../PlatformUI";
import {Company,CompanyApplication,companyStatusLabels} from "../../lib/companies";

export default function CompanyCenter(props:{workspace?:boolean}){return <Suspense fallback={null}><CompanyCenterContent {...props}/></Suspense>;}
function CompanyCenterContent({workspace=false}:{workspace?:boolean}){
  const selectedId=useSearchParams().get("company")||"";
  const ar=useLanguage()==="ar";const [companies,setCompanies]=useState<Company[]>([]),[applications,setApplications]=useState<CompanyApplication[]>([]);
  const [state,setState]=useState("loading"),[attempt,setAttempt]=useState(0);
  useEffect(()=>{const controller=new AbortController();setState("loading");
    (async()=>{try{const responses=await Promise.all([fetch("/api/companies",{cache:"no-store",signal:controller.signal}),fetch("/api/company-applications",{cache:"no-store",signal:controller.signal})]);if(responses.some(r=>r.status===401)){window.location.assign("/login?next="+encodeURIComponent(window.location.pathname+window.location.search));return;}const payloads=await Promise.all(responses.map(r=>r.json()));if(responses.some(r=>!r.ok)||payloads.some(p=>!p.ok)||!Array.isArray(payloads[0].companies)||!Array.isArray(payloads[1].applications))throw Error();setCompanies(payloads[0].companies);setApplications(payloads[1].applications);setState("ready");}catch(e){if(!(e instanceof Error&&e.name==="AbortError"))setState("error");}})();return()=>controller.abort();
  },[workspace,attempt]);
  const selected=companies.find(c=>c.id===selectedId);
  return <main className="platform-page">
    <PlatformHero eyebrow={ar?"حسابك / الشركات":"ACCOUNT / COMPANIES"} title={workspace&&selected?selected.name:ar?"أعمال متعددة.\nحساب واحد.":"Many businesses.\nOne account."} description={ar?"شركاتك المعتمدة وطلبات إنشاء المساحات، مع حالة كل طلب وملاحظات المراجعة.":"Your approved companies and workspace applications, with review status and decision notes."} icon="grid"><Link className="platform-button primary" href="/company-space/request">{ar?"طلب مساحة شركة":"Request a company space"}<PlatformIcon kind="arrow"/></Link></PlatformHero>
    <section className="platform-section">
      {state!=="ready"?<PlatformEmpty icon="grid" title={state==="loading"?(ar?"جارٍ تحميل شركاتك…":"Loading your companies…"):(ar?"تعذّر تحميل الشركات":"Could not load companies")} body={ar?"لا تُعرض إلا الشركات والطلبات المصرّح لحسابك بالوصول إليها.":"Only companies and applications your account may access are displayed."}>{state==="error"&&<button type="button" className="platform-button secondary" onClick={()=>setAttempt(x=>x+1)}>{ar?"إعادة المحاولة":"Try again"}</button>}</PlatformEmpty>:
      <>
        {workspace&&selectedId&&!selected&&<p className="company-feedback error" role="alert">{ar?"الشركة غير موجودة أو ليست متاحة لحسابك.":"This company does not exist or is not available to your account."}</p>}
        {workspace&&selected?<article className="platform-card company-workspace-card"><span className="platform-badge">{ar?"مساحة معتمدة":"Approved workspace"}</span><h2>{selected.name}</h2><p>{ar?"تم إنشاء المساحة بعد موافقة LINETECH. دعوات الأعضاء وفوترة العضويات ومشاريع الشركة لم تُفعّل بعد.":"This workspace was created after LINETECH approval. Member invitations, membership billing and company projects are not active yet."}</p><Link className="platform-text-link" href="/account/companies">{ar?"عرض جميع شركاتي":"View all my companies"}<span>↗</span></Link></article>:<>
          <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar?"مساحاتك المعتمدة":"YOUR WORKSPACES"}</p><h2>{ar?"شركاتي":"My companies"}</h2></div></div>
          {companies.length?<div className="platform-grid">{companies.map(c=><Link className="platform-card" key={c.id} href={`/company-space?company=${encodeURIComponent(c.id)}`}><span className="platform-card-icon"><PlatformIcon kind="grid"/></span><h2>{c.name}</h2><div className="platform-card-foot"><span>{ar?"فتح الشركة":"Open company"}</span><PlatformIcon kind="arrow"/></div></Link>)}</div>:<PlatformEmpty icon="grid" title={ar?"لا توجد شركات معتمدة بعد.":"No approved companies yet."} body={ar?"ابدأ بطلب مساحة شركة، وتابع نتيجة المراجعة هنا.":"Start with a company application and track its review here."}/>}
        </>}
        <div className="platform-section-heading company-application-heading"><div><p className="platform-eyebrow">{ar?"متابعة المراجعة":"REVIEW TRACKING"}</p><h2>{ar?"طلبات إنشاء الشركات":"Company applications"}</h2></div></div>
        {applications.length?<div className="company-application-list">{applications.map(a=><article className="platform-card company-application-card" key={a.id}><div className="platform-section-heading"><h2>{a.company_name}</h2><span className={`platform-badge company-status-${a.status}`}>{companyStatusLabels[a.status][ar?"ar":"en"]}</span></div><p>{new Date(a.created_at).toLocaleDateString(ar?"ar-YE":"en")}</p>{a.decision_note&&<p className="company-decision-note">{a.decision_note}</p>}{a.status==="approved"&&a.company_id&&<Link className="platform-text-link" href={`/company-space?company=${encodeURIComponent(a.company_id)}`}>{ar?"فتح مساحة الشركة":"Open company workspace"}<span>↗</span></Link>}</article>)}</div>:<p className="company-form-note">{ar?"لا توجد طلبات مسجلة. ستظهر طلباتك بعد إرسالها بنجاح.":"No applications recorded. Your requests appear here after successful submission."}</p>}
        {(companies.length===100||applications.length===100)&&<p className="company-form-note">{ar?"تُعرض أحدث 100 نتيجة. تواصل معنا للوصول إلى السجلات الأقدم.":"The latest 100 records are displayed. Contact us for older records."}</p>}
      </>}
    </section>
  </main>;
}
