"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Project, ProjectCategory, categoryLabels } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";

const filters: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "systems", label: categoryLabels.systems },
  { key: "ai-ml", label: categoryLabels["ai-ml"] },
  { key: "research", label: categoryLabels.research },
  { key: "interest-driven", label: categoryLabels["interest-driven"] },
];

export function ProjectsGrid({
  projects,
  stars,
}: {
  projects: Project[];
  stars: Record<string, number>;
}) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === f.key
                ? "border-accent bg-accent text-accent-contrast"
                : "border-border text-muted-foreground hover:border-accent/40 hover:text-accent-soft"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2">
        {visible.map((project) => (
          <motion.div
            key={project.slug}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProjectCard
              project={project}
              stars={project.repo ? stars[project.repo] : undefined}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
