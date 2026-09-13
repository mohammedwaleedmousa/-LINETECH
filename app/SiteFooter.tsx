"use client";

import Localized from "./Localized";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <Localized><footer className="ref-footer site-footer-global">
      <div className="ref-shell ref-footer-grid">
        <div className="ref-footer-brand">
          <Link className="ref-brand" href="/" prefetch>
            <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
          </Link>
          <p>Technology for a brighter tomorrow.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <Link href="/" prefetch>Home</Link>
          <Link href="/services" prefetch>Solutions</Link>
          <Link href="/projects" prefetch>Case Studies</Link>
          <Link href="/about" prefetch>Company</Link>
          <Link href="/chat" prefetch>Chat</Link>
          <Link href="/faq" prefetch>FAQ</Link>
        </div>
        <div className="footer-quick-links">
          <h4>Technology</h4>
          <Link href="/services/web-development" prefetch>Web Development</Link>
          <Link href="/services/ecommerce-systems" prefetch>E-commerce & Systems</Link>
          <Link href="/projects/ledgerpro" prefetch>Business Systems</Link>
          <Link href="/projects" prefetch>Case Studies</Link>
        </div>
        <div>
          <h4>Company</h4>
          <span>Aden, Yemen</span>
          <Link href="/start" prefetch>Start Project</Link>
          <Link href="/privacy" prefetch>Privacy</Link>
          <Link href="/terms" prefetch>Terms</Link>
        </div>
        <div className="ref-footer-words">PLATFORMS<br/>SYSTEMS<br/>SOFTWARE<br/>OPERATIONS<i/></div>
      </div>
      <div className="ref-shell ref-footer-bottom">
        <span>© 2026 LINETECH. All rights reserved.</span>
        <span>Every idea starts with a line.</span>
      </div>
    </footer></Localized>
  );
}