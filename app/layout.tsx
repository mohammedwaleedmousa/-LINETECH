import type { Metadata, Viewport } from "next";
import SiteSurface from "./SiteSurface";
import "./site.css";

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
    const path = window.location.pathname.replace(/\\/+$/, '') || '/';
    if (path === '/admin' || path.startsWith('/admin/')) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.documentElement.dataset.language = 'en';
      return;
    }
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
        <script dangerouslySetInnerHTML={{ __html: languageBootstrapScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
        <SiteSurface>{children}</SiteSurface>
      </body>
    </html>
  );
}
