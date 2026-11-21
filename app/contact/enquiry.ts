export const email = "info@linetech.company";
export const phone = "+967773335065";

export const enquiryServices = [
  { id: "web-development", en: "Website development", ar: "تطوير المواقع", legacy: "Web Development" },
  { id: "app-development", en: "Application development", ar: "تطوير التطبيقات" },
  { id: "ecommerce-systems", en: "Stores & business systems", ar: "المتاجر والأنظمة", legacy: "E-commerce & Systems" },
  { id: "after-sales-care", en: "After-sales care", ar: "خدمات ما بعد البيع", legacy: "aftercare" },
  { id: "other", en: "Other", ar: "أخرى" },
] as const;

export function findEnquiryService(value: string) {
  const requested = value.trim().toLowerCase();
  return enquiryServices.find((service) =>
    [service.id, service.en, service.ar, "legacy" in service ? service.legacy : ""]
      .some((label) => label && label.toLowerCase() === requested),
  );
}

export function whatsappLink(message?: string) {
  return `https://wa.me/${phone.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function emailLink(subject?: string, message = "") {
  if (!subject) return `mailto:${email}`;
  const body = message.replace(/\r?\n/g, "\r\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
