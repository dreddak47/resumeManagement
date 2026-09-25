import { aboutParagraphs, interestsNote } from "@/content/about";
import { skillGroups } from "@/content/skills";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="About"
        title="ECE by degree, software by choice"
      />

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          {aboutParagraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <p className="rounded-xl border border-interest/20 bg-interest/5 p-4 text-sm leading-relaxed text-muted-foreground">
              {interestsNote}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-background-elevated/60 p-6">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-accent">
              Toolbox
            </h3>
            <div className="space-y-4">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-xs font-medium text-muted">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
