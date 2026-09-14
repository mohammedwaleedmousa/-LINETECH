import arabic from "./arabic.json";

export type Language = "ar" | "en";
const dictionary: Record<string, string> = arabic;

export function translate(value: string, language: Language): string {
  if (language === "en") return value;
  const key = value.trim().replace(/\s+/g, " ");
  let result = dictionary[key];
  if (result === undefined) {
    const step = key.match(/^Step (\d+) of (\d+)$/);
    const largeFile = key.match(/^(.+) is larger than 5 MB\. Keep preview documents smaller until cloud storage is connected\.$/);
    const cannotOpen = key.match(/^(.+) could not be opened in the preview\.$/);
    const bytes = key.match(/^([\d.]+) (B|KB|MB)$/);
    if (step) result = `الخطوة ${step[1]} من ${step[2]}`;
    else if (key === "Review request") result = "مراجعة الطلب";
    else if (largeFile) result = `${largeFile[1]} أكبر من 5 ميغابايت. استخدم مستندًا أصغر في المعاينة حتى يتم ربط التخزين السحابي.`;
    else if (cannotOpen) result = `تعذر فتح ${cannotOpen[1]} في المعاينة.`;
    else if (bytes) result = `${bytes[1]} ${{B: "بايت", KB: "كيلوبايت", MB: "ميغابايت"}[bytes[2]]}`;
    else if (key.endsWith(" — LINETECH")) result = `${translate(key.slice(0, -11), language)} — لاين تك`;
    else return value;
  }
  return `${value.match(/^\s*/)?.[0] || ""}${result}${value.match(/\s*$/)?.[0] || ""}`;
}
