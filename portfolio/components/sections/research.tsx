import { Trophy } from "lucide-react";
import { research, codingProfile } from "@/content/research";
import { getCodeforcesStats } from "@/lib/codeforces";
import { getContributionCalendar } from "@/lib/github";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { ContributionHeatmap } from "@/components/contribution-heatmap";

export async function Research() {
  const [cf, calendar] = await Promise.all([
    getCodeforcesStats(),
    getContributionCalendar(),
  ]);

  return (
    <section id="research" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading
        eyebrow="Research & Competitive Programming"
        title="Reading papers, solving problems"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {research.map((entry, i) => (
            <Reveal key={entry.title} delay={i * 0.08}>
              <div className="border-t border-border pt-6">
                <p className="font-display text-lg font-medium text-foreground">
                  {entry.title}
                </p>
                <p className="mt-1 text-sm text-accent-soft">
                  {entry.org} · {entry.period}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
                {entry.link && (
                  <a
                    href={entry.link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-accent underline underline-offset-4"
                  >
                    {entry.link.label} ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="space-y-6">
          <Reveal>
            <Card>
              <div className="mb-3 flex items-center gap-2 text-accent">
                <Trophy size={18} />
                <span className="text-sm font-medium uppercase tracking-[0.15em]">
                  Codeforces
                </span>
              </div>
              <p className="font-display text-3xl font-medium text-foreground">
                {cf.rating ?? "Expert"}
              </p>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {cf.rank ?? codingProfile.note}
                {cf.maxRating ? ` · peak ${cf.maxRating}` : ""}
              </p>
              <a
                href={`https://codeforces.com/profile/${codingProfile.handle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-accent underline underline-offset-4"
              >
                View profile ↗
              </a>
            </Card>
          </Reveal>

          {calendar && (
            <Reveal delay={0.1}>
              <Card>
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-accent">
                  GitHub Activity
                </p>
                <ContributionHeatmap
                  weeks={calendar.weeks}
                  total={calendar.totalContributions}
                />
              </Card>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
