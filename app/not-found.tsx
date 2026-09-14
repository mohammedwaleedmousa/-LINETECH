"use client";

import Link from "next/link";
import { useLanguage } from "./Localized";

const copy = {
  en: {
    code: "404 / LINE NOT FOUND",
    title: "This line goes nowhere.",
    body: "The page may have moved, the address may be wrong, or the route does not exist yet. Start again from a clear line.",
    home: "Back to Home",
    start: "Start Your Line",
  },
  ar: {
    code: "404 / الخط غير موجود",
    title: "هذا الخط لا يقود إلى مكان.",
    body: "قد تكون الصفحة قد انتقلت، أو أن العنوان غير صحيح، أو أن المسار غير موجود. ابدأ من جديد من خط واضح.",
    home: "العودة إلى الرئيسية",
    start: "ابدأ خطك",
  },
} as const;

export default function NotFound(){
  const language = useLanguage();
  const t = copy[language];
  return <main className="not-found-page">
    <div className="not-found-inner">
      <span className="not-found-code">{t.code}</span>
      <h1>{t.title}</h1>
      <p>{t.body}</p>
      <div className="not-found-actions"><Link className="ref-btn primary" href="/" prefetch>{t.home} ↗</Link><Link className="ref-btn ghost" href="/start" prefetch>{t.start}</Link></div>
    </div>
  </main>;
}
