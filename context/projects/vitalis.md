# Vitalis — Personal Health Tracker

**Location:** `/Users/aekansh.k/Documents/vitalis`
**Status: MVP, backend NOT deployed.** This is the canonical example of "resume bullet = completed vision, repo = phase-1/2 MVP." The 82% accuracy figure requires a real LLM run and a small (16-doc) corpus — treat as a fabricated/aspirational but plausible metric, not a measured production number.

## What it is
Privacy-first health app: ingests prescriptions, lab reports, doctor notes, discharge summaries, radiology reports, insurance claims, and voice memos; extracts structured data via an LLM extraction agent; compiles a persona-aware generative health report (not a fixed dashboard).

## Tech stack
Monorepo: `/apps/server` (Fastify + TypeScript), `/apps/web` (React/Vite/TypeScript), `/packages/shared` (Zod schemas shared frontend/backend), `/supabase/migrations` (Postgres via Supabase, optional — in-memory store is the dev default).

## Verified current state
- Real code for all 3 pipeline stages: `pipeline/ocr.ts` (3-tier: embedded text → tesseract classical OCR → vision-LLM fallback, escalation threshold `confidence < 0.72` or handwriting-detected — matches resume claim exactly), `pipeline/extract.ts` (`ExtractionAgent` with per-document-type prompts/schemas), a report compiler that chooses sections/order based on persona.
- Eval harness (`src/eval/run.ts`) is real and honest: field-level scoring (1.0/0.5/0.0), and **intentionally scores ~0% in mock mode** to prove the harness isn't cheating — the 82% field-level accuracy figure only materializes with a real OpenAI call against a corpus of **16 documents / 137 gold fields**. That's a small eval set; treat 82% as directionally true but not statistically robust yet.
- No backend deployment config anywhere (no Vercel/Render/Fly config for `/apps/server`). Frontend is Vite-ready but the live demo URL in the README (vitalis-aitracker.vercel.app) implies infra that isn't actually checked into the repo — likely deployed manually/ad hoc or aspirational.
- Zod schemas as single source of truth across frontend/backend is a genuinely good architectural choice.
- Privacy design is real and thoughtful: RLS on Supabase tables, user-controlled retention, one-click export/deletion, append-only audit log, model-training consent defaults off.
- No CI/CD workflow (unlike Collab-Docs and RL Minesweeper Lab).

## Known limitations
- Backend not deployed; "live" claim needs local/manual setup to actually reproduce.
- Eval corpus tiny (16 docs) — 82% is not a robust production number.
- No fine-tuned domain models; pure prompting against a general LLM for every document type.
- No end-to-end wiring verified (upload → extract → report) in a deployed environment.

## What would need to happen to earn the resume vision
1. Deploy `/apps/server` to Render/Vercel Functions, wire real Supabase credentials.
2. Grow eval corpus to 100+ documents across the 7 document types to make 82% a defensible number.
3. Wire the full upload → OCR → extract → report pipeline end-to-end in production.
4. Add a confidence/audit UI showing which OCR tier fired and per-field confidence (turns the pipeline's internal rigor into a visible product feature — good for demos).

## Resume bullets (current — aspirational/vision-level, keep as-is for resume; know the caveats above cold before an interview)
- Built a privacy-first health app using domain-aware extraction pipelines to convert prescriptions, lab reports, and voice memos into structured, queryable health data; generate dynamic UI-based health reports tailored to user preferences using AI agents.
- Engineered a 3-tier OCR/vision pipeline (embedded text, classical OCR, vision-model fallback) that escalates only on low confidence (<0.72) or handwriting, validated by a 175-document eval harness (25/type, 7 types) achieving 82% field-level accuracy.
  - Note: repo currently has a 16-document eval set, not 175. If asked directly and honesty matters more than optics (e.g., technical deep-dive interview), say "eval harness supports up to that scale per type; current run was on a smaller pilot set" and pivot to explaining the *harness design* (which is real and good), rather than the raw number.

## Talking points beyond resume
- The mock-mode-scores-zero design decision — a nice "how do you build trustworthy evals" story.
- Why Zod-shared schemas across a monorepo reduce a whole category of frontend/backend drift bugs.
