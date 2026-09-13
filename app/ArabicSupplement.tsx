"use client";

import { useLayoutEffect } from "react";

const EXTRA: Record<string,string> = {
  "We combine clear product thinking, design and engineering to turn ideas into useful digital products.":"نجمع بين التفكير الواضح في المنتج والتصميم والهندسة لتحويل الأفكار إلى منتجات رقمية مفيدة.",
  "CLEAN":"نظيف","MINIMAL":"بسيط","TECHNICAL":"تقني","IMPACTFUL":"مؤثر","FAST":"سريع","CLEAR":"واضح","RESPONSIVE":"متجاوب","SCALABLE":"قابل للتوسع","FLOW":"تدفق","IDENTITY":"هوية","CONSISTENCY":"اتساق","CLARITY":"وضوح","PROFILE":"ملف شخصي","WORK":"أعمال","VALUE":"قيمة","PRESENCE":"حضور",
  "Every engagement follows one clear line so scope, expectations and execution stay aligned.":"يتبع كل مشروع خطًا واضحًا واحدًا حتى يبقى النطاق والتوقعات والتنفيذ متوافقة.",
  "Selected work that represents LINETECH's direction: practical products, clear systems and experiences built for real use.":"أعمال مختارة تمثل توجه LINETECH: منتجات عملية، وأنظمة واضحة، وتجارب مبنية للاستخدام الحقيقي.",
  "A mobile-first commerce platform focused on product discovery, customer journeys and operational order flow.":"منصة تجارة إلكترونية تركز على الجوال واكتشاف المنتجات ورحلة العميل وتدفق الطلبات التشغيلي.",
  "A service marketplace concept structured around discovery, trust, categories and scalable operations.":"مفهوم لسوق خدمات مبني حول الاكتشاف والثقة والتصنيفات وعمليات قابلة للتوسع.",
  "A business platform focused on financial records, workflows and clearer operational visibility.":"منصة أعمال تركز على السجلات المالية وسير العمل ووضوح العمليات.",
  "Challenge":"التحدي","Approach":"المنهج","Product":"المنتج","Impact":"الأثر",
  "LINETECH is a technology company focused on turning clear ideas into real digital products through disciplined design, engineering and execution.":"LINETECH شركة تقنية تركز على تحويل الأفكار الواضحة إلى منتجات رقمية حقيقية عبر تصميم وهندسة وتنفيذ منضبط.",
  "We keep the company focused on practical principles that improve every project from the first conversation to launch.":"نبقي الشركة مركزة على مبادئ عملية تحسن كل مشروع من أول محادثة حتى الإطلاق.",
  "We define the real problem before choosing the technology.":"نحدد المشكلة الحقيقية قبل اختيار التقنية.",
  "A product is only successful when it works in the real world.":"لا يكون المنتج ناجحًا إلا عندما يعمل في العالم الحقيقي.",
  "Every project should leave behind a stronger foundation.":"يجب أن يترك كل مشروع خلفه أساسًا أقوى.",
  "Design, scope and execution should serve the outcome.":"يجب أن يخدم التصميم والنطاق والتنفيذ النتيجة المطلوبة.",
  "LINETECH is being built as a long-term technology company focused on useful products, strong systems and work that performs beyond the presentation.":"نبني LINETECH كشركة تقنية طويلة المدى تركز على منتجات مفيدة وأنظمة قوية وعمل يتجاوز مجرد العرض.",
  "One continuous journey keeps the work simple, understandable and accountable.":"رحلة واحدة متصلة تبقي العمل بسيطًا ومفهومًا وقابلًا للمساءلة.",
  "Start with the real idea.":"ابدأ بالفكرة الحقيقية.","Make the problem and scope clear.":"اجعل المشكلة والنطاق واضحين.","Shape the right product experience.":"صغ تجربة المنتج المناسبة.","Turn the line into something real.":"حوّل الخط إلى شيء حقيقي.",

  "A professional digital presence that explains the business clearly and converts interest into action.":"حضور رقمي احترافي يشرح النشاط بوضوح ويحوّل الاهتمام إلى إجراء.",
  "A strong first version for an idea that needs to become a usable web product.":"نسخة أولى قوية لفكرة تحتاج أن تتحول إلى منتج ويب قابل للاستخدام.",
  "A clearer, faster or more structured experience for a website that has outgrown its current form.":"تجربة أوضح وأسرع وأكثر تنظيمًا لموقع تجاوز شكله الحالي.",
  "We define the audience, goal and the real job the website needs to do.":"نحدد الجمهور والهدف والوظيفة الحقيقية التي يجب أن يؤديها الموقع.",
  "We shape pages, flows and priorities before visual design begins.":"نحدد الصفحات والتدفقات والأولويات قبل بدء التصميم البصري.",
  "We develop, refine and test the experience across the required screens.":"نطور التجربة ونصقلها ونختبرها على الشاشات المطلوبة.",
  "We prepare deployment, final checks and the handover for ongoing use.":"نجهز النشر والفحوصات النهائية والتسليم للاستخدام المستمر.",

  "A clear path from discovery to the action that matters, without unnecessary friction.":"مسار واضح من الاكتشاف إلى الإجراء المهم دون احتكاك غير ضروري.",
  "Roles, screens, states and workflows organized around the way the business operates.":"أدوار وشاشات وحالات وسير عمل منظم حول طريقة عمل النشاط.",
  "Product, cart, checkout or ordering flows shaped for clarity and practical use.":"تدفقات المنتج والسلة والدفع أو الطلب مصممة للوضوح والاستخدام العملي.",
  "Dashboards and management flows that make the system easier to run after launch.":"لوحات تحكم وتدفقات إدارة تجعل تشغيل النظام أسهل بعد الإطلاق.",
  "Stores that need a stronger digital buying experience and a clearer order flow.":"متاجر تحتاج إلى تجربة شراء رقمية أقوى وتدفق طلبات أوضح.",
  "Businesses that need booking, requests, dashboards or structured internal workflows.":"أنشطة تحتاج حجوزات أو طلبات أو لوحات تحكم أو سير عمل داخلي منظم.",
  "Teams using manual or disconnected steps that can be turned into one focused system.":"فرق تستخدم خطوات يدوية أو منفصلة يمكن تحويلها إلى نظام واحد مركز.",
  "We understand the customer journey and the operational steps behind it.":"نفهم رحلة العميل والخطوات التشغيلية التي تقف خلفها.",
  "We clarify roles, states, screens and the minimum useful scope.":"نوضح الأدوار والحالات والشاشات والحد الأدنى المفيد من النطاق.",
  "We shape the interface and implement the agreed workflows.":"نصوغ الواجهة وننفذ سير العمل المتفق عليه.",
  "We validate the end-to-end flow and prepare the system for real use.":"نتحقق من التدفق الكامل ونجهز النظام للاستخدام الحقيقي.",

  "A focused look and feel that matches the business, audience and positioning.":"مظهر وتوجه بصري مركز يتناسب مع النشاط والجمهور وموقع العلامة.",
  "A practical logo direction with the core versions needed for real-world use.":"توجه عملي للشعار مع النسخ الأساسية المطلوبة للاستخدام الواقعي.",
  "Typography, color and graphic rules that keep the identity consistent.":"قواعد الخطوط والألوان والعناصر الرسومية التي تحافظ على اتساق الهوية.",
  "A simple system that makes future design decisions easier and more coherent.":"نظام بسيط يجعل قرارات التصميم المستقبلية أسهل وأكثر اتساقًا.",
  "A strong first identity for a company that needs to enter the market with clarity.":"هوية أولى قوية لشركة تحتاج دخول السوق بوضوح.",
  "A more consistent system for a business whose current visuals no longer match its direction.":"نظام أكثر اتساقًا لنشاط لم تعد هويته الحالية تعكس توجهه.",
  "A visual foundation that can move naturally across a website, product and social presence.":"أساس بصري ينتقل بسلاسة عبر الموقع والمنتج والحضور على الشبكات الاجتماعية.",
  "We clarify the business, audience, tone and what the identity needs to communicate.":"نوضح النشاط والجمهور والنبرة وما يجب أن تعبّر عنه الهوية.",
  "We define the visual territory before refining individual elements.":"نحدد المجال البصري قبل صقل العناصر الفردية.",
  "We turn the direction into a repeatable logo, type, color and graphic system.":"نحوّل التوجه إلى نظام متكرر للشعار والخطوط والألوان والعناصر الرسومية.",
  "We prepare the agreed assets and practical guidance for consistent use.":"نجهز الأصول المتفق عليها وإرشادات عملية للاستخدام المتسق.",

  "Experience, skills and projects organized around what matters most to the target opportunity.":"تنظيم الخبرة والمهارات والمشاريع حول ما يهم أكثر للفرصة المستهدفة.",
  "A clean professional document with stronger hierarchy, readability and consistency.":"وثيقة احترافية نظيفة بتسلسل بصري ووضوح واتساق أقوى.",
  "A focused way to present selected work, responsibilities and project context.":"طريقة مركزة لعرض الأعمال المختارة والمسؤوليات وسياق المشاريع.",
  "A clearer foundation for presenting the same professional story across relevant channels.":"أساس أوضح لعرض القصة المهنية نفسها عبر القنوات المناسبة.",
  "A first professional presentation that turns academic and project work into a clearer story.":"عرض مهني أول يحول العمل الأكاديمي والمشاريع إلى قصة أوضح.",
  "A stronger CV or portfolio when experience has grown but the current presentation has not.":"سيرة أو معرض أعمال أقوى عندما تنمو الخبرة بينما يبقى العرض الحالي كما هو.",
  "A focused portfolio that helps clients or employers understand capabilities quickly.":"معرض أعمال مركز يساعد العملاء أو أصحاب العمل على فهم القدرات بسرعة.",
  "We understand the target role, current material and strongest experience.":"نفهم الدور المستهدف والمواد الحالية وأقوى الخبرات.",
  "We decide what should lead, what supports it and what can be removed.":"نحدد ما يجب أن يتصدر، وما يدعمه، وما يمكن إزالته.",
  "We build the hierarchy, wording structure and visual presentation.":"نبني التسلسل وهيكل الصياغة والعرض البصري.",
  "We refine consistency and prepare the agreed files for practical use.":"نصقل الاتساق ونجهز الملفات المتفق عليها للاستخدام العملي.",

  "Flamingo Park brings the catalog, product detail, filtering, ordering and store management into one focused digital experience designed for customers using mobile first.":"يجمع Flamingo Park الكتالوج وتفاصيل المنتج والتصفية والطلبات وإدارة المتجر في تجربة رقمية واحدة مركزة ومصممة للجوال أولًا.",
  "The product needed to make a large catalog easier to browse while reducing friction around product choices, orders and the operational work behind them.":"كان المنتج بحاجة إلى جعل الكتالوج الكبير أسهل في التصفح مع تقليل التعقيد في خيارات المنتجات والطلبات والعمل التشغيلي خلفها.",
  "The experience was structured around fast discovery, clear product information, responsive interaction and an admin flow that keeps catalog and order work manageable.":"تمت هيكلة التجربة حول الاكتشاف السريع ومعلومات المنتج الواضحة والتفاعل المتجاوب وتدفق إدارة يجعل الكتالوج والطلبات أسهل في التشغيل.",
  "Categories, brands, filtering and product browsing structured for a growing catalog.":"تصنيفات وعلامات وتصفية وتصفح منتجات مهيأة لكتالوج متنامٍ.",
  "Product detail flows for images, sizes, colors, availability and purchase actions.":"تدفقات لتفاصيل المنتج تشمل الصور والمقاسات والألوان والتوفر وإجراءات الشراء.",
  "A clearer path from product selection to order confirmation and customer follow-up.":"مسار أوضح من اختيار المنتج إلى تأكيد الطلب ومتابعة العميل.",
  "Admin tools for products, content, customers, orders and store configuration.":"أدوات إدارة للمنتجات والمحتوى والعملاء والطلبات وإعدادات المتجر.",

  "Etqan organizes providers, categories and service requests into one marketplace experience, with the structure needed to support both customer discovery and platform administration.":"ينظم إتقان مقدمي الخدمات والتصنيفات وطلبات الخدمة في تجربة سوق واحدة، مع الهيكل اللازم لدعم اكتشاف العملاء وإدارة المنصة.",
  "A services marketplace has to make many providers and categories feel simple, while still creating enough structure for trust, discovery and future growth.":"يجب أن يجعل سوق الخدمات كثرة مقدمي الخدمات والتصنيفات بسيطة، مع الحفاظ على هيكل كافٍ للثقة والاكتشاف والنمو المستقبلي.",
  "The product was shaped around clear categories, provider visibility, focused customer journeys and an admin structure that can support the marketplace as it expands.":"تم تشكيل المنتج حول تصنيفات واضحة وظهور مقدمي الخدمات ورحلات عميل مركزة وهيكل إدارة يدعم توسع السوق.",
  "Category-driven browsing that helps customers move from a need to relevant providers.":"تصفح قائم على التصنيفات يساعد العملاء على الانتقال من الحاجة إلى مقدمي الخدمة المناسبين.",
  "A consistent way to present service providers, details and the information customers need.":"طريقة متسقة لعرض مقدمي الخدمات والتفاصيل والمعلومات التي يحتاجها العملاء.",
  "Flows for discovering, reviewing and moving toward a service request with less confusion.":"تدفقات للاكتشاف والمراجعة والانتقال إلى طلب الخدمة بوضوح أكبر.",
  "Management areas for marketplace content, providers, customers and platform structure.":"مساحات إدارة لمحتوى السوق ومقدمي الخدمات والعملاء وهيكل المنصة.",

  "LedgerPro brings core business records and workflows into a structured web platform so information is easier to manage, review and extend as operational needs grow.":"يجمع LedgerPro سجلات الأعمال الأساسية وسير العمل في منصة ويب منظمة لتسهيل إدارة المعلومات ومراجعتها وتوسيعها مع نمو الاحتياجات التشغيلية.",
  "Business records become difficult to manage when information is spread across manual steps, disconnected files and inconsistent workflows.":"تصبح سجلات الأعمال صعبة الإدارة عندما تتوزع المعلومات بين خطوات يدوية وملفات منفصلة وسير عمل غير متسق.",
  "The system was structured around clear entities, repeatable workflows and a practical interface that keeps operational data easier to understand and maintain.":"تمت هيكلة النظام حول كيانات واضحة وسير عمل متكرر وواجهة عملية تجعل البيانات التشغيلية أسهل للفهم والصيانة.",
  "Core business and financial records organized into a consistent system.":"تنظيم سجلات الأعمال والسجلات المالية الأساسية في نظام متسق.",
  "Repeatable flows for creating, updating and reviewing day-to-day information.":"تدفقات متكررة لإنشاء المعلومات اليومية وتحديثها ومراجعتها.",
  "Focused views that surface the information needed for clearer operational awareness.":"واجهات مركزة تُظهر المعلومات المطلوبة لرؤية تشغيلية أوضح.",
  "A web architecture that can support additional business capabilities as requirements develop.":"بنية ويب يمكنها دعم قدرات أعمال إضافية مع تطور المتطلبات.",

  "Start with the project brief. You can explain the idea in simple language; technical details can be defined after the goal and scope are clear.":"ابدأ بملخص المشروع. يمكنك شرح الفكرة بلغة بسيطة، ويمكن تحديد التفاصيل التقنية بعد وضوح الهدف والنطاق.",
  "No. A rough idea is enough to begin the conversation. The first step is understanding the outcome, then defining the useful scope.":"لا. تكفي فكرة أولية لبدء المحادثة. الخطوة الأولى هي فهم النتيجة المطلوبة ثم تحديد النطاق المفيد.",
  "For project work, the standard structure is 40% to begin, 30% during the project and 30% before final handover, unless a different structure is agreed for the project.":"في أعمال المشاريع، التقسيم القياسي هو 40% للبدء، و30% أثناء المشروع، و30% قبل التسليم النهائي، ما لم يتم الاتفاق على تقسيم مختلف.",
  "Timing depends on the type of work, scope, content readiness and feedback speed. The schedule is defined after the project is understood rather than promising one fixed duration for every project.":"يعتمد الوقت على نوع العمل والنطاق وجاهزية المحتوى وسرعة الملاحظات. يتم تحديد الجدول بعد فهم المشروع بدل وعد مدة ثابتة لكل المشاريع.",
  "Yes, but changes that affect the agreed scope, timeline or deliverables are reviewed before they are added so the project stays controlled.":"نعم، لكن التغييرات التي تؤثر في النطاق أو الجدول أو المخرجات المتفق عليها تتم مراجعتها قبل إضافتها حتى يبقى المشروع منضبطًا.",
  "Revisions are handled within the agreed project scope. The exact review stages and what is included are defined before execution begins.":"تتم التعديلات ضمن نطاق المشروع المتفق عليه، وتُحدد مراحل المراجعة وما هو مشمول قبل بدء التنفيذ.",
  "For web projects, deployment can be prepared as part of the project. The exact hosting setup depends on the product and is agreed during planning.":"في مشاريع الويب يمكن تجهيز النشر كجزء من المشروع. يعتمد إعداد الاستضافة على المنتج ويتم الاتفاق عليه أثناء التخطيط.",
  "The handover includes the agreed project assets and launch state. Ongoing maintenance or support can be scoped separately when needed.":"يشمل التسليم أصول المشروع المتفق عليها وحالة الإطلاق، ويمكن تحديد الصيانة أو الدعم المستمر بشكل منفصل عند الحاجة.",

  "The current project brief is designed to keep your typed content in the browser until you choose to copy or share it.":"تم تصميم ملخص المشروع الحالي ليبقي المحتوى الذي تكتبه داخل المتصفح حتى تختار نسخه أو مشاركته.",
  "1. Information you choose to provide":"1. المعلومات التي تختار تقديمها","2. Technical website data":"2. البيانات التقنية للموقع","3. Information you send directly":"3. المعلومات التي ترسلها مباشرة","4. Sharing and selling":"4. المشاركة والبيع","5. Retention":"5. الاحتفاظ بالبيانات","6. Changes to this page":"6. التغييرات على هذه الصفحة",
  "If you use the project brief, you may enter information about yourself, your business or a project. The current brief does not intentionally send that content to LINETECH automatically; it remains in your browser until you choose a copy or share action.":"إذا استخدمت ملخص المشروع فقد تدخل معلومات عنك أو عن نشاطك أو مشروعك. لا يرسل الملخص الحالي هذا المحتوى تلقائيًا إلى LINETECH؛ بل يبقى في متصفحك حتى تختار النسخ أو المشاركة.",
  "Like most hosted websites, infrastructure providers may process technical request information needed to deliver and secure the site, such as IP address, browser information, timestamps and request logs. LINETECH does not use this page to claim access to data it does not actually receive.":"مثل أغلب المواقع المستضافة، قد يعالج مزودو البنية التحتية معلومات تقنية لازمة لتقديم الموقع وتأمينه مثل عنوان IP ومعلومات المتصفح والتوقيتات وسجلات الطلبات. لا تدعي LINETECH عبر هذه الصفحة الوصول إلى بيانات لا تستلمها فعليًا.",
  "If you choose to send project information to LINETECH through a communication channel, that information may be used to understand your request, respond to you, prepare a project scope and manage the working relationship.":"إذا اخترت إرسال معلومات المشروع إلى LINETECH عبر قناة تواصل، فقد تُستخدم لفهم طلبك والرد عليك وإعداد نطاق المشروع وإدارة علاقة العمل.",
  "LINETECH does not intend to sell personal information. Information may only be processed by service providers where needed to operate the website, communications or project delivery, subject to the tools and services actually used.":"لا تنوي LINETECH بيع المعلومات الشخصية. وقد تتم معالجة المعلومات بواسطة مزودي الخدمات فقط عند الحاجة لتشغيل الموقع أو التواصل أو تنفيذ المشروع بحسب الأدوات والخدمات المستخدمة فعليًا.",
  "Information that you send directly may be retained for as long as reasonably needed for communication, project records, legal obligations or legitimate business administration. Browser-only project brief content is controlled by your browser unless you choose to share it.":"قد يتم الاحتفاظ بالمعلومات التي ترسلها مباشرة للمدة المعقولة اللازمة للتواصل أو سجلات المشروع أو الالتزامات القانونية أو الإدارة المشروعة للأعمال. أما محتوى ملخص المشروع الموجود في المتصفح فيبقى تحت تحكم متصفحك ما لم تختر مشاركته.",
  "This privacy information may be updated as the website gains new features, integrations or communication methods. Material changes should be reflected on this page.":"قد يتم تحديث معلومات الخصوصية مع إضافة مزايا أو تكاملات أو طرق تواصل جديدة للموقع، وستنعكس التغييرات الجوهرية على هذه الصفحة.",

  "Project scope, payment stages, deliverables and timelines should be confirmed before execution begins.":"يجب تأكيد نطاق المشروع ومراحل الدفع والمخرجات والجداول الزمنية قبل بدء التنفيذ.",
  "1. Website use":"1. استخدام الموقع","2. Information on the website":"2. المعلومات على الموقع","3. Project proposals and scope":"3. عروض المشاريع ونطاقها","4. Payments":"4. المدفوعات","5. Client materials and approvals":"5. مواد العميل والموافقات","6. Intellectual property and handover":"6. الملكية الفكرية والتسليم","7. External services":"7. الخدمات الخارجية","8. Changes":"8. التغييرات",
  "You may use the LINETECH website to learn about the company, services, selected work and how to begin a project. You should not misuse the site, interfere with its operation or attempt unauthorized access to systems or data.":"يمكنك استخدام موقع LINETECH للتعرف على الشركة والخدمات والأعمال المختارة وكيفية بدء مشروع. يجب ألا تسيء استخدام الموقع أو تعطل تشغيله أو تحاول الوصول غير المصرح به إلى الأنظمة أو البيانات.",
  "Website content is intended to describe LINETECH and its services in general terms. Specific project scope, pricing, delivery dates and responsibilities are only confirmed through the agreement for that project.":"يهدف محتوى الموقع إلى وصف LINETECH وخدماتها بشكل عام. أما نطاق المشروع المحدد والأسعار ومواعيد التسليم والمسؤوليات فلا يتم تأكيدها إلا عبر اتفاق المشروع نفسه.",
  "A project begins after the agreed scope, deliverables, timeline and commercial terms are confirmed. Requests outside the agreed scope may require a change to the timeline, price or deliverables before they are added.":"يبدأ المشروع بعد تأكيد النطاق والمخرجات والجدول والشروط التجارية المتفق عليها. وقد تتطلب الطلبات خارج النطاق تعديلًا في الوقت أو السعر أو المخرجات قبل إضافتها.",
  "Unless another structure is agreed in writing, project payments may be organized in stages. The applicable schedule, amount, currency and payment method are confirmed for each project before work begins.":"ما لم يتم الاتفاق كتابيًا على غير ذلك، يمكن تنظيم دفعات المشروع على مراحل. ويتم تأكيد الجدول والمبلغ والعملة وطريقة الدفع لكل مشروع قبل بدء العمل.",
  "Clients are responsible for providing materials, access and approvals needed for their project. Delays in required information or approvals may affect the project schedule.":"العملاء مسؤولون عن توفير المواد والصلاحيات والموافقات المطلوبة للمشروع، وقد تؤثر التأخيرات في المعلومات أو الموافقات على الجدول الزمني.",
  "Ownership, licenses, source files, credentials and handover items depend on the type of project and are defined in the applicable project agreement. Third-party tools, fonts, services and software remain subject to their own licenses and terms.":"تعتمد الملكية والتراخيص وملفات المصدر وبيانات الدخول وعناصر التسليم على نوع المشروع وتُحدد في اتفاق المشروع. وتظل أدوات وخطوط وخدمات وبرمجيات الأطراف الخارجية خاضعة لتراخيصها وشروطها.",
  "Projects and this website may rely on third-party hosting, infrastructure or software. LINETECH cannot control the availability or terms of independent third-party services.":"قد تعتمد المشاريع وهذا الموقع على استضافة أو بنية تحتية أو برمجيات من أطراف خارجية، ولا تستطيع LINETECH التحكم في توفر أو شروط الخدمات المستقلة التابعة لتلك الأطراف.",
  "These website terms may be updated as LINETECH services and website features evolve. The current version is published on this page.":"قد يتم تحديث شروط الموقع مع تطور خدمات LINETECH ومزايا الموقع، وتُنشر النسخة الحالية في هذه الصفحة.",

  "Sign-in UI is ready. Secure authentication will be connected when the backend phase begins.":"واجهة تسجيل الدخول جاهزة. سيتم ربط المصادقة الآمنة عند بدء مرحلة الـBackend.",
  "Account creation UI is ready. Registration will be connected when the backend phase begins.":"واجهة إنشاء الحساب جاهزة. سيتم ربط التسجيل عند بدء مرحلة الـBackend.",
  "Password recovery will be activated with the authentication backend.":"سيتم تفعيل استعادة كلمة المرور عند ربط Backend المصادقة.",
  "I agree to the":"أوافق على","Privacy Policy":"سياسة الخصوصية",

  "Welcome to LINETECH. Send your project questions, files or voice notes here and keep the conversation in one place.":"مرحبًا بك في LINETECH. أرسل أسئلة مشروعك وملفاتك ورسائلك الصوتية هنا واحتفظ بالمحادثة في مكان واحد.",
  "When realtime messaging is connected, this will become the direct conversation between you and the LINETECH team.":"عند ربط الرسائل الفورية، ستصبح هذه المحادثة قناة مباشرة بينك وبين فريق LINETECH.",
  "The file works now, but this browser could not keep the full media preview after refresh.":"الملف يعمل الآن، لكن المتصفح لم يتمكن من الاحتفاظ بمعاينة الوسائط كاملة بعد التحديث.",
  "edited":"معدلة"
};

function normalize(value:string){return value.trim().replace(/\s+/g," ");}
function translate(value:string){return EXTRA[normalize(value)] || null;}
function replaceText(node:Text){
  const parent=node.parentElement;
  if(!parent || parent.closest("script,style,noscript,code,pre,[data-no-translate]")) return;
  if(parent.matches(".chat-message-row.client .chat-bubble > p")) return;
  const current=node.nodeValue||"";
  const translated=translate(current);
  if(!translated) return;
  const leading=current.match(/^\s*/)?.[0]||"";
  const trailing=current.match(/\s*$/)?.[0]||"";
  node.nodeValue=`${leading}${translated}${trailing}`;
}
function scan(root:Node){
  if(root.nodeType===Node.TEXT_NODE){replaceText(root as Text);return;}
  if(root.nodeType!==Node.ELEMENT_NODE && root.nodeType!==Node.DOCUMENT_NODE) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node:Node|null;
  while((node=walker.nextNode())) replaceText(node as Text);
}

export default function ArabicSupplement(){
  useLayoutEffect(()=>{
    if(window.localStorage.getItem("linetech-language-v1")==="en") return;
    scan(document.body);
    const observer=new MutationObserver(mutations=>{
      mutations.forEach(mutation=>{
        if(mutation.type==="characterData") replaceText(mutation.target as Text);
        mutation.addedNodes.forEach(scan);
      });
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    return ()=>observer.disconnect();
  },[]);
  return null;
}
