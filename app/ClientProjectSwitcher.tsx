"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./Localized";

type ClientProject = {
  id: string;
  title: string;
  status: string;
  phase: number;
  updatedAt?: string;
  dueDate?: string;
};

type Props = {
  currentProjectId?: string | null;
  className?: string;
};

export default function ClientProjectSwitcher({ currentProjectId, className = "" }: Props) {
  const language = useLanguage();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json().catch(() => null) as {
          ok?: boolean;
          projects?: ClientProject[];
        } | null;
        if (!cancelled && payload?.ok && Array.isArray(payload.projects)) {
          setProjects(payload.projects);
        }
      } catch {
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeId = useMemo(() => {
    if (currentProjectId && projects.some(project => project.id === currentProjectId)) return currentProjectId;
    return projects[0]?.id || "";
  }, [currentProjectId, projects]);

  if (!loaded || projects.length <= 1) return null;

  const label = language === "ar" ? "المشروع الحالي" : "CURRENT PROJECT";
  const phaseLabel = language === "ar" ? "مرحلة" : "Phase";

  function changeProject(projectId: string) {
    if (!projectId || projectId === activeId) return;
    const url = new URL(window.location.href);
    url.searchParams.set("project", projectId);
    window.location.assign(url.pathname + url.search + url.hash);
  }

  return (
    <div className={`client-project-switcher ${className}`.trim()}>
      <span>{label}</span>
      <div className="client-project-switcher-control">
        <select
          value={activeId}
          onChange={event => changeProject(event.target.value)}
          aria-label={language === "ar" ? "اختر المشروع" : "Choose project"}
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.title} · {phaseLabel} {project.phase}/5 · {project.status}
            </option>
          ))}
        </select>
        <i aria-hidden="true">⌄</i>
      </div>
    </div>
  );
}
