"use client";

import Localized from "./Localized";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const linkClass = (href: string) => isActive(href) ? "footer-link-active" : undefined;

  return (
    <Localized><footer className="ref-footer site-footer-global">
      <div className="footer-abstract" aria-hidden="true">
        <i className="footer-abstract-orbit"/>
        <i className="footer-abstract-wave"/>
        <i className="footer-abstract-thread"/>
      </div>

      <div className="ref-shell ref-footer-grid">
        <div className="ref-footer-brand">
          <Link className="ref-brand" href="/" prefetch>
            <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
          </Link>
          <p>Technology for a brighter tomorrow.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <Link className={linkClass("/")} aria-current={isActive("/") ? "page" : undefined} href="/" prefetch>Home</Link>
          <Link className={linkClass("/services")} aria-current={isActive("/services") ? "page" : undefined} href="/services" prefetch>Services</Link>
          <Link className={linkClass("/projects")} aria-current={isActive("/projects") ? "page" : undefined} href="/projects" prefetch>Projects</Link>
          <Link className={linkClass("/about")} aria-current={isActive("/about") ? "page" : undefined} href="/about" prefetch>About</Link>
          <Link className={linkClass("/faq")} aria-current={isActive("/faq") ? "page" : undefined} href="/faq" prefetch>FAQ</Link>
          <Link className={linkClass("/start")} aria-current={isActive("/start") ? "page" : undefined} href="/start" prefetch>Contact</Link>
        </div>
        <div className="footer-quick-links">
          <h4>Quick Links</h4>
          <Link className={linkClass("/services/web-development")} href="/services/web-development" prefetch>Web Development</Link>
          <Link className={linkClass("/services/ecommerce-systems")} href="/services/ecommerce-systems" prefetch>E-commerce & Systems</Link>
          <Link className={linkClass("/services/brand-identity")} href="/services/brand-identity" prefetch>Brand Identity</Link>
          <Link className={linkClass("/services/cv-portfolio")} href="/services/cv-portfolio" prefetch>CV & Portfolio</Link>
        </div>
        <div>
          <h4>Company</h4>
          <span>Aden, Yemen</span>
          <Link className={linkClass("/start")} href="/start" prefetch>Start Your Line</Link>
          <Link className={linkClass("/privacy")} href="/privacy" prefetch>Privacy</Link>
          <Link className={linkClass("/terms")} href="/terms" prefetch>Terms</Link>
        </div>
        <div className="ref-footer-words">IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER TOMORROW<i/></div>
      </div>
      <div className="ref-shell ref-footer-bottom">
        <span>© 2026 LINETECH. All rights reserved.</span>
        <span>Every idea starts with a line.</span>
      </div>
    </footer></Localized>
  );
}
