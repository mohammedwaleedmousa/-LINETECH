"use client";

import Link from "next/link";
import { useLanguage } from "../Localized";
import "./pricing.css";

type Copy={en:string;ar:string};
const c=(en:string,ar:string):Copy=>({en,ar});
const plans=[
 {name:"START",setup:"$149",monthly:"$19",tag:c("For small businesses","للأنشطة الصغيرة"),features:[c("Up to 5 pages","حتى 5 صفحات"),c("One language","لغة واحدة"),c("Responsive website","متجاوب مع جميع الأجهزة"),c("Custom domain connection","ربط دومين مخصص"),c("SSL, hosting & management","SSL والاستضافة والإدارة"),c("Contact form, WhatsApp & Maps","نموذج تواصل وواتساب وخرائط"),c("Basic SEO","SEO أساسي"),c("1 GB storage · 1 content update / month","1GB تخزين · تعديل محتوى واحد شهريًا")]},
 {name:"BUSINESS",setup:"$299",monthly:"$35",featured:true,tag:c("Most popular","الأكثر طلبًا"),features:[c("Up to 10 pages","حتى 10 صفحات"),c("Arabic + English","العربية + الإنجليزية"),c("Everything in START","كل مميزات START"),c("Content management","إدارة المحتوى"),c("Analytics","التحليلات"),c("Enhanced SEO","SEO محسّن"),c("Portfolio / gallery","معرض أعمال أو صور"),c("Lead forms & social integration","نماذج عملاء وربط الشبكات الاجتماعية"),c("3 GB storage · 3 updates · 2 team members","3GB تخزين · 3 تعديلات · عضوان بالفريق")]},
 {name:"PRO",setup:"$499",monthly:"$59",tag:c("For advanced businesses","للأعمال المتقدمة"),features:[c("Up to 20 pages","حتى 20 صفحة"),c("Everything in BUSINESS","كل مميزات BUSINESS"),c("Advanced customization","تخصيص متقدم"),c("Bookings or appointments","حجوزات أو مواعيد"),c("Team management options","خيارات إدارة الفريق"),c("Advanced forms & integrations","نماذج وتكاملات متقدمة"),c("Advanced analytics","تحليلات متقدمة"),c("Priority support","دعم بأولوية"),c("5 GB storage · 5 updates · 5 team members","5GB تخزين · 5 تعديلات · 5 أعضاء بالفريق")]},
 {name:"E-COMMERCE",setup:"$699",monthly:"$79",tag:c("Online stores","للمتاجر الإلكترونية"),features:[c("Product & category management","إدارة المنتجات والتصنيفات"),c("Cart & checkout","السلة وإتمام الطلب"),c("Orders & customers","إدارة الطلبات والعملاء"),c("Coupons & inventory","الكوبونات والمخزون"),c("Search & filtering","البحث والفلترة"),c("WhatsApp & analytics","واتساب والتحليلات"),c("Store SEO","SEO للمتجر"),c("Admin dashboard","لوحة إدارة"),c("Up to 1,000 products · 10 GB storage · 3 staff","حتى 1,000 منتج · 10GB تخزين · 3 موظفين")]},
 {name:"E-COMMERCE PRO",setup:"$1,199",monthly:"$129",tag:c("For larger stores","للمتاجر الأكبر"),features:[c("Everything in E-COMMERCE","كل مميزات E-COMMERCE"),c("Product variants","ألوان ومقاسات وخيارات المنتجات"),c("Advanced inventory","مخزون متقدم"),c("Staff permissions","صلاحيات الموظفين"),c("Sales reporting","تقارير المبيعات"),c("Advanced promotions","عروض وخصومات متقدمة"),c("Product import tools","أدوات استيراد المنتجات"),c("Priority integrations & support","تكاملات ودعم بأولوية"),c("Up to 10,000 products · 25 GB storage · 6 updates / month · 10 staff","حتى 10,000 منتج · 25GB تخزين · 6 تعديلات شهريًا · 10 موظفين")]},
 {name:"CUSTOM",setup:c("Quoted","حسب المشروع"),monthly:"$199+",tag:c("Custom systems & enterprise","للأنظمة الخاصة والشركات"),features:[c("Custom project scope","نطاق مشروع مخصص"),c("CRM & business systems","CRM وأنظمة أعمال"),c("Branches & staff roles","فروع وصلاحيات موظفين"),c("Custom APIs & integrations","API وتكاملات مخصصة"),c("Advanced workflows","مسارات عمل متقدمة"),c("Dedicated architecture","بنية تقنية مخصصة"),c("Priority planning & support","تخطيط ودعم بأولوية")]}
];
const addons=[
 ["Extra page","صفحة إضافية","$25+"],["Additional language","لغة إضافية","$75+"],["Content writing","كتابة المحتوى","$50+"],["Advanced SEO","SEO متقدم","$100+/mo"],["Booking system","نظام حجوزات","$100+"],["Integrations","تكاملات","$50+"],["Fully custom design","تصميم مخصص بالكامل","$200+"],["Additional maintenance","صيانة إضافية","$25+/mo"]
];
const policies=[
 c("A content update means a small text, image, contact detail or price change. New pages, systems and features are quoted separately.","تعديل المحتوى يعني تغييرًا بسيطًا في نص أو صورة أو بيانات تواصل أو سعر. الصفحات والأنظمة والمميزات الجديدة تُسعّر بشكل منفصل."),
 c("Custom domain connection is included. Domain registration and renewal are billed separately according to the extension and provider.","ربط الدومين المخصص مشمول. تسجيل الدومين وتجديده يُفوّتر بشكل منفصل حسب الامتداد والمزوّد."),
 c("Plans use fair-usage limits for storage, products, team members and service. Extra capacity can be added or the plan can be upgraded.","تطبق حدود استخدام عادلة على التخزين والمنتجات وأعضاء الفريق والخدمة. يمكن شراء سعة إضافية أو الترقية لباقة أعلى."),
 c("Support response targets: START within 2 business days, BUSINESS within 1 business day, and priority response for PRO and commerce plans. Response time is not a guaranteed resolution time.","أهداف الاستجابة للدعم: START خلال يومي عمل، BUSINESS خلال يوم عمل، وأولوية لباقات PRO والمتاجر. زمن الاستجابة لا يعني ضمان زمن حل المشكلة."),
 c("If payment remains overdue, reminders are sent first. The service may be marked past due after 14 days and suspended after 30 days. Data is retained according to LINETECH terms before deletion.","عند تأخر الدفع تُرسل التذكيرات أولًا. قد تُصنّف الخدمة متأخرة بعد 14 يومًا وتُعلّق بعد 30 يومًا. تُحفظ البيانات وفق شروط LINETECH قبل الحذف.")
];
export default function Pricing(){
 const lang=useLanguage(); const ar=lang==="ar"; const t=(x:Copy)=>ar?x.ar:x.en;
 return <main className="pricing-page">
  <section className="pricing-hero"><div className="pricing-grid"/><div className="ref-shell pricing-hero-inner">
   <span className="pricing-index">LINETECH / 06</span>
   <p className="ref-kicker">{ar?"الخطط والأسعار":"PLANS & PRICING"}</p>
   <h1>{ar?"ابدأ بخطة تناسب عملك.":"Start with a plan that fits your business."}</h1>
   <p>{ar?"مواقع ومتاجر وأنظمة أعمال تُطلق وتُدار بواسطة LINETECH، برسوم تأسيس واضحة واشتراك مستمر للاستضافة والإدارة والدعم.":"Websites, stores and business systems launched and managed by LINETECH, with clear setup pricing and ongoing hosting, management and support."}</p>
   <div className="pricing-hero-actions"><a href="#plans" className="ref-button light">{ar?"استعرض الباقات":"Explore plans"} <span>↓</span></a><Link href="/start" className="pricing-text-link">{ar?"ابدأ مشروعك":"Start your project"} <span>→</span></Link></div>
  </div></section>
  <section className="pricing-section" id="plans"><div className="ref-shell">
   <div className="pricing-heading"><div><p className="ref-kicker with-line">{ar?"باقات المواقع والأنظمة":"WEBSITE & SYSTEM PLANS"}</p><h2>{ar?"من أول حضور رقمي إلى منصة أعمال كاملة.":"From your first digital presence to a complete business platform."}</h2></div><p>{ar?"رسوم التأسيس تغطي بناء وإطلاق المشروع. الاشتراك يغطي تشغيل الموقع واستضافته وإدارته حسب نطاق الباقة.":"The setup fee covers building and launching the project. The subscription covers ongoing operation, hosting and management within the plan scope."}</p></div>
   <div className="pricing-plan-grid">{plans.map((p,i)=><article className={"pricing-card "+(p.featured?"featured":"")} key={p.name}>
    <div className="pricing-card-top"><span>0{i+1}</span>{p.featured&&<b>{ar?"الأكثر طلبًا":"POPULAR"}</b>}</div>
    <p className="pricing-plan-tag">{t(p.tag)}</p><h3>{p.name}</h3>
    <div className="pricing-price"><div><small>{ar?"التأسيس":"SETUP"}</small><strong>{typeof p.setup==="string"?p.setup:t(p.setup)}</strong></div><i/><div><small>{ar?"شهريًا":"MONTHLY"}</small><strong>{p.monthly}</strong></div></div>
    <ul>{p.features.map((f,j)=><li key={j}><span>✓</span>{t(f)}</li>)}</ul>
    <Link href={`/start?plan=${encodeURIComponent(p.name)}`} className={p.featured?"ref-button light":"pricing-plan-link"}>{ar?"اختر هذه الباقة":"Choose this plan"} <span>→</span></Link>
   </article>)}</div>
  </div></section>
  <section className="pricing-addons"><div className="ref-shell">
   <div className="pricing-heading compact"><div><p className="ref-kicker with-line">{ar?"إضافات اختيارية":"ADD-ONS"}</p><h2>{ar?"أضف فقط ما يحتاجه عملك.":"Add only what your business needs."}</h2></div><p>{ar?"المتطلبات خارج نطاق الباقة تُسعّر بشكل منفصل حتى تبقى التكلفة واضحة من البداية.":"Requirements outside a plan are priced separately so the project cost stays clear from the start."}</p></div>
   <div className="addon-grid">{addons.map(([en,arText,price],i)=><div className="addon-row" key={en}><span>0{i+1}</span><strong>{ar?arText:en}</strong><b>{price}</b></div>)}</div>
   <p className="pricing-note">{ar?"البريد الاحترافي، الدومينات، إدخال كميات كبيرة من المنتجات والخدمات الخارجية تُسعّر حسب العدد أو المزود أو نطاق العمل. قد تختلف تكلفة تجديد الدومين حسب الامتداد.":"Professional email, domains, bulk product entry and third-party services are priced by quantity, provider or scope. Domain renewal costs may vary by extension."}</p>
  </div></section>
  <section className="pricing-policies"><div className="ref-shell"><div className="pricing-heading compact"><div><p className="ref-kicker with-line">{ar?"تفاصيل الخدمة":"SERVICE DETAILS"}</p><h2>{ar?"حدود واضحة. خدمة أفضل.":"Clear limits. Better service."}</h2></div><p>{ar?"الاشتراك يغطي التشغيل المستمر ضمن حدود الباقة، بينما تُسعّر المميزات الجديدة والأعمال خارج النطاق بشكل منفصل.":"Your subscription covers ongoing service within the plan limits. New features and out-of-scope work are quoted separately."}</p></div><div className="policy-grid">{policies.map((item,i)=><article key={i}><span>0{i+1}</span><p>{t(item)}</p></article>)}</div></div></section>
  <section className="pricing-platform"><div className="ref-shell pricing-platform-grid"><div><p className="ref-kicker">{ar?"تُدار بواسطة LINETECH":"MANAGED BY LINETECH"}</p><h2>{ar?"منصة واحدة. أعمال متعددة. إدارة أوضح.":"One platform. Many businesses. Clearer management."}</h2></div><div><p>{ar?"تم تصميم نموذج الخدمة ليتيح لـ LINETECH إدارة مواقع العملاء واستضافتهم ودعمهم من بنية مركزية، مع فصل بيانات كل عميل وصلاحياته.":"The service model is designed so LINETECH can host, manage and support client websites from a central platform while keeping each client's data and access separated."}</p><Link href="/start" className="ref-button light">{ar?"ابدأ خطك":"Start Your Line"} <span>→</span></Link></div></div></section>
 </main>
}
