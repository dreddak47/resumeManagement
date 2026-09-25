import { ArrowUpRight, Mail } from "lucide-react";
import { identity } from "@/content/about";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function Hero() {
  return (
    <section
      id="top"
      className="bg-noise relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-10%] -z-10 mx-auto h-[420px] max-w-3xl rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-accent">
            Ideas, mostly. Then code.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="font-display max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            I get a lot of ideas. AI is how I stop losing them.
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {identity.tagline}. I vibe code the first draft of pretty much
            everything now — then I'm the one who takes it the rest of the
            way. Currently doing that day-to-day at{" "}
            <span className="text-foreground">Directi (Titan Email)</span>,
            and constantly on the side.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-transform hover:-translate-y-0.5"
            >
              See my work
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent-soft"
            >
              Download resume
            </a>

            <div className="ml-1 flex items-center gap-3 text-muted-foreground">
              <a
                href={identity.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-accent-soft"
              >
                <GithubIcon size={19} />
              </a>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-accent-soft"
              >
                <LinkedinIcon size={19} />
              </a>
              <a
                href={`mailto:${identity.email}`}
                aria-label="Email"
                className="transition-colors hover:text-accent-soft"
              >
                <Mail size={19} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
