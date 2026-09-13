"use client";

import { useEffect } from "react";

const KEY_PREFIX = "linetech-scroll:";

export default function ScrollRestorer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const key = `${KEY_PREFIX}${window.location.pathname}${window.location.search}`;

    const restore = () => {
      const saved = sessionStorage.getItem(key);
      if (!saved) return;
      const y = Number(saved);
      if (!Number.isFinite(y)) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, left: 0, behavior: "auto" });
        });
      });
    };

    const save = () => {
      sessionStorage.setItem(key, String(window.scrollY));
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
