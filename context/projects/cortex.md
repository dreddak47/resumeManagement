# Cortex

**Location:** `/Users/aekansh.k/Documents/cortex`
**Status: Phase 0+1 done, Phase 2 (memory) blocked/placeholder, Phases 3-5 unstarted.** His most architecturally ambitious AI project — a personal AI orchestration control-plane. Strong AI/ML or platform-engineering resume candidate; not currently listed.

## What it is
A local-first "control plane" for turning ideas into shipped code: ideas come in (CLI/API/Slack-planned) → routed through an agent layer → dispatched to a coding harness (currently Claude Code) → tracked to PR with full cost/run ledger. Explicitly designed as swappable registries (harnesses / models / agents / tools) plus a memory layer and event bus, not a monolithic app.

## Tech stack
Python 3.12, FastAPI + Uvicorn, Pydantic, Typer (CLI). **LiteLLM proxy** for multi-provider model routing (Anthropic, Groq, OpenRouter) with tiered cost routing (free tier for triage, cheap tier for research, premium tier for actual code-gen). SQLite ledger for runs/costs/events (DuckDB-attachable for analysis). YAML-based registries for models/harnesses/agents (hot-swappable without code changes). Embedded FastAPI dashboard (plain HTML/JS).

## Verified current state
- Contracts-first design: `HarnessAdapter`, `ModelInfo`, `AgentSpec`, `ToolEntry`, `Channel`, `MemoryStore` are all defined as clean interfaces before implementation — genuinely good engineering discipline.
- Working today: event bus, ledger, LiteLLM gateway, idea inbox, a plain-Python (deterministic, not yet agentic) router, a Claude Code harness adapter that runs the `claude` CLI as a subprocess against a workspace and captures the resulting PR URL + cost, and an embedded dashboard.
- **Budget governance is real and dual-rail**: enforced both at the LiteLLM gateway (per-key limits) and in-app (per-run/daily caps) before any dispatch; over-budget runs are queued as `budget_blocked`, never hard-failed — a genuinely thoughtful cost-safety design.
- 22 passing pytest tests covering budget gates, API routes, and contract validation.
- ~34 Python files, ~1,413 LOC core logic.
- Not deployed anywhere — local-first by design, runs at `localhost:8000`.

## Known limitations
- Memory vault (Phase 2) is an empty placeholder — retrieval/writeback contracts exist but nothing is implemented. This is the single biggest gap versus the "personal AI control plane" vision.
- Router is deterministic Python, not an actual agent yet (Phase 5 "agent lab" would add real multi-agent routing).
- No scheduler, no human-in-the-loop approval queue, no Slack/Telegram channels — all contracted (`RunState.NEEDS_HUMAN` exists as an enum) but unimplemented.
- Only one harness adapter exists (Claude Code); Codex/other harnesses are mentioned in docs but not built.
- Dashboard is minimal — no real-time updates or cost-trend visualizations.

## What's needed to complete the vision
1. Implement the memory vault (retrieval + writeback) — this is the "compounding" feature that differentiates it from a plain task runner.
2. Build the scheduler + HITL approval queue.
3. Add at least one more harness adapter to prove the abstraction (e.g., Codex or a bare LLM-only harness).
4. Real-time dashboard (cost trends, run timelines).

## Note on relevance to the end-goal resume-management web app
This project is directly relevant prior art for the resumeManagement web app's planned JD-tailoring/review AI agents (see `../../PLAN.md`) — same author, same architecture instincts (registries, contracts-first, budget governance, harness abstraction). Worth reusing patterns from here rather than designing from scratch.

## Resume bullet draft (AI/ML or platform-engineering resume)
- Designed a contracts-first AI orchestration control plane (FastAPI + LiteLLM) that routes tasks across tiered models (free/cheap/premium) by task type, dispatches approved work to a coding-agent harness, and tracks every run's cost/tokens/outcome in a persistent ledger.
- Implemented dual-rail budget governance (gateway-level per-key limits + in-app per-run/daily caps) that queues over-budget work instead of failing it outright, preventing runaway LLM spend across multiple providers (Anthropic, Groq, OpenRouter).

## Talking points beyond resume
- The "registries as YAML, not DB schema" choice for models/harnesses/agents — enables hot-swapping without redeploys, a nice small-scale platform-engineering decision worth explaining.
- Good contrast piece to Mimir (his org's AI-toolchain repo at work) — shows he independently arrived at similar architecture (multi-tool/harness abstraction, cost governance) in a personal project, reinforcing that this is a genuine interest, not just a work assignment.
