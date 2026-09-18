"use client";

import { useEffect, useState } from "react";
import ContentHeroArt from "../ContentHeroArt";
import { useLanguage } from "../Localized";

const copy = {
  en: {
    index: "01 / PRIVACY",
    kicker: "PRIVACY",
    title: "Your information stays clear and under your control.",
    lead: "A practical overview of what LINETECH stores locally, what may be processed to operate the website, and what happens when you choose to contact us.",
    updated: "LAST UPDATED",
    date: "September 2026",
    aside: "The current project-request experience is local-first: the details you enter remain on your device unless you intentionally share them through a communication channel.",
    contents: "ON THIS PAGE",
    overview: [
      ["LOCAL-FIRST", "Project-request and workspace preview data are stored in your browser on the device you use."],
      ["NO DATA SALES", "LINETECH does not sell or rent your personal information."],
      ["YOUR CHOICE", "Sending project information outside the browser is a separate action you choose."],
    ],
    storageLabel: "LOCAL STORAGE & COOKIES",
    storageTitle: "What the current website stores",
    storageLead: "These entries support language preference, service discovery and the local project-request experience. Clearing browser data can remove them.",
    storageHeaders: ["ITEM", "STORAGE", "PURPOSE", "DURATION"],
    storageRows: [
      ["Language preference", "Local storage + preference cookie", "Remember Arabic or English across visits.", "Local storage until removed; cookie up to 12 months."],
      ["Service Finder", "Local storage", "Preserve finder answers and transfer useful context into the project request.", "Until reset, completed, replaced or browser storage is cleared."],
      ["Project request", "Local storage", "Keep the completed request available to the local workspace preview.", "Until browser storage is cleared or the record is replaced."],
      ["Workspace progress", "Local storage", "Keep the local project-progress preview available on the same browser.", "Until browser storage is cleared or the record is replaced."],
    ],
    contactLabel: "PRIVACY QUESTIONS",
    contactTitle: "Want to ask about your information?",
    contactText: "Use the project-start contact path to reach LINETECH. If your question concerns information you previously shared, include enough context for us to identify the relevant conversation or project.",
    contactCta: "Contact LINETECH",
    sections: [
      {
        id: "scope",
        number: "01",
        title: "Scope of this policy",
        text: "This policy explains how the LINETECH website handles information during website use, service discovery, project-request preparation, local workspace previews and direct project communications. Project-specific agreements may add confidentiality or data-handling requirements for a particular engagement.",
      },
      {
        id: "information-you-provide",
        number: "02",
        title: "Information you choose to provide",
        text: "When you prepare a project request, you may enter your name, contact details, business information, project goals, budget range, timing and other project context. The current request flow keeps that draft and completed request in browser storage on the device you are using unless you choose to share it through another channel.",
      },
      {
        id: "local-storage",
        number: "03",
        title: "Local storage and preference cookies",
        text: "LINETECH uses browser storage to support language preference, the Service Finder, project requests and the workspace preview. A small preference cookie is also used to remember the selected language. These technologies support the website experience; clearing browser data, changing browsers or changing devices can remove or hide locally stored information.",
      },
      {
        id: "technical-data",
        number: "04",
        title: "Technical website data",
        text: "Infrastructure and hosting providers may process technical request data needed to deliver, protect and troubleshoot the website, such as IP address, browser and device information, timestamps, network information and request logs. LINETECH does not use this policy to claim access to provider data it does not actually receive.",
      },
      {
        id: "direct-communications",
        number: "05",
        title: "Information you send directly",
        text: "If you choose to send project information to LINETECH through email, WhatsApp or another communication channel offered during the project process, that information is no longer limited to your browser. It may be used to understand your request, reply to you, prepare a scope or proposal, deliver the project and manage the working relationship.",
      },
      {
        id: "use-of-information",
        number: "06",
        title: "How information is used",
        text: "Information received by LINETECH may be used to communicate with you, evaluate and plan requested work, provide services, maintain project records, protect the website and business, resolve issues, and meet applicable legal or administrative requirements. LINETECH does not use personal information for unrelated purposes without a valid reason.",
      },
      {
        id: "sharing",
        number: "07",
        title: "Sharing and service providers",
        text: "LINETECH does not sell or rent personal information. Information may be processed by independent service providers when necessary to operate hosting and infrastructure, communications, domains, software or project-delivery tools. The exact providers involved can vary with the website and the services chosen for a project.",
      },
      {
        id: "retention",
        number: "08",
        title: "Retention",
        text: "Browser-only information remains subject to the storage controls of your browser and device. Information you send directly may be kept for as long as reasonably necessary for communication, project delivery, project records, dispute prevention, security, legal obligations or legitimate business administration, and should not be kept longer than needed for those purposes.",
      },
      {
        id: "choices-rights",
        number: "09",
        title: "Your choices and rights",
        text: "You can clear locally stored website data through your browser controls and you can choose whether to send a prepared project request to LINETECH. Depending on the law that applies to you and the information involved, you may also have rights to ask about, access, correct, delete or restrict certain personal information held by LINETECH. Requests are assessed according to the applicable law and any information LINETECH is required to retain.",
      },
      {
        id: "security",
        number: "10",
        title: "Security",
        text: "LINETECH aims to use reasonable technical and organizational measures appropriate to the website and project context. No website, device, storage method or communication channel can be guaranteed completely secure, so sensitive credentials or unnecessary confidential information should not be sent through general project-request fields.",
      },
      {
        id: "updates",
        number: "11",
        title: "Updates to this policy",
        text: "This policy may change as LINETECH adds features, integrations, providers or communication methods. When the way information is handled changes materially, the current policy and its last-updated date will be revised on this page.",
      },
    ],
  },
  ar: {
    index: "01 / الخصوصية",
    kicker: "الخصوصية",
    title: "معلوماتك واضحة وتحت سيطرتك.",
    lead: "توضيح عملي لما تحفظه لاين تك محليًا، وما قد تتم معالجته لتشغيل الموقع، وما يحدث عندما تختار التواصل معنا.",
    updated: "آخر تحديث",
    date: "سبتمبر 2026",
    aside: "تجربة طلب المشروع الحالية مبنية على مبدأ التخزين المحلي أولًا: تبقى التفاصيل التي تدخلها على جهازك ما لم تختر مشاركتها عبر قناة تواصل.",
    contents: "في هذه الصفحة",
    overview: [
      ["تخزين محلي أولًا", "بيانات طلب المشروع ومعاينة مساحة العميل تُحفظ داخل متصفحك على الجهاز الذي تستخدمه."],
      ["لا نبيع البيانات", "لا تبيع لاين تك معلوماتك الشخصية ولا تؤجرها."],
      ["القرار بيدك", "إرسال معلومات المشروع خارج المتصفح إجراء منفصل تختاره أنت."],
    ],
    storageLabel: "التخزين المحلي وملفات الارتباط",
    storageTitle: "ما الذي يحفظه الموقع حاليًا",
    storageLead: "تدعم هذه البيانات تفضيل اللغة واكتشاف الخدمة وتجربة طلب المشروع المحلية. وقد يؤدي مسح بيانات المتصفح إلى حذفها.",
    storageHeaders: ["العنصر", "نوع التخزين", "الغرض", "المدة"],
    storageRows: [
      ["تفضيل اللغة", "تخزين محلي + ملف ارتباط للتفضيل", "تذكر اختيار العربية أو الإنجليزية بين الزيارات.", "التخزين المحلي حتى حذفه؛ وملف الارتباط حتى 12 شهرًا."],
      ["مكتشف الخدمة", "تخزين محلي", "حفظ إجابات مكتشف الخدمة ونقل السياق المفيد إلى طلب المشروع.", "حتى إعادة الضبط أو الإكمال أو الاستبدال أو مسح بيانات المتصفح."],
      ["طلب المشروع", "تخزين محلي", "إبقاء الطلب المكتمل متاحًا لمعاينة مساحة العميل المحلية.", "حتى مسح بيانات المتصفح أو استبدال السجل."],
      ["تقدم مساحة العميل", "تخزين محلي", "إبقاء معاينة تقدم المشروع المحلية متاحة في المتصفح نفسه.", "حتى مسح بيانات المتصفح أو استبدال السجل."],
    ],
    contactLabel: "أسئلة الخصوصية",
    contactTitle: "هل لديك سؤال عن معلوماتك؟",
    contactText: "استخدم مسار بدء المشروع للتواصل مع لاين تك. وإذا كان سؤالك متعلقًا بمعلومات شاركتها سابقًا، أضف قدرًا كافيًا من السياق حتى نتمكن من تحديد المحادثة أو المشروع المعني.",
    contactCta: "تواصل مع لاين تك",
    sections: [
      {
        id: "scope",
        number: "01",
        title: "نطاق هذه السياسة",
        text: "توضح هذه السياسة كيفية تعامل موقع لاين تك مع المعلومات أثناء استخدام الموقع واكتشاف الخدمات وتجهيز طلب المشروع ومعاينات مساحة العميل المحلية والتواصل المباشر بخصوص المشاريع. وقد تضيف اتفاقيات المشاريع متطلبات خاصة بالسرية أو التعامل مع البيانات بحسب طبيعة كل مشروع.",
      },
      {
        id: "information-you-provide",
        number: "02",
        title: "المعلومات التي تختار تقديمها",
        text: "عند تجهيز طلب مشروع قد تدخل اسمك ووسيلة التواصل ومعلومات النشاط وأهداف المشروع ونطاق الميزانية والتوقيت وسياقًا إضافيًا. يحتفظ مسار الطلب الحالي بالمسودة والطلب المكتمل داخل تخزين المتصفح على الجهاز الذي تستخدمه ما لم تختر مشاركته عبر قناة أخرى.",
      },
      {
        id: "local-storage",
        number: "03",
        title: "التخزين المحلي وملف تفضيل اللغة",
        text: "تستخدم لاين تك تخزين المتصفح لدعم تفضيل اللغة ومكتشف الخدمة وطلبات المشاريع ومعاينة مساحة العميل. كما يُستخدم ملف ارتباط صغير لتذكر اللغة المختارة. تساعد هذه التقنيات على تشغيل تجربة الموقع، وقد يؤدي مسح بيانات المتصفح أو تغيير المتصفح أو الجهاز إلى إزالة المعلومات المحفوظة محليًا أو عدم ظهورها.",
      },
      {
        id: "technical-data",
        number: "04",
        title: "بيانات الموقع التقنية",
        text: "قد تعالج خدمات الاستضافة والبنية التحتية بيانات تقنية لازمة لتقديم الموقع وحمايته وتشخيص المشكلات، مثل عنوان IP ومعلومات المتصفح والجهاز والتوقيت وبيانات الشبكة وسجلات الطلبات. ولا تدّعي لاين تك عبر هذه السياسة الوصول إلى بيانات يحتفظ بها المزود ولا تستلمها الشركة فعليًا.",
      },
      {
        id: "direct-communications",
        number: "05",
        title: "المعلومات التي ترسلها مباشرة",
        text: "إذا اخترت إرسال معلومات المشروع إلى لاين تك عبر البريد الإلكتروني أو واتساب أو أي قناة تواصل أخرى متاحة ضمن مسار المشروع، فلن تبقى تلك المعلومات محصورة داخل متصفحك. وقد تُستخدم لفهم طلبك والرد عليك وتجهيز النطاق أو العرض وتنفيذ المشروع وإدارة علاقة العمل.",
      },
      {
        id: "use-of-information",
        number: "06",
        title: "كيف نستخدم المعلومات",
        text: "قد تستخدم لاين تك المعلومات التي تستلمها للتواصل معك وتقييم العمل المطلوب والتخطيط له وتقديم الخدمات وحفظ سجلات المشروع وحماية الموقع والعمل ومعالجة المشكلات والوفاء بالمتطلبات النظامية أو الإدارية المعمول بها. ولا تُستخدم المعلومات الشخصية لأغراض غير مرتبطة دون سبب مشروع.",
      },
      {
        id: "sharing",
        number: "07",
        title: "المشاركة ومزودو الخدمات",
        text: "لا تبيع لاين تك المعلومات الشخصية ولا تؤجرها. وقد تتم معالجة المعلومات بواسطة مزودي خدمات مستقلين عندما يكون ذلك ضروريًا لتشغيل الاستضافة والبنية التحتية أو الاتصالات أو النطاقات أو البرامج أو أدوات تنفيذ المشاريع. وقد تختلف الجهات المستخدمة بحسب الموقع والخدمات المختارة لكل مشروع.",
      },
      {
        id: "retention",
        number: "08",
        title: "الاحتفاظ بالمعلومات",
        text: "تبقى المعلومات الموجودة داخل المتصفح فقط خاضعة لإعدادات التخزين في جهازك ومتصفحك. أما المعلومات التي ترسلها مباشرة فقد يتم الاحتفاظ بها للمدة اللازمة بشكل معقول للتواصل وتنفيذ المشروع وسجلاته ومنع النزاعات والأمن والالتزامات النظامية أو الإدارة المشروعة للأعمال، ولا ينبغي الاحتفاظ بها أطول مما تتطلبه هذه الأغراض.",
      },
      {
        id: "choices-rights",
        number: "09",
        title: "خياراتك وحقوقك",
        text: "يمكنك حذف بيانات الموقع المحفوظة محليًا من إعدادات متصفحك، كما يمكنك اختيار ما إذا كنت سترسل طلب المشروع المجهز إلى لاين تك. وبحسب النظام المنطبق عليك وطبيعة المعلومات، قد تكون لك حقوق في الاستفسار عن بعض معلوماتك الشخصية التي تحتفظ بها لاين تك أو الوصول إليها أو تصحيحها أو حذفها أو تقييد استخدامها، وتتم معالجة الطلبات وفق النظام المعمول به وأي معلومات يتعين على لاين تك الاحتفاظ بها.",
      },
      {
        id: "security",
        number: "10",
        title: "الأمان",
        text: "تسعى لاين تك إلى استخدام تدابير تقنية وتنظيمية معقولة ومناسبة لطبيعة الموقع والمشروع. ولا يمكن ضمان أمان أي موقع أو جهاز أو وسيلة تخزين أو قناة تواصل بصورة مطلقة، لذلك لا ينبغي إرسال كلمات المرور أو بيانات الدخول الحساسة أو المعلومات السرية غير الضرورية داخل حقول طلب المشروع العامة.",
      },
      {
        id: "updates",
        number: "11",
        title: "تحديث هذه السياسة",
        text: "قد تتغير هذه السياسة مع إضافة ميزات أو تكاملات أو مزودي خدمات أو وسائل تواصل جديدة إلى لاين تك. وعند حدوث تغيير جوهري في طريقة التعامل مع المعلومات، سيتم تحديث هذه الصفحة وتاريخ آخر تحديث.",
      },
    ],
  },
} as const;

export default function PrivacyPage() {
  const language = useLanguage();
  const t = copy[language];
  const [activeSection, setActiveSection] = useState<string>(t.sections[0].id);

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
    <main className="info-page page-privacy">
      <section className="info-page-hero legal-hero privacy-hero" data-content-hero="privacy">
        <ContentHeroArt motif="privacy" />
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

      <section className="privacy-overview" aria-label={t.kicker}>
        <div className="ref-shell privacy-overview-grid">
          {t.overview.map(([label, text], index) => (
            <article key={label}>
              <span>0{index + 1}</span>
              <div>
                <strong>{label}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="info-content privacy-content">
        <div className="ref-shell info-content-grid privacy-content-grid">
          <aside className="info-content-aside privacy-aside">
            <div className="privacy-meta">
              <p className="ref-kicker">{t.updated}</p>
              <h2>{t.date}</h2>
              <p>{t.aside}</p>
            </div>

            <nav className="privacy-index" aria-label={t.contents}>
              <span className="privacy-index-label">{t.contents}</span>
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

          <div className="info-prose privacy-prose">
            {t.sections.map((section) => (
              <section id={section.id} key={section.id} className="privacy-section">
                <span className="privacy-section-number" aria-hidden="true">{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>

                  {section.id === "local-storage" && (
                    <div className="privacy-storage">
                      <p className="ref-kicker">{t.storageLabel}</p>
                      <h3>{t.storageTitle}</h3>
                      <p className="privacy-storage-lead">{t.storageLead}</p>
                      <div className="privacy-storage-scroll">
                        <table>
                          <thead>
                            <tr>
                              {t.storageHeaders.map((header) => <th key={header}>{header}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {t.storageRows.map((row) => (
                              <tr key={row[0]}>
                                {row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}

            <section className="privacy-contact">
              <p className="ref-kicker">{t.contactLabel}</p>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactText}</p>
              <a className="privacy-contact-link" href="/start">
                {t.contactCta}<span aria-hidden="true">→</span>
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
