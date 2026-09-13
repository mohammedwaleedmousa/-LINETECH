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
      <div className="footer-tech-signal" aria-hidden="true">
        <svg viewBox="0 0 1600 320" fill="none" preserveAspectRatio="none" focusable="false">
          <path className="footer-signal-line footer-signal-a" d="M-40 244C170 156 310 238 500 176S845 80 1034 142s310 24 610-78"/>
          <path className="footer-signal-line footer-signal-b" d="M-30 282C210 214 382 286 584 214S900 118 1122 190s326 36 520-16"/>
          <path className="footer-signal-line footer-signal-c" d="M170 36C306 98 370 92 486 60s240-18 342 26 222 74 346 30 210-72 346-38"/>
          <g className="footer-signal-nodes">
            <circle cx="248" cy="194" r="3"/><circle cx="500" cy="176" r="3.5"/><circle cx="742" cy="116" r="2.7"/>
            <circle cx="1034" cy="142" r="3.5"/><circle cx="1280" cy="126" r="2.8"/><circle cx="584" cy="214" r="2.8"/>
            <circle cx="1122" cy="190" r="3"/><circle cx="486" cy="60" r="2.6"/><circle cx="828" cy="86" r="2.7"/>
          </g>
          <g className="footer-signal-pulses">
            <circle cx="500" cy="176" r="12"/><circle cx="1034" cy="142" r="14"/><circle cx="1122" cy="190" r="11"/>
          </g>
        </svg>
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
