"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./Localized";

const copy = {
  en: {
    system: "LINETECH / TECHNOLOGY COMPANY",
    location: "ADEN / YEMEN",
    eyebrow: "READY TO BUILD",
    title: "Build something worth using.",
    lead: "From the first line to a working digital product — clear thinking, disciplined design and practical engineering.",
    cta: "Start Your Line",
    brandLead: "Technology for a brighter tomorrow.",
    brandText: "Digital products, systems and identities built around real business needs.",
    explore: "Explore",
    services: "Services",
    company: "Company",
    home: "Home",
    projects: "Projects",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    web: "Web Development",
    commerce: "E-commerce & Systems",
    brand: "Brand Identity",
    cv: "CV & Portfolio",
    privacy: "Privacy",
    terms: "Terms",
    rights: "© 2026 LINETECH. All rights reserved.",
    line: "Every idea starts with a line.",
  },
  ar: {
    system: "LINETECH / شركة تقنية",
    location: "عدن / اليمن",
    eyebrow: "جاهزون للبناء",
    title: "ابنِ شيئًا يستحق الاستخدام.",
    lead: "من الخط الأول إلى منتج رقمي يعمل — تفكير واضح، تصميم منضبط، وهندسة عملية.",
    cta: "ابدأ خطك",
    brandLead: "تقنية لغدٍ أكثر إشراقًا.",
    brandText: "منتجات وأنظمة وهويات رقمية مبنية حول احتياجات العمل الحقيقية.",
    explore: "استكشف",
    services: "الخدمات",
    company: "الشركة",
    home: "الرئيسية",
    projects: "المشاريع",
    about: "عن LINETECH",
    faq: "الأسئلة الشائعة",
    contact: "تواصل معنا",
    web: "تطوير المواقع",
    commerce: "التجارة الإلكترونية والأنظمة",
    brand: "الهوية البصرية",
    cv: "السيرة الذاتية والملف المهني",
    privacy: "الخصوصية",
    terms: "الشروط",
    rights: "© 2026 LINETECH. جميع الحقوق محفوظة.",
    line: "كل فكرة تبدأ بخط.",
  },
} as const;

export default function SiteFooter() {
  const pathname = usePathname();
  const language = useLanguage();
  const t = copy[language];
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const linkClass = (href: string) => isActive(href) ? "footer-v2-link is-active" : "footer-v2-link";

  return (
    <footer className="site-footer-global footer-v2">
      <div className="footer-v2-decor" aria-hidden="true">
        <svg viewBox="0 0 1600 520" preserveAspectRatio="none" fill="none" focusable="false">
          <path className="footer-v2-path path-a" d="M930 80C1110 46 1220 86 1335 178s172 102 318 50"/>
          <path className="footer-v2-path path-b" d="M810 156c176-12 282 62 382 148s226 100 430 28"/>
          <path className="footer-v2-path path-c" d="M1005 18c58 92 130 126 220 122 118-5 172 58 220 146"/>
          <g className="footer-v2-nodes">
            <circle cx="1078" cy="68" r="3"/><circle cx="1215" cy="109" r="4"/><circle cx="1335" cy="178" r="3"/>
            <circle cx="1005" cy="165" r="3"/><circle cx="1192" cy="304" r="4"/><circle cx="1455" cy="286" r="3"/>
          </g>
        </svg>
      </div>

      <div className="footer-v2-watermark" aria-hidden="true">LINETECH</div>

      <div className="ref-shell footer-v2-shell">
        <div className="footer-v2-system">
          <span><i aria-hidden="true" />{t.system}</span>
          <span>{t.location}</span>
        </div>

        <div className="footer-v2-cta">
          <div className="footer-v2-cta-copy">
            <p>{t.eyebrow}</p>
            <h2>{t.title}</h2>
            <span>{t.lead}</span>
          </div>
          <Link className="footer-v2-cta-button" href="/start" prefetch>
            {t.cta}<span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="footer-v2-main">
          <div className="footer-v2-brand">
            <Link className="ref-brand footer-v2-logo" href="/" prefetch aria-label="LINETECH home">
              <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
            </Link>
            <h3>{t.brandLead}</h3>
            <p>{t.brandText}</p>
          </div>

          <nav className="footer-v2-column" aria-label={t.explore}>
            <h4>{t.explore}</h4>
            <Link className={linkClass("/")} aria-current={isActive("/") ? "page" : undefined} href="/" prefetch>{t.home}</Link>
            <Link className={linkClass("/projects")} aria-current={isActive("/projects") ? "page" : undefined} href="/projects" prefetch>{t.projects}</Link>
            <Link className={linkClass("/about")} aria-current={isActive("/about") ? "page" : undefined} href="/about" prefetch>{t.about}</Link>
            <Link className={linkClass("/faq")} aria-current={isActive("/faq") ? "page" : undefined} href="/faq" prefetch>{t.faq}</Link>
          </nav>

          <nav className="footer-v2-column" aria-label={t.services}>
            <h4>{t.services}</h4>
            <Link className={linkClass("/services/web-development")} href="/services/web-development" prefetch>{t.web}</Link>
            <Link className={linkClass("/services/ecommerce-systems")} href="/services/ecommerce-systems" prefetch>{t.commerce}</Link>
            <Link className={linkClass("/services/brand-identity")} href="/services/brand-identity" prefetch>{t.brand}</Link>
            <Link className={linkClass("/services/cv-portfolio")} href="/services/cv-portfolio" prefetch>{t.cv}</Link>
          </nav>

          <nav className="footer-v2-column" aria-label={t.company}>
            <h4>{t.company}</h4>
            <Link className={linkClass("/services")} href="/services" prefetch>{t.services}</Link>
            <Link className={linkClass("/start")} aria-current={isActive("/start") ? "page" : undefined} href="/start" prefetch>{t.contact}</Link>
            <Link className={linkClass("/privacy")} href="/privacy" prefetch>{t.privacy}</Link>
            <Link className={linkClass("/terms")} href="/terms" prefetch>{t.terms}</Link>
          </nav>
        </div>

        <div className="footer-v2-bottom">
          <span>{t.rights}</span>
          <span className="footer-v2-core-line"><i aria-hidden="true" />{t.line}</span>
        </div>
      </div>
    </footer>
  );
}
