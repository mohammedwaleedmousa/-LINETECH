"use client";

import { ReactNode, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import LanguageBridge from "./LanguageBridge";
import HomeMotion from "./HomeMotion";
import ServicesMotion from "./ServicesMotion";
import NavigationFeedback from "./NavigationFeedback";

export default function SiteSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  useEffect(() => {
    document.body.dataset.surface = admin ? "admin" : "site";
    if (admin) {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      document.documentElement.dataset.language = "en";
    }
    return () => {
      delete document.body.dataset.surface;
    };
  }, [admin]);

  if (admin) return <>{children}</>;

  return (
    <>
      <LanguageBridge />
      <NavigationFeedback />
      <HomeMotion />
      <ServicesMotion />
      <Suspense fallback={null}>
        <SiteNav />
      </Suspense>
      {children}
      <SiteFooter />
    </>
  );
}
