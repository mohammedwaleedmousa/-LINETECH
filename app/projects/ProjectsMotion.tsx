"use client";

import { useEffect } from "react";

export default function ProjectsMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main.page-projects");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const revealNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-project-motion='reveal'],[data-project-motion='card']"));
    const heroNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-project-motion='hero']"));

    heroNodes.forEach((node, index) => {
      node.classList.add("projects-motion-hero");
      node.style.setProperty("--projects-hero-delay", `${70 + index * 75}ms`);
    });

    revealNodes.forEach((node, index) => {
      node.classList.add("projects-motion-reveal");
      if (node.dataset.projectMotion === "card") {
        node.style.setProperty("--projects-motion-delay", `${Math.min(index, 4) * 70}ms`);
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

    const hero = root.querySelector<HTMLElement>("[data-project-hero]");
    const field = root.querySelector<HTMLElement>("[data-project-field]");
    let pointerFrame = 0;

    const reset = () => {
      field?.style.setProperty("--project-field-x", "0px");
      field?.style.setProperty("--project-field-y", "0px");
    };

    const move = (event: PointerEvent) => {
      if (!hero || !field) return;
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        field.style.setProperty("--project-field-x", `${(x * 5).toFixed(2)}px`);
        field.style.setProperty("--project-field-y", `${(y * 3).toFixed(2)}px`);
      });
    };

    if (!reduced && finePointer && hero && field) {
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", reset);
    }

    const frame = requestAnimationFrame(() => root.classList.add("projects-motion-mounted"));

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      observer?.disconnect();
      hero?.removeEventListener("pointermove", move);
      hero?.removeEventListener("pointerleave", reset);
      reset();
      root.classList.remove("projects-motion-mounted");
      heroNodes.forEach((node) => {
        node.classList.remove("projects-motion-hero");
        node.style.removeProperty("--projects-hero-delay");
      });
      revealNodes.forEach((node) => {
        node.classList.remove("projects-motion-reveal", "is-visible");
        node.style.removeProperty("--projects-motion-delay");
      });
    };
  }, []);

  return null;
}
