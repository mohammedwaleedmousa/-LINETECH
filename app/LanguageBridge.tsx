"use client";

import { useLayoutEffect } from "react";

type Language = "ar" | "en";

export const LANGUAGE_STORAGE_KEY = "linetech-language-v1";
export const LANGUAGE_EVENT = "linetech:languagechange";

const AR: Record<string,string> = {
  "Home":"الرئيسية","Services":"الخدمات","Projects":"المشاريع","About":"من نحن","Contact":"تواصل معنا","Chat":"المحادثة","Login":"تسجيل الدخول","Login / Create Account":"تسجيل الدخول / إنشاء حساب","Start Your Line":"ابدأ خطك","Page":"صفحة","Service":"خدمة","Project":"مشروع","Client":"عميل","Account":"حساب",
  "Navigation":"التنقل","Quick Links":"روابط سريعة","Company":"الشركة","Privacy":"الخصوصية","Terms":"الشروط","FAQ":"الأسئلة الشائعة","Aden, Yemen":"عدن، اليمن","Technology for a brighter tomorrow.":"تقنية لمستقبل أكثر إشراقًا.","© 2026 LINETECH. All rights reserved.":"© 2026 LINETECH. جميع الحقوق محفوظة.","Every idea starts with a line.":"كل فكرة تبدأ بخط.",
  "Web Development":"تطوير الويب","E-commerce & Systems":"التجارة الإلكترونية والأنظمة","Brand Identity":"الهوية البصرية","CV & Portfolio":"السيرة الذاتية ومعرض الأعمال",
  "Search LINETECH":"بحث LINETECH","Toggle navigation":"فتح أو إغلاق القائمة","Primary navigation":"التنقل الرئيسي","Mobile navigation":"تنقل الجوال","SEARCH / LINETECH":"بحث / LINETECH","SEARCH RESULTS":"نتائج البحث","QUICK ACCESS":"وصول سريع","What are you looking for?":"عمّ تبحث؟","No results found. Try another word.":"لا توجد نتائج. جرّب كلمة أخرى.","Type to search":"اكتب للبحث","ESC to close":"ESC للإغلاق","Close search":"إغلاق البحث","Search":"بحث",
  "TECHNOLOGY FOR A BRIGHTER TOMORROW":"تقنية لمستقبل أكثر إشراقًا","Every idea":"كل فكرة","starts with a line.":"تبدأ بخط.","We turn ideas into real digital products through clear design, reliable technology and disciplined execution.":"نحوّل الأفكار إلى منتجات رقمية حقيقية عبر تصميم واضح، وتقنية موثوقة، وتنفيذ منضبط.","Let's Build":"لنبدأ البناء","View Our Work":"شاهد أعمالنا","Founder-led":"بقيادة المؤسس","Core Services":"خدمات أساسية","Clear Steps":"خطوات واضحة","Bigger Possibilities":"إمكانات أكبر",
  "OUR SERVICES":"خدماتنا","Solutions for":"حلول من أجل","a smarter tomorrow.":"غدٍ أكثر ذكاءً.","Solutions for a smarter tomorrow.":"حلول لغدٍ أكثر ذكاءً.","We combine technology, design and engineering to deliver solutions that solve real problems.":"نجمع بين التقنية والتصميم والهندسة لتقديم حلول تعالج مشكلات حقيقية.","View All Services":"عرض جميع الخدمات","Learn more":"اعرف المزيد",
  "Fast, polished company websites and digital experiences built for real business use.":"مواقع شركات سريعة ومتقنة وتجارب رقمية مبنية للاستخدام التجاري الحقيقي.","Commerce flows, dashboards and custom systems shaped around the way your business works.":"تجارب تجارة إلكترونية ولوحات تحكم وأنظمة مخصصة مبنية حول طريقة عمل نشاطك.","Clear visual systems that make a business feel consistent, modern and credible.":"أنظمة بصرية واضحة تمنح النشاط حضورًا متسقًا وحديثًا وموثوقًا.","Professional personal presentation for careers, portfolios and stronger opportunities.":"عرض مهني احترافي للسيرة والأعمال بما يعزز الفرص المهنية.",
  "FEATURED PROJECTS":"مشاريع مختارة","Real solutions.":"حلول حقيقية.","Real impact.":"أثر حقيقي.","Real solutions. Real impact.":"حلول حقيقية. أثر حقيقي.","A selection of products and systems that reflect LINETECH's practical direction.":"مجموعة من المنتجات والأنظمة التي تعكس توجه LINETECH العملي.","View All Projects":"عرض جميع المشاريع","View Project":"عرض المشروع","E-COMMERCE":"تجارة إلكترونية","MARKETPLACE":"سوق خدمات","SERVICES MARKETPLACE":"سوق خدمات","BUSINESS SYSTEM":"نظام أعمال","A mobile-first retail experience for product discovery, orders and customer conversion.":"تجربة تجارة تجزئة تركز على الجوال لاكتشاف المنتجات والطلبات وتحويل الزوار إلى عملاء.","A services marketplace designed to organize discovery, providers and customer journeys.":"سوق خدمات مصمم لتنظيم الاكتشاف ومقدمي الخدمات ورحلة العميل.","A business system for financial records, workflows and clearer operational visibility.":"نظام أعمال للسجلات المالية وسير العمل ووضوح أكبر للعمليات.",
  "ABOUT LINETECH":"عن LINETECH","More than technology.":"أكثر من مجرد تقنية.","A smarter tomorrow.":"غدٌ أكثر ذكاءً.","More than technology. A smarter tomorrow.":"أكثر من مجرد تقنية. غدٌ أكثر ذكاءً.","LINETECH is a technology company that turns ideas into real digital products. We begin with clarity, shape the right solution and build for real-world use.":"LINETECH شركة تقنية تحوّل الأفكار إلى منتجات رقمية حقيقية. نبدأ بالوضوح، ونصوغ الحل المناسب، ثم نبنيه للاستخدام الواقعي.","IDEAS":"أفكار","SYSTEMS":"أنظمة","PEOPLE":"أشخاص","A BETTER":"مستقبل","TOMORROW":"أفضل","A BETTER TOMORROW":"مستقبل أفضل",
  "OUR PROCESS":"منهجية العمل","From idea to impact.":"من الفكرة إلى الأثر.","Understand":"فهم","Plan":"تخطيط","Build":"بناء","Launch":"إطلاق","We define the idea, goals and the real challenge.":"نحدد الفكرة والأهداف والتحدي الحقيقي.","We shape the right structure, scope and direction.":"نحدد الهيكل والنطاق والاتجاه المناسب.","We design, develop and test with precision.":"نصمم ونطور ونختبر بدقة.","We deploy, hand over and support the next step.":"نطلق المشروع ونسلمه وندعم الخطوة التالية.",
  "OUR STANDARD":"معيارنا","What every":"ما يجب أن","client should feel.":"يشعر به كل عميل.","Alignment":"مواءمة","before execution":"قبل التنفيذ","Quality":"جودة","in every step":"في كل خطوة","Clear communication, a focused scope and work that feels intentional from the first line to launch.":"تواصل واضح، ونطاق مركز، وعمل مقصود من أول خط حتى الإطلاق.","A reliable process, careful decisions and a final product built for real use — not just presentation.":"عملية موثوقة، وقرارات مدروسة، ومنتج نهائي مبني للاستخدام الحقيقي لا للعرض فقط.",
  "LET'S BUILD TOGETHER":"لنبنِ معًا","Ready to turn your idea into reality?":"هل أنت مستعد لتحويل فكرتك إلى واقع؟","Start with the idea. We'll help define the first line.":"ابدأ بالفكرة، وسنساعدك على تحديد الخط الأول.",
  "WHAT WE BUILD":"ما الذي نبنيه","Four focused services.":"أربع خدمات مركزة.","We start with the outcome you need, then choose the right mix of strategy, design and engineering. No unnecessary complexity.":"نبدأ بالنتيجة التي تحتاجها، ثم نختار المزيج المناسب من الاستراتيجية والتصميم والهندسة دون تعقيد غير ضروري.","Explore service →":"استكشف الخدمة ←","High-performance websites and web products built around clear goals, fast loading and long-term scalability.":"مواقع ومنتجات ويب عالية الأداء مبنية حول أهداف واضحة وسرعة تحميل وقابلية للتوسع على المدى الطويل.","Landing pages / Business websites / Custom web apps":"صفحات هبوط / مواقع شركات / تطبيقات ويب مخصصة","Commerce experiences and operational systems structured around real customer journeys and business workflows.":"تجارب تجارة إلكترونية وأنظمة تشغيلية مبنية حول رحلة العميل وسير عمل النشاط الحقيقي.","E-commerce / Dashboards / Booking / Custom systems":"تجارة إلكترونية / لوحات تحكم / حجوزات / أنظمة مخصصة","A focused visual system that gives a business a distinctive, consistent and credible presence.":"نظام بصري مركز يمنح النشاط حضورًا مميزًا ومتسقًا وموثوقًا.","Logo direction / Visual system / Brand guidelines":"توجه الشعار / النظام البصري / دليل الهوية","Professional presentation designed to communicate experience, work and value with clarity.":"عرض مهني مصمم لتوضيح الخبرة والأعمال والقيمة بوضوح.","CV / Portfolio / Personal presence":"سيرة ذاتية / معرض أعمال / حضور شخصي",
  "PROCESS":"العملية","One clear line.":"خط واحد واضح.","Define":"تحديد","Design":"تصميم","Build & Launch":"البناء والإطلاق","We understand the business, idea and real need.":"نفهم النشاط والفكرة والحاجة الحقيقية.","We define scope, priorities and the right solution.":"نحدد النطاق والأولويات والحل المناسب.","We shape the experience before development begins.":"نصوغ التجربة قبل بدء التطوير.","We develop, test, launch and prepare the next step.":"نطور ونختبر ونطلق ونجهز الخطوة التالية.","START YOUR LINE":"ابدأ خطك","Not sure which service fits?":"غير متأكد من الخدمة المناسبة؟","Tell us the outcome you need. We will help define the right first line.":"أخبرنا بالنتيجة التي تحتاجها، وسنساعدك في تحديد الخط الأول الصحيح.","Contact Us ↗":"تواصل معنا ↖",
  "WEB DEVELOPMENT":"تطوير الويب","E-COMMERCE & SYSTEMS":"التجارة الإلكترونية والأنظمة","BRAND IDENTITY":"الهوية البصرية","CV & PORTFOLIO":"السيرة الذاتية ومعرض الأعمال","Web products built to perform.":"منتجات ويب مبنية للأداء.","Digital systems built around real workflows.":"أنظمة رقمية مبنية حول سير عمل حقيقي.","A visual system with a clear point of view.":"نظام بصري برؤية واضحة.","Present your work with clarity.":"اعرض أعمالك بوضوح.","Start this service ↗":"ابدأ هذه الخدمة ↖","View our work":"شاهد أعمالنا","LINETECH / SERVICE":"LINETECH / خدمة","WHAT YOU GET":"ما الذي ستحصل عليه","A clear, usable outcome.":"نتيجة واضحة وقابلة للاستخدام.","Every engagement is scoped around the result you need, with the deliverables defined before execution starts.":"نحدد نطاق كل مشروع حول النتيجة التي تحتاجها، مع توضيح المخرجات قبل بدء التنفيذ.","WHO IT FITS":"لمن تناسب","Built around the real need.":"مبنية حول الحاجة الحقيقية.","We keep the solution focused instead of adding features that do not serve the project.":"نحافظ على تركيز الحل بدل إضافة مزايا لا تخدم المشروع.","HOW WE WORK":"كيف نعمل","One line from brief to delivery.":"خط واحد من الملخص إلى التسليم.","A simple process keeps decisions visible, scope controlled and the final outcome aligned with the original goal.":"عملية بسيطة تجعل القرارات واضحة والنطاق مضبوطًا والنتيجة النهائية متوافقة مع الهدف الأصلي.","Ready to move from idea to execution?":"جاهز للانتقال من الفكرة إلى التنفيذ؟","Prepare a clear project brief, then continue through the contact channel you choose.":"جهّز ملخصًا واضحًا للمشروع، ثم واصل عبر قناة التواصل التي تختارها.",
  "From focused company websites to custom web applications, we shape the experience around the business goal, then build it for speed, clarity and long-term use.":"من مواقع الشركات المركزة إلى تطبيقات الويب المخصصة، نصوغ التجربة حول هدف النشاط ثم نبنيها للسرعة والوضوح والاستخدام طويل المدى.","Product structure":"هيكل المنتج","A clear page and feature structure before development starts.":"هيكل واضح للصفحات والمزايا قبل بدء التطوير.","Responsive interface":"واجهة متجاوبة","A polished experience designed to work across desktop, tablet and mobile.":"تجربة متقنة تعمل على الكمبيوتر والتابلت والجوال.","Development":"التطوير","Clean implementation focused on performance, usability and maintainability.":"تنفيذ نظيف يركز على الأداء وسهولة الاستخدام وقابلية الصيانة.","Launch readiness":"جاهزية الإطلاق","Testing, deployment preparation and a clear handover for the next step.":"اختبارات وتجهيز للنشر وتسليم واضح للخطوة التالية.","Companies":"الشركات","New products":"المنتجات الجديدة","Existing platforms":"المنصات القائمة","Structure":"الهيكلة",
  "We design commerce experiences and operational systems around how customers buy and how teams actually work — keeping the flow clear from the interface to the business process behind it.":"نصمم تجارب التجارة والأنظمة التشغيلية حول طريقة شراء العملاء وطريقة عمل الفرق فعليًا، مع إبقاء التدفق واضحًا من الواجهة إلى العمليات خلفها.","Customer journey":"رحلة العميل","System structure":"هيكل النظام","Commerce experience":"تجربة التجارة","Operational view":"الرؤية التشغيلية","Retail businesses":"أنشطة التجزئة","Service operations":"عمليات الخدمات","Custom processes":"عمليات مخصصة","Map the flow":"رسم التدفق","Define the system":"تحديد النظام","Design & build":"التصميم والبناء","Test the process":"اختبار العملية",
  "We build focused brand identities that make a business feel intentional, consistent and credible across the places customers actually see it.":"نبني هويات بصرية مركزة تجعل النشاط يبدو مقصودًا ومتسقًا وموثوقًا في كل نقاط ظهوره أمام العملاء.","Visual direction":"التوجه البصري","Logo system":"نظام الشعار","Brand language":"لغة الهوية","Usage guidance":"إرشادات الاستخدام","New businesses":"الأعمال الجديدة","Growing brands":"العلامات النامية","Digital products":"المنتجات الرقمية","Direction":"الاتجاه","Systemize":"بناء النظام","Deliver":"التسليم",
  "We structure professional experience, projects and personal value into a cleaner CV and portfolio presence that is easier to understand and easier to trust.":"ننظم الخبرة والمشاريع والقيمة الشخصية في سيرة ومعرض أعمال أوضح وأسهل للفهم وبناء الثقة.","Content structure":"هيكلة المحتوى","CV presentation":"عرض السيرة الذاتية","Portfolio structure":"هيكلة معرض الأعمال","Digital presence":"الحضور الرقمي","Students & graduates":"الطلاب والخريجون","Professionals":"المحترفون","Specialists & freelancers":"المتخصصون والمستقلون","Review":"المراجعة","Prioritize":"تحديد الأولويات","Present":"العرض","Finalize":"الإنهاء",
  "SELECTED WORK":"أعمال مختارة","Built to work. Built to grow.":"مبنية للعمل. ومهيأة للنمو.","Each project begins with a real problem, a clear user and a result worth building toward.":"كل مشروع يبدأ بمشكلة حقيقية، ومستخدم واضح، ونتيجة تستحق البناء من أجلها.","View case study ↗":"عرض دراسة الحالة ↖","HOW WE THINK":"كيف نفكر","Products, not decoration.":"منتجات، لا مجرد زخرفة.","Our work is evaluated by clarity, usability, performance and how well it supports the business behind it.":"نقيّم عملنا بالوضوح وسهولة الاستخدام والأداء ومدى خدمته للنشاط خلفه.","Challenge":"التحدي","Approach":"المنهج","Product":"المنتج","Impact":"الأثر","Understand what needs to change.":"نفهم ما الذي يحتاج إلى التغيير.","Define the simplest strong solution.":"نحدد أبسط حل قوي.","Design and build for real use.":"نصمم ونبني للاستخدام الحقيقي.","Launch with a foundation for growth.":"نطلق على أساس يدعم النمو.","Your project can be the next line.":"مشروعك يمكن أن يكون الخط التالي.","Start with the idea. We will help shape the product.":"ابدأ بالفكرة، وسنساعدك على صياغة المنتج.",
  "Projects ↗":"المشاريع ↖","Build with us ↗":"ابنِ معنا ↖","All projects":"كل المشاريع","LINETECH / CASE STUDY":"LINETECH / دراسة حالة","OVERVIEW":"نظرة عامة","The product in one line.":"المنتج في خط واحد.","THE CHALLENGE":"التحدي","What needed to become clearer.":"ما الذي كان يحتاج إلى وضوح أكبر.","THE APPROACH":"المنهج","Structure before complexity.":"الهيكلة قبل التعقيد.","WHAT WE BUILT":"ما الذي بنيناه","The working parts.":"الأجزاء الفعالة.","The case study focuses on the product structure and implemented capabilities rather than invented performance claims.":"تركز دراسة الحالة على هيكل المنتج والقدرات المنفذة بدل ادعاءات أداء غير حقيقية.","TECHNOLOGY":"التقنية","Built on a practical stack.":"مبني على حزمة تقنية عملية.","Technology choices support the product requirements, maintainability and deployment needs.":"اختيارات التقنية تدعم متطلبات المنتج وقابلية الصيانة واحتياجات النشر.","YOUR NEXT PROJECT":"مشروعك التالي","Have a product that needs a clearer line?":"لديك منتج يحتاج إلى خط أوضح؟","Start with the problem. We will help shape the right product.":"ابدأ بالمشكلة، وسنساعدك على صياغة المنتج المناسب.",
  "A mobile-first commerce experience built around product discovery, faster ordering and a clearer operational flow for the store.":"تجربة تجارة إلكترونية تركز على الجوال، مبنية حول اكتشاف المنتجات وتسريع الطلبات وتدفق تشغيلي أوضح للمتجر.","Catalog & discovery":"الكتالوج والاكتشاف","Product experience":"تجربة المنتج","Order journey":"رحلة الطلب","Store operations":"عمليات المتجر","DISCOVERY":"اكتشاف","COMMERCE":"تجارة","ORDERS":"طلبات","OPERATIONS":"عمليات",
  "A services marketplace designed to make finding, comparing and requesting local services clearer for customers and easier to manage operationally.":"سوق خدمات مصمم لجعل العثور على الخدمات المحلية ومقارنتها وطلبها أوضح للعملاء وأسهل في الإدارة.","Service discovery":"اكتشاف الخدمات","Provider structure":"هيكلة مقدمي الخدمات","Customer journey":"رحلة العميل","Admin operations":"إدارة المنصة","TRUST":"ثقة","SERVICES":"خدمات","MARKETPLACE":"سوق",
  "A business system built to organize financial records, operational workflows and the information teams need to see clearly.":"نظام أعمال مبني لتنظيم السجلات المالية وسير العمل والمعلومات التي تحتاج الفرق إلى رؤيتها بوضوح.","Records structure":"هيكلة السجلات","Operational workflows":"سير العمل التشغيلي","Dashboard visibility":"وضوح لوحة التحكم","Scalable foundation":"أساس قابل للتوسع","RECORDS":"سجلات","WORKFLOWS":"سير عمل","VISIBILITY":"وضوح","SYSTEM":"نظام",
  "THE IDEA":"الفكرة","A line is the beginning of something real.":"الخط هو بداية شيء حقيقي.","An idea becomes useful when it is understood, defined, designed, built and launched. LINETECH exists to carry that journey from the first line to a working product.":"تصبح الفكرة مفيدة عندما تُفهم وتُحدد وتُصمم وتُبنى وتُطلق. وُجدت LINETECH لتحمل هذه الرحلة من الخط الأول إلى منتج يعمل فعليًا.","Today the company focuses on web development, commerce systems, brand identity and professional digital presence.":"تركز الشركة اليوم على تطوير الويب وأنظمة التجارة والهوية البصرية والحضور الرقمي المهني.","OUR PRINCIPLES":"مبادئنا","Clear thinking. Strong execution.":"تفكير واضح. تنفيذ قوي.","Clarity first.":"الوضوح أولًا.","Build for use.":"نبني للاستخدام.","Think long term.":"نفكر على المدى الطويل.","Stay disciplined.":"نحافظ على الانضباط.","FOUNDER":"المؤسس","Founder & CEO — LINETECH":"المؤسس والرئيس التنفيذي — LINETECH","FOUNDER STATEMENT":"كلمة المؤسس","Building for the long term.":"نبني للمدى الطويل.","THE LINE":"الخط","JOURNEY":"الرحلة","Idea":"الفكرة","YOUR IDEA":"فكرتك","What line do you want to start?":"ما الخط الذي تريد أن تبدأه؟","Bring the idea. We will help turn it into something real.":"أحضر الفكرة، وسنساعدك على تحويلها إلى شيء حقيقي.",
  "Tell us what you want to build.":"أخبرنا بما تريد بناءه.","Start with the idea — even if it is still rough. We will use the brief to turn it into a clear first line.":"ابدأ بالفكرة حتى لو كانت ما تزال أولية. سنستخدم الملخص لتحويلها إلى خط أول واضح.","Start the brief ↘":"ابدأ الملخص ↙","View services":"عرض الخدمات","PROJECT BRIEF":"ملخص المشروع","One clear line before we build.":"خط واحد واضح قبل أن نبدأ البناء.","Fill in what you know. You do not need technical knowledge or every answer yet.":"اكتب ما تعرفه. لا تحتاج إلى معرفة تقنية أو إلى امتلاك كل الإجابات الآن.","Your idea stays in your browser until you choose to copy or share it.":"تبقى فكرتك في متصفحك حتى تختار نسخها أو مشاركتها.","Three short steps help define the real size and direction of the project.":"ثلاث خطوات قصيرة تساعد في تحديد حجم المشروع واتجاهه الحقيقي.","You can start even if budget or timing are not defined yet.":"يمكنك البدء حتى لو لم تحدد الميزانية أو الموعد بعد.","WHAT HAPPENS NEXT":"ماذا يحدث بعد ذلك","A simple path forward.":"مسار بسيط إلى الأمام.","Once the brief is clear, the next step is defining the project and preparing the right execution plan.":"عندما يصبح الملخص واضحًا، تكون الخطوة التالية هي تحديد المشروع وإعداد خطة التنفيذ المناسبة.","Make the first line clear, then build from there.":"اجعل الخط الأول واضحًا، ثم ابنِ انطلاقًا منه.","Start now ↗":"ابدأ الآن ↖",
  "This brief stays on your device. Nothing is sent or stored by this form.":"يبقى هذا الملخص على جهازك. لا يتم إرسال أو تخزين أي شيء عبر هذا النموذج.","About you":"معلوماتك","Scope":"النطاق","01 / ABOUT YOU":"01 / معلوماتك","Who are we building with?":"مع من سنبني؟","Start with the essentials so the project has a clear owner and communication path.":"ابدأ بالأساسيات حتى يكون للمشروع مسؤول واضح وقناة تواصل محددة.","Your name *":"اسمك *","Your full name":"اسمك الكامل","Company / Brand":"الشركة / العلامة","Optional":"اختياري","Email or WhatsApp *":"البريد أو واتساب *","How should we reach you?":"كيف يمكننا التواصل معك؟","Preferred contact":"طريقة التواصل المفضلة","WhatsApp":"واتساب","Email":"البريد الإلكتروني","Call":"مكالمة","Either":"أي منهما","Project type *":"نوع المشروع *","Select a service":"اختر خدمة","Continue to project":"الانتقال إلى المشروع","02 / THE PROJECT":"02 / المشروع","What needs to become real?":"ما الذي يجب أن يتحول إلى واقع؟","Tell us the goal, current stage and the few things the solution must do well.":"أخبرنا بالهدف والمرحلة الحالية وأهم الأشياء التي يجب أن ينجزها الحل جيدًا.","Project stage *":"مرحلة المشروع *","Select current stage":"اختر المرحلة الحالية","Main goal *":"الهدف الرئيسي *","Select the main outcome":"اختر النتيجة الرئيسية","What do you want to build? *":"ماذا تريد أن تبني؟ *","Describe the idea, problem and final result.":"صف الفكرة والمشكلة والنتيجة النهائية.","Who is it for?":"لمن هذا المشروع؟","Customers, companies, a team, recruiters, a specific market...":"عملاء، شركات، فريق، جهات توظيف، سوق محدد...","Must-have features":"المزايا الأساسية","List the 3–5 things the project cannot work without.":"اذكر 3–5 أشياء لا يمكن للمشروع العمل بدونها.","Existing links / references":"روابط / مراجع موجودة","Current site, competitor links or examples you like.":"الموقع الحالي أو روابط منافسين أو أمثلة تعجبك.","← Back":"رجوع →","Continue to scope":"الانتقال إلى النطاق","03 / SCOPE":"03 / النطاق","How should we frame the first move?":"كيف نحدد الخطوة الأولى؟","These details help separate a small focused engagement from a larger product build.":"تساعد هذه التفاصيل على التفريق بين مشروع صغير ومركز وبين بناء منتج أكبر.","Budget range":"نطاق الميزانية","Launch timing":"موعد الإطلاق","Anything else we should know?":"هل هناك شيء آخر يجب أن نعرفه؟","Constraints, preferences, deadlines or context.":"قيود أو تفضيلات أو مواعيد نهائية أو سياق إضافي.","Service":"الخدمة","Stage":"المرحلة","Goal":"الهدف","Timing":"الوقت","READY BRIEF":"الملخص جاهز","Your first line is ready.":"خطك الأول جاهز.","Review, copy or share this brief when you are ready to continue with LINETECH.":"راجع الملخص أو انسخه أو شاركه عندما تكون مستعدًا للمتابعة مع LINETECH.","Copy project brief":"نسخ ملخص المشروع","Copied ✓":"تم النسخ ✓","Share brief":"مشاركة الملخص","Preview next step":"معاينة الخطوة التالية","← Back to project":"العودة إلى المشروع →",
  "New idea":"فكرة جديدة","Existing project":"مشروع قائم","Redesign / rebuild":"إعادة تصميم / بناء","Improve an existing system":"تحسين نظام قائم","Sell / generate leads":"بيع / جذب عملاء محتملين","Bookings / requests":"حجوزات / طلبات","Internal operations":"عمليات داخلية","Build credibility":"بناء المصداقية","Career / portfolio":"مسار مهني / معرض أعمال","Other":"أخرى","Need guidance":"أحتاج إرشادًا","Small focused project":"مشروع صغير ومحدد","Medium project":"مشروع متوسط","Large project":"مشروع كبير","ASAP":"في أقرب وقت","1–2 months":"شهر إلى شهرين","3+ months":"3 أشهر أو أكثر","Flexible":"مرن",
  "Clear answers before we build.":"إجابات واضحة قبل أن نبدأ البناء.","Common questions about scope, payments, revisions, launch and the way LINETECH approaches project work.":"أسئلة شائعة حول النطاق والمدفوعات والتعديلات والإطلاق وطريقة LINETECH في إدارة المشاريع.","WORKING TOGETHER":"العمل معًا","Keep the process clear from the first line.":"حافظ على وضوح العملية من الخط الأول.","If your question is specific to your project, prepare the brief first, then share it through your preferred contact channel.":"إذا كان سؤالك خاصًا بمشروعك، جهّز الملخص أولًا ثم شاركه عبر قناة التواصل التي تفضلها.","How do we start a project?":"كيف نبدأ مشروعًا؟","Do I need a complete specification before contacting LINETECH?":"هل أحتاج إلى مواصفات كاملة قبل التواصل مع LINETECH؟","How are payments usually structured?":"كيف تُقسم المدفوعات عادة؟","How long does a project take?":"كم يستغرق المشروع؟","Can the scope change after work begins?":"هل يمكن تغيير النطاق بعد بدء العمل؟","Are revisions included?":"هل التعديلات مشمولة؟","Who handles hosting and deployment?":"من يتولى الاستضافة والنشر؟","What happens after launch?":"ماذا يحدث بعد الإطلاق؟",
  "PRIVACY":"الخصوصية","TERMS":"الشروط","01 / PRIVACY":"01 / الخصوصية","02 / TERMS":"02 / الشروط","Your information should stay clear and controlled.":"يجب أن تبقى معلوماتك واضحة وتحت سيطرتك.","This page explains how information is handled when you use the LINETECH website and project brief.":"توضح هذه الصفحة كيفية التعامل مع المعلومات عند استخدام موقع LINETECH وملخص المشروع.","Clear expectations make better work.":"التوقعات الواضحة تصنع عملًا أفضل.","These terms cover use of the LINETECH website. Individual projects are governed by the scope and agreement accepted for that project.":"تغطي هذه الشروط استخدام موقع LINETECH، بينما تخضع المشاريع الفردية للنطاق والاتفاق المعتمد لكل مشروع.","LAST UPDATED":"آخر تحديث","September 2026":"سبتمبر 2026","Information you choose to provide":"المعلومات التي تختار تقديمها","Technical website data":"البيانات التقنية للموقع","Information you send directly":"المعلومات التي ترسلها مباشرة","Sharing and selling":"المشاركة والبيع","Retention":"الاحتفاظ بالبيانات","Changes to this page":"التغييرات على هذه الصفحة","Website use":"استخدام الموقع","Information on the website":"المعلومات على الموقع","Project proposals and scope":"عروض المشاريع ونطاقها","Payments":"المدفوعات","Client materials and approvals":"مواد العميل والموافقات","Intellectual property and handover":"الملكية الفكرية والتسليم","External services":"الخدمات الخارجية","Changes":"التغييرات",
  "LINETECH / ACCESS":"LINETECH / الدخول","Your work. One clear line.":"عملك. خط واحد واضح.","Sign in if you already have an account, or create one to prepare your LINETECH client workspace.":"سجّل الدخول إذا كان لديك حساب، أو أنشئ حسابًا لتجهيز مساحة عملك مع LINETECH.","PROJECT ACCESS":"الوصول للمشروع","CLEAR STATUS":"حالة واضحة","ONE WORKSPACE":"مساحة عمل واحدة","Need to start a project first?":"تريد بدء مشروع أولًا؟","Sign in":"تسجيل الدخول","Create account":"إنشاء حساب","CLIENT ACCESS":"دخول العميل","NEW ACCOUNT":"حساب جديد","Welcome back.":"مرحبًا بعودتك.","Create your workspace.":"أنشئ مساحة عملك.","Enter your account details to continue.":"أدخل بيانات حسابك للمتابعة.","Create an account to prepare for your LINETECH client workspace.":"أنشئ حسابًا لتجهيز مساحة عمل العميل في LINETECH.","Full name":"الاسم الكامل","Email address":"البريد الإلكتروني","Password":"كلمة المرور","Enter your password":"أدخل كلمة المرور","Create a password":"أنشئ كلمة مرور","Confirm password":"تأكيد كلمة المرور","Repeat your password":"أعد كتابة كلمة المرور","Remember me":"تذكرني","Forgot password?":"نسيت كلمة المرور؟","Frontend preview only — account data and credentials are not sent or stored yet.":"معاينة واجهة فقط — لا يتم إرسال أو تخزين بيانات الحساب أو معلومات الدخول حاليًا.",
  "Chats":"المحادثات","Search or start new chat":"ابحث أو ابدأ محادثة جديدة","LINETECH Project Team":"فريق مشاريع LINETECH","Preview mode":"وضع المعاينة","Messages stay on this device":"الرسائل تبقى على هذا الجهاز","Company conversation":"محادثة مع الشركة","PREVIEW":"معاينة","Messages, photos, documents and real voice notes work locally now. Realtime delivery starts when authentication and the backend are connected.":"الرسائل والصور والمستندات والرسائل الصوتية تعمل محليًا الآن. يبدأ الإرسال الفوري عند ربط تسجيل الدخول والـBackend.","This frontend preview stays on your device.":"تبقى هذه المعاينة على جهازك.","TODAY":"اليوم","Start a conversation":"ابدأ محادثة","Message deleted":"تم حذف الرسالة","Photo":"صورة","Voice message":"رسالة صوتية","Document":"مستند","Message":"رسالة","You: ":"أنت: ","Edit message":"تعديل الرسالة","Delete for everyone":"حذف لدى الطرفين","This message was deleted for everyone.":"تم حذف هذه الرسالة لدى الطرفين.","Drop files here":"أفلت الملفات هنا","Photos and documents will be added to this conversation":"ستتم إضافة الصور والمستندات إلى هذه المحادثة","Editing message":"تعديل الرسالة","Photos":"الصور","Upload up to 4 images":"ارفع حتى 4 صور","PDF, Word, Excel and more":"PDF وWord وExcel وغيرها","Recording real voice":"جارٍ تسجيل صوت حقيقي","Type a message":"اكتب رسالة","Edit your message":"عدّل رسالتك","Emoji picker can be connected in the next UI pass.":"يمكن إضافة منتقي الإيموجي في مرحلة الواجهة التالية.","Saved on this device only — realtime delivery will start when the chat backend is connected.":"تم الحفظ على هذا الجهاز فقط — سيبدأ الإرسال الفوري عند ربط Backend المحادثة.","Message edited in this local preview.":"تم تعديل الرسالة في هذه المعاينة المحلية.","Deleted for everyone in this frontend preview. Realtime deletion will be enforced when the backend is connected.":"تم الحذف لدى الطرفين في هذه المعاينة. سيصبح الحذف متزامنًا فعليًا عند ربط الـBackend.","Preparing image…":"جارٍ تجهيز الصورة…","This image could not be opened in the preview.":"تعذر فتح هذه الصورة في المعاينة.","Voice recording is not available in this browser.":"تسجيل الصوت غير متاح في هذا المتصفح.","Microphone permission is needed to record a real voice message.":"يلزم السماح باستخدام الميكروفون لتسجيل رسالة صوتية حقيقية.","Voice recording cancelled.":"تم إلغاء التسجيل الصوتي.","Voice note could not be prepared.":"تعذر تجهيز الرسالة الصوتية.","Local preview conversation cleared.":"تم مسح محادثة المعاينة المحلية.","Pause voice message":"إيقاف الرسالة الصوتية مؤقتًا","Play voice message":"تشغيل الرسالة الصوتية","Search conversation":"بحث في المحادثة","Conversation menu":"قائمة المحادثة","Message actions":"خيارات الرسالة","Download document":"تنزيل المستند","Cancel editing":"إلغاء التعديل","Cancel voice recording":"إلغاء التسجيل الصوتي","Send voice recording":"إرسال التسجيل الصوتي","Add attachment":"إضافة مرفق","Send message":"إرسال الرسالة","Save edit":"حفظ التعديل","Record voice message":"تسجيل رسالة صوتية",
  "THANK YOU":"شكرًا لك","01 / NEXT LINE":"01 / الخط التالي","Frontend preview only — no project data has been submitted or stored.":"معاينة واجهة فقط — لم يتم إرسال أو تخزين أي بيانات للمشروع.","This is the confirmation experience LINETECH can use once the final submission flow is connected later. For now, keep your brief ready and use the copy or share actions from the project form.":"هذه هي تجربة التأكيد التي يمكن لـLINETECH استخدامها بعد ربط الإرسال النهائي لاحقًا. حاليًا احتفظ بملخصك جاهزًا واستخدم النسخ أو المشاركة من نموذج المشروع.","Back to Project Brief ↗":"العودة إلى ملخص المشروع ↖","Brief":"الملخص","Your idea is structured into a clear starting point.":"تم تنظيم فكرتك في نقطة بداية واضحة.","Scope, priorities and the right solution are clarified.":"يتم توضيح النطاق والأولويات والحل المناسب.","Execution begins once the project direction is agreed.":"يبدأ التنفيذ بعد الاتفاق على اتجاه المشروع.",
  "404 / LINE NOT FOUND":"404 / الخط غير موجود","This line goes nowhere.":"هذا الخط لا يقود إلى مكان.","The page may have moved, the address may be wrong, or the route does not exist yet. Start again from a clear line.":"قد تكون الصفحة نُقلت أو العنوان غير صحيح أو المسار غير موجود بعد. ابدأ من جديد بخط واضح.","Back to Home ↗":"العودة للرئيسية ↖",
  "→":"←","↗":"↖","↘":"↙"
};

const originalText = new WeakMap<Text,string>();
const originalAttributes = new WeakMap<Element,Map<string,string>>();
const attributes = ["placeholder","title","aria-label"] as const;

function normalize(value:string){return value.trim().replace(/\s+/g," ");}

function translateKnown(value:string){
  const key = normalize(value);
  if(AR[key]) return AR[key];
  const step = key.match(/^Step (\d+) of 3$/);
  if(step) return `الخطوة ${step[1]} من 3`;
  const largeFile = key.match(/^(.+) is larger than 5 MB\. Keep preview documents smaller until cloud storage is connected\.$/);
  if(largeFile) return `${largeFile[1]} أكبر من 5 MB. استخدم مستندًا أصغر في المعاينة حتى يتم ربط التخزين السحابي.`;
  const cannotOpen = key.match(/^(.+) could not be opened in the preview\.$/);
  if(cannotOpen) return `تعذر فتح ${cannotOpen[1]} في المعاينة.`;
  return null;
}

function withWhitespace(source:string,replacement:string){
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  return `${leading}${replacement}${trailing}`;
}

function skipText(node:Text){
  const parent = node.parentElement;
  if(!parent) return true;
  if(parent.closest("script,style,noscript,code,pre,[data-no-translate]")) return true;
  if(parent.matches(".chat-message-row.client .chat-bubble > p")) return true;
  return false;
}

function applyText(node:Text,language:Language){
  if(skipText(node)) return;
  const current = node.nodeValue || "";
  const saved = originalText.get(node);
  if(language === "en"){
    if(saved !== undefined && current !== saved) node.nodeValue = saved;
    return;
  }
  const translated = translateKnown(current);
  if(translated){
    originalText.set(node,current);
    const next = withWhitespace(current,translated);
    if(current !== next) node.nodeValue = next;
  }
}

function applyAttribute(element:Element,name:string,language:Language){
  if(element.closest("[data-no-translate]")) return;
  const current = element.getAttribute(name);
  if(current === null) return;
  let savedMap = originalAttributes.get(element);
  if(!savedMap){savedMap = new Map();originalAttributes.set(element,savedMap);}
  if(language === "en"){
    const saved = savedMap.get(name);
    if(saved !== undefined && current !== saved) element.setAttribute(name,saved);
    return;
  }
  const translated = translateKnown(current);
  if(translated){
    savedMap.set(name,current);
    if(current !== translated) element.setAttribute(name,translated);
  }
}

function translateTree(root:Node,language:Language){
  if(root.nodeType === Node.TEXT_NODE){applyText(root as Text,language);return;}
  if(root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
  const scope = root as ParentNode;
  const walker = document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
  let node:Node | null;
  while((node = walker.nextNode())) applyText(node as Text,language);
  if(root.nodeType === Node.ELEMENT_NODE){
    const el = root as Element;
    attributes.forEach(name=>applyAttribute(el,name,language));
  }
  scope.querySelectorAll?.("[placeholder],[title],[aria-label]").forEach(el=>attributes.forEach(name=>applyAttribute(el,name,language)));
}

function translateTitle(language:Language){
  const current = document.title;
  const english = current.replace(/ — LINETECH$/,"" );
  if(language === "en") return;
  const translated = translateKnown(english);
  if(translated) document.title = `${translated} — LINETECH`;
}

function setDocumentLanguage(language:Language){
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.dataset.language = language;
  document.body.dataset.language = language;
  (window as Window & {__LINETECH_LANGUAGE__?:Language}).__LINETECH_LANGUAGE__ = language;
}

export default function LanguageBridge(){
  useLayoutEffect(()=>{
    let language:Language = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "ar";
    let applying = false;

    const apply = (next:Language)=>{
      language = next;
      applying = true;
      setDocumentLanguage(language);
      translateTree(document.body,language);
      translateTitle(language);
      applying = false;
    };

    apply(language);

    const observer = new MutationObserver(mutations=>{
      if(applying) return;
      applying = true;
      for(const mutation of mutations){
        if(mutation.type === "characterData") applyText(mutation.target as Text,language);
        mutation.addedNodes.forEach(node=>translateTree(node,language));
        if(mutation.type === "attributes" && mutation.target instanceof Element && mutation.attributeName){
          applyAttribute(mutation.target,mutation.attributeName,language);
        }
      }
      translateTitle(language);
      applying = false;
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:[...attributes]});

    const onLanguage = (event:Event)=>{
      const detail = (event as CustomEvent<{language?:Language}>).detail;
      const next:Language = detail?.language === "en" ? "en" : "ar";
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY,next);
      apply(next);
    };
    window.addEventListener(LANGUAGE_EVENT,onLanguage as EventListener);

    return ()=>{
      observer.disconnect();
      window.removeEventListener(LANGUAGE_EVENT,onLanguage as EventListener);
    };
  },[]);

  return null;
}
