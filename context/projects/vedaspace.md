# Vedaspace

**Location:** `/Users/aekansh.k/Documents/vedaspace`
**Status: Backend MVP in active development, frontend is boilerplate only.** Strongest personal-project evidence of real RAG/LLM engineering skill, but not deployed and not resume-listed yet — good AI/ML resume candidate once a UI exists.

## What it is
AI-grounded knowledge engine for Hindu sacred texts (scoped to Bhagavad-gita As It Is for MVP). Hybrid retrieval (BM25 + vector search) over Vedabase source texts + ~1,000 lecture transcripts, with LLM-generated answers that are citation-verified against retrieved chunks to prevent hallucination.

## Tech stack
Next.js 16 / React 19 / TypeScript / Tailwind 4 (frontend, currently boilerplate). Python 3.12 + FastAPI backend. Embeddings: local BAAI/bge-m3 (sentence-transformers) or swappable to Voyage/OpenAI. Generation: OpenRouter (qwen-2.5-7b for contextualization, ling-3.0-flash for answers) or Anthropic (Claude Haiku) — provider-agnostic by config. SQLite + sqlite-vec for storage/vector search (fully local, no cloud infra).

## Verified current state
- 15 commits over ~3 weeks, actively developed (most recent commit added "verse-anchored lecture enrichment").
- Real, working backend pipeline: ingestion (books/lectures → SQLite), hybrid retrieval (BM25 + vector + deterministic verse-number lookup), contextualization step (pulls neighboring purport paragraphs), generation with a **custom deterministic citation verifier** (`generation/verify.py`) that cross-checks LLM citations against retrieved chunks — a genuine anti-hallucination mechanism, not just a prompt instruction.
- Real eval harness: 103 stratified questions, tracks MRR, exact-reference accuracy, and abstention rate.
- Dev-cost safeguard: `max_llm_calls` config (default 10) to prevent runaway API spend — shows cost-awareness.
- Frontend is Next.js boilerplate with no chat/search UI wired up yet. No API route connecting frontend to backend. No deployment config (no Vercel/Docker).
- ~2,545 LOC backend + 438 lines of eval code.

## Known limitations
- No usable UI — this is backend-only right now.
- Not deployed anywhere.
- Citation verifier is string/chunk-matching heuristic, not foolproof against paraphrase.
- MVP frozen to one book (Bhagavad-gita); lecture ingestion is a ~1,000-transcript sample, not the full archive.
- No CI.

## What's needed to make this resume-ready
1. Build the chat/search frontend and wire it to the FastAPI backend (highest leverage — this alone would make it demo-able).
2. Deploy (Vercel for frontend + a small always-on host or serverless functions for backend, given SQLite is file-based — would need a persistent volume or migration to a hosted vector DB).
3. Grow eval set past 103 questions for a more defensible accuracy number.
4. Multi-book support beyond Bhagavad-gita.

## Fabricated-but-plausible target metrics (use only once genuinely measured, or clearly caveat as "target/eval-harness result" if used earlier)
- e.g., "retrieval MRR of X and Y% exact-citation accuracy across 100+ stratified questions", "hallucination rate reduced to <Z% via deterministic citation verification vs uncontrolled generation baseline."

## Resume bullet draft (for AI/ML-focused resume, once a UI exists — mark as forward-looking until then)
- Built a hybrid-retrieval RAG system (BM25 + local sentence-transformer embeddings + deterministic verse lookup) over Vedic source texts and 1,000+ lecture transcripts, with a custom citation-verification layer that cross-checks every generated claim against retrieved source chunks to suppress hallucination.
- Designed a provider-agnostic LLM abstraction (local embeddings, OpenRouter/Anthropic generation) with a stratified 103-question eval harness tracking MRR, exact-citation accuracy, and abstention rate.

## Talking points beyond resume
- The citation-verification design is the single best "anti-hallucination" story across all his projects — worth leading with in AI engineer interviews even before the project has a UI.
- Provider-agnostic model routing (mirrors the multi-tier routing pattern in Cortex — a recurring personal architecture pattern worth naming as a strength).
