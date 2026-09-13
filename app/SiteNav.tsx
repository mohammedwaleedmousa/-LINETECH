"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/about", "About"],
  ["/start", "Contact"],
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="ref-nav ref-shell site-nav global-site-nav">
        <Link className="ref-brand" href="/" prefetch aria-label="LINETECH home">
          <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
        </Link>
        <nav className="ref-nav-links" aria-label="Primary navigation">
          {items.map(([href, label]) => (
            <Link key={href} href={href} prefetch className={isActive(href) ? "active" : ""}>{label}</Link>
          ))}
        </nav>
        <div className="ref-nav-end">
          <span className="ref-search" aria-hidden="true">⌕</span>
          <Link className="ref-button light desktop-cta" href="/start" prefetch>Start Your Line <span>→</span></Link>
          <button className={`mobile-menu-button ${open ? "open" : ""}`} type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(v => !v)}>
            <i/><i/>
          </button>
        </div>
      </header>
      <div className={`mobile-menu-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {items.map(([href, label], index) => (
            <Link key={href} href={href} prefetch className={isActive(href) ? "active" : ""} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{label}<b>→</b>
            </Link>
          ))}
        </nav>
        <Link className="mobile-start-line" href="/start" prefetch onClick={() => setOpen(false)}>Start Your Line <span>→</span></Link>
      </div>
    </>
  );
}
