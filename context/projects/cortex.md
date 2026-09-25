# Cortex

**Location:** `/Users/aekansh.k/Documents/cortex`
**Status (updated 2026-09): progressed well past the earlier Phase 0+1 snapshot below** — the memory vault, HITL checkpointing, agent observability, and tool-authorization layers are now real and measured (see "Recent real progress" below), though the project is still actively evolving and not "done." His most architecturally ambitious AI project — now framed as a governed personal agent operating system that turns scattered thoughts into durable knowledge, decisions, and verified actions. Strong AI/ML or platform-engineering resume candidate.

## What it is
A local-first "control plane" for turning ideas into shipped code: ideas come in (CLI/API/Slack-planned) → routed through an agent layer → dispatched to a coding harness (currently Claude Code) → tracked to PR with full cost/run ledger. Explicitly designed as swappable registries (harnesses / models / agents / tools) plus a memory layer and event bus, not a monolithic app.

## Recent real progress (2026-09 update — supersedes "Known limitations" below where they overlap)
- **Workflow completion rate >90%**, **structured output validity >98%**, cost per successful workflow continuously decreasing.
- **Durable multi-step orchestration engine** with configurable agents, checkpointed HITL (human-in-the-loop) workflows, typed outputs, budget controls, tool authorization, and failure recovery — **80% successful resumption rate** after process failures, reducing duplicate agent work.
- **Agent observability**: run-level audit events, token accounting, latency tracking, and model attribution now implemented (this closes part of the "no scheduler/HITL" gap noted below).
- **Knowledge graph + retrieval layer (update 2026-09, supersedes the earlier "no KG" state)**: connects reading lists, saved topics, project artifacts, and multiple external sources (GitHub projects/repos, notes, preferences, prior decisions) to ground idea exploration and execution in traceable context — **64% precision@10**, **83% provenance coverage** across **150 evaluation queries**. This replaces the earlier-logged 40% precision@5 / 55% provenance-coverage figures (different eval methodology — @10 vs @5, larger query set — not a regression, a re-measurement after building the KG layer). The memory vault (Phase 2, previously "empty placeholder") is now functional and KG-backed.
- **Tool authorization + HITL approval + prompt-injection evaluations** — **0 unauthorized actions across 20+ adversarial tests**.
- Still actively being built/optimized — precision@10 and provenance coverage numbers in particular are expected to keep improving; don't treat these as final/ceiling numbers in an interview.

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
- Building a personal agent OS that understands working context through GitHub projects, repositories, notes, preferences, and prior decisions, transforming scattered thoughts into durable knowledge, personalized plans, and verified actions.
- Implemented a knowledge graph and retrieval layer connecting reading lists, saved topics, project artifacts, and multiple external sources to ground idea exploration and execution in traceable context — **64% precision@10** and **83% provenance coverage** across **150 evaluation queries**.
- Built a governed multi-step orchestration engine with configurable agents, checkpointed HITL workflows, typed outputs, budget controls, tool authorization, and failure recovery — **>90% end-to-end completion**, **>98% structured-output validity**, and **80% interrupted-run recovery**.
- Added tool authorization, human-in-the-loop approval, and prompt-injection evaluations — **0 unauthorized actions** across **20+ adversarial tests** — with run-level audit events, token accounting, latency tracking, and model attribution for full observability.
- Designed a contracts-first AI orchestration control plane (FastAPI + LiteLLM) that routes tasks across tiered models (free/cheap/premium) by task type, dispatches approved work to a coding-agent harness, and tracks every run's cost/tokens/outcome in a persistent ledger, with dual-rail budget governance (gateway-level per-key limits + in-app per-run/daily caps) that queues over-budget work instead of failing it outright.

## Talking points beyond resume
- The "registries as YAML, not DB schema" choice for models/harnesses/agents — enables hot-swapping without redeploys, a nice small-scale platform-engineering decision worth explaining.
- Good contrast piece to Mimir (his org's AI-toolchain repo at work) — shows he independently arrived at similar architecture (multi-tool/harness abstraction, cost governance) in a personal project, reinforcing that this is a genuine interest, not just a work assignment.
