"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/about", "About"],
  ["/start", "Contact"],
] as const;

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="ref-nav ref-shell site-nav global-site-nav">
      <Link className="ref-brand" href="/" prefetch aria-label="LINETECH home">
        <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
      </Link>
      <nav className="ref-nav-links" aria-label="Primary navigation">
        {items.map(([href, label]) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return <Link key={href} href={href} prefetch className={active ? "active" : ""}>{label}</Link>;
        })}
      </nav>
      <div className="ref-nav-end">
        <span className="ref-search" aria-hidden="true">⌕</span>
        <Link className="ref-button light" href="/start" prefetch>Start Your Line <span>→</span></Link>
      </div>
    </header>
  );
}
