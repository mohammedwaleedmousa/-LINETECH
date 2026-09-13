import type { Metadata, Viewport } from "next";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import LanguageBridge from "./LanguageBridge";
import "./globals.css";
import "./inner.css";
import "./polish.css";
import "./home-reference.css";
import "./home-fix.css";
import "./inner-reference.css";
import "./process-fix.css";
import "./nav-float.css";
import "./full-width.css";
import "./route-motion.css";
import "./final-qa.css";
import "./hero-screen.css";
import "./scroll-fix.css";
import "./final-lock.css";
import "./hero-variants.css";
import "./hero-images.css";
import "./service-detail.css";
import "./project-detail.css";
import "./info-pages.css";
import "./search.css";
import "./v1-frontend-lock.css";
import "./viewport-qa.css";
import "./auth.css";
import "./chat.css";
import "./chat-enhancements.css";
import "./tech-hero.css";
import "./i18n.css";
import "./company-tech.css";
import "./visual-catalog.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linetech.aiengineer77.workers.dev";
const siteDescription = "LINETECH designs and builds web platforms, commerce systems and business software for real operational needs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LINETECH — Technology platforms and systems.",
    template: "%s — LINETECH",
  },
  description: siteDescription,
  applicationName: "LINETECH",
  keywords: ["LINETECH", "web platforms", "commerce systems", "business software", "digital products", "Aden", "Yemen"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "LINETECH — Technology platforms and systems.",
    description: siteDescription,
    siteName: "LINETECH",
    type: "website",
    images: [{ url: "/hero/home.webp", width: 1536, height: 1024, alt: "LINETECH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LINETECH — Technology platforms and systems.",
    description: siteDescription,
    images: ["/hero/home.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

const languageBootstrapScript = `
(() => {
  try {
    const language = localStorage.getItem('linetech-language-v1') === 'en' ? 'en' : 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.language = language;
  } catch (_) {}
})();`;

const scrollRestorationScript = `
(() => {
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const key = 'linetech-scroll:' + location.pathname + location.search;
    const save = () => sessionStorage.setItem(key, String(window.scrollY));
    const restore = () => {
      const raw = sessionStorage.getItem(key);
      if (raw === null) return;
      const y = Number(raw);
      if (!Number.isFinite(y)) return;
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
    };
    addEventListener('scroll', save, { passive: true });
    addEventListener('pagehide', save);
    addEventListener('beforeunload', save);
    addEventListener('load', restore, { once: true });
  } catch (_) {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: languageBootstrapScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
        <LanguageBridge />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
