import type { Metadata, Viewport } from "next";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import LanguageBridge from "./LanguageBridge";
import HomeMotion from "./HomeMotion";
import ServicesMotion from "./ServicesMotion";
import NavigationFeedback from "./NavigationFeedback";
import HomeSplash from "./HomeSplash";
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
import "./project-case-study.css";
import "./info-pages.css";
import "./search.css";
import "./v1-frontend-lock.css";
import "./viewport-qa.css";
import "./auth.css";
import "./auth-final.css";
import "./chat.css";
import "./chat-enhancements.css";
import "./chat-modern.css";
import "./chat-modern-fix.css";
import "./tech-hero.css";
import "./i18n.css";
import "./home-motion.css";
import "./services-motion.css";
import "./projects-motion.css";
import "./home-spacing.css";
import "./language-startup.css";
import "./home-neurons.css";
import "./site-home-theme.css";
import "./service-detail-compact.css";
import "./service-detail-engagement.css";
import "./service-detail-hero-unified.css";
import "./footer-enhanced.css";
import "./footer-compact.css";
import "./nav-tablet-qa.css";
import "./responsive-contact-process-fix.css";
import "./frontend-final-qa.css";
import "./home-splash.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linetech.aiengineer77.workers.dev";
const siteDescription = "LINETECH is a technology company that turns ideas into real digital products through strategy, design and engineering.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LINETECH — Every idea starts with a line.",
    template: "%s — LINETECH",
  },
  description: siteDescription,
  applicationName: "LINETECH",
  keywords: ["LINETECH", "web development", "brand identity", "digital products", "Aden", "Yemen"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "LINETECH — Every idea starts with a line.",
    description: siteDescription,
    siteName: "LINETECH",
    type: "website",
    images: [{ url: "/hero/home.webp", width: 1536, height: 1024, alt: "LINETECH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LINETECH — Every idea starts with a line.",
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
    const stored = localStorage.getItem('linetech-language-v1');
    const cookieMatch = document.cookie.match(/(?:^|; )linetech-language-v1=(ar|en)(?:;|$)/);
    const cookieLanguage = cookieMatch ? cookieMatch[1] : null;
    const language = stored === 'ar' || stored === 'en' ? stored : cookieLanguage === 'ar' || cookieLanguage === 'en' ? cookieLanguage : 'en';
    if (language === 'ar') document.documentElement.classList.add('language-hydrating');
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.language = language;
  } catch (_) {}
})();`;

const homeSplashBootstrapScript = `
(() => {
  try {
    const path = window.location.pathname.replace(/\\/+$/, '') || '/';
    if (path === '/' || path === '/index.html') {
      document.documentElement.classList.add('home-splash-pre');
      window.setTimeout(() => document.documentElement.classList.remove('home-splash-pre'), 2500);
    }
  } catch (_) {}
})();`;

const scrollRestorationScript = `
(() => {
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
  } catch (_) {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: homeSplashBootstrapScript }} />
        <script dangerouslySetInnerHTML={{ __html: languageBootstrapScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
        <LanguageBridge />
        <NavigationFeedback />
        <HomeMotion />
        <ServicesMotion />
        <HomeSplash />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
