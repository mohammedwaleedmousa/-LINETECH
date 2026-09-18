"use client";

import ContentHeroArt from "../ContentHeroArt";

import { useLanguage } from "../Localized";

const copy = {
  en: {
    index: "02 / TERMS",
    kicker: "TERMS",
    title: "Clear expectations make better work.",
    lead: "These terms cover use of the LINETECH website. Individual projects are governed by the scope and agreement accepted for that project.",
    updated: "LAST UPDATED",
    date: "September 2026",
    aside: "Project scope, payment stages, deliverables and timelines should be confirmed before execution begins.",
    sections: [
      ["1. Website use", "You may use the LINETECH website to learn about the company, services, selected work and how to begin a project. You should not misuse the site, interfere with its operation or attempt unauthorized access to systems or data."],
      ["2. Information on the website", "Website content describes LINETECH and its services in general terms. Specific project scope, pricing, delivery dates and responsibilities are confirmed only through the agreement for that project."],
      ["3. Project proposals and scope", "A project begins after the agreed scope, deliverables, timeline and commercial terms are confirmed. Requests outside the agreed scope may require an updated timeline, price or deliverables before they are added."],
      ["4. Payments", "Payment schedule, amount, currency and payment method are defined for each project before work begins. No single payment structure applies automatically to every project."],
      ["5. Client materials and approvals", "Clients are responsible for providing the materials, access and approvals required for their project. Delays in required information or approvals may affect the project schedule."],
      ["6. Intellectual property and handover", "Ownership, licenses, source files, credentials and handover items depend on the type of project and are defined in the applicable project agreement. Third-party tools, fonts, services and software remain subject to their own licenses and terms."],
      ["7. External services", "Projects and this website may rely on third-party hosting, infrastructure or software. LINETECH cannot control the availability or terms of independent third-party services."],
      ["8. Changes", "These website terms may be updated as LINETECH services and website features evolve. The current version is published on this page."],
    ],
  },
  ar: {
    index: "02 / الشروط",
    kicker: "الشروط",
    title: "التوقعات الواضحة تصنع عملًا أفضل.",
    lead: "تغطي هذه الشروط استخدام موقع لاين تك. أما كل مشروع فيخضع للنطاق والاتفاق المعتمد لذلك المشروع.",
    updated: "آخر تحديث",
    date: "سبتمبر 2026",
    aside: "يجب تأكيد نطاق المشروع ومراحل الدفع والمخرجات والمدة قبل بدء التنفيذ.",
    sections: [
      ["1. استخدام الموقع", "يمكنك استخدام موقع لاين تك للتعرف على الشركة والخدمات والأعمال المختارة وطريقة بدء مشروع. لا يجوز إساءة استخدام الموقع أو تعطيل عمله أو محاولة الوصول غير المصرح به إلى الأنظمة أو البيانات."],
      ["2. المعلومات الموجودة في الموقع", "يصف محتوى الموقع لاين تك وخدماتها بصورة عامة. ولا يتم اعتماد نطاق مشروع محدد أو سعر أو تاريخ تسليم أو مسؤوليات إلا من خلال الاتفاق الخاص بذلك المشروع."],
      ["3. عروض المشاريع والنطاق", "يبدأ المشروع بعد تأكيد النطاق والمخرجات والمدة والشروط التجارية المتفق عليها. وأي طلبات خارج النطاق المتفق عليه قد تتطلب تعديلًا في المدة أو السعر أو المخرجات قبل إضافتها."],
      ["4. الدفعات", "يتم تحديد جدول الدفعات والمبلغ والعملة وطريقة الدفع لكل مشروع قبل بدء العمل. ولا توجد صيغة دفع واحدة تُطبق تلقائيًا على جميع المشاريع."],
      ["5. مواد العميل والموافقات", "يتحمل العميل مسؤولية توفير المواد والصلاحيات والموافقات اللازمة للمشروع. وقد تؤثر أي تأخيرات في المعلومات أو الموافقات المطلوبة على الجدول الزمني للمشروع."],
      ["6. الملكية الفكرية والتسليم", "تختلف الملكية والتراخيص والملفات المصدرية وبيانات الدخول وعناصر التسليم حسب نوع المشروع، ويتم تحديدها في اتفاق المشروع المعتمد. وتظل الأدوات والخطوط والخدمات والبرمجيات التابعة لجهات خارجية خاضعة لتراخيصها وشروطها الخاصة."],
      ["7. الخدمات الخارجية", "قد تعتمد المشاريع وهذا الموقع على استضافة أو بنية تحتية أو برمجيات من جهات خارجية. ولا تتحكم لاين تك في توفر أو شروط الخدمات المستقلة التابعة لتلك الجهات."],
      ["8. التغييرات", "قد يتم تحديث شروط الموقع مع تطور خدمات لاين تك وميزات الموقع. ويتم نشر النسخة الحالية في هذه الصفحة."],
    ],
  },
} as const;

export default function TermsPage(){
  const language = useLanguage();
  const t = copy[language];

  return <main className="info-page page-terms">
    <section className="info-page-hero legal-hero" data-content-hero="terms">
      <ContentHeroArt motif="terms" />
      <div className="ref-shell legal-hero-grid">
        <div className="legal-hero-copy">
          <span className="legal-hero-index">{t.index}</span>
          <p className="ref-kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
        <div className="legal-hero-visual" aria-hidden="true"><i/></div>
      </div>
    </section>
    <section className="info-content">
      <div className="ref-shell info-content-grid">
        <aside className="info-content-aside">
          <p className="ref-kicker">{t.updated}</p>
          <h2>{t.date}</h2>
          <p>{t.aside}</p>
        </aside>
        <div className="info-prose">
          {t.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}
        </div>
      </div>
    </section>
  </main>;
}
