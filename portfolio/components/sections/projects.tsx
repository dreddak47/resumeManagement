import { projects } from "@/content/projects";
import { getRepoStats } from "@/lib/github";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectsGrid } from "@/components/projects-grid";

export async function Projects() {
  const repos = projects.filter((p) => p.repo).map((p) => p.repo!);
  const stats = await Promise.all(repos.map((repo) => getRepoStats(repo)));
  const stars = Object.fromEntries(
    repos.map((repo, i) => [repo, stats[i].stars])
  );

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="A mix of shipped systems, research-flavored AI/ML work, and a couple of projects built purely because I wanted them to exist. Star counts and activity pull live from GitHub."
      />
      <ProjectsGrid projects={projects} stars={stars} />
    </section>
  );
}
