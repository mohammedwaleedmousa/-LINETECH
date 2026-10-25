"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";
import { PlatformEmpty, PlatformHero, PlatformIcon } from "./PlatformUI";

export default function ModulePage({title, description, items, href="/contact", action}: {
  title:[string,string]; description:[string,string]; items?:[string,string][]; href?:string; action?:[string,string];
}) {
  const ar = useLanguage() === "ar";
  const index = ar ? 0 : 1;
  const label = action?.[index] || (href === "/contact" ? ar ? "تواصل معنا" : "Contact us" : ar ? "العودة إلى المساحة" : "Back to workspace");
  return <main className="platform-page platform-module-page">
    <PlatformHero eyebrow={ar ? "مساحة العمل" : "WORKSPACE"} title={title[index]} description={description[index]} icon="grid"/>
    <section className="platform-section"><PlatformEmpty icon="layers" title={ar ? "خطوتك القادمة، قريبًا." : "Your next step is coming."} body={ar ? "نعمل على تجهيز هذا القسم. ستتوفر وظائفه هنا عند تفعيله، ويمكنك استخدام الرابط أدناه للمتابعة الآن." : "This section is being prepared. Its features will be available here when activated. Use the link below to continue for now."}>
      <span className="platform-badge">{ar ? "غير مفعّل حاليًا" : "Not active yet"}</span>
      {items && <ul>{items.map((x,n) => <li key={n}>{x[index]}</li>)}</ul>}
      <Link className="platform-button secondary" href={href}>{label}<PlatformIcon kind="arrow"/></Link>
    </PlatformEmpty></section>
  </main>;
}
