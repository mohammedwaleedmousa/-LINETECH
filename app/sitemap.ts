import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linetech.aiengineer77.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/services/web-development",
    "/services/ecommerce-systems",
    "/services/brand-identity",
    "/services/cv-portfolio",
    "/projects",
    "/projects/flamingo-park",
    "/projects/etqan",
    "/projects/ledgerpro",
    "/about",
    "/faq",
    "/start",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" || route === "/projects" || route === "/start" ? 0.9 : 0.7,
  }));
}
