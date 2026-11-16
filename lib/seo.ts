import type { Metadata } from "next";

export const SITE_URL = "https://linetech.company";
export const siteDescription = "LINETECH is a founder-led technology company in Aden, Yemen, building websites, mobile applications and business systems, with ongoing support.";
export const canonicalUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : `${path.replace(/\/$/, "")}/`}`;
export const socialImage = { url: "/brand/social-card.png", width: 1200, height: 630, alt: "LINETECH — Every idea starts with a line." };

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = `${title} — LINETECH`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: { title: fullTitle, description, url: canonicalUrl(path), siteName: "LINETECH", type: "website", images: [socialImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage.url] },
  };
}
