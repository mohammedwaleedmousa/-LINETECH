"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const items = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/projects", "Projects"],
  ["/about", "About"],
  ["/start", "Contact"],
  ["/chat", "Chat"],
] as const;

const searchItems = [
  { title: "Home", meta: "Page", href: "/", keywords: "home linetech technology" },
  { title: "Services", meta: "Page", href: "/services", keywords: "services solutions" },
  { title: "Web Development", meta: "Service", href: "/services/web-development", keywords: "website web development landing business custom apps" },
  { title: "E-commerce & Systems", meta: "Service", href: "/services/ecommerce-systems", keywords: "ecommerce commerce systems dashboard booking" },
  { title: "Brand Identity", meta: "Service", href: "/services/brand-identity", keywords: "brand branding logo visual identity guidelines" },
  { title: "CV & Portfolio", meta: "Service", href: "/services/cv-portfolio", keywords: "cv portfolio career personal presence" },
  { title: "Projects", meta: "Page", href: "/projects", keywords: "projects work portfolio products" },
  { title: "Flamingo Park", meta: "Project", href: "/projects/flamingo-park", keywords: "flamingo park ecommerce retail" },
  { title: "Etqan", meta: "Project", href: "/projects/etqan", keywords: "etqan marketplace services" },
  { title: "LedgerPro", meta: "Project", href: "/projects/ledgerpro", keywords: "ledgerpro business system finance" },
  { title: "About LINETECH", meta: "Page", href: "/about", keywords: "about company founder Mohammed Waleed" },
  { title: "FAQ", meta: "Page", href: "/faq", keywords: "faq questions payments revisions support timeline" },
  { title: "Privacy", meta: "Page", href: "/privacy", keywords: "privacy data information project brief" },
  { title: "Terms", meta: "Page", href: "/terms", keywords: "terms scope payments agreement website" },
  { title: "Chat", meta: "Client", href: "/chat", keywords: "chat messages conversation support client company project" },
  { title: "Login / Create Account", meta: "Account", href: "/login", keywords: "login sign in create account register client workspace" },
  { title: "Start Your Line", meta: "Contact", href: "/start", keywords: "contact start project brief build idea" },
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;

    document.documentElement.classList.add("search-scroll-lock");
    document.body.classList.add("search-scroll-lock");

    const timer = window.setTimeout(() => inputRef.current?.focus(), 360);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("search-scroll-lock");
      document.body.classList.remove("search-scroll-lock");
    };
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchItems.slice(0, 5);
    return searchItems.filter((item) => `${item.title} ${item.meta} ${item.keywords}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="ref-nav ref-shell site-nav global-site-nav">
        <Link className="ref-brand" href="/" prefetch aria-label="LINETECH home">
          <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
        </Link>
        <nav className="ref-nav-links" aria-label="Primary navigation">
          {items.map(([href, label]) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} prefetch className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ref-nav-end">
          <button className={`ref-search search-trigger ${searchOpen ? "active" : ""}`} type="button" aria-label="Search LINETECH" aria-expanded={searchOpen} onClick={() => { setOpen(false); setSearchOpen((value) => !value); }}>⌕</button>
          <Link className="ref-button light desktop-cta" href="/start" prefetch>Start Your Line <span>→</span></Link>
          <Link className={`nav-login desktop-login ${pathname.startsWith("/login") ? "active" : ""}`} href="/login" prefetch>Login <span>↗</span></Link>
          <button className={`mobile-menu-button ${open ? "open" : ""}`} type="button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { setSearchOpen(false); setOpen(v => !v); }}>
            <i/><i/>
          </button>
        </div>
      </header>

      <div id="mobile-navigation" className={`mobile-menu-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {items.map(([href, label], index) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} prefetch className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{label}<b>→</b>
              </Link>
            );
          })}
        </nav>
        <Link className="mobile-start-line" href="/start" prefetch onClick={() => setOpen(false)}>Start Your Line <span>→</span></Link>
        <Link className="mobile-login" href="/login" prefetch onClick={() => setOpen(false)}>Login / Create Account <span>↗</span></Link>
      </div>

      {searchOpen && (
        <div className="site-search-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <div className="site-search-panel" role="dialog" aria-modal="false" aria-label="Search LINETECH">
            <div className="site-search-rail" aria-hidden="true"><i/><i/><i/></div>
            <div className="site-search-topline">
              <span>SEARCH / LINETECH</span>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">ESC <b>×</b></button>
            </div>
            <div className="site-search-content">
              <div className="site-search-field">
                <span aria-hidden="true">⌕</span>
                <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" aria-label="Search" />
              </div>
              <div className="site-search-caption">
                <span>{query ? "SEARCH RESULTS" : "QUICK ACCESS"}</span>
                <span>{results.length.toString().padStart(2, "0")}</span>
              </div>
              <div className="site-search-results" aria-live="polite">
                {results.length > 0 ? results.map((item, index) => (
                  <Link key={`${item.title}-${item.href}`} href={item.href} prefetch onClick={() => setSearchOpen(false)}>
                    <span className="site-search-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="site-search-title">{item.title}<small>{item.meta}</small></span>
                    <b>→</b>
                  </Link>
                )) : <p className="site-search-empty">No results found. Try another word.</p>}
              </div>
              <div className="site-search-hint"><span>Type to search</span><span>ESC to close</span></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
