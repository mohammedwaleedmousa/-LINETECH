"use client";

import { useLayoutEffect } from "react";

type Language = "ar" | "en";

export const LANGUAGE_STORAGE_KEY = "linetech-language-v1";
export const LANGUAGE_EVENT = "linetech:languagechange";

const AR = new Map<string,string>([
  ["Home","الرئيسية"],["Services","الخدمات"],["Projects","المشاريع"],["About","من نحن"],["Contact","تواصل معنا"],["Chat","المحادثة"],["Login","تسجيل الدخول"],["Login / Create Account","تسجيل الدخول / إنشاء حساب"],["Start Your Line","ابدأ خطك"],
  ["Page","صفحة"],["Service","خدمة"],["Project","مشروع"],["Client","عميل"],["Account","حساب"],
  ["Navigation","التنقل"],["Quick Links","روابط سريعة"],["Company","الشركة"],["Privacy","الخصوصية"],["Terms","الشروط"],["FAQ","الأسئلة الشائعة"],["Aden, Yemen","عدن، اليمن"],
  ["Technology for a brighter tomorrow.","تقنية لمستقبل أكثر إشراقًا."],["© 2026 LINETECH. All rights reserved.","© 2026 LINETECH. جميع الحقوق محفوظة."],["Every idea starts with a line.","كل فكرة تبدأ بخط."],
  ["Web Development","تطوير الويب"],["E-commerce & Systems","التجارة الإلكترونية والأنظمة"],["Brand Identity","الهوية البصرية"],["CV & Portfolio","السيرة الذاتية ومعرض الأعمال"],
  ["Search LINETECH","بحث LINETECH"],["Toggle navigation","فتح أو إغلاق القائمة"],["Primary navigation","التنقل الرئيسي"],["Mobile navigation","تنقل الجوال"],["SEARCH / LINETECH","بحث / LINETECH"],["SEARCH RESULTS","نتائج البحث"],["QUICK ACCESS","وصول سريع"],["What are you looking for?","عمّ تبحث؟"],["No results found. Try another word.","لا توجد نتائج. جرّب كلمة أخرى."],["Type to search","اكتب للبحث"],["ESC to close","ESC للإغلاق"],["Close search","إغلاق البحث"],["Search","بحث"],
  ["TECHNOLOGY FOR A BRIGHTER TOMORROW","تقنية لمستقبل أكثر إشراقًا"],["Every idea","كل فكرة"],["starts with a line.","تبدأ بخط."],["We turn ideas into real digital products through clear design, reliable technology and disciplined execution.","نحوّل الأفكار إلى منتجات رقمية حقيقية عبر تصميم واضح وتقنية موثوقة وتنفيذ منضبط."],["Let's Build","لنبدأ البناء"],["View Our Work","شاهد أعمالنا"],["Founder-led","بقيادة المؤسس"],["Core Services","خدمات أساسية"],["Clear Steps","خطوات واضحة"],["Bigger Possibilities","إمكانات أكبر"],
  ["OUR SERVICES","خدماتنا"],["Solutions for a smarter tomorrow.","حلول لغدٍ أكثر ذكاءً."],["We combine technology, design and engineering to deliver solutions that solve real problems.","نجمع بين التقنية والتصميم والهندسة لتقديم حلول تعالج مشكلات حقيقية."],["View All Services","عرض جميع الخدمات"],["Learn more","اعرف المزيد"],
  ["FEATURED PROJECTS","مشاريع مختارة"],["Real solutions. Real impact.","حلول حقيقية. أثر حقيقي."],["View All Projects","عرض جميع المشاريع"],["View Project","عرض المشروع"],["E-COMMERCE","تجارة إلكترونية"],["MARKETPLACE","سوق خدمات"],["SERVICES MARKETPLACE","سوق خدمات"],["BUSINESS SYSTEM","نظام أعمال"],
  ["ABOUT LINETECH","عن LINETECH"],["More than technology. A smarter tomorrow.","أكثر من مجرد تقنية. غدٌ أكثر ذكاءً."],["IDEAS","أفكار"],["SYSTEMS","أنظمة"],["PEOPLE","أشخاص"],["A BETTER TOMORROW","مستقبل أفضل"],
  ["OUR PROCESS","منهجية العمل"],["From idea to impact.","من الفكرة إلى الأثر."],["Understand","فهم"],["Plan","تخطيط"],["Build","بناء"],["Launch","إطلاق"],
  ["OUR STANDARD","معيارنا"],["Alignment","مواءمة"],["before execution","قبل التنفيذ"],["Quality","جودة"],["in every step","في كل خطوة"],
  ["LET'S BUILD TOGETHER","لنبنِ معًا"],["Ready to turn your idea into reality?","هل أنت مستعد لتحويل فكرتك إلى واقع؟"],["Start with the idea. We'll help define the first line.","ابدأ بالفكرة، وسنساعدك على تحديد الخط الأول."],
  ["WHAT WE BUILD","ما الذي نبنيه"],["Four focused services.","أربع خدمات مركزة."],["Explore service →","استكشف الخدمة ←"],["PROCESS","العملية"],["One clear line.","خط واحد واضح."],["Define","تحديد"],["Design","تصميم"],["Build & Launch","البناء والإطلاق"],["START YOUR LINE","ابدأ خطك"],["Not sure which service fits?","غير متأكد من الخدمة المناسبة؟"],["Contact Us ↗","تواصل معنا ↖"],
  ["WEB DEVELOPMENT","تطوير الويب"],["E-COMMERCE & SYSTEMS","التجارة الإلكترونية والأنظمة"],["BRAND IDENTITY","الهوية البصرية"],["CV & PORTFOLIO","السيرة الذاتية ومعرض الأعمال"],["Web products built to perform.","منتجات ويب مبنية للأداء."],["Digital systems built around real workflows.","أنظمة رقمية مبنية حول سير عمل حقيقي."],["A visual system with a clear point of view.","نظام بصري برؤية واضحة."],["Present your work with clarity.","اعرض أعمالك بوضوح."],["Start this service ↗","ابدأ هذه الخدمة ↖"],["View our work","شاهد أعمالنا"],["LINETECH / SERVICE","LINETECH / خدمة"],["WHAT YOU GET","ما الذي ستحصل عليه"],["A clear, usable outcome.","نتيجة واضحة وقابلة للاستخدام."],["WHO IT FITS","لمن تناسب"],["Built around the real need.","مبنية حول الحاجة الحقيقية."],["HOW WE WORK","كيف نعمل"],["One line from brief to delivery.","خط واحد من الملخص إلى التسليم."],
  ["SELECTED WORK","أعمال مختارة"],["Built to work. Built to grow.","مبنية للعمل ومهيأة للنمو."],["View case study ↗","عرض دراسة الحالة ↖"],["HOW WE THINK","كيف نفكر"],["Products, not decoration.","منتجات، لا مجرد زخرفة."],["Challenge","التحدي"],["Approach","المنهج"],["Product","المنتج"],["Impact","الأثر"],["Projects ↗","المشاريع ↖"],["Build with us ↗","ابنِ معنا ↖"],["All projects","كل المشاريع"],["LINETECH / CASE STUDY","LINETECH / دراسة حالة"],["OVERVIEW","نظرة عامة"],["The product in one line.","المنتج في خط واحد."],["THE CHALLENGE","التحدي"],["THE APPROACH","المنهج"],["WHAT WE BUILT","ما الذي بنيناه"],["TECHNOLOGY","التقنية"],["YOUR NEXT PROJECT","مشروعك التالي"],
  ["DISCOVERY","اكتشاف"],["COMMERCE","تجارة"],["ORDERS","طلبات"],["OPERATIONS","عمليات"],["TRUST","ثقة"],["SERVICES","خدمات"],["RECORDS","سجلات"],["WORKFLOWS","سير عمل"],["VISIBILITY","وضوح"],["SYSTEM","نظام"],
  ["THE IDEA","الفكرة"],["OUR PRINCIPLES","مبادئنا"],["Clear thinking. Strong execution.","تفكير واضح. تنفيذ قوي."],["FOUNDER","المؤسس"],["Founder & CEO — LINETECH","المؤسس والرئيس التنفيذي — LINETECH"],["FOUNDER STATEMENT","كلمة المؤسس"],["Building for the long term.","نبني للمدى الطويل."],["THE LINE","الخط"],["JOURNEY","الرحلة"],["Idea","الفكرة"],["YOUR IDEA","فكرتك"],["What line do you want to start?","ما الخط الذي تريد أن تبدأه؟"],
  ["Tell us what you want to build.","أخبرنا بما تريد بناءه."],["Start the brief ↘","ابدأ الملخص ↙"],["View services","عرض الخدمات"],["PROJECT BRIEF","ملخص المشروع"],["One clear line before we build.","خط واحد واضح قبل أن نبدأ البناء."],["WHAT HAPPENS NEXT","ماذا يحدث بعد ذلك"],["A simple path forward.","مسار بسيط إلى الأمام."],["Start now ↗","ابدأ الآن ↖"],
  ["Clear answers before we build.","إجابات واضحة قبل أن نبدأ البناء."],["WORKING TOGETHER","العمل معًا"],["PRIVACY","الخصوصية"],["TERMS","الشروط"],["LAST UPDATED","آخر تحديث"],["September 2026","سبتمبر 2026"],
  ["LINETECH / ACCESS","LINETECH / الدخول"],["Your work. One clear line.","عملك. خط واحد واضح."],["Sign in","تسجيل الدخول"],["Create account","إنشاء حساب"],["CLIENT ACCESS","دخول العميل"],["NEW ACCOUNT","حساب جديد"],["Welcome back.","مرحبًا بعودتك."],["Create your workspace.","أنشئ مساحة عملك."],["Email address","البريد الإلكتروني"],["Password","كلمة المرور"],["Remember me","تذكرني"],["Forgot password?","نسيت كلمة المرور؟"],
  ["Chats","المحادثات"],["Search or start new chat","ابحث أو ابدأ محادثة جديدة"],["LINETECH Project Team","فريق مشاريع LINETECH"],["Preview mode","وضع المعاينة"],["Company conversation","محادثة مع الشركة"],["PREVIEW","معاينة"],["TODAY","اليوم"],["Edit message","تعديل الرسالة"],["Delete for everyone","حذف لدى الطرفين"],["Photos","الصور"],["Document","مستند"],["Type a message","اكتب رسالة"],["Recording real voice","جارٍ تسجيل صوت حقيقي"],
  ["THANK YOU","شكرًا لك"],["01 / NEXT LINE","01 / الخط التالي"],["Your first line is ready.","خطك الأول جاهز."],["Brief","الملخص"],["404 / LINE NOT FOUND","404 / الخط غير موجود"],["This line goes nowhere.","هذا الخط لا يقود إلى مكان."],["Back to Home ↗","العودة للرئيسية ↖"],
  ["Privacy Policy","سياسة الخصوصية"],["Terms of Use","شروط الاستخدام"],["Login or Create Account","تسجيل الدخول أو إنشاء حساب"],["Thank You","شكرًا لك"],
  ["→","←"],["↗","↖"],["↘","↙"]
]);

const originalText = new WeakMap<Text,string>();
const originalAttributes = new WeakMap<Element,Map<string,string>>();
const attributes = ["placeholder","title","aria-label"] as const;

function normalize(value:string){
  return value.trim().replace(/\s+/g," ");
}

function translateKnown(value:string){
  const key = normalize(value);
  const translated = AR.get(key);
  if(translated) return translated;
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
  if(!translated) return;
  if(saved === undefined) originalText.set(node,current);
  const next = withWhitespace(current,translated);
  if(current !== next) node.nodeValue = next;
}

function applyAttribute(element:Element,name:string,language:Language){
  if(element.closest("[data-no-translate]")) return;
  const current = element.getAttribute(name);
  if(current === null) return;
  let savedMap = originalAttributes.get(element);
  if(!savedMap){
    savedMap = new Map();
    originalAttributes.set(element,savedMap);
  }
  if(language === "en"){
    const saved = savedMap.get(name);
    if(saved !== undefined && current !== saved) element.setAttribute(name,saved);
    return;
  }
  const translated = translateKnown(current);
  if(!translated) return;
  if(!savedMap.has(name)) savedMap.set(name,current);
  if(current !== translated) element.setAttribute(name,translated);
}

function translateTree(root:Node,language:Language){
  if(root.nodeType === Node.TEXT_NODE){
    applyText(root as Text,language);
    return;
  }
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
