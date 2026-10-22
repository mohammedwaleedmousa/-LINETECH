"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {useLanguage} from "../../Localized";
import {PlatformEmpty,PlatformHero,PlatformIcon} from "../../PlatformUI";

type Subscription={planCode:string;status:string;recurringPriceUsd:number;nextBillingAt?:string};
export default function SubscriptionOverview(){
  const ar=useLanguage()==="ar";
  const [data,setData]=useState<Subscription|null>(null);
  const [state,setState]=useState("loading");
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{const c=new AbortController();setState("loading");fetch("/api/account",{cache:"no-store",signal:c.signal}).then(async r=>{if(r.status===401){window.location.assign("/login?next=/account/subscriptions");return;}const p=await r.json();if(!r.ok||!p.ok)throw Error();setData(p.account.subscription);setState("ready")}).catch(e=>{if(e.name!=="AbortError")setState("error")});return()=>c.abort()},[attempt]);
  const statuses:Record<string,string>={active:"نشط",trial:"تجريبي",past_due:"متأخر الدفع",suspended:"معلّق",cancelled:"ملغي"};
  return <main className="platform-page">
    <PlatformHero eyebrow={ar?"حسابك / الاشتراكات":"ACCOUNT / SUBSCRIPTIONS"} title={ar?"اشتراكاتك،\nبوضوح أكبر.":"Your subscriptions.\nClearly in view."} description={ar?"راجع اشتراكك الحالي وتفاصيله المالية، وتواصل معنا لطلب التجديد أو الإلغاء.":"Review your current subscription and billing details. Contact us to request renewal or cancellation."} icon="layers"/>
    <section className="platform-section">
      {state==="ready"&&data?<article className="platform-subscription-card"><div className="platform-section-heading"><div><p className="platform-eyebrow">{ar?"الاشتراك المسجل":"RECORDED SUBSCRIPTION"}</p><h2>{data.planCode}</h2></div><span className="platform-badge">{ar?(statuses[data.status]||data.status):data.status}</span></div><dl className="platform-subscription-facts"><div><dt>{ar?"القيمة الدورية المسجلة":"Recorded recurring amount"}</dt><dd>{new Intl.NumberFormat(ar?"ar-YE":"en",{style:"currency",currency:"USD"}).format(data.recurringPriceUsd)}</dd></div><div><dt>{ar?"تاريخ الفوترة التالي":"Next billing date"}</dt><dd>{data.nextBillingAt?new Date(data.nextBillingAt).toLocaleDateString(ar?"ar-YE":"en"):"—"}</dd></div></dl><Link className="platform-button secondary" href="/contact">{ar?"طلب إدارة الاشتراك":"Request subscription changes"}<PlatformIcon kind="arrow"/></Link></article>:
      <PlatformEmpty icon="layers" title={state==="loading"?(ar?"جارٍ تحميل الاشتراك…":"Loading subscription…"):state==="error"?(ar?"تعذّر تحميل الاشتراك":"Could not load subscription"):(ar?"لا يوجد اشتراك مسجل بعد.":"No subscription recorded yet.")} body={state==="error"?(ar?"تحقق من اتصالك وحاول مرة أخرى.":"Check your connection and try again."):(ar?"تظهر اشتراكاتك الفعلية هنا. للاطلاع على مستويات المنصة القادمة، انتقل إلى صفحة الخطط.":"Your actual subscriptions appear here. Explore the plans page for upcoming platform tiers.")}>
        {state==="error"?<button className="platform-button secondary" type="button" onClick={()=>setAttempt(x=>x+1)}>{ar?"إعادة المحاولة":"Try again"}</button>:state==="ready"?<Link className="platform-button secondary" href="/pricing">{ar?"استكشف الخطط":"Explore plans"}<PlatformIcon kind="arrow"/></Link>:null}
      </PlatformEmpty>}
    </section>
  </main>;
}
