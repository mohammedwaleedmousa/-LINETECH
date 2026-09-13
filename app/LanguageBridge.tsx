"use client";

import { useEffect } from "react";
import { useLanguage } from "./Localized";
import { translate } from "./translations";

export default function LanguageBridge() {
  const language = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = language;
    document.body.dataset.language = language;
    document.documentElement.classList.remove("language-hydrating");

    // Next updates route metadata separately from the page's React content.
    const originals = new Map<Element, { source: string; rendered: string }>();
    const applyMetadata = () => {
      document.head.querySelectorAll('title, meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]').forEach(element => {
        const isTitle = element.tagName === "TITLE";
        const current = isTitle ? element.textContent || "" : element.getAttribute("content") || "";
        const previous = originals.get(element);
        const source = previous && previous.rendered === current ? previous.source : current;
        const rendered = translate(source, language);
        originals.set(element, { source, rendered });
        if (current === rendered) return;
        if (isTitle) element.textContent = rendered;
        else element.setAttribute("content", rendered);
      });
    };
    applyMetadata();
    const observer = new MutationObserver(applyMetadata);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["content"] });
    return () => {
      observer.disconnect();
      originals.forEach(({ source, rendered }, element) => {
        if (element.tagName === "TITLE" && element.textContent === rendered) element.textContent = source;
        else if (element.getAttribute("content") === rendered) element.setAttribute("content", source);
      });
    };
  }, [language]);
  return null;
}
