"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {useLanguage} from "../Localized";
import {PlatformHero,PlatformIcon} from "../PlatformUI";

type Data={profile?:{fullName?:string};subscription?:{status:string;planCode:string;nextBillingAt?:string}|null};
const shortcuts=[
  {href:"/account/projects",ar:"مشاريعي",en:"My projects",bodyAr:"تحديثات العمل والملفات والتسليمات",bodyEn:"Updates, files and deliverables",icon:"websites"},
  {href:"/services/request",ar:"ابدأ مشروعًا",en:"Start a project",bodyAr:"حوّل فكرتك إلى طلب واضح",bodyEn:"Turn your idea into a clear brief",icon:"technical-services"},
  {href:"/account/profile",ar:"حسابي وأماني",en:"Profile & security",bodyAr:"بياناتك وتفضيلاتك وأمان حسابك",bodyEn:"Your details, preferences and security",icon:"shield"},
  {href:"/account/companies",ar:"شركاتي",en:"My companies",bodyAr:"مساحات الشركات والعضويات والدعوات",bodyEn:"Company spaces, memberships and invitations",icon:"grid"},
];
export default function AccountOverview(){
  const ar=useLanguage()==="ar";
  const [account,setAccount]=useState<Data|null>(null);
  const [state,setState]=useState("loading");
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{const controller=new AbortController();setState("loading");fetch("/api/account",{cache:"no-store",signal:controller.signal}).then(async r=>{if(r.status===401){window.location.assign("/login?next=/account");return;}const p=await r.json();if(!r.ok||!p.ok)throw Error();setAccount(p.account);setState("ready")}).catch(e=>{if(e.name!=="AbortError")setState("error")});return()=>controller.abort()},[attempt]);
  return <main className="platform-page platform-account-page">
    <PlatformHero eyebrow={ar?"حسابك الموحد":"YOUR ACCOUNT"} title={account?.profile?.fullName?(ar?`مرحبًا، ${account.profile.fullName}.`:`Welcome, ${account.profile.fullName}.`):(ar?"كل أعمالك،\nمن حساب واحد.":"Your work.\nOne account.")} description={ar?"تابع مشروعاتك وطلباتك واشتراكاتك، وانتقل بين مساحات أعمالك من مكان واحد.":"Track projects, requests and subscriptions, and move between your workspaces from one place."} icon="user">
      <Link className="platform-button primary" href="/services/request">{ar?"طلب مشروع جديد":"Request a project"}<PlatformIcon kind="arrow"/></Link>
    </PlatformHero>
    <section className="platform-section">
      <div className="platform-account-summary" aria-live="polite">
        <span className="platform-card-icon"><PlatformIcon kind="layers"/></span>
        <div><span className="platform-eyebrow">{ar?"الاشتراك الحالي":"CURRENT SUBSCRIPTION"}</span><h2>{state==="loading"?(ar?"جارٍ تحميل حسابك…":"Loading your account…"):state==="error"?(ar?"تعذّر تحميل الحساب":"Could not load account"):account?.subscription?.planCode||(ar?"لا يوجد اشتراك حالي":"No current subscription")}</h2><p>{state==="ready"?(account?.subscription?.status||(ar?"يمكنك متابعة مشاريعك وطلب خدمة من مساحتك.":"You can still track projects and request a service from your workspace.")):(ar?"بيانات حسابك تُعرض هنا عند تحميلها.":"Your account details appear here when loaded.")}</p></div>
        {state==="error"?<button type="button" className="platform-button secondary" onClick={()=>setAttempt(x=>x+1)}>{ar?"إعادة المحاولة":"Try again"}</button>:<Link href="/account/subscriptions" className="platform-text-link">{ar?"تفاصيل الاشتراك":"Subscription details"}<span>↗</span></Link>}
      </div>
      <div className="platform-section-heading"><div><p className="platform-eyebrow">{ar?"مساحتك الشخصية":"YOUR PERSONAL SPACE"}</p><h2>{ar?"ما خطوتك التالية؟":"What is your next step?"}</h2></div></div>
      <div className="platform-grid platform-shortcuts">{shortcuts.map((c,index)=><Link className="platform-card" key={c.href} href={c.href}><div className="platform-card-top"><span className="platform-card-icon"><PlatformIcon kind={c.icon}/></span><small>0{index+1}</small></div><h2>{ar?c.ar:c.en}</h2><p>{ar?c.bodyAr:c.bodyEn}</p><div className="platform-card-foot"><span>{ar?"فتح المساحة":"Open workspace"}</span><PlatformIcon kind="arrow"/></div></Link>)}</div>
    </section>
  </main>;
}
