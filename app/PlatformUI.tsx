"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useLanguage } from "./Localized";

export function PlatformIcon({ kind = "grid" }: { kind?: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    websites: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 13l-2 2 2 2m8-4 2 2-2 2m-5 1 2-6"/></>,
    "mobile-apps": <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2M9 9h6m-6 4h4"/></>,
    "software-saas": <><path d="M8 17H6a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 7a5 5 0 0 1 0 10h-2M12 13v8m-3-3 3 3 3-3"/></>,
    "brand-design": <><path d="m12 3 8 5-3 11H7L4 8l8-5Zm0 0v9m-5 7 5-7 5 7"/><circle cx="12" cy="12" r="2"/></>,
    "templates-tools": <><path d="M3 7h18M7 3v18"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M11 11h6m-6 4h4"/></>,
    "technical-services": <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/></>,
    book: <><path d="M12 5v16M3 4h4a5 5 0 0 1 5 3 5 5 0 0 1 5-3h4v15h-4a5 5 0 0 0-5 2 5 5 0 0 0-5-2H3V4Z"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 4 9-4"/></>,
    shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind] || paths.grid}</svg>;
}

export function PlatformHero({ eyebrow, title, description, icon = "grid", children }: {
  eyebrow: string; title: string; description: string; icon?: string; children?: ReactNode;
}) {
  return <header className="platform-hero">
    <div className="platform-hero-copy">
      <p className="platform-eyebrow"><span/> LINETECH / {eyebrow}</p>
      <h1>{title}</h1><p className="platform-lead">{description}</p>
      {children && <div className="platform-hero-actions">{children}</div>}
    </div>
    <div className="platform-hero-art" aria-hidden="true"><div className="platform-orbit platform-orbit-one"/><div className="platform-orbit platform-orbit-two"/><div className="platform-art-core"><PlatformIcon kind={icon}/></div><span className="platform-art-label">EVERY IDEA STARTS WITH A LINE.</span><i className="platform-art-point"/></div>
  </header>;
}

export function PlatformEmpty({ icon = "grid", title, body, children }: { icon?: string; title: string; body: string; children?: ReactNode }) {
  return <div className="platform-empty" role="status"><span className="platform-empty-icon"><PlatformIcon kind={icon}/></span><h2>{title}</h2><p>{body}</p>{children && <div className="platform-empty-actions">{children}</div>}</div>;
}

export function CategoryCard({ slug, title, index, href }: { slug: string; title: string; index: number; href?:string }) {
  const ar = useLanguage() === "ar";
  return <Link className="platform-card platform-category-card" href={href || `/products?category=${encodeURIComponent(slug)}`}>
    <div className="platform-card-top"><span className="platform-card-icon"><PlatformIcon kind={slug}/></span><small>{String(index + 1).padStart(2, "0")}</small></div>
    <h2>{title}</h2><div className="platform-card-foot"><span>{ar ? "استكشف الفئة" : "Explore category"}</span><PlatformIcon kind="arrow"/></div>
  </Link>;
}
