import arabic from "./arabic.json";

export type Language = "ar" | "en";
const dictionary: Record<string, string> = arabic;

const companyArabic: Record<string, string> = {
  "Solutions": "الحلول",
  "Case Studies": "دراسات الحالة",
  "Start Project": "ابدأ مشروعًا",
  "Start Project ↗": "ابدأ مشروعًا ↖",
  "Explore Solutions": "استكشف الحلول",
  "Explore Solutions ↗": "استكشف الحلول ↖",
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
  "Technology stack": "الحزمة التقنية",
  "CASE STUDIES": "دراسات الحالة",
  "Systems we have built around real workflows.": "أنظمة بنيناها حول سير عمل حقيقي.",
  "These case studies show how LINETECH approaches commerce, marketplaces and business operations as products — not just interfaces.": "توضح دراسات الحالة كيف تتعامل LINETECH مع التجارة والأسواق وعمليات الأعمال كمنتجات متكاملة، لا كواجهات فقط.",
  "COMPANY": "الشركة",
  "Built as a technology company from day one.": "نبنيها كشركة تقنية من اليوم الأول.",
  "LINETECH focuses on useful digital products, clear systems and engineering decisions that support real business use.": "تركز LINETECH على منتجات رقمية مفيدة وأنظمة واضحة وقرارات هندسية تدعم الاستخدام الفعلي للأعمال.",
  "START PROJECT": "ابدأ مشروعًا",
  "Ready to build a real digital product?": "هل أنت مستعد لبناء منتج رقمي حقيقي؟",
  "Start with the business problem. We will help define the right system.": "ابدأ بمشكلة العمل، وسنساعدك على تحديد النظام المناسب.",
  "CORE TECHNOLOGY": "التقنية الأساسية",
  "Core technology solutions.": "حلولنا التقنية الأساسية.",
  "These are the areas where LINETECH leads with product structure, engineering and implementation.": "هذه هي المجالات التي تقود فيها LINETECH بهيكلة المنتج والهندسة والتنفيذ.",
  "SUPPORTING SERVICES": "خدمات مساندة",
  "Support the product around the technology.": "خدمات تدعم المنتج حول التقنية.",
  "Brand and professional presentation can support a product or company, but they are not the center of LINETECH's technology offering.": "يمكن للهوية والعرض المهني أن يدعما المنتج أو الشركة، لكنهما ليسا محور العرض التقني لـ LINETECH.",
  "Technology solutions built for real operations.": "حلول تقنية مبنية لعمليات حقيقية.",
  "LINETECH structures the product, user flows and technical foundation around what the business actually needs to run.": "تبني LINETECH هيكل المنتج وتدفقات المستخدم والأساس التقني حول ما يحتاجه العمل فعليًا للتشغيل.",
  "From business workflow to working product.": "من سير العمل إلى منتج يعمل فعليًا.",
  "We define the system first, then design and build the experience around the real users and operations.": "نحدد النظام أولًا، ثم نصمم ونبني التجربة حول المستخدمين والعمليات الفعلية.",
  "One clear system.": "نظام واحد واضح.",
  "Have a workflow that should become a system?": "لديك سير عمل يجب أن يتحول إلى نظام؟",
  "Start with the business problem. We will help define the right product and technical direction.": "ابدأ بمشكلة العمل، وسنساعدك على تحديد المنتج والاتجاه التقني المناسبين.",
  "Selected systems, not a portfolio gallery.": "أنظمة مختارة، لا معرض أعمال.",
  "Each case study explains the product problem, system structure and what was actually built.": "تشرح كل دراسة حالة مشكلة المنتج وهيكل النظام وما تم بناؤه فعليًا.",
  "SYSTEMS IN PRACTICE": "أنظمة في الواقع",
  "Three different products. Three different operational problems.": "ثلاثة منتجات مختلفة. ثلاث مشكلات تشغيلية مختلفة.",
  "Commerce, marketplace and business software each require different users, data, flows and operating logic.": "التجارة والأسواق وبرمجيات الأعمال لكل منها مستخدمون وبيانات وتدفقات ومنطق تشغيلي مختلف.",
  "HOW WE EVALUATE A PRODUCT": "كيف نقيّم المنتج",
  "Business logic before visual polish.": "منطق العمل قبل الصقل البصري.",
  "A strong product has to support the workflow behind the interface, not only look finished on the screen.": "المنتج القوي يجب أن يدعم سير العمل خلف الواجهة، لا أن يبدو مكتملًا على الشاشة فقط.",
  "Problem": "المشكلة",
  "Understand the real operational problem.": "نفهم المشكلة التشغيلية الحقيقية.",
  "System": "النظام",
  "Define users, rules, states and information flow.": "نحدد المستخدمين والقواعد والحالات وتدفق المعلومات.",
  "Operation": "التشغيل",
  "Launch with a structure the business can actually run.": "نطلق بهيكل يستطيع النشاط تشغيله فعليًا.",
  "Have an operation that needs a better system?": "لديك عملية تحتاج إلى نظام أفضل؟",
  "Tell us how the business works today. We will help define what the product should become.": "أخبرنا كيف يعمل النشاط اليوم، وسنساعدك على تحديد ما يجب أن يصبح عليه المنتج.",
  "A technology company built around systems, products and execution.": "شركة تقنية مبنية حول الأنظمة والمنتجات والتنفيذ.",
  "LINETECH turns business problems and clear ideas into digital products that can be operated, maintained and improved over time.": "تحوّل LINETECH مشكلات الأعمال والأفكار الواضحة إلى منتجات رقمية قابلة للتشغيل والصيانة والتطوير مع الوقت.",
  "WHAT LINETECH DOES": "ما الذي تفعله LINETECH",
  "We turn business problems into digital systems.": "نحوّل مشكلات الأعمال إلى أنظمة رقمية.",
  "We focus on web platforms, commerce systems and business software, then support those products with the design and structure they need to work clearly.": "نركز على منصات الويب وأنظمة التجارة وبرمجيات الأعمال، ثم ندعم هذه المنتجات بالتصميم والهيكل الذي تحتاجه للعمل بوضوح.",
  "The company is built around product thinking, engineering and practical execution — not around producing isolated screens.": "تُبنى الشركة حول التفكير في المنتج والهندسة والتنفيذ العملي، لا حول إنتاج شاشات منفصلة.",
  "HOW THE COMPANY WORKS": "كيف تعمل الشركة",
  "Technology decisions connected to the business.": "قرارات تقنية مرتبطة بالعمل.",
  "Every project is treated as a system with users, rules, data, workflows and a clear operating goal.": "نتعامل مع كل مشروع كنظام له مستخدمون وقواعد وبيانات وسير عمل وهدف تشغيلي واضح.",
  "Product thinking": "تفكير المنتج",
  "Define what the product must solve before choosing features.": "نحدد ما يجب أن يحله المنتج قبل اختيار المزايا.",
  "Engineering": "الهندسة",
  "Choose a practical architecture and build for performance and maintainability.": "نختار بنية عملية ونبني للأداء وقابلية الصيانة.",
  "Operations": "العمليات",
  "Design the product around the real workflow behind the interface.": "نصمم المنتج حول سير العمل الحقيقي خلف الواجهة.",
  "Long-term foundation": "أساس طويل المدى",
  "Leave the product ready for handover, support and future growth.": "نترك المنتج جاهزًا للتسليم والدعم والنمو المستقبلي.",
  "We keep the company focused on practical principles that improve every product from the first conversation to launch.": "نحافظ على تركيز الشركة على مبادئ عملية تحسن كل منتج من أول محادثة حتى الإطلاق.",
  "OPERATING MODEL": "نموذج التشغيل",
  "From business problem to working system.": "من مشكلة العمل إلى نظام يعمل فعليًا.",
  "One continuous process keeps product decisions, engineering and delivery connected.": "عملية متصلة واحدة تُبقي قرارات المنتج والهندسة والتنفيذ مترابطة.",
  "SYSTEM": "النظام",
  "Understand the business, users and real operational problem.": "نفهم العمل والمستخدمين والمشكلة التشغيلية الحقيقية.",
  "Define roles, data, rules, screens and workflows.": "نحدد الأدوار والبيانات والقواعد والشاشات وسير العمل.",
  "Design and develop the agreed product with a maintainable foundation.": "نصمم ونطور المنتج المتفق عليه على أساس قابل للصيانة.",
  "Deploy, hand over and prepare the product for the next version.": "ننشر المنتج ونسلمه ونجهزه للنسخة التالية.",
  "Have a business problem that should become a product?": "لديك مشكلة عمل يجب أن تتحول إلى منتج؟",
  "Bring the workflow and the goal. We will help define the system.": "أحضر سير العمل والهدف، وسنساعدك على تحديد النظام.",
  "LINETECH designs and builds web platforms, commerce systems and business software for real operational needs.": "تصمم LINETECH وتبني منصات ويب وأنظمة تجارة وبرمجيات أعمال لاحتياجات تشغيلية حقيقية.",
  "LINETECH — Technology platforms and systems.": "LINETECH — منصات وأنظمة تقنية."
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
