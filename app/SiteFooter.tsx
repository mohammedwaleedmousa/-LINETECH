"use client";

import Link from "./IntentLink";
import { usePathname } from "next/navigation";
import { useLanguage } from "./Localized";

const copy = {
  en: {
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
      <div className="footer-v2-lightfield" aria-hidden="true">
        <i className="footer-v2-horizon" />
        <i className="footer-v2-beacon" />
      </div>

      <div className="footer-v2-watermark" aria-hidden="true">LINETECH</div>

      <div className="ref-shell footer-v2-shell">
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
