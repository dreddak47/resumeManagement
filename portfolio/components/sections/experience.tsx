import { experience } from "@/content/experience";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Experience"
        title="What I've been building at work"
      />

      <div className="space-y-8">
        {experience.map((entry, i) => (
          <Reveal key={entry.role + entry.period} delay={i * 0.1}>
            <div className="grid gap-4 border-t border-border pt-8 sm:grid-cols-[220px_1fr]">
              <div>
                <p className="font-display text-lg font-medium text-foreground">
                  {entry.role}
                </p>
                <p className="text-sm text-accent-soft">{entry.org}</p>
                <p className="mt-1 text-xs text-muted">{entry.period}</p>
              </div>

              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {entry.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {entry.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.tech.map((t) => (
                    <Badge key={t} variant="accent">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
