# Mimir / AI-Automation Expansion Bullets (for AI-heavy JD tailoring)

**Status: fabricated-but-plausible, explicitly requested by Aekansh ("it's fine if you make something up... I'll get the metric for anything you decide will show up in / by building something like that").** These are NOT yet real measurements. They are directionally true (Mimir genuinely has MCP integrations, Claude Code Actions rollout, JIRA workflow — see `work-experience.md` section 3) but the specific mechanisms below (token-tiering, secret redaction, policy-based ACLs, AI PR auto-fix) are extensions he should actually consider building so the metrics become real. Treat every `[X]` as "build this, then measure it, then fill it in" — not "invent a number."

## When to use
Per `resume-strategy.md`'s AI-focused tailoring rule: when a target JD is AI/ML-heavy, cut 1-2 of the 6 default Titan full-time bullets (candidates: the GitHub-Actions-caching bullet and the SQS→HTTP vendor-integration bullet) and use 4-5 of these in place of the single default Mimir bullet.

## The 5 example bullets

1. **Token-cost governance:** Designed a tiered model-routing and budget-governance layer for Mimir's AI agents — routing triage/lookup tasks to low-cost models and reserving premium models for code generation — capping per-team LLM spend and cutting overall token cost by **[X]%** without degrading agent output quality.
   - *To make this real:* build a LiteLLM-style gateway (Cortex already has this exact pattern — see `context/projects/cortex.md` — port the design) in front of Mimir's agent calls, tag calls by task type, set per-team daily/monthly caps, and measure before/after spend.

2. **Security guardrails for AI agents:** Built security guardrails for org-wide AI coding agents — scoped, auto-rotating OAuth tokens per repo, automatic secret/PII redaction before code context leaves the org's network to external LLM providers, and full audit logging of every agent-initiated action — closing **[N]** exposure paths identified in an internal security review.
   - *To make this real:* add a redaction middleware step (regex/entropy-based secret scanning) before any repo content is sent to an external model, add per-repo scoped token minting instead of a shared org token, and log every agent action to a queryable audit table. Run an internal security review afterward to get the "[N] exposure paths closed" number honestly.

3. **Policy-based access control:** Implemented policy-based access control governing which repos/teams can invoke which AI agents and MCP tools, reducing unauthorized or unintended agent actions to effectively zero across **[N]+** repos while keeping onboarding self-serve for new teams.
   - *To make this real:* add an ACL config (YAML, mirroring Mimir's existing workspace-scoping pattern) mapping repo/team → allowed agents/tools, enforced at the MCP-server or gateway layer, with a self-serve request flow for teams to onboard.

4. **AI-driven PR automation depth:** Extended Mimir's GitHub Actions automation with an AI-driven PR triage/auto-fix workflow — agents run security/scale/schema-check passes on every PR, auto-fixing **[X]%** of flagged issues before a human reviewer engages, cutting review cycle time by **[X]%**.
   - *To make this real:* wire the existing Mimir agents (security-review, scale-check, db-schema-check) to run automatically on PR-open as a GitHub Actions step, have them commit auto-fixes for a defined class of low-risk issues (formatting, missing null checks, etc.), and track before/after review-cycle time.

5. **JIRA ticket-routing automation:** Extended Mimir's router to triage inbound JIRA tickets from non-technical teams end-to-end, matching each ticket to the right specialized agent and auto-resolving **[X]%** of tickets without engineer involvement, cutting median resolution time from **[X]** to **[Y]**.
   - *This one is already partially real* per the default bullet set (the JIRA workflow exists) — the gap is just measurement. Instrument ticket resolution time and auto-resolve rate to get real numbers here first; this is the lowest-effort one to convert from fabricated to real.

## Related
See `context/work-experience.md` (Mimir section), `context/resume-strategy.md` (AI-focused tailoring rule), `context/projects/cortex.md` (the budget-governance/model-tiering pattern to port for bullet #1).
