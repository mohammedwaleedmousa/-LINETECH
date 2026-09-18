"use client";

import ContentHeroArt from "../ContentHeroArt";

import { useLanguage } from "../Localized";

const copy = {
  en: {
    index: "01 / PRIVACY",
    kicker: "PRIVACY",
    title: "Your information should stay clear and controlled.",
    lead: "This page explains how information is handled when you use the LINETECH website and project request experience.",
    updated: "LAST UPDATED",
    date: "September 2026",
    aside: "The current project request experience keeps the information you enter on your device unless you choose to share it through another communication channel.",
    sections: [
      ["1. Information you choose to provide","If you use the project request, you may enter information about yourself, your business or a project. While you prepare the request, that information stays in your browser. Completing the request creates a local project record on the device so the workspace preview can display it."],
      ["2. Local project records","The completed request and workspace preview use browser storage on the device you are using. Clearing browser storage, changing devices or using a different browser may remove or hide that local record. Copying or sharing the request is a separate action controlled by you."],
      ["3. Technical website data","Like most hosted websites, infrastructure providers may process technical request information needed to deliver and secure the site, such as IP address, browser information, timestamps and request logs. LINETECH does not use this page to claim access to data it does not actually receive."],
      ["4. Information you send directly","If you choose to send project information to LINETECH through a communication channel, that information may be used to understand your request, respond to you, prepare a project scope and manage the working relationship."],
      ["5. Sharing and selling","LINETECH does not intend to sell personal information. Information may only be processed by service providers where needed to operate the website, communications or project delivery, subject to the tools and services actually used."],
      ["6. Retention","Information that you send directly may be retained for as long as reasonably needed for communication, project records, legal obligations or legitimate business administration. Browser-only project information remains under the storage controls of your browser and device."],
      ["7. Changes to this page","This privacy information may be updated as the website gains new features, integrations or communication methods. Material changes should be reflected on this page."],
    ],
  },
  ar: {
    index: "01 / الخصوصية",
    kicker: "الخصوصية",
    title: "يجب أن تبقى معلوماتك واضحة وتحت سيطرتك.",
    lead: "توضح هذه الصفحة كيفية التعامل مع المعلومات عند استخدام موقع لاين تك وتجربة طلب المشروع.",
    updated: "آخر تحديث",
    date: "سبتمبر 2026",
    aside: "تحافظ تجربة طلب المشروع الحالية على المعلومات التي تدخلها داخل جهازك ما لم تختر مشاركتها عبر قناة تواصل أخرى.",
    sections: [
      ["1. المعلومات التي تختار تقديمها","عند استخدام طلب المشروع قد تدخل معلومات عنك أو عن نشاطك أو مشروعك. أثناء تجهيز الطلب تبقى هذه المعلومات في متصفحك. وعند إتمام الطلب يتم إنشاء سجل محلي على الجهاز حتى تستطيع مساحة العميل عرضه."],
      ["2. سجلات المشروع المحلية","يستخدم الطلب المكتمل ومعاينة مساحة العميل تخزين المتصفح على الجهاز الذي تستخدمه. قد يؤدي مسح بيانات المتصفح أو تغيير الجهاز أو استخدام متصفح آخر إلى إزالة السجل المحلي أو عدم ظهوره. نسخ الطلب أو مشاركته إجراء منفصل تتحكم به أنت."],
      ["3. بيانات الموقع التقنية","مثل معظم المواقع المستضافة، قد تعالج خدمات البنية التحتية معلومات تقنية لازمة لتقديم الموقع وتأمينه مثل عنوان IP ومعلومات المتصفح والتوقيت وسجلات الطلبات. لا تدّعي لاين تك عبر هذه الصفحة الوصول إلى بيانات لا تستلمها فعليًا."],
      ["4. المعلومات التي ترسلها مباشرة","إذا اخترت إرسال معلومات المشروع إلى لاين تك عبر قناة تواصل، فقد تستخدم هذه المعلومات لفهم طلبك والرد عليك وتجهيز نطاق المشروع وإدارة علاقة العمل."],
      ["5. المشاركة والبيع","لا تنوي لاين تك بيع المعلومات الشخصية. وقد تتم معالجة المعلومات بواسطة مزودي خدمات عند الحاجة لتشغيل الموقع أو التواصل أو تنفيذ المشروع، بحسب الأدوات والخدمات المستخدمة فعليًا."],
      ["6. الاحتفاظ بالمعلومات","قد يتم الاحتفاظ بالمعلومات التي ترسلها مباشرة للمدة اللازمة بشكل معقول للتواصل وسجلات المشاريع والالتزامات النظامية أو الإدارة المشروعة للأعمال. أما معلومات المشروع الموجودة فقط في المتصفح فتبقى خاضعة لإعدادات التخزين في متصفحك وجهازك."],
      ["7. التغييرات على هذه الصفحة","قد يتم تحديث معلومات الخصوصية مع إضافة ميزات أو تكاملات أو وسائل تواصل جديدة إلى الموقع، ويجب أن تنعكس التغييرات المهمة على هذه الصفحة."],
    ],
  },
} as const;

export default function PrivacyPage(){
  const language = useLanguage();
  const t = copy[language];
  return <main className="info-page page-privacy">
    <section className="info-page-hero legal-hero" data-content-hero="privacy">
      <ContentHeroArt motif="privacy" />
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
    <section className="info-content"><div className="ref-shell info-content-grid"><aside className="info-content-aside"><p className="ref-kicker">{t.updated}</p><h2>{t.date}</h2><p>{t.aside}</p></aside><div className="info-prose">
      {t.sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    </div></div></section>
  </main>;
}
