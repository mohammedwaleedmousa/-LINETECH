"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import styles from "./brand-home.module.css";

const services = [
  { n:"01", en:"Websites & commerce", ar:"المواقع والمتاجر", enText:"Company websites and online stores designed around your customers, from the first page to the final order.", arText:"مواقع شركات ومتاجر إلكترونية مصمّمة حول عملائك، من الصفحة الأولى إلى إتمام الطلب.", href:"/services/web-development", type:"WEB / COMMERCE" },
  { n:"02", en:"Mobile applications", ar:"تطبيقات الجوال", enText:"Thoughtful mobile experiences, with the design, development and launch scope agreed around your product.", arText:"تجارب جوال واضحة وسهلة، بتصميم وتطوير وخطة إطلاق تناسب منتجك.", href:"/services/app-development", type:"iOS / ANDROID" },
  { n:"03", en:"Business systems", ar:"الأنظمة البرمجية", enText:"Dashboards and custom workflows that bring your operations together in one practical system.", arText:"لوحات إدارة وسير عمل مخصّص يجمع عملياتك في نظام عملي واحد.", href:"/services/ecommerce-systems", type:"SYSTEMS / OPERATIONS" },
  { n:"04", en:"AI & automation", ar:"الذكاء الاصطناعي والأتمتة", enText:"Explore where AI can solve a real problem. Define the data, feasibility and a focused prototype before expanding.", arText:"نحدّد أين يمكن للذكاء الاصطناعي حل مشكلة فعلية، ثم نقيّم البيانات والجدوى ونبدأ بنموذج أولي محدّد.", href:"/contact?service=ai", type:"AI / AUTOMATION" },
];
const process = [
  ["Understand","نفهم","Your objective, users and constraints.","هدفك ومستخدميك وحدود المشروع."],
  ["Build","نبني","Design, engineering and planned reviews.","تصميم وتطوير ومراجعات متفق عليها."],
  ["Evolve","نطوّر","Launch, handover and agreed aftercare.","إطلاق وتسليم ودعم حسب الاتفاق."],
];

export default function Home() {
  const ar = useLanguage() === "ar";
  const t = (en:string, arabic:string) => ar ? arabic : en;
  return <main className={styles.home} id="top" dir={ar?"rtl":"ltr"}>
    <section className={styles.hero}>
      <div className={styles.shell}>
        <div className={styles.eyebrow}><span/>{t("INDEPENDENT TECHNOLOGY COMPANY · ADEN, YEMEN","شركة تقنية مستقلة · عدن، اليمن")}</div>
        <div className={styles.heroGrid}>
          <div>
            <h1>{t("Your idea.","فكرتك.")}<br/><span>{t("Built for the real world.","حلّ يستحق التنفيذ.")}</span></h1>
            <p className={styles.lead}>{t("We turn ideas into websites, applications and intelligent systems. Clear thinking, considered design and engineering that serves your business.","نحوّل أفكارك إلى مواقع وتطبيقات وأنظمة ذكية. فهم واضح، وتصميم مدروس، وتطوير يخدم احتياج عملك.")}</p>
            <div className={styles.actions}><Link className={styles.primary} href="/services/request">{t("Discuss your project","ناقش مشروعك")} <span aria-hidden="true">↗</span></Link><a className={styles.secondary} href="#projects">{t("View our work","شاهد أعمالنا")} <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className={styles.heroArt} aria-hidden="true"><div className={styles.artGrid}/><img src="/brand/symbol-white.png" alt="" width="452" height="491"/><span className={styles.artCaption}>Every idea starts with a line.</span></div>
        </div>
        <div className={styles.heroFoot}><span>{t("FROM THE FIRST LINE TO LAUNCH","من أول خط إلى الإطلاق")}</span><span>WEB · MOBILE · SYSTEMS · AI</span></div>
      </div>
    </section>

    <section className={styles.light} id="services"><div className={styles.shell}>
      <div className={styles.sectionHead}><div><p className={styles.kicker}>{t("01 / WHAT WE DO","01 / ماذا نقدّم")}</p><h2>{t("The right solution.","الحل المناسب.")}<br/>{t("For your next step.","لخطوتك القادمة.")}</h2></div><p>{t("Start with the outcome you need. We define the deliverables, priorities and scope before development begins.","نبدأ بالنتيجة التي تحتاجها، ونحدّد المخرجات والأولويات ونطاق العمل قبل بدء التنفيذ.")}</p></div>
      <div className={styles.services}>{services.map(s=><Link key={s.n} href={s.href} className={styles.service}><div className={styles.serviceTop}><span>{s.n}</span><span aria-hidden="true">↗</span></div><small>{s.type}</small><h3>{ar?s.ar:s.en}</h3><p>{ar?s.arText:s.enText}</p><span className={styles.serviceLink}>{t("Explore the service","استكشف الخدمة")} <span aria-hidden="true">→</span></span></Link>)}</div>
    </div></section>

    <section className={styles.work} id="projects"><div className={styles.shell}>
      <div className={styles.sectionHead}><div><p className={styles.kicker}>{t("02 / SELECTED WORK","02 / أعمال مختارة")}</p><h2>{t("Ideas, made tangible.","أفكار أصبحت واقعًا.")}</h2></div><Link className={styles.textLink} href="/projects">{t("All project case studies","كل دراسات المشاريع")} ↗</Link></div>
      <Link className={styles.featured} href="/projects/flamingo-park"><div className={styles.projectArt}><span>FP.</span><div className={styles.projectArtBottom}><span>FLAMINGO PARK</span><span>COMMERCE / WEB</span></div></div><div className={styles.projectCopy}><span className={styles.kicker}>{t("FOUNDER'S WORK / E-COMMERCE","من أعمال المؤسس / تجارة إلكترونية")}</span><h3>Flamingo Park</h3><p>{t("A commerce website that connects product discovery, ordering and store operations. Explore the project scope and engineering decisions.","موقع تجاري يجمع اكتشاف المنتجات والطلبات وعمليات المتجر. اطّلع على نطاق المشروع والقرارات التقنية.")}</p><span className={styles.textLink}>{t("Explore the case study","اطّلع على تفاصيل المشروع")} ↗</span></div></Link>
      <div className={styles.workNote}>{t("The project artwork is a brand illustration. Project details are available in the case study.","الصورة معالجة بصرية لاسم المشروع؛ تفاصيل التنفيذ موضّحة في دراسة المشروع.")}</div>
      <Link className={styles.concept} href="/projects/etqan"><div><span className={styles.kicker}>{t("CONCEPT EXPLORATION","مشروع تصوّري")}</span><h3>Etqan</h3></div><p>{t("A service-marketplace concept exploring provider discovery and a clearer customer journey.","تصوّر لسوق خدمات يستكشف اكتشاف مقدّمي الخدمات وتنظيم رحلة العميل.")}</p><span aria-hidden="true">↗</span></Link>
    </div></section>

    <section className={styles.light} id="about"><div className={`${styles.shell} ${styles.about}`}><div><p className={styles.kicker}>{t("03 / ABOUT LINETECH","03 / عن LINETECH")}</p><h2>{t("Small by design.","بداية مركّزة.")}<br/>{t("Serious about the work.","وجديّة في العمل.")}</h2><Link className={styles.textLink} href="/about">{t("Meet LINETECH","تعرّف على LINETECH")} ↗</Link></div><div><p className={styles.aboutLead}>{t("LINETECH is a founder-led technology company based in Aden. You work directly with the person responsible for understanding, building and delivering your project.","LINETECH شركة تقنية يقودها مؤسسها من عدن. تتعامل مباشرةً مع المسؤول عن فهم مشروعك وبنائه وتسليمه.")}</p><div className={styles.founder}><span>MW</span><div><strong>Mohammed Waleed</strong><p>Founder &amp; CEO</p></div></div><p>{t("We agree on scope, review stages, handover and support before work begins. The aim is a useful product you can understand, operate and continue to develop.","نتّفق على نطاق العمل والمراجعات والتسليم والدعم قبل البداية. هدفنا منتج مفيد تستطيع فهمه وتشغيله وتطويره.")}</p></div></div></section>

    <section className={styles.process}><div className={styles.shell}><p className={styles.kicker}>{t("04 / HOW WE WORK","04 / كيف نعمل")}</p><div className={styles.steps}>{process.map(([en,arabic,desc,descAr],i)=><article key={en}><span className={styles.stepNumber}>0{i+1}</span><h3>{ar?arabic:en}</h3><p>{ar?descAr:desc}</p></article>)}</div></div></section>

    <section className={styles.contact} id="contact"><div className={styles.shell}><p className={styles.kicker}>{t("05 / LET'S TALK","05 / لنبدأ الحديث")}</p><h2>{t("What's your next idea?","ما فكرتك القادمة؟")}</h2><p>{t("Tell us what you want to build. We will help you define a clear next step.","أخبرنا بما تريد بناءه، ولنحدّد معًا الخطوة التالية بوضوح.")}</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>{t("Discuss your project","ناقش مشروعك")} ↗</Link><a className={styles.secondary} href="https://wa.me/967773335065" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div><div className={styles.contactDetails}><a href="mailto:info@linetech.company">info@linetech.company</a><a href="tel:+967773335065" dir="ltr">+967 773 335 065</a><span>{t("Aden, Yemen","عدن، اليمن")}</span></div><Link href="/privacy" className={styles.privacy}>{t("How we handle your information","كيف نتعامل مع معلوماتك")}</Link></div></section>
  </main>;
}
