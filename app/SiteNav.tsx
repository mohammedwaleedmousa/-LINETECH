"use client";

import Localized, { useLanguage, setLanguage } from "./Localized";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const items = [
  ["/", "Home"],
  ["/services", "Solutions"],
  ["/projects", "Case Studies"],
  ["/about", "Company"],
  ["/chat", "Chat"],
] as const;

const searchItems = [
  { title: "Home", meta: "Page", href: "/", keywords: "home linetech technology الرئيسية LINETECH تقنية" },
  { title: "Solutions", meta: "Page", href: "/services", keywords: "solutions services systems platforms حلول خدمات أنظمة منصات" },
  { title: "Web Development", meta: "Service", href: "/services/web-development", keywords: "website web development platform business custom apps تطوير ويب مواقع منصات تطبيقات" },
  { title: "E-commerce & Systems", meta: "Service", href: "/services/ecommerce-systems", keywords: "ecommerce commerce systems dashboard booking تجارة الكترونية أنظمة لوحات تحكم حجوزات" },
  { title: "Brand Identity", meta: "Service", href: "/services/brand-identity", keywords: "brand branding logo visual identity guidelines هوية بصرية شعار علامة" },
  { title: "CV & Portfolio", meta: "Service", href: "/services/cv-portfolio", keywords: "cv portfolio career personal presence سيرة ذاتية معرض اعمال مهنة" },
  { title: "Case Studies", meta: "Page", href: "/projects", keywords: "projects case studies systems products مشاريع دراسات حالة أنظمة منتجات" },
  { title: "Flamingo Park", meta: "Project", href: "/projects/flamingo-park", keywords: "flamingo park ecommerce retail فلامنجو بارك متجر" },
  { title: "Etqan", meta: "Project", href: "/projects/etqan", keywords: "etqan marketplace services اتقان سوق خدمات" },
  { title: "LedgerPro", meta: "Project", href: "/projects/ledgerpro", keywords: "ledgerpro business system finance ليدجر برو نظام مالي" },
  { title: "About LINETECH", meta: "Page", href: "/about", keywords: "company about founder Mohammed Waleed الشركة عن المؤسس محمد وليد" },
  { title: "FAQ", meta: "Page", href: "/faq", keywords: "faq questions payments revisions support timeline اسئلة شائعة دفعات تعديلات دعم" },
  { title: "Privacy", meta: "Page", href: "/privacy", keywords: "privacy data information project brief خصوصية بيانات معلومات" },
  { title: "Terms", meta: "Page", href: "/terms", keywords: "terms scope payments agreement website شروط نطاق دفعات اتفاق" },
  { title: "Chat", meta: "Client", href: "/chat", keywords: "chat messages conversation support client company project محادثة رسائل دعم عميل شركة" },
  { title: "Login / Create Account", meta: "Account", href: "/login", keywords: "login sign in create account register client workspace تسجيل دخول إنشاء حساب" },
  { title: "Start Project", meta: "Contact", href: "/start", keywords: "contact start project brief build idea تواصل ابدأ مشروع ملخص فكرة" },
] as const;

type SiteLanguage = "ar" | "en";

function GlobeIcon(){
  return <svg className="language-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9z"/></svg>;
}

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const language = useLanguage();
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
    const timer = window.setTimeout(() => inputRef.current?.focus(), 160);
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
  const warmRoute = (href: string) => { router.prefetch(href); };

  function toggleLanguage(){
    const next:SiteLanguage = language === "ar" ? "en" : "ar";
    setLanguage(next);
  }

  return (
    <Localized><>
      <header className="ref-nav ref-shell site-nav global-site-nav">
        <Link className="ref-brand" href="/" prefetch aria-label="LINETECH home" onMouseEnter={()=>warmRoute("/")} onFocus={()=>warmRoute("/")}>
          <span className="ref-mark"><i/><b/></span><strong>LINETECH</strong>
        </Link>
        <nav className="ref-nav-links" aria-label="Primary navigation">
          {items.map(([href, label]) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} prefetch className={active ? "active" : ""} aria-current={active ? "page" : undefined} onMouseEnter={()=>warmRoute(href)} onFocus={()=>warmRoute(href)}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ref-nav-end">
          <button className="language-toggle desktop-language" type="button" onClick={toggleLanguage} aria-label={language === "ar" ? "Switch to English" : "Switch to Arabic"} title={language === "ar" ? "English" : "Arabic"}><GlobeIcon/>{language === "ar" ? "الإنجليزية" : "العربية"}</button>
          <button className={`ref-search search-trigger ${searchOpen ? "active" : ""}`} type="button" aria-label="Search LINETECH" aria-expanded={searchOpen} onClick={() => { setOpen(false); setSearchOpen((value) => !value); }}>⌕</button>
          <Link className="ref-button light desktop-cta" href="/start" prefetch onMouseEnter={()=>warmRoute("/start")} onFocus={()=>warmRoute("/start")}>Start Project <span>→</span></Link>
          <Link className={`nav-login desktop-login ${pathname.startsWith("/login") ? "active" : ""}`} href="/login" prefetch onMouseEnter={()=>warmRoute("/login")} onFocus={()=>warmRoute("/login")}>Login <span>↗</span></Link>
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
              <Link key={href} href={href} prefetch className={active ? "active" : ""} aria-current={active ? "page" : undefined} onMouseEnter={()=>warmRoute(href)} onFocus={()=>warmRoute(href)} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{label}<b>→</b>
              </Link>
            );
          })}
        </nav>
        <button className="mobile-language-toggle" type="button" onClick={toggleLanguage}><span>{language === "ar" ? "English" : "Arabic"}</span><strong>{language === "ar" ? "الإنجليزية" : "العربية"}</strong></button>
        <Link className="mobile-start-line" href="/start" prefetch onMouseEnter={()=>warmRoute("/start")} onFocus={()=>warmRoute("/start")} onClick={() => setOpen(false)}>Start Project <span>→</span></Link>
        <Link className="mobile-login" href="/login" prefetch onMouseEnter={()=>warmRoute("/login")} onFocus={()=>warmRoute("/login")} onClick={() => setOpen(false)}>Login / Create Account <span>↗</span></Link>
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
                  <Link key={`${item.title}-${item.href}`} href={item.href} prefetch onMouseEnter={()=>warmRoute(item.href)} onFocus={()=>warmRoute(item.href)} onClick={() => setSearchOpen(false)}>
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
    </></Localized>
  );
}