"use client";

import { useEffect } from "react";

export default function AboutMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main.page-about");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-about-motion='hero']"));
    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-about-motion='reveal'],[data-about-motion='stagger']"));

    heroNodes.forEach((node, index) => {
      node.classList.add("about-motion-hero");
      node.style.setProperty("--about-hero-delay", `${75 + index * 78}ms`);
    });

    let staggerIndex = 0;
    revealNodes.forEach((node) => {
      node.classList.add("about-motion-reveal");
      if (node.dataset.aboutMotion === "stagger") {
        node.classList.add("about-motion-stagger");
        node.style.setProperty("--about-motion-delay", `${(staggerIndex % 4) * 70}ms`);
        staggerIndex += 1;
      }
    });

    const observer = reduced ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add("is-visible");
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    if (reduced) revealNodes.forEach((node) => node.classList.add("is-visible"));
    else revealNodes.forEach((node) => observer?.observe(node));

    const frame = requestAnimationFrame(() => root.classList.add("about-motion-mounted"));

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      root.classList.remove("about-motion-mounted");
      heroNodes.forEach((node) => {
        node.classList.remove("about-motion-hero");
        node.style.removeProperty("--about-hero-delay");
      });
      revealNodes.forEach((node) => {
        node.classList.remove("about-motion-reveal", "about-motion-stagger", "is-visible");
        node.style.removeProperty("--about-motion-delay");
      });
    };
  }, []);

  return null;
}
