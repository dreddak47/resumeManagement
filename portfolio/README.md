# Portfolio

Aekansh Kathunia's personal portfolio — public-facing, frontend-only. Next.js (App Router) + TypeScript + Tailwind + Framer Motion, deployed on Vercel.

## Content architecture

- `content/*.ts` — curated, public-safe copy (about, experience, projects, research, skills), hand-written from the private `../context/*.md` store but sanitized (no internal notes, no notice-period mentions).
- `lib/github.ts`, `lib/codeforces.ts` — server-side fetchers for live data (repo stars, GitHub contribution calendar, Codeforces rating), each with a safe static fallback if the API call fails.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` and optionally set `GITHUB_TOKEN` (a read-only PAT, no scopes needed for public data) to enable the GitHub contribution-calendar heatmap and raise the unauthenticated REST rate limit. The site works without it — that section is simply omitted and repo stats fall back to static defaults.

## Deploy

Deploy to Vercel with the project root directory set to `portfolio/` (this is a subfolder of the `resumeManagement` monorepo, not its own repo).
