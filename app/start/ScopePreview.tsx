"use client";

import { useLanguage } from "../Localized";
import "./scope-preview.css";

type ScopePreviewProps = {
  service: string;
  stage: string;
  goal: string;
  budget: string;
  timing: string;
};

const serviceFocus: Record<string, { en: string[]; ar: string[] }> = {
  "Web Development": {
    en: ["Information structure & user flow", "Responsive interface", "Performance, testing & launch"],
    ar: ["هيكلة المحتوى ومسار المستخدم", "واجهة متجاوبة", "الأداء والاختبار والإطلاق"],
  },
  "E-commerce & Systems": {
    en: ["Customer or operational journey", "Core system screens & states", "Management flow & launch readiness"],
    ar: ["رحلة العميل أو سير العمل التشغيلي", "شاشات النظام وحالاته الأساسية", "الإدارة والاستعداد للإطلاق"],
  },
  "Brand Identity": {
    en: ["Visual direction", "Identity system", "Practical usage & handover"],
    ar: ["الاتجاه البصري", "نظام الهوية", "الاستخدام العملي والتسليم"],
  },
  "CV & Portfolio": {
    en: ["Content hierarchy", "Professional presentation", "Portfolio or digital presence"],
    ar: ["ترتيب المحتوى", "التقديم المهني", "الـPortfolio أو الحضور الرقمي"],
  },
  Other: {
    en: ["Clarify the real need", "Define the smallest useful scope", "Choose the right delivery path"],
    ar: ["توضيح الاحتياج الحقيقي", "تحديد أصغر نطاق مفيد", "اختيار مسار التنفيذ المناسب"],
  },
};

const valueLabels: Record<string, { en: string; ar: string }> = {
  "Web Development": { en: "Web Development", ar: "تطوير المواقع" },
  "E-commerce & Systems": { en: "E-commerce & Systems", ar: "التجارة الإلكترونية والأنظمة" },
  "Brand Identity": { en: "Brand Identity", ar: "الهوية البصرية" },
  "CV & Portfolio": { en: "CV & Portfolio", ar: "السيرة الذاتية والملف المهني" },
  Other: { en: "Other", ar: "أخرى" },
  "New idea": { en: "New idea", ar: "فكرة جديدة" },
  "Existing project": { en: "Existing project", ar: "مشروع قائم" },
  "Redesign / rebuild": { en: "Redesign / rebuild", ar: "إعادة تصميم / بناء" },
  "Improve an existing system": { en: "Improve an existing system", ar: "تحسين نظام قائم" },
  "Sell / generate leads": { en: "Sell / generate leads", ar: "البيع / توليد العملاء المحتملين" },
  "Bookings / requests": { en: "Bookings / requests", ar: "الحجوزات / الطلبات" },
  "Internal operations": { en: "Internal operations", ar: "العمليات الداخلية" },
  "Build credibility": { en: "Build credibility", ar: "بناء الموثوقية" },
  "Career / portfolio": { en: "Career / portfolio", ar: "المسار المهني / Portfolio" },
  "Need guidance": { en: "Need guidance", ar: "أحتاج توجيهًا" },
  "Small focused project": { en: "Small focused project", ar: "مشروع صغير ومركز" },
  "Medium project": { en: "Medium project", ar: "مشروع متوسط" },
  "Large project": { en: "Large project", ar: "مشروع كبير" },
  ASAP: { en: "ASAP", ar: "في أقرب وقت" },
  "1–2 months": { en: "1–2 months", ar: "1–2 شهر" },
  "3+ months": { en: "3+ months", ar: "3 أشهر أو أكثر" },
  Flexible: { en: "Flexible", ar: "مرن" },
};

const copy = {
  en: {
    kicker: "SCOPE PREVIEW",
    title: "This is how LINETECH currently understands the request.",
    lead: "This is a starting interpretation, not a final quote or fixed scope. It keeps the project context clear before the final step.",
    service: "Recommended service",
    stage: "Current stage",
    goal: "Primary outcome",
    frame: "Project size signal",
    timing: "Timing preference",
    focus: "Likely focus areas",
    note: "Final deliverables, price and timeline are defined after the request is completed.",
  },
  ar: {
    kicker: "معاينة النطاق",
    title: "هكذا تفهم لاين تك طلبك حاليًا.",
    lead: "هذه قراءة أولية وليست عرض سعر أو نطاقًا نهائيًا. هدفها إبقاء سياق المشروع واضحًا قبل الخطوة الأخيرة.",
    service: "الخدمة المناسبة",
    stage: "مرحلة المشروع",
    goal: "النتيجة الأساسية",
    frame: "مؤشر حجم المشروع",
    timing: "التوقيت المفضل",
    focus: "محاور العمل المتوقعة",
    note: "يتم تحديد المخرجات النهائية والسعر والمدة بعد إكمال الطلب.",
  },
} as const;

export default function ScopePreview({ service, stage, goal, budget, timing }: ScopePreviewProps) {
  const language = useLanguage();
  const t = copy[language];
  const label = (value: string) => valueLabels[value]?.[language] || value || "—";
  const focus = serviceFocus[service]?.[language] || serviceFocus.Other[language];

  return (
    <section className="scope-preview" aria-label={t.kicker}>
      <div className="scope-preview-head">
        <div><span>{t.kicker}</span><h4>{t.title}</h4></div>
        <p>{t.lead}</p>
      </div>

      <div className="scope-preview-meta">
        <div><span>{t.service}</span><strong>{label(service)}</strong></div>
        <div><span>{t.stage}</span><strong>{label(stage)}</strong></div>
        <div><span>{t.goal}</span><strong>{label(goal)}</strong></div>
        <div><span>{t.frame}</span><strong>{label(budget)}</strong></div>
        <div><span>{t.timing}</span><strong>{label(timing)}</strong></div>
      </div>

      <div className="scope-preview-focus">
        <span>{t.focus}</span>
        <div>{focus.map((item, index) => <p key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</p>)}</div>
      </div>

      <p className="scope-preview-note">{t.note}</p>
    </section>
  );
}
