# Resume Strategy — Formatting & Role Tailoring

## Standing workflow (2026-09 update)

Going forward, every new job application is tailored from exactly one of **two active base variants**: `resumes/sde.tex` (generalist backend) or `resumes/ai-swe.tex` (backend engineer with a real, metric-backed AI lean — Mimir platform work + Cortex). `resumes/aiml.tex` and `resumes/fde.tex` are retired from the active rotation — kept for reference, not used for new tailoring unless explicitly requested.

**Naming convention:** the final deliverable PDF is `build/aekansh_Resume_<Company>.pdf` (e.g. `aekansh_Resume_Stripe.pdf`); the working `.tex` lives at `resumes/tailored/<company-slug>-<role-slug>.tex`.

**Goal: maximize resume score within the one-page constraint**, not just "produce a tailored resume." The loop is: tailor → compile → score with the `resume-score-checker` agent (ATS + Recruiter/Model Fit) against the target JD → edit based on feedback → recompile → rescore → repeat until scores plateau or the one-page budget is exhausted. See `.claude/skills/tailor-resume/SKILL.md` for the full step-by-step.

**Jev (TypeSafe) for finer bullet-level review:** `scripts/jev_review.py` calls TypeSafe's Jev model (requires `TYPESAFE_API_KEY` in the environment — see `.env.example`) to rate individual bullets on metric density and JD-relevance. Use it as a supplementary signal to catch weak individual bullets that a holistic resume-score-checker pass might average out — not as the primary scoring loop.

## Overall format guidance for a 1+ YOE SDE-level candidate (applies to the active role variants)

**Section order:** Header → **Work Experience** → **Projects** → **Technical Skills** → **Education** → **Achievements**.

Why this order, not the college-standard Education-first order:
- Past 1 YOE, recruiters and ATS scanners weight recent professional experience most heavily. Education stops being the lead signal once you have real work experience — leading with it reads as "still early-career/uncertain," even though technically still true here.
- Since his degree program (ECE) is a mild mismatch with "software engineer," leading with work experience lets the resume open on his strongest, most relevant signal instead of inviting an early "wait, ECE?" pause.
- Education still matters (IIITD is a strong signal) — keep it visible but after Experience/Projects, one compact block, no need for coursework lists at this stage.

**Within Education:** institution + degree + year only. Drop GPA unless it's exceptional and you have room. No coursework list at 1+ YOE — it reads as compensating for lack of experience.

**Within Work Experience:** reverse-chronological. Keep ALL positions (per user instruction) — Directi (SDE-Backend), Directi (SDE Intern), MIDAS Lab (research), Launchpad.ai (fellowship). At 1 YOE the fellowship/research entries are doing real work signaling breadth (research + robotics + backend), don't cut them for space; compress their bullets instead if needed. 2 bullets per role is enough except the current/most senior role, which can carry a 3rd if it earns its place.

**Within Projects:** 2-3 projects max on a one-page resume at this experience level — projects are now a *supplement* to work experience, not the centerpiece. Order by relevance to the target role, not chronology. Cut mercilessly: better to show 2 airtight, metric-rich projects than 4 thin ones.

**Technical Skills:** last substantive section, one compact block (Languages / Frameworks / Tools), reordered per role (see below) so the first thing listed matches the JD's primary ask. Recruiters and ATS keyword-scan this section heavily — lead with what the role needs.

**Achievements:** keep short, bottom of page (Codeforces Expert, Amazon ML Challenge top-50). These are tie-breaker signals, not headline content at 1+ YOE.

**One-page discipline:** with 4 work-experience entries staying fixed, projects are the only truly elastic section — this is the main lever for tailoring per role (see below).

## Per-role tailoring

### SDE (generalist backend/full-stack)
- **Work experience emphasis:** Lead with CI/CD platform + Medusa's distributed-systems/data-pipeline work (SQS, S3, event-driven architecture, virtual threads, DB optimization). De-emphasize the AI-toolchain (Mimir) angle — mention briefly, don't lead with it.
- **Projects (pick 2-3):** Collab-Docs (real-time systems, CRDT/OT, concurrency, durability) is the anchor — directly on-target. Second slot: Remote Connector (systems/networking, OS integration) if it needs polish first, otherwise RL Minesweeper Lab as a "breadth" project (shows ML comfort without making the resume ML-primary). Vitalis is a weaker fit here (more AI-flavored) — cut it for the SDE variant unless space allows a 3rd project.
- **Tech stack order:** Languages first (Java, Python, JS/TS, SQL, C++), then Frameworks (Spring Boot, Node.js, React), then Systems/Infra (AWS, Kubernetes, Docker, Redis, Kafka/SQS), then a short ML/AI line last.
- **Skills to headline:** distributed systems, event-driven architecture, DBs, caching, CI/CD, Kubernetes.

### AI/ML Engineer
- **Work experience emphasis:** Lead with Mimir (AI-toolchain, MCP integration, multi-model tooling) and MIDAS Lab research (LLM code-gen, knowledge graphs, fine-tuning). Reframe the Medusa bullet toward the data-pipeline/Athena angle (data engineering adjacent to ML) rather than pure backend plumbing. Keep the GitHub Actions bullet short — mention Claude Code Actions rollout specifically, since that's the AI-tooling angle of an otherwise plain DevOps project.
- **Projects (pick 2-3):** RL Minesweeper Lab (deep RL, rigorous eval) and Vitalis (LLM extraction pipelines, multi-tier OCR/vision, agents) are the two anchors. Third slot, if space allows: Vedaspace (RAG, citation verification, provider-agnostic LLM routing) is actually his most technically serious AI project once it has even a minimal demo-able UI — worth fast-tracking a UI specifically to unlock this slot (see PLAN.md backlog). Until then, use StockWorthy (RAG + fine-tuned phi-2) from the college projects as the 3rd.
- **Tech stack order:** ML/AI first (PyTorch, RAG, LLMs, Agentic AI, RL, LangChain), then Languages (Python first), then Frameworks/Infra.
- **Skills to headline:** LLMs/RAG/agents, RL, fine-tuning, MCP, eval-harness design, model-cost governance (Cortex is good evidence here even if not listed as a project — mention in a work-experience bullet or a "personal AI tooling" aside if space allows).

### FDE (Forward Deployed Engineer)
FDE roles (Palantir-style) weight differently: rapid prototyping under ambiguity, direct customer/stakeholder-facing delivery, full-stack versatility, ability to stand up working systems fast and iterate live with users, comfort owning a problem end-to-end rather than a narrow component.
- **Work experience emphasis:** Lead with the CI/CD platform build — framed as "owned a problem end-to-end, from studying unfamiliar infra (ARC/Helm/K8s) to org-wide adoption across 3+ teams," which is a strong FDE-shaped story (ambiguous problem → shipped tool → real users). Second bullet: Medusa, framed around integrating many stakeholders' data needs (3rd-party integrations, multiple internal teams consuming the platform) rather than the low-level plumbing.
- **Projects (pick 2-3):** Vitalis (end-to-end product thinking: OCR → extraction → generative report, privacy-first design decisions) and Collab-Docs (shipped, real users could use it today, rigorous but pragmatic trade-offs documented in ADRs — good "how do you make judgment calls under constraints" story) are the anchors. Remote Connector is a good 3rd if there's room — shows he'll go all the way down to OS-level integration to solve a real problem for a real "customer" (himself), which is very on-brand for FDE narratives.
- **Tech stack order:** Balanced/full-stack first (mention breadth: backend + frontend + infra + ML in one line), then a clear "comfortable shipping across the stack" framing rather than leading with any single specialization.
- **Skills to headline:** full-stack delivery, rapid prototyping, cross-functional tooling adoption (the CI/CD platform's org-wide adoption is his single best FDE proof point), pragmatic trade-off-making under real constraints (ADRs in Collab-Docs are excellent evidence of this).

## Default Titan bullets (canonical — finalized 2026-09, do not regenerate from scratch)

Aekansh hand-finalized the Titan/Directi work-experience bullets after several rounds of review. **These exact bullets (verbatim, in `resumes/sde.tex`) are the canonical default** for the Titan block across all resume variants going forward. When tailoring for a new JD, start from these — reorder/reword lightly for emphasis, but don't regenerate the underlying facts/metrics from scratch, and don't let the same fact carry different numbers across variants (see [[feedback-resume-bullet-quality]]).

**SDE - Backend (full-time), 6 bullets:**
1. Full ownership of Medusa (core event-processing/analytics service, Java/Spring Boot) — 50M+ events, 200K+ entity updates in production.
2. JDK 25 virtual-threads migration + thread-pool restructuring + tracing optimization — P99 latency -65%, SQS throughput +30%.
3. Owned third-party data-delivery layer (Pendo, MoEngage); redesigned SQS-only → concurrent virtual-thread-backed HTTP dispatch, shifted to 100% HTTP with near-zero downtime under strict per-vendor rate limits, cut SQS spend $1.5K+/year; led the MoEngage integration solo.
4. GitHub Actions optimization (EFS-backed caching, SQL/Docker sidecars) — workflow time -60% (full-time-era continuation, distinct from the intern-era 40% Jenkins-cutover win).
5. Athena-bound entity-snapshot ETL redesign (Iceberg/CDC) — CPU usage -70%; Airflow pipeline refinements.
6. Mimir/AI tooling: Athena-AI MCP integration, org-wide Claude Code Actions rollout (auth/token/access control/embedded MCP servers), JIRA ticket-resolution workflow for non-technical teams.

**SDE Intern - Backend, 3 bullets (keep all 3 — do not drop the 3rd generic one, per explicit instruction):**
1. Architected titan-github-actions from the ground up (self-hosted ARC/K8s runners), replacing Jenkins — pipeline time -40%, adopted across multiple teams.
2. Observability-driven automated deployments (Loki/Prometheus) with dynamic rollback — failed-deploy incidents -80%.
3. Contributed to multiple services using Spring Boot/AWS, scalable microservice architecture.

**Space note:** this 9-bullet Titan block is dense for a one-pager. In `sde.tex` the Projects section was trimmed to a single project (Collab-Docs, 2 bullets) to compensate — MIDAS Lab and Launchpad.ai stay at 1 bullet each. If a tailored variant needs to reclaim space, trim Projects further before touching any Titan bullet.

### AI-focused tailoring rule (when the target JD is AI/ML-heavy)
Per explicit instruction: **cut 1-2 of the 6 default full-time bullets** (best candidates to cut: #4 GitHub-Actions-caching and #3 SQS→HTTP/vendor-integration, since they're the least AI-relevant) and **replace/expand bullet #6 (Mimir) into multiple dedicated bullets**.

**Update 2026-09: the Mimir expansion now uses real metrics, not `[X]` placeholders.** Pull the expanded Mimir bullets from `context/work-experience.md` → Mimir section → "Recent platform work (last 3-4 months, real metrics)" — covering the offline eval benchmark suite (15 tasks), model routing + confidence-based escalation (74%→90% success, ~40% cost cut), the AI observability layer (~8% cost-per-task), and the OpenCode context-management layer (~30%/13%/7% token/context/cost reductions). `context/mimir-ai-expansion.md`'s older fabricated-placeholder bullets (security guardrails, policy ACLs, PR auto-fix, JIRA auto-resolve) remain aspirational/unbuilt — do not use them as resume claims until built and measured.

## General rule for using "vision-level" project bullets
It's fine and expected to keep using resume bullets that describe a project's *completed vision* (per user's explicit instruction) rather than its current messy state, and to use plausible-but-fabricated metrics where a real measurement doesn't exist yet (e.g., Vitalis's 82%, Japa Coach's eventual accuracy number). The discipline this context store adds: never let the fabricated number be the FIRST time Aekansh has to think about it — it should already be logged in the relevant `projects/*.md` file with the caveat spelled out, so he can smoothly acknowledge current state if an interviewer probes, without contradicting the resume.

## Related memory
See [[projects-overview]], [[profile]], [[work-experience]].
