import arabic from "./arabic.json";

export type Language = "ar" | "en";
const dictionary: Record<string, string> = arabic;
const qaCopy: Record<string, string> = {
  "Review request": "مراجعة الطلب",
  "Describe your idea, choose a service and complete a clear project request.": "اشرح فكرتك، واختر الخدمة، ثم أكمل طلب مشروع واضحًا.",
  "Your request stays on your device until you choose to share it with LINETECH.": "يبقى طلبك على جهازك حتى تختار مشاركته مع لاين تك.",
  "Start your project request": "ابدأ طلب مشروعك",
  "Complete your project request, receive a reference number, then share it with LINETECH through your chosen contact channel.": "أكمل طلب مشروعك، واحصل على رقم مرجعي، ثم شاركه مع لاين تك عبر قناة التواصل التي تختارها.",
  "Find Your Service": "اعثر على خدمتك",
  "How We Work": "كيف نعمل",
  "Client Workspace": "مساحة العميل",
  "Guide": "دليل",
  "Process": "المراحل",
  "See full process": "شاهد المراحل كاملة",
  "Want to see the client area?": "هل تريد مشاهدة مساحة العميل؟",
  "Open Client Workspace": "افتح مساحة العميل",
  "Sign in if you already have an account, or create one to prepare your LINETECH client workspace.": "سجّل الدخول إذا كان لديك حساب، أو أنشئ حسابًا لتجهيز مساحة عميل لاين تك.",
  "PROJECT ACCESS": "الوصول للمشروع",
  "CLEAR STATUS": "حالة واضحة",
  "ONE WORKSPACE": "مساحة واحدة",
  "Need to start a project first?": "تحتاج إلى بدء مشروع أولًا؟",
  "Saved on this device.": "تم الحفظ على هذا الجهاز.",
  "Message edited on this device.": "تم تعديل الرسالة على هذا الجهاز.",
  "Message removed from this device.": "تم حذف الرسالة من هذا الجهاز.",
  "This image could not be opened.": "تعذر فتح هذه الصورة.",
  "Voice recording is not available in this browser.": "تسجيل الصوت غير متاح في هذا المتصفح.",
  "Voice recording cancelled.": "تم إلغاء تسجيل الصوت.",
  "Voice note could not be prepared.": "تعذر تجهيز الرسالة الصوتية.",
  "Microphone permission is needed to record a voice message.": "يلزم السماح باستخدام الميكروفون لتسجيل رسالة صوتية.",
  "Preparing image…": "جارٍ تجهيز الصورة…",
  "Conversation reset on this device.": "تمت إعادة المحادثة على هذا الجهاز.",
  "Synced with your workspace": "متزامنة مع مساحة عملك",
  "Project conversation": "محادثة المشروع",
  "Refresh project conversation": "تحديث محادثة المشروع",
  "Too many actions. Wait one minute and try again.": "محاولات كثيرة جدًا. انتظر دقيقة ثم حاول مرة أخرى.",
  "PROJECT WORKSPACE": "مساحة المشروع",
  "Messages, photos, documents and voice notes are securely connected to this project.": "الرسائل والصور والمستندات والرسائل الصوتية مرتبطة بهذا المشروع بأمان.",
  "This conversation is connected to your LINETECH workspace.": "هذه المحادثة مرتبطة بمساحة عملك في لاين تك.",
  "Delete message": "حذف الرسالة",
  "This message was deleted.": "تم حذف هذه الرسالة.",
  "Saved to project workspace": "محفوظ في مساحة المشروع",
  "Drop files here": "أفلت الملفات هنا",
  "Photos and documents will be added to this conversation": "ستتم إضافة الصور والمستندات إلى هذه المحادثة",
  "Editing message": "تعديل الرسالة",
  "Upload up to 4 images": "ارفع حتى 4 صور",
  "PDF, Word, Excel and more": "PDF وWord وExcel والمزيد",
  "Choose emoji": "اختر رمزًا تعبيريًا",
  "Recording voice": "جارٍ تسجيل الصوت",
  "Add attachment": "إضافة مرفق",
  "Emoji": "رمز تعبيري",
  "Edit your message": "عدّل رسالتك",
  "Save edit": "حفظ التعديل",
  "Save message": "حفظ الرسالة",
  "Record voice message": "تسجيل رسالة صوتية",
  "Cancel voice recording": "إلغاء تسجيل الصوت",
  "Save voice recording": "حفظ التسجيل الصوتي",
  "Message actions": "إجراءات الرسالة",
  "Download document": "تنزيل المستند",
  "Shared image": "صورة مشتركة",
  "Photo": "صورة",
  "Voice message": "رسالة صوتية",
  "Message deleted": "تم حذف الرسالة",
  "Start a conversation": "ابدأ محادثة",
  "You: ": "أنت: ",
};

export function translate(value: string, language: Language): string {
  if (language === "en") return value;
  const key = value.trim().replace(/\s+/g, " ");
  let result = dictionary[key] ?? qaCopy[key];
  if (result === undefined) {
    const step = key.match(/^Step (\d+) of (\d+)$/);
    const oldLargeFile = key.match(/^(.+) is larger than 5 MB\. Keep preview documents smaller until cloud storage is connected\.$/);
    const deviceLargeFile = key.match(/^(.+) is larger than 5 MB\. Choose a smaller document for this device conversation\.$/);
    const oldCannotOpen = key.match(/^(.+) could not be opened in the preview\.$/);
    const cannotOpen = key.match(/^(.+) could not be opened\.$/);
    const bytes = key.match(/^([\d.]+) (B|KB|MB)$/);
    if (step) result = `الخطوة ${step[1]} من ${step[2]}`;
    else if (oldLargeFile) result = `${oldLargeFile[1]} أكبر من 5 ميغابايت. استخدم مستندًا أصغر في المعاينة حتى يتم ربط التخزين السحابي.`;
    else if (deviceLargeFile) result = `${deviceLargeFile[1]} أكبر من 5 ميغابايت. اختر مستندًا أصغر لهذه المحادثة على الجهاز.`;
    else if (oldCannotOpen) result = `تعذر فتح ${oldCannotOpen[1]} في المعاينة.`;
    else if (cannotOpen) result = `تعذر فتح ${cannotOpen[1]}.`;
    else if (bytes) result = `${bytes[1]} ${{B: "بايت", KB: "كيلوبايت", MB: "ميغابايت"}[bytes[2]]}`;
    else if (key.endsWith(" — LINETECH")) result = `${translate(key.slice(0, -11), language)} — لاين تك`;
    else if (/[؀-ۿ]/.test(key) && key.includes("LINETECH")) result = key.replaceAll("LINETECH", "لاين تك");
    else return value;
  }
  return `${value.match(/^\s*/)?.[0] || ""}${result}${value.match(/\s*$/)?.[0] || ""}`;
}
