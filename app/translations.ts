import arabic from "./arabic.json";

export type Language = "ar" | "en";
const dictionary: Record<string, string> = arabic;

const companyArabic: Record<string, string> = {
  "Solutions": "الحلول",
  "Case Studies": "دراسات الحالة",
  "Start Project": "ابدأ مشروعًا",
  "Explore Solutions": "استكشف الحلول",
  "TECHNOLOGY COMPANY": "شركة تقنية",
  "Digital platforms and systems built for real business.": "منصات وأنظمة رقمية مبنية لأعمال حقيقية.",
  "LINETECH designs and builds web platforms, commerce systems and business software around clear operational goals.": "تصمم LINETECH وتبني منصات ويب وأنظمة تجارة وبرمجيات أعمال حول أهداف تشغيلية واضحة.",
  "Web Platforms": "منصات الويب",
  "Commerce Systems": "أنظمة التجارة",
  "Business Systems": "أنظمة الأعمال",
  "Product Delivery": "تنفيذ المنتجات",
  "TECHNOLOGY SOLUTIONS": "الحلول التقنية",
  "Technology built around how your business works.": "تقنية مبنية حول طريقة عمل نشاطك.",
  "From customer-facing platforms to operational systems, we design the right structure before we build the product.": "من المنصات الموجهة للعملاء إلى الأنظمة التشغيلية، نحدد الهيكل الصحيح قبل بناء المنتج.",
  "Web platforms": "منصات الويب",
  "Fast, scalable web products for companies, services and digital businesses.": "منتجات ويب سريعة وقابلة للتوسع للشركات والخدمات والأعمال الرقمية.",
  "Commerce systems": "أنظمة التجارة",
  "Commerce flows, ordering, dashboards and operations connected in one clear product.": "تدفقات تجارة وطلبات ولوحات تحكم وعمليات مترابطة في منتج واضح واحد.",
  "Business software": "برمجيات الأعمال",
  "Structured workflows and internal systems that replace scattered manual work.": "سير عمل منظم وأنظمة داخلية تستبدل العمل اليدوي المتفرق.",
  "Brand systems": "أنظمة الهوية",
  "Visual systems that support a digital product with consistency and credibility.": "أنظمة بصرية تدعم المنتج الرقمي بالاتساق والمصداقية.",
  "HOW WE BUILD": "كيف نبني",
  "A product engineering process, not a portfolio workflow.": "منهجية هندسة منتج، لا أسلوب معرض أعمال.",
  "Define the system": "تحديد النظام",
  "Map the users, business rules, data and real operational flow.": "نحدد المستخدمين وقواعد العمل والبيانات والتدفق التشغيلي الحقيقي.",
  "Design the experience": "تصميم التجربة",
  "Turn the system into clear screens, states and user journeys.": "نحوّل النظام إلى شاشات وحالات ورحلات مستخدم واضحة.",
  "Build the product": "بناء المنتج",
  "Develop the agreed product with performance and maintainability in mind.": "نطور المنتج المتفق عليه مع التركيز على الأداء وقابلية الصيانة.",
  "Deploy and evolve": "النشر والتطوير",
  "Prepare deployment, handover and the foundation for the next version.": "نجهز النشر والتسليم والأساس للنسخة التالية.",
  "TECHNOLOGY FOUNDATION": "الأساس التقني",
  "Practical technology for products that need to stay fast and maintainable.": "تقنيات عملية لمنتجات تحتاج أن تبقى سريعة وقابلة للصيانة.",
  "Our stack is selected around the product, not around trends.": "نختار الحزمة التقنية حول احتياج المنتج، لا حول الترند.",
  "CASE STUDIES": "دراسات الحالة",
  "Systems we have built around real workflows.": "أنظمة بنيناها حول سير عمل حقيقي.",
  "These case studies show how LINETECH approaches commerce, marketplaces and business operations as products — not just interfaces.": "توضح دراسات الحالة كيف تتعامل LINETECH مع التجارة والأسواق وعمليات الأعمال كمنتجات متكاملة، لا كواجهات فقط.",
  "COMPANY": "الشركة",
  "Built as a technology company from day one.": "نبنيها كشركة تقنية من اليوم الأول.",
  "LINETECH focuses on useful digital products, clear systems and engineering decisions that support real business use.": "تركز LINETECH على منتجات رقمية مفيدة وأنظمة واضحة وقرارات هندسية تدعم الاستخدام الفعلي للأعمال.",
  "CORE TECHNOLOGY": "التقنية الأساسية",
  "Core technology solutions.": "حلولنا التقنية الأساسية.",
  "These are the areas where LINETECH leads with product structure, engineering and implementation.": "هذه هي المجالات التي تقود فيها LINETECH بهيكلة المنتج والهندسة والتنفيذ.",
  "SUPPORTING SERVICES": "خدمات مساندة",
  "Support the product around the technology.": "خدمات تدعم المنتج حول التقنية.",
  "Brand and professional presentation can support a product or company, but they are not the center of LINETECH's technology offering.": "يمكن للهوية والعرض المهني أن يدعما المنتج أو الشركة، لكنهما ليسا محور العرض التقني لـ LINETECH.",
  "Selected systems, not a portfolio gallery.": "أنظمة مختارة، لا معرض أعمال.",
  "Each case study explains the product problem, system structure and what was actually built.": "تشرح كل دراسة حالة مشكلة المنتج وهيكل النظام وما تم بناؤه فعليًا."
};

function keepBrandLatin(value: string): string {
  return value.replace(/لاين تك/g, "LINETECH");
}

export function translate(value: string, language: Language): string {
  if (language === "en") return value;
  const key = value.trim().replace(/\s+/g, " ");
  let result = companyArabic[key] ?? dictionary[key];
  if (result === undefined) {
    const step = key.match(/^Step (\d+) of 3$/);
    const largeFile = key.match(/^(.+) is larger than 5 MB\. Keep preview documents smaller until cloud storage is connected\.$/);
    const cannotOpen = key.match(/^(.+) could not be opened in the preview\.$/);
    const bytes = key.match(/^([\d.]+) (B|KB|MB)$/);
    if (step) result = `الخطوة ${step[1]} من 3`;
    else if (largeFile) result = `${largeFile[1]} أكبر من 5 ميغابايت. استخدم مستندًا أصغر في المعاينة حتى يتم ربط التخزين السحابي.`;
    else if (cannotOpen) result = `تعذر فتح ${cannotOpen[1]} في المعاينة.`;
    else if (bytes) result = `${bytes[1]} ${{B: "بايت", KB: "كيلوبايت", MB: "ميغابايت"}[bytes[2]]}`;
    else if (key.endsWith(" — LINETECH")) result = `${translate(key.slice(0, -11), language)} — LINETECH`;
    else return value;
  }
  const branded = keepBrandLatin(result);
  return `${value.match(/^\s*/)?.[0] || ""}${branded}${value.match(/\s*$/)?.[0] || ""}`;
}
