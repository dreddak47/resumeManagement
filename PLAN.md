# End-Goal Plan: Personal Resume Management Web App

## Vision
A private, single-user (Aekansh-only) web app for managing his job search: resume versioning, JD-driven tailoring via AI agents, AI-based review, and eventually a personal portfolio/recruiter-facing agent. Deployed from a private GitHub repo, accessible from anywhere. This repo (`resumeManagement`) is the seed of that app — everything built in this session (context store, base resumes, skills, agents) is v0 of the app's data/logic layer, not throwaway scaffolding.

## Design principles (carried over from his own prior architecture instincts — see `context/projects/cortex.md`)
- **Contracts/context first, UI later.** Cortex shows he already defaults to this — the context store and skills built in this session are the equivalent of Cortex's "contracts before implementation" phase, applied to resume management instead of code orchestration.
- **Local-first data, thin hosted layer.** The context store (`context/*.md`) and resumes (`resumes/*.tex`) are the source of truth, versioned in git. The web app is a UI/orchestration layer on top, not a new source of truth — avoids a painful migration later and keeps everything readable/editable without the app (as it is today).
- **Cost governance for AI calls**, same pattern as Cortex's dual-rail budget gates — tailoring/review agents will call LLMs; even at solo-user scale, cap spend per JD-tailoring run and log it.
- **Single-user auth, but do it properly anyway** — even though it's just him, do NOT skip auth on a deployed app with his personal data (health-adjacent content is out of scope here, but resume/career data plus API keys still deserve real auth, not a hidden URL).

## Phases

### Phase 0 — Context & template layer (this session, done)
- `context/` — profile, work experience, per-project state (current vs. vision), resume strategy.
- `resumes/{sde,aiml,fde}.tex` — three base one-pagers.
- `.claude/skills/{jd-analyze,tailor-resume}` — reusable tailoring workflow, usable today from any Claude Code session in this repo, before any web app exists.
- `.claude/agents/{resume-fact-checker,resume-reviewer}` — review/verification agents.
- **Immediate next action even before building the app:** use these skills manually (via Claude Code in this repo) for real job applications now, during the notice period. The app should productize a workflow that's already proven manually, not invent one from scratch.

### Phase 1 — Repo/data model + minimal UI (MVP)
- Convert `context/*.md` and `resumes/*.tex` into a lightweight structured store (keep markdown/LaTeX as the canonical format; add a thin YAML/JSON index for the app to query — e.g., `index/projects.yaml` mirroring `context/projects-overview.md`'s table). Don't migrate to a database yet.
- Minimal web UI (Next.js, matching his personal-project stack preference — see `context/profile.md`): view resumes rendered from LaTeX (or migrate resume source to a structured format like JSON Resume / a typed schema that can render to LaTeX AND to a web view — decide this before Phase 1, see "Open decision" below), view/edit context files, view job-application tracker (company, role, status, JD text, which tailored resume version was sent, dates).
- Auth: single-user (e.g., NextAuth with a hardcoded allowed email, or Clerk restricted to his email) — simplest thing that isn't a public URL with no gate.
- Deploy: Vercel (frontend) is consistent with his existing project deployment habits (Collab-Docs, RL Minesweeper Lab, Vitalis, Vedaspace all target Vercel/Render).

### Phase 2 — JD tailoring & review agents, in-app
- Port the `jd-analyze` and `tailor-resume` skill logic into actual backend agent calls (LiteLLM-style multi-provider routing, mirroring `context/projects/cortex.md`'s pattern — reuse that design rather than re-inventing).
- Input: paste a JD → agent pipeline: (1) JD analysis against context store, (2) draft tailored resume, (3) fact-check agent pass, (4) reviewer agent pass → present diff against the relevant base resume for human approval before saving.
- Output artifact: a new tailored resume version, versioned (git commit or in-app version history), linked to a job-application tracker entry.
- Keep a human-approval gate before any tailored resume is considered "final" — never auto-send anything anywhere.

### Phase 3 — Job tracker as first-class object
- Track: company, role, JD snapshot, resume version used, application date, status (applied/interviewing/offer/rejected/ghosted), notes, follow-up reminders.
- Given the 2-month notice-period deadline, this tracker's real value is surfacing what's stale/needs follow-up — a simple dashboard view (applications by status, days-since-applied) is more valuable early than fancy analytics.

### Phase 4 — Portfolio / recruiter-facing agent (stretch, lower priority than shipping Phase 1-3 fast given the time pressure)
- A public-facing (or shareable-link) page where a recruiter can "ask about" his projects, backed by the same `context/projects/*.md` files as a retrieval source — directly reuses the RAG/citation-verification pattern already built in `context/projects/vedaspace.md`'s project (Vedaspace itself, or its architecture, could literally power this).
- Must clearly separate what's public (polished project narratives) from what's private (notice-period status, honest gap notes in `context/projects/*.md`, job-tracker data) — do not expose the private context store directly; generate a sanitized public subset.

## Open decisions to resolve before Phase 1 build
1. **Resume source-of-truth format:** stay LaTeX-only (simplest, matches current habit, but harder to build a web editor around) vs. migrate to a structured schema (JSON/YAML) that generates both LaTeX (for PDF export) and a web view (for in-app editing). Recommendation: structured schema — it directly unlocks the tailoring agents (Phase 2) manipulating discrete fields instead of regex-editing LaTeX strings.
2. **Where context lives long-term:** keep `context/*.md` as canonical (git-versioned, human-readable, already working) vs. move into a DB once the app exists. Recommendation: keep markdown as canonical, let the app read/write it directly (it already lives in the same git repo the app will deploy from) — avoids sync bugs between two sources of truth.
3. **Hosting for the JD-tailoring LLM calls:** reuse Cortex's LiteLLM-gateway pattern directly (it already solves multi-provider + budget governance) vs. a simpler direct-Anthropic-API call given it's single-user. Recommendation: start simple (direct API calls with a basic per-day spend cap) for Phase 2, revisit Cortex's gateway pattern only if multi-provider routing becomes actually necessary.

## Immediate priorities given the 2-month notice-period constraint
Given the job search is time-boxed, sequence for speed-to-value:
1. Use Phase 0 (already done) manually today for real applications — don't wait for the app.
2. Build just enough of Phase 1 (structured resume schema + a job tracker, even as a simple spreadsheet-replacement) to stop losing track of applications — this has higher ROI right now than the tailoring agents, since the base resumes + manual skill usage already cover tailoring reasonably well.
3. Phase 2 (in-app tailoring agents) only if manual `jd-analyze`/`tailor-resume` skill usage becomes a bottleneck at application volume.
4. Phase 4 (recruiter-facing agent) is explicitly lowest priority — nice narrative for later interviews ("I built an agent that lets recruiters query my project history"), not useful for the immediate job search.

## Related context
See [[profile]], [[projects-overview]], [[resume-strategy]], and `context/projects/cortex.md` for the architecture patterns this plan deliberately reuses.
