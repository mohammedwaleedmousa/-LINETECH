"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PENDING_CLASS = "route-pending";

function clearPending() {
  document.documentElement.classList.remove(PENDING_CLASS);
}

export default function NavigationFeedback() {
  const pathname = usePathname();

  useEffect(() => {
    let safetyTimer = 0;

    const beginNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try { url = new URL(anchor.href, window.location.href); }
      catch { return; }

      if (url.origin !== window.location.origin) return;
      const sameRoute = url.pathname === window.location.pathname && url.search === window.location.search;
      if (sameRoute) return;

      document.documentElement.classList.add(PENDING_CLASS);
      window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(clearPending, 8000);
    };

    document.addEventListener("click", beginNavigation, true);
    return () => {
      document.removeEventListener("click", beginNavigation, true);
      window.clearTimeout(safetyTimer);
      clearPending();
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(clearPending);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return <div className="route-progress" aria-hidden="true"><i /></div>;
}
