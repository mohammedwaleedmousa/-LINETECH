"use client";

import { useEffect, useState } from "react";
import ContentHeroArt from "../ContentHeroArt";

import { useLanguage } from "../Localized";

const copy = {
  en: {
    index: "02 / TERMS",
    kicker: "TERMS OF SERVICE",
    title: "Clear terms. Better work.",
    lead: "These terms explain how the LINETECH website may be used and the general framework for working with LINETECH. Project-specific scope and commercial terms are confirmed separately for each engagement.",
    updated: "LAST UPDATED",
    date: "September 2026",
    aside: "The project agreement always takes priority for project-specific scope, fees, deliverables, approvals and timelines.",
    contents: "ON THIS PAGE",
    contactLabel: "QUESTIONS",
    contactTitle: "Need clarity before we begin?",
    contactText: "If anything in these terms needs clarification, contact LINETECH before approving a proposal or starting a project.",
    contactCta: "Contact LINETECH",
    sections: [
      {
        id: "website-use",
        number: "01",
        title: "Website use",
        text: "You may use the LINETECH website to learn about the company, services, selected work and ways to start a project. You must not misuse the website, disrupt its operation, attempt unauthorized access, or use its content or systems in a way that violates applicable law or the rights of others.",
      },
      {
        id: "service-information",
        number: "02",
        title: "Service information and proposals",
        text: "Website content describes LINETECH and its services in general terms. A proposal, estimate or conversation does not create a project commitment until the applicable scope, commercial terms and approval to proceed are confirmed.",
      },
      {
        id: "scope-and-changes",
        number: "03",
        title: "Project scope and changes",
        text: "Each project is based on an agreed scope, deliverables and working assumptions. Requests outside that scope may require a revised price, timeline or delivery plan. LINETECH may pause out-of-scope work until the change is agreed.",
      },
      {
        id: "client-responsibilities",
        number: "04",
        title: "Client responsibilities",
        text: "Clients are responsible for providing accurate information, required materials, access, feedback and approvals in a timely manner. The client must also have the right to provide any content, files, trademarks, credentials or other materials supplied to LINETECH.",
      },
      {
        id: "fees-and-costs",
        number: "05",
        title: "Fees, payments and third-party costs",
        text: "Project fees, currency, payment stages and payment method are confirmed before work begins. Hosting, domains, paid software, licenses, advertising, platform fees or other third-party costs are included only when the project agreement expressly says so.",
      },
      {
        id: "timelines",
        number: "06",
        title: "Timelines and delays",
        text: "Delivery dates depend on the agreed scope and timely client participation. Delays in materials, access, decisions, approvals, payments or external services may require the project schedule to be adjusted.",
      },
      {
        id: "revisions-and-handover",
        number: "07",
        title: "Revisions, acceptance and handover",
        text: "Included revisions, review stages, acceptance criteria and handover items are defined for each project. Additional revisions or work requested after approval may be treated as a scope change.",
      },
      {
        id: "intellectual-property",
        number: "08",
        title: "Intellectual property",
        text: "Ownership and usage rights for final deliverables are defined in the applicable project agreement. Unless agreed otherwise, LINETECH retains ownership of its pre-existing methods, reusable components, internal tools and know-how. Third-party assets remain subject to their own licenses and terms.",
      },
      {
        id: "confidentiality",
        number: "09",
        title: "Confidentiality and project access",
        text: "Where a project requires access to non-public information, accounts or systems, both sides should handle that access responsibly and only for the project purpose. Any project-specific confidentiality obligations may be documented separately when required.",
      },
      {
        id: "third-party-services",
        number: "10",
        title: "Third-party services",
        text: "The website and client projects may rely on independent providers for hosting, domains, infrastructure, payment services, software or other tools. LINETECH does not control those providers and cannot guarantee their uninterrupted availability, pricing or future terms.",
      },
      {
        id: "suspension-and-cancellation",
        number: "11",
        title: "Suspension and cancellation",
        text: "Either side may request to pause or end a project subject to the applicable project agreement. Amounts already due, completed work, committed third-party costs and handover obligations are handled according to that agreement and the work completed at that point.",
      },
      {
        id: "liability-and-updates",
        number: "12",
        title: "Responsibility and updates to these terms",
        text: "LINETECH aims to deliver services with reasonable care and in line with the agreed project scope. Project-specific warranties, limitations, remedies and governing terms should be stated in the applicable agreement. These website terms may be updated as LINETECH services evolve, and the current version will be published on this page.",
      },
    ],
  },
  ar: {
    index: "02 / الشروط",
    kicker: "شروط الخدمة",
    title: "شروط واضحة. عمل أفضل.",
    lead: "توضح هذه الشروط طريقة استخدام موقع لاين تك والإطار العام للعمل مع الشركة. أما نطاق كل مشروع وشروطه التجارية فيتم اعتمادها بشكل مستقل لكل مشروع.",
    updated: "آخر تحديث",
    date: "سبتمبر 2026",
    aside: "يكون اتفاق المشروع هو المرجع الأول في النطاق والرسوم والمخرجات والموافقات والمدة الخاصة بذلك المشروع.",
    contents: "في هذه الصفحة",
    contactLabel: "لديك سؤال؟",
    contactTitle: "هل تحتاج توضيحًا قبل أن نبدأ؟",
    contactText: "إذا كان أي جزء من هذه الشروط غير واضح، تواصل مع لاين تك قبل اعتماد العرض أو بدء المشروع.",
    contactCta: "تواصل مع لاين تك",
    sections: [
      {
        id: "website-use",
        number: "01",
        title: "استخدام الموقع",
        text: "يمكنك استخدام موقع لاين تك للتعرف على الشركة وخدماتها وأعمالها المختارة وطرق بدء مشروع. ولا يجوز إساءة استخدام الموقع أو تعطيل عمله أو محاولة الوصول غير المصرح به أو استخدام محتواه أو أنظمته بما يخالف الأنظمة المعمول بها أو حقوق الآخرين.",
      },
      {
        id: "service-information",
        number: "02",
        title: "معلومات الخدمات والعروض",
        text: "يصف محتوى الموقع لاين تك وخدماتها بصورة عامة. ولا يُعد العرض أو التقدير أو المحادثة التزامًا ببدء المشروع حتى يتم تأكيد النطاق والشروط التجارية والموافقة على بدء التنفيذ.",
      },
      {
        id: "scope-and-changes",
        number: "03",
        title: "نطاق المشروع والتغييرات",
        text: "يعتمد كل مشروع على نطاق ومخرجات وافتراضات عمل متفق عليها. وقد تتطلب الطلبات الخارجة عن النطاق تعديل السعر أو المدة أو خطة التسليم، ويجوز إيقاف تنفيذ العمل الإضافي حتى يتم اعتماد التغيير.",
      },
      {
        id: "client-responsibilities",
        number: "04",
        title: "مسؤوليات العميل",
        text: "يتحمل العميل مسؤولية توفير المعلومات الصحيحة والمواد والصلاحيات والملاحظات والموافقات المطلوبة في الوقت المناسب، كما يجب أن يملك الحق في تزويد لاين تك بأي محتوى أو ملفات أو علامات تجارية أو بيانات دخول أو مواد أخرى يقدمها للمشروع.",
      },
      {
        id: "fees-and-costs",
        number: "05",
        title: "الرسوم والدفعات وتكاليف الجهات الخارجية",
        text: "يتم تحديد رسوم المشروع والعملة ومراحل الدفع وطريقة السداد قبل بدء العمل. ولا تشمل الرسوم تكاليف الاستضافة أو النطاقات أو البرامج المدفوعة أو التراخيص أو الإعلانات أو رسوم المنصات أو أي تكاليف خارجية أخرى إلا إذا نص اتفاق المشروع على ذلك صراحة.",
      },
      {
        id: "timelines",
        number: "06",
        title: "المدة والتأخيرات",
        text: "تعتمد مواعيد التسليم على النطاق المتفق عليه وعلى مشاركة العميل في الوقت المناسب. وقد تستلزم التأخيرات في المواد أو الصلاحيات أو القرارات أو الموافقات أو الدفعات أو الخدمات الخارجية تعديل الجدول الزمني للمشروع.",
      },
      {
        id: "revisions-and-handover",
        number: "07",
        title: "المراجعات والاعتماد والتسليم",
        text: "يتم تحديد المراجعات المشمولة ومراحل المراجعة ومعايير الاعتماد وعناصر التسليم لكل مشروع. وقد تُعامل المراجعات الإضافية أو الأعمال المطلوبة بعد الاعتماد كتغيير في نطاق المشروع.",
      },
      {
        id: "intellectual-property",
        number: "08",
        title: "الملكية الفكرية",
        text: "يتم تحديد ملكية المخرجات النهائية وحقوق استخدامها في اتفاق المشروع المعتمد. وما لم يتم الاتفاق على خلاف ذلك، تحتفظ لاين تك بملكية الأساليب والمكونات القابلة لإعادة الاستخدام والأدوات الداخلية والخبرات التي كانت لديها قبل المشروع، بينما تظل أصول الجهات الخارجية خاضعة لتراخيصها وشروطها.",
      },
      {
        id: "confidentiality",
        number: "09",
        title: "السرية وصلاحيات المشروع",
        text: "عندما يتطلب المشروع الوصول إلى معلومات أو حسابات أو أنظمة غير عامة، يجب على الطرفين التعامل مع تلك الصلاحيات بمسؤولية واستخدامها لغرض المشروع فقط. ويمكن توثيق أي التزامات سرية خاصة بالمشروع بشكل مستقل عند الحاجة.",
      },
      {
        id: "third-party-services",
        number: "10",
        title: "خدمات الجهات الخارجية",
        text: "قد يعتمد الموقع أو مشاريع العملاء على مزودين مستقلين للاستضافة أو النطاقات أو البنية التحتية أو خدمات الدفع أو البرامج أو غيرها من الأدوات. ولا تتحكم لاين تك في تلك الجهات ولا تضمن استمرار توفر خدماتها أو أسعارها أو شروطها مستقبلًا.",
      },
      {
        id: "suspension-and-cancellation",
        number: "11",
        title: "إيقاف المشروع أو إلغاؤه",
        text: "يجوز لأي من الطرفين طلب إيقاف المشروع مؤقتًا أو إنهائه وفقًا لاتفاق المشروع المعتمد. ويتم التعامل مع المبالغ المستحقة والعمل المنجز والتكاليف الخارجية الملتزم بها والتسليمات وفقًا لذلك الاتفاق وحالة المشروع عند التوقف.",
      },
      {
        id: "liability-and-updates",
        number: "12",
        title: "المسؤولية وتحديث الشروط",
        text: "تعمل لاين تك على تقديم خدماتها بعناية معقولة ووفق نطاق المشروع المتفق عليه. وتُحدد أي ضمانات أو حدود للمسؤولية أو حلول أو شروط حاكمة خاصة بالمشروع في اتفاقه المعتمد. وقد يتم تحديث شروط الموقع مع تطور خدمات لاين تك، وتُنشر النسخة الحالية دائمًا في هذه الصفحة.",
      },
    ],
  },
} as const;

export default function TermsPage() {
  const language = useLanguage();
  const t = copy[language];
  const [activeSection, setActiveSection] = useState(t.sections[0].id);

  useEffect(() => {
    setActiveSection(t.sections[0].id);

    const sections = t.sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [language, t.sections]);

  return (
    <main className="info-page page-terms">
      <section className="info-page-hero legal-hero" data-content-hero="terms">
        <ContentHeroArt motif="terms" />
        <div className="ref-shell legal-hero-grid">
          <div className="legal-hero-copy">
            <span className="legal-hero-index">{t.index}</span>
            <p className="ref-kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
            <p>{t.lead}</p>
          </div>
          <div className="legal-hero-visual" aria-hidden="true"><i /></div>
        </div>
      </section>

      <section className="info-content terms-content">
        <div className="ref-shell info-content-grid terms-content-grid">
          <aside className="info-content-aside terms-aside">
            <div className="terms-meta">
              <p className="ref-kicker">{t.updated}</p>
              <h2>{t.date}</h2>
              <p>{t.aside}</p>
            </div>

            <nav className="terms-index" aria-label={t.contents}>
              <span className="terms-index-label">{t.contents}</span>
              {t.sections.map((section) => (
                <a
                  href={`#${section.id}`}
                  key={section.id}
                  className={activeSection === section.id ? "is-active" : undefined}
                  aria-current={activeSection === section.id ? "location" : undefined}
                >
                  <span>{section.number}</span>
                  <b>{section.title}</b>
                </a>
              ))}
            </nav>
          </aside>

          <div className="info-prose terms-prose">
            {t.sections.map((section) => (
              <section id={section.id} key={section.id} className="terms-section">
                <span className="terms-section-number" aria-hidden="true">{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </div>
              </section>
            ))}

            <section className="terms-contact">
              <p className="ref-kicker">{t.contactLabel}</p>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactText}</p>
              <a className="terms-contact-link" href="/contact">
                {t.contactCta}<span aria-hidden="true">→</span>
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
