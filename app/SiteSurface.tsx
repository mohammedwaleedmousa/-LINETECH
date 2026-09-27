"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import LanguageBridge from "./LanguageBridge";
import HomeMotion from "./HomeMotion";
import ServicesMotion from "./ServicesMotion";
import NavigationFeedback from "./NavigationFeedback";
import HomeSplash from "./HomeSplash";
import ClientPortalShell from "./ClientPortalShell";

export default function SiteSurface({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  const clientPortal = ["/workspace","/chat","/handover","/account"].some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    document.body.dataset.surface = admin ? "admin" : clientPortal ? "client" : "site";
    if (admin) {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      document.documentElement.dataset.language = "en";
    }
    return () => {
      delete document.body.dataset.surface;
    };
  }, [admin, clientPortal]);

  if (admin) return <>{children}</>;

  if (clientPortal) {
    return (
      <>
        <LanguageBridge />
        <ClientPortalShell>{children}</ClientPortalShell>
      </>
    );
  }

  return (
    <>
      <LanguageBridge />
      <NavigationFeedback />
      <HomeMotion />
      <ServicesMotion />
      <HomeSplash />
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
