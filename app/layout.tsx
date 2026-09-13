import type { Metadata, Viewport } from "next";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
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

const siteDescription = "LINETECH is a technology company that turns ideas into real digital products through strategy, design and engineering.";

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "LINETECH — Every idea starts with a line.",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

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
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
