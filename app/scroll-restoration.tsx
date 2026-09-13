"use client";

import { useEffect } from "react";

const KEY = "linetech-scroll-y";

export default function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const restore = () => {
      const saved = sessionStorage.getItem(KEY);
      if (!saved) return;
      const y = Number(saved);
      if (!Number.isFinite(y)) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
    };

    const save = () => {
      sessionStorage.setItem(KEY, String(window.scrollY));
    };

    restore();
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);

    return () => {
      save();
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  return null;
}
