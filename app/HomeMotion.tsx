"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  ".ref-section-heading",
  ".ref-about-copy",
  ".ref-about-art",
  ".ref-about-lockup",
  ".process-center-head",
  ".home-faq-intro",
  ".ref-cta-inner",
];

const STAGGER_GROUPS = [
  ".ref-service-grid .ref-service-card",
  ".ref-project-grid .home-project-card",
  ".process-center-grid .process-center-card",
  ".home-commitment-grid > article",
  ".home-faq-list > details",
];

export default function HomeMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.querySelector<HTMLElement>("main.ref-home");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = new Set<HTMLElement>();

    REVEAL_SELECTORS.forEach((selector) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        node.classList.add("home-motion-reveal");
        revealNodes.add(node);
      });
    });

    STAGGER_GROUPS.forEach((selector) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((node, index) => {
        node.classList.add("home-motion-reveal", "home-motion-stagger");
        node.style.setProperty("--home-motion-delay", `${Math.min(index, 5) * 70}ms`);
        revealNodes.add(node);
      });
    });

    const heroItems = root.querySelectorAll<HTMLElement>(
      ".ref-hero-copy > .ref-kicker, .ref-hero-copy > h1, .ref-hero-copy > .ref-lead, .ref-hero-copy > .ref-actions, .ref-hero-copy > .ref-stats"
    );

    heroItems.forEach((node, index) => {
      node.classList.add("home-motion-hero");
      node.style.setProperty("--home-hero-delay", `${80 + index * 85}ms`);
    });

    if (reduceMotion) {
      root.classList.add("home-motion-mounted", "home-motion-reduced");
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const frame = window.requestAnimationFrame(() => {
      root.classList.add("home-motion-mounted");
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      root.classList.remove("home-motion-mounted", "home-motion-reduced");
      heroItems.forEach((node) => {
        node.classList.remove("home-motion-hero");
        node.style.removeProperty("--home-hero-delay");
      });
      revealNodes.forEach((node) => {
        node.classList.remove("home-motion-reveal", "home-motion-stagger", "is-visible");
        node.style.removeProperty("--home-motion-delay");
      });
    };
  }, [pathname]);

  return null;
}
