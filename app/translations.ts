import arabic from "./arabic.json";

export type Language = "ar" | "en";
const dictionary: Record<string, string> = arabic;
const qaCopy: Record<string, string> = {
  "Review request": "مراجعة الطلب",
  "Describe your idea, choose a service and complete a clear project request.": "اشرح فكرتك، واختر الخدمة، ثم أكمل طلب مشروع واضحًا.",
  "Your request stays on your device until you choose to share it with LINETECH.": "يبقى طلبك على جهازك حتى تختار مشاركته مع لاين تك.",
  "Start your project request": "ابدأ طلب مشروعك",
  "Complete your project request, receive a reference number, then share it with LINETECH through your chosen contact channel.": "أكمل طلب مشروعك، واحصل على رقم مرجعي، ثم شاركه مع لاين تك عبر قناة التواصل التي تختارها.",
};

export function translate(value: string, language: Language): string {
  if (language === "en") return value;
  const key = value.trim().replace(/\s+/g, " ");
  let result = dictionary[key] ?? qaCopy[key];
  if (result === undefined) {
    const step = key.match(/^Step (\d+) of (\d+)$/);
    const largeFile = key.match(/^(.+) is larger than 5 MB\. Keep preview documents smaller until cloud storage is connected\.$/);
    const cannotOpen = key.match(/^(.+) could not be opened in the preview\.$/);
    const bytes = key.match(/^([\d.]+) (B|KB|MB)$/);
    if (step) result = `الخطوة ${step[1]} من ${step[2]}`;
    else if (largeFile) result = `${largeFile[1]} أكبر من 5 ميغابايت. استخدم مستندًا أصغر في المعاينة حتى يتم ربط التخزين السحابي.`;
    else if (cannotOpen) result = `تعذر فتح ${cannotOpen[1]} في المعاينة.`;
    else if (bytes) result = `${bytes[1]} ${{B: "بايت", KB: "كيلوبايت", MB: "ميغابايت"}[bytes[2]]}`;
    else if (key.endsWith(" — LINETECH")) result = `${translate(key.slice(0, -11), language)} — لاين تك`;
    else if (/[؀-ۿ]/.test(key) && key.includes("LINETECH")) result = key.replaceAll("LINETECH", "لاين تك");
    else return value;
  }
  return `${value.match(/^\s*/)?.[0] || ""}${result}${value.match(/\s*$/)?.[0] || ""}`;
}
