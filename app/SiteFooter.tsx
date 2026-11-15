"use client";

import Link from "./IntentLink";
import { usePathname } from "next/navigation";
import { useLanguage } from "./Localized";

const copy = {
  en: {
    brandLead: "Technology for a brighter tomorrow.",
    brandText: "Websites, applications and ongoing care built around real business needs.",
    explore: "Explore",
    services: "Services",
    company: "Company",
    home: "Home",
    projects: "Projects",
    products: "Products",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    web: "Web Development",
    commerce: "E-commerce & Systems",
    brand: "Application Development",
    cv: "After-sales Care",
    how: "Packages & Pricing",
    workspace: "Client Workspace",
    privacy: "Privacy",
    terms: "Terms",
    rights: "© 2026 LINETECH. All rights reserved.",
    line: "Every idea starts with a line.",
  },
  ar: {
    brandLead: "تقنية لغدٍ أكثر إشراقًا.",
    brandText: "مواقع وتطبيقات وخدمات دعم مبنية حول احتياجات العمل الحقيقية.",
    explore: "استكشف",
    services: "الخدمات",
    company: "الشركة",
    home: "الرئيسية",
    projects: "المشاريع",
    products: "المنتجات",
    about: "عن لاين تك",
    faq: "الأسئلة الشائعة",
    contact: "تواصل معنا",
    web: "تطوير المواقع",
    commerce: "التجارة الإلكترونية والأنظمة",
    brand: "تطوير التطبيقات",
    cv: "خدمات ما بعد البيع",
    how: "الباقات والأسعار",
    workspace: "مساحة العميل",
    privacy: "الخصوصية",
    terms: "الشروط",
    rights: "© 2026 لاين تك. جميع الحقوق محفوظة.",
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
            <Link className={linkClass("/products")} aria-current={isActive("/products") ? "page" : undefined} href="/products" prefetch>{t.products}</Link>
            <Link className={linkClass("/about")} aria-current={isActive("/about") ? "page" : undefined} href="/about" prefetch>{t.about}</Link>
            <Link className={linkClass("/faq")} aria-current={isActive("/faq") ? "page" : undefined} href="/faq" prefetch>{t.faq}</Link>
          </nav>

          <nav className="footer-v2-column" aria-label={t.services}>
            <h4>{t.services}</h4>
            <Link className={linkClass("/services/web-development")} href="/services/web-development" prefetch>{t.web}</Link>
            <Link className={linkClass("/services/ecommerce-systems")} href="/services/ecommerce-systems" prefetch>{t.commerce}</Link>
            <Link className={linkClass("/services/app-development")} href="/services/app-development" prefetch>{t.brand}</Link>
            <Link className={linkClass("/pricing")} href="/pricing#aftercare" prefetch>{t.cv}</Link>
          </nav>

          <nav className="footer-v2-column" aria-label={t.company}>
            <h4>{t.company}</h4>
            <Link className={linkClass("/services")} href="/services" prefetch>{t.services}</Link>
            <Link className={linkClass("/pricing")} href="/pricing" prefetch>{t.how}</Link>
            <Link className={linkClass("/account/projects")} href="/account/projects" prefetch>{t.workspace}</Link>
            <Link className={linkClass("/contact")} aria-current={isActive("/contact") ? "page" : undefined} href="/contact" prefetch>{t.contact}</Link>
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
