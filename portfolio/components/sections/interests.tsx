import { projects } from "@/content/projects";
import { getRepoStats } from "@/lib/github";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";

export async function Interests() {
  const featured = projects.filter((p) =>
    p.categories.includes("interest-driven")
  );
  const stats = await Promise.all(
    featured.map((p) => (p.repo ? getRepoStats(p.repo) : null))
  );
  const stars = Object.fromEntries(
    featured.map((p, i) => [p.slug, stats[i]?.stars])
  );

  return (
    <section
      id="interests"
      className="relative mx-auto max-w-5xl px-6 py-24"
    >
      <SectionHeading
        eyebrow="Where interests meet engineering"
        title="A quieter side project cluster"
        description="I try to live by a set of spiritual principles outside of work — mindfulness, discipline, a daily practice. Rather than keep that separate from engineering, a couple of my side projects apply the same rigor I use at work to things I actually care about personally."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <ProjectCard project={project} stars={stars[project.slug]} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          With Vedaspace, I got curious about whether serious retrieval
          engineering — hybrid search, citation verification, a real eval
          harness — could make an AI system trustworthy enough to study
          Sanskrit source texts with, instead of trusting a model's
          paraphrase. With chantBetter, I wanted an honest, on-device tool
          for my own daily chanting practice, which turned into a small
          research problem in real-time audio ML and error-taxonomy design.
          Neither is about the technology for its own sake — they exist
          because the practice mattered enough to me to build for.
        </p>
      </Reveal>
    </section>
  );
}
