import { Mail } from "lucide-react";
import { identity } from "@/content/about";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg text-foreground">
            {identity.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open to interesting backend / AI-leaning roles.
          </p>
        </div>

        <div className="flex items-center gap-5 text-muted-foreground">
          <a
            href={identity.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-accent-soft"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-accent-soft"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={`mailto:${identity.email}`}
            aria-label="Email"
            className="transition-colors hover:text-accent-soft"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-xs text-muted">
        Built with Next.js, deployed on Vercel.
      </p>
    </footer>
  );
}
