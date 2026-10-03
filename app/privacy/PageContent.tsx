"use client";

import { useEffect, useState } from "react";
import ContentHeroArt from "../ContentHeroArt";
import { useLanguage } from "../Localized";

const copy = {
  en: {
    index: "01 / PRIVACY",
    kicker: "PRIVACY",
    title: "Your information stays clear and under your control.",
    lead: "A practical overview of how LINETECH handles account, project, workspace, chat and file data while operating and delivering its services.",
    updated: "LAST UPDATED",
    date: "September 2026",
    aside: "LINETECH now uses authenticated accounts and secure project workspaces. Project requests, project records, chat messages and uploaded files are stored in the backend so they can remain available after you sign in on another device.",
    contents: "ON THIS PAGE",
    overview: [
      ["ACCOUNT-BASED", "Your account, project records and workspace data are stored in the LINETECH backend and are available through authenticated access."],
      ["NO DATA SALES", "LINETECH does not sell or rent your personal information."],
      ["CONTROLLED ACCESS", "Project information is protected by account and project permissions and is available only to authorized users and LINETECH staff when needed."],
    ],
    storageLabel: "DATA & STORAGE",
    storageTitle: "Where the current platform keeps data",
    storageLead: "LINETECH uses a mix of browser preferences, secure session cookies, database records and private project storage depending on the feature.",
    storageHeaders: ["ITEM", "STORAGE", "PURPOSE", "DURATION"],
    storageRows: [
      ["Language preference", "Browser storage + preference cookie", "Remember Arabic or English across visits.", "Until removed or the preference expires."],
      ["Account session", "Secure HttpOnly cookies", "Keep an authenticated session and refresh it securely.", "Short-lived access session; refresh session may persist when “Remember me” is selected."],
      ["Pending project draft", "Temporary browser storage", "Preserve an unfinished project request while you sign in or confirm your email, including across a new browser tab on the same device.", "Valid for 24 hours; removed after successful submission or when the form next opens after expiry."],
      ["Project & workspace records", "Supabase database", "Store requests, project status, activity, handover items and workspace information linked to the client account.", "For as long as reasonably needed for the project, business records, security or legal obligations."],
      ["Chat & project files", "Supabase database + private storage", "Store project messages, notifications, images, documents, audio and delivery files.", "For as long as reasonably needed for communication, delivery, handover, security or required records."],
    ],
    contactLabel: "PRIVACY QUESTIONS",
    contactTitle: "Want to ask about your information?",
    contactText: "Use the LINETECH contact page to reach us about privacy or information connected to your account or project. Include enough context for us to identify the relevant account, conversation or project.",
    contactCta: "Contact LINETECH",
    sections: [
      {
        id: "scope",
        number: "01",
        title: "Scope of this policy",
        text: "This policy explains how LINETECH handles information when you use the website, create or access an account, submit a project request, use the client workspace, exchange project messages, upload files or receive project handover materials. Project-specific agreements may add confidentiality or data-handling requirements for a particular engagement.",
      },
      {
        id: "information-you-provide",
        number: "02",
        title: "Information you choose to provide",
        text: "When you create an account or work with LINETECH, you may provide your name, email, company or brand, contact details, project goals, service needs, budget range, timing, notes and other project context. You may also send chat messages and upload images, audio, documents or other supported project files. Submitted project data is stored with your authenticated account and project records.",
      },
      {
        id: "local-storage",
        number: "03",
        title: "Storage, sessions and browser preferences",
        text: "LINETECH uses browser storage for limited preferences such as language, temporary service-discovery context and a short-lived project-request draft during sign-in or email confirmation. Pending project drafts are treated as valid for 24 hours, removed after successful submission, and cleared when the form is next opened after expiry. Authenticated project data is stored in the backend rather than being limited to one browser. Signed-in sessions use Secure, HttpOnly, SameSite cookies so the website can maintain and refresh authenticated access without exposing session tokens to normal page scripts.",
      },
      {
        id: "technical-data",
        number: "04",
        title: "Accounts and authentication",
        text: "Account authentication is handled through Supabase Auth. LINETECH uses authenticated sessions to protect the workspace, chat, handover and administrative areas. Infrastructure may also process technical request data needed to deliver, protect and troubleshoot the service, including IP address, browser or device information, timestamps, network information and request logs.",
      },
      {
        id: "direct-communications",
        number: "05",
        title: "Project chat and files",
        text: "The client workspace can store project chat messages and supported attachments such as images, documents and audio. These records are connected to the relevant project so the client and authorized LINETECH staff can communicate, review materials, deliver work and complete handover. Files are kept in private project storage rather than a public file bucket.",
      },
      {
        id: "use-of-information",
        number: "06",
        title: "How information is used",
        text: "Information received by LINETECH may be used to create and maintain your account, evaluate and plan requested work, operate the workspace, communicate about the project, deliver files and services, maintain project and handover records, provide notifications, protect the platform, resolve issues, and meet applicable legal or administrative requirements.",
      },
      {
        id: "sharing",
        number: "07",
        title: "Sharing and service providers",
        text: "LINETECH does not sell or rent personal information. The current platform uses Supabase for authentication, database and private project storage, and Cloudflare for website and Worker delivery, security and infrastructure. Other project-specific tools or communication providers may be used when necessary to deliver a service, depending on the project.",
      },
      {
        id: "retention",
        number: "08",
        title: "Retention",
        text: "Account, project, communication and file records may be kept for as long as reasonably necessary to operate the account, deliver and support the project, complete handover, maintain business records, prevent disputes, protect security, or meet legal and administrative obligations. Browser preferences remain subject to the storage controls of your browser and device.",
      },
      {
        id: "choices-rights",
        number: "09",
        title: "Your choices and rights",
        text: "You can clear browser preferences through your browser controls. You may also contact LINETECH to ask about, access, correct or request deletion or restriction of certain personal information connected to your account or project, subject to applicable law, security checks and records LINETECH is required or reasonably needs to retain.",
      },
      {
        id: "security",
        number: "10",
        title: "Security",
        text: "LINETECH uses access controls, row-level database policies, private project storage, secure session cookies, request rate limits, security headers and upload validation as part of the current platform protections. No online system can be guaranteed completely secure, so clients should still avoid sending credentials or unnecessary highly sensitive information through general project fields or chat.",
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
    lead: "توضيح عملي لكيفية تعامل لاين تك مع بيانات الحساب والمشروع ومساحة العميل والمحادثات والملفات أثناء تشغيل الخدمات وتنفيذ المشاريع.",
    updated: "آخر تحديث",
    date: "سبتمبر 2026",
    aside: "تعتمد لاين تك الآن على حسابات موثقة ومساحات مشاريع محمية. تُحفظ طلبات المشاريع وسجلاتها والمحادثات والملفات في النظام الخلفي حتى تبقى متاحة لك بعد تسجيل الدخول من جهاز آخر.",
    contents: "في هذه الصفحة",
    overview: [
      ["مرتبطة بالحساب", "تُحفظ بيانات الحساب والمشاريع ومساحة العميل في النظام الخلفي وتتاح لك من خلال تسجيل دخول موثّق."],
      ["لا نبيع البيانات", "لا تبيع لاين تك معلوماتك الشخصية ولا تؤجرها."],
      ["وصول مضبوط", "بيانات المشروع محمية بصلاحيات الحساب والمشروع، ولا يصل إليها إلا المستخدمون المصرح لهم وفريق لاين تك عند الحاجة."],
    ],
    storageLabel: "البيانات والتخزين",
    storageTitle: "أين تحفظ المنصة البيانات حاليًا",
    storageLead: "تستخدم لاين تك مزيجًا من تفضيلات المتصفح وملفات جلسة آمنة وسجلات قاعدة البيانات والتخزين الخاص بالمشاريع بحسب الميزة المستخدمة.",
    storageHeaders: ["العنصر", "نوع التخزين", "الغرض", "المدة"],
    storageRows: [
      ["تفضيل اللغة", "تخزين المتصفح + ملف تفضيل", "تذكر اختيار العربية أو الإنجليزية بين الزيارات.", "حتى الحذف أو انتهاء مدة التفضيل."],
      ["جلسة الحساب", "ملفات ارتباط آمنة HttpOnly", "الحفاظ على جلسة تسجيل الدخول وتجديدها بصورة آمنة.", "جلسة الوصول قصيرة؛ وقد تستمر جلسة التجديد عند اختيار «تذكرني»."],
      ["مسودة مشروع معلّقة", "تخزين مؤقت في المتصفح", "الحفاظ على طلب المشروع غير المكتمل أثناء تسجيل الدخول أو تأكيد البريد، بما في ذلك عند فتح رابط التأكيد في تبويب جديد على الجهاز نفسه.", "صالحة لمدة 24 ساعة؛ وتُحذف بعد نجاح الإرسال أو عند فتح النموذج مجددًا بعد انتهاء المدة."],
      ["المشروع ومساحة العميل", "قاعدة بيانات Supabase", "حفظ الطلب وحالة المشروع والنشاط وعناصر التسليم وبيانات مساحة العميل المرتبطة بالحساب.", "طالما كانت مطلوبة بشكل معقول لتنفيذ المشروع أو سجلات العمل أو الأمان أو الالتزامات النظامية."],
      ["المحادثات وملفات المشروع", "قاعدة بيانات Supabase + تخزين خاص", "حفظ الرسائل والتنبيهات والصور والمستندات والصوت وملفات التسليم.", "طالما كانت مطلوبة بشكل معقول للتواصل أو التنفيذ أو التسليم أو الأمان أو حفظ السجلات."],
    ],
    contactLabel: "أسئلة الخصوصية",
    contactTitle: "هل لديك سؤال عن معلوماتك؟",
    contactText: "استخدم صفحة تواصل معنا في لاين تك بخصوص الخصوصية أو المعلومات المرتبطة بحسابك أو مشروعك، وأضف قدرًا كافيًا من السياق حتى نتمكن من تحديد الحساب أو المحادثة أو المشروع المعني.",
    contactCta: "تواصل مع لاين تك",
    sections: [
      {
        id: "scope",
        number: "01",
        title: "نطاق هذه السياسة",
        text: "توضح هذه السياسة كيفية تعامل لاين تك مع المعلومات عند استخدام الموقع أو إنشاء حساب أو تسجيل الدخول أو إرسال طلب مشروع أو استخدام مساحة العميل أو تبادل رسائل المشروع أو رفع الملفات أو استلام مواد التسليم. وقد تضيف اتفاقيات المشاريع متطلبات خاصة بالسرية أو التعامل مع البيانات بحسب طبيعة كل مشروع.",
      },
      {
        id: "information-you-provide",
        number: "02",
        title: "المعلومات التي تختار تقديمها",
        text: "عند إنشاء حساب أو العمل مع لاين تك قد تقدم اسمك وبريدك الإلكتروني واسم الشركة أو العلامة ووسيلة التواصل وأهداف المشروع والخدمة المطلوبة ونطاق الميزانية والتوقيت والملاحظات وسياقًا إضافيًا. وقد ترسل أيضًا رسائل داخل المحادثة أو ترفع صورًا أو ملفات صوتية أو مستندات أو ملفات مشروع مدعومة. تُحفظ البيانات المرسلة ضمن حسابك وسجلات المشروع الموثقة.",
      },
      {
        id: "local-storage",
        number: "03",
        title: "التخزين والجلسات وتفضيلات المتصفح",
        text: "تستخدم لاين تك تخزين المتصفح لتفضيلات محدودة مثل اللغة أو سياق مؤقت لاكتشاف الخدمة، وكذلك لمسودة طلب مشروع قصيرة الأجل أثناء تسجيل الدخول أو تأكيد البريد. تُعامل المسودة المعلّقة كمسودة صالحة لمدة 24 ساعة، وتُحذف بعد نجاح إرسال الطلب أو عند فتح النموذج مجددًا بعد انتهاء المدة. أما بيانات المشروع بعد تسجيل الدخول فتُحفظ في النظام الخلفي ولا تكون محصورة بمتصفح واحد. وتستخدم جلسات تسجيل الدخول ملفات ارتباط Secure وHttpOnly وSameSite للحفاظ على الوصول الموثّق وتجديده دون تعريض رموز الجلسة لسكربتات الصفحة العادية.",
      },
      {
        id: "technical-data",
        number: "04",
        title: "الحساب والمصادقة",
        text: "تتم مصادقة الحسابات عبر Supabase Auth، وتستخدم لاين تك جلسات موثّقة لحماية مساحة العميل والمحادثات والتسليم والصفحات الإدارية. وقد تعالج البنية التحتية أيضًا بيانات تقنية لازمة لتقديم الخدمة وحمايتها وتشخيص المشكلات مثل عنوان IP ومعلومات المتصفح أو الجهاز والتوقيت وبيانات الشبكة وسجلات الطلبات.",
      },
      {
        id: "direct-communications",
        number: "05",
        title: "محادثات المشروع وملفاته",
        text: "تتيح مساحة العميل حفظ رسائل المشروع والمرفقات المدعومة مثل الصور والمستندات والملفات الصوتية. ترتبط هذه السجلات بالمشروع المعني حتى يتمكن العميل وفريق لاين تك المصرح له من التواصل ومراجعة المواد وتنفيذ العمل وإكمال التسليم. وتُحفظ الملفات في تخزين خاص بالمشروع وليس في مساحة ملفات عامة.",
      },
      {
        id: "use-of-information",
        number: "06",
        title: "كيف نستخدم المعلومات",
        text: "قد تستخدم لاين تك المعلومات لإنشاء حسابك وإدارته وتقييم العمل المطلوب والتخطيط له وتشغيل مساحة العميل والتواصل حول المشروع وتقديم الخدمات والملفات وحفظ سجلات المشروع والتسليم وإرسال التنبيهات وحماية المنصة ومعالجة المشكلات والوفاء بالمتطلبات النظامية أو الإدارية المعمول بها.",
      },
      {
        id: "sharing",
        number: "07",
        title: "المشاركة ومزودو الخدمات",
        text: "لا تبيع لاين تك المعلومات الشخصية ولا تؤجرها. تستخدم المنصة حاليًا Supabase للمصادقة وقاعدة البيانات والتخزين الخاص بملفات المشاريع، وتستخدم Cloudflare لاستضافة الموقع وتشغيل طبقة Worker والبنية التحتية والحماية. وقد تُستخدم أدوات أو مزودو تواصل إضافيون عند الحاجة بحسب طبيعة كل مشروع.",
      },
      {
        id: "retention",
        number: "08",
        title: "الاحتفاظ بالمعلومات",
        text: "قد يُحتفظ بسجلات الحساب والمشروع والمحادثات والملفات للمدة اللازمة بشكل معقول لتشغيل الحساب وتنفيذ المشروع ودعمه وإكمال التسليم وحفظ سجلات العمل ومنع النزاعات وحماية الأمان والوفاء بالالتزامات النظامية أو الإدارية. أما تفضيلات المتصفح فتبقى خاضعة لإعدادات التخزين في جهازك ومتصفحك.",
      },
      {
        id: "choices-rights",
        number: "09",
        title: "خياراتك وحقوقك",
        text: "يمكنك حذف تفضيلات المتصفح من إعدادات جهازك. كما يمكنك التواصل مع لاين تك للاستفسار عن بعض معلوماتك المرتبطة بالحساب أو المشروع أو طلب الوصول إليها أو تصحيحها أو حذفها أو تقييد استخدامها، وذلك بحسب النظام المنطبق ومتطلبات التحقق الأمني والسجلات التي يتعين أو يلزم بشكل معقول الاحتفاظ بها.",
      },
      {
        id: "security",
        number: "10",
        title: "الأمان",
        text: "تستخدم لاين تك ضمن المنصة الحالية ضوابط وصول وسياسات على مستوى صفوف قاعدة البيانات وتخزينًا خاصًا بملفات المشاريع وملفات جلسة آمنة وحدودًا للمحاولات ورؤوس حماية وفحصًا للملفات المرفوعة. ولا يمكن ضمان أمان أي نظام متصل بالإنترنت بصورة مطلقة، لذلك يظل من الأفضل عدم إرسال بيانات الدخول أو المعلومات شديدة الحساسية غير الضرورية عبر الحقول العامة أو المحادثة.",
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
              <a className="privacy-contact-link" href="/contact">
                {t.contactCta}<span aria-hidden="true">→</span>
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
