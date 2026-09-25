import { ExternalLink, Star } from "lucide-react";
import { Project, categoryLabels } from "@/content/projects";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GITHUB_USER } from "@/lib/github";
import { GithubIcon } from "@/components/ui/brand-icons";

export function ProjectCard({
  project,
  stars,
}: {
  project: Project;
  stars?: number;
}) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {project.categories.map((c) => (
            <Badge
              key={c}
              variant={c === "interest-driven" ? "interest" : "default"}
            >
              {categoryLabels[c]}
            </Badge>
          ))}
        </div>

        <h3 className="font-display text-xl font-medium text-foreground">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-accent-soft">{project.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-4 space-y-1.5">
          {project.highlights.slice(0, 3).map((h) => (
            <li
              key={h}
              className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted">{project.period}</span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {typeof stars === "number" && stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Star size={13} /> {stars}
              </span>
            )}
            {project.repo && (
              <a
                href={`https://github.com/${GITHUB_USER}/${project.repo}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="transition-colors hover:text-accent-soft"
              >
                <GithubIcon size={16} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} live demo`}
                className="transition-colors hover:text-accent-soft"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
