import type { Metadata, Viewport } from "next";
import SiteSurface from "./SiteSurface";
import "./site.css";

import { SITE_URL, siteDescription, socialImage } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LINETECH — Every idea starts with a line.", template: "%s — LINETECH" },
  description: siteDescription,
  applicationName: "LINETECH",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/brand/safari-pinned-tab.svg", color: "#050708" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { title: "LINETECH", description: siteDescription, siteName: "LINETECH", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "LINETECH", description: siteDescription, images: [socialImage.url] },
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
