"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ServicesMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/services") return;

    const root = document.querySelector<HTMLElement>("main.page-services");
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
    if (!sections.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const revealNodes = new Set<HTMLElement>();
    const heroNodes = new Set<HTMLElement>();

    const addReveal = (node: Element | null, delay = 0, variant?: "side") => {
      if (!(node instanceof HTMLElement)) return;
      node.classList.add("services-motion-reveal");
      if (variant === "side") node.classList.add("services-motion-side");
      node.style.setProperty("--services-motion-delay", `${delay}ms`);
      revealNodes.add(node);
    };

    const addHero = (node: Element | null, delay = 0) => {
      if (!(node instanceof HTMLElement)) return;
      node.classList.add("services-motion-hero");
      node.style.setProperty("--services-hero-delay", `${delay}ms`);
      heroNodes.add(node);
    };

    const hero = sections[0];
    const heroCopy = hero?.querySelector<HTMLElement>("h1")?.parentElement ?? null;
    if (heroCopy) {
      const kicker = heroCopy.querySelector("p:first-of-type");
      const title = heroCopy.querySelector("h1");
      const lead = heroCopy.querySelector("h1 + p");
      const actions = heroCopy.querySelector("div:has(> a)");
      addHero(kicker, 70);
      addHero(title, 150);
      addHero(lead, 235);
      addHero(actions, 320);
    }

    hero?.querySelectorAll<HTMLElement>("div[aria-label] > div").forEach((node, index) => {
      addHero(node, 390 + index * 60);
    });

    const services = sections[1];
    if (services) {
      const heading = services.querySelector<HTMLElement>("h2")?.parentElement?.parentElement ?? null;
      addReveal(heading, 0);
      services.querySelectorAll<HTMLElement>("article").forEach((node, index) => {
        addReveal(node, Math.min(index, 5) * 75);
      });
    }

    const outcome = sections[2];
    if (outcome) {
      const outcomeHeading = outcome.querySelector<HTMLElement>("h2")?.parentElement?.parentElement ?? null;
      addReveal(outcomeHeading, 0);

      const panel = outcomeHeading?.nextElementSibling ?? null;
      if (panel instanceof HTMLElement) {
        const panelTop = panel.firstElementChild;
        addReveal(panelTop, 40);
        panel.querySelectorAll<HTMLElement>("a").forEach((node, index) => {
          addReveal(node, 80 + Math.min(index, 5) * 65);
        });
        const helper = panel.lastElementChild;
        if (helper && helper !== panelTop) addReveal(helper, 330);
      }
    }

    const process = sections[3];
    if (process) {
      const processHeading = process.querySelector<HTMLElement>("h2")?.parentElement?.parentElement ?? null;
      addReveal(processHeading, 0);
      process.querySelectorAll<HTMLElement>("article").forEach((node, index) => {
        addReveal(node, index * 70);
      });
    }

    const cta = sections[4];
    if (cta) {
      const ctaInner = cta.querySelector<HTMLElement>(".ref-cta-inner");
      addReveal(ctaInner ?? cta.firstElementChild, 0, "side");
    }

    if (reduceMotion) {
      root.classList.add("services-motion-mounted", "services-motion-reduced");
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    }

    const observer = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              (entry.target as HTMLElement).classList.add("is-visible");
              observer?.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
        );

    observer && revealNodes.forEach((node) => observer.observe(node));

    const heroArt = hero?.querySelector<HTMLElement>(".home-line-art");
    let pointerFrame = 0;

    const resetArt = () => {
      if (!heroArt) return;
      heroArt.style.setProperty("--services-art-x", "0px");
      heroArt.style.setProperty("--services-art-y", "0px");
    };

    const moveArt = (event: PointerEvent) => {
      if (!hero || !heroArt) return;
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));

      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        heroArt.style.setProperty("--services-art-x", `${(x * 5).toFixed(2)}px`);
        heroArt.style.setProperty("--services-art-y", `${(y * 3.5).toFixed(2)}px`);
      });
    };

    if (!reduceMotion && finePointer && hero && heroArt) {
      hero.addEventListener("pointermove", moveArt, { passive: true });
      hero.addEventListener("pointerleave", resetArt);
    }

    const frame = window.requestAnimationFrame(() => root.classList.add("services-motion-mounted"));

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(pointerFrame);
      observer?.disconnect();
      hero?.removeEventListener("pointermove", moveArt);
      hero?.removeEventListener("pointerleave", resetArt);
      resetArt();
      root.classList.remove("services-motion-mounted", "services-motion-reduced");

      heroNodes.forEach((node) => {
        node.classList.remove("services-motion-hero");
        node.style.removeProperty("--services-hero-delay");
      });
      revealNodes.forEach((node) => {
        node.classList.remove("services-motion-reveal", "services-motion-side", "is-visible");
        node.style.removeProperty("--services-motion-delay");
      });
    };
  }, [pathname]);

  return null;
}
