import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="ref-footer site-footer-global">
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
          <Link href="/services" prefetch>Services</Link>
          <Link href="/projects" prefetch>Projects</Link>
          <Link href="/about" prefetch>About</Link>
          <Link href="/faq" prefetch>FAQ</Link>
          <Link href="/start" prefetch>Contact</Link>
        </div>
        <div>
          <h4>Services</h4>
          <Link href="/services/web-development" prefetch>Web Development</Link>
          <Link href="/services/ecommerce-systems" prefetch>E-commerce & Systems</Link>
          <Link href="/services/brand-identity" prefetch>Brand Identity</Link>
          <Link href="/services/cv-portfolio" prefetch>CV & Portfolio</Link>
        </div>
        <div>
          <h4>Company</h4>
          <span>Aden, Yemen</span>
          <Link href="/start" prefetch>Start Your Line</Link>
          <Link href="/privacy" prefetch>Privacy</Link>
          <Link href="/terms" prefetch>Terms</Link>
        </div>
        <div className="ref-footer-words">IDEAS<br/>SYSTEMS<br/>PEOPLE<br/>A BETTER TOMORROW<i/></div>
      </div>
      <div className="ref-shell ref-footer-bottom">
        <span>© 2026 LINETECH. All rights reserved.</span>
        <span>Every idea starts with a line.</span>
      </div>
    </footer>
  );
}
