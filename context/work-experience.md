# Work Experience — Rich Context

## Directi (Titan Email) — SDE Intern (Jan 2025 – Jul 2025) → SDE-Backend (Jul 2025 – present, resigned/notice period)

Two distinct bodies of work, roughly chronological but with overlap: (1) the CI/CD platform build during the internship and early full-time period, (2) the Medusa event platform + Mimir AI-toolchain work as the primary full-time role.

**IMPORTANT — ownership language:** Medusa predates him. He was handed an already-built production service to own, operate, and optimize — he did NOT build it from scratch. Resume/interview language must say "own," "scale," "optimize," "redesigned [a specific pipeline within it]," or "maintain" — never "built Medusa." The CI/CD platform (`titan-github-actions`), by contrast, he genuinely built from zero during the internship — "designed and built" is accurate there.

### 1. GitHub Actions CI/CD Platform (`titan-github-actions`) — main internship project (~3 months) + ongoing maintenance
**Why it existed:** Org relied on Jenkins — outdated components, hard to manage, slow. Goal: replace with a GitHub-native, dynamic, org-connected CI/CD system.

**What he actually built (verified from repo):**
- Studied ARC (Actions Runner Controller), Helm charts, Kubernetes controllers/runners, then built self-hosted runners on **EKS**, spanning **staging / prod / prod-euc1** (multi-region: us-east-1 primary, eu-central-1 secondary).
- **8+ reusable GitHub Actions workflows** (run-checks, build-and-deploy, lambda-deployment for Java/Python, claude-workflow, auto-merge-prod-master) and **~20 custom composite actions** (build, deploy, test, SonarQube, Jacoco coverage, Docker/Jib builds).
- Multi-project matrix builds: git-diff-based detection to parallelize builds across changed service directories only.
- **EFS volumes attached to self-hosted runners** for persistent caching (JDKs/tools binaries, dependency caches) — this is the concrete mechanism behind the "~60% CI/CD time reduction" claim.
- Sidecar containers for integration testing (MySQL/Docker sidecars) for faster local-like test runs inside CI.
- **Canary + blue-green deployment automation** with automated 5-minute canary health windows, auto-rollout on success, and production monitoring gates pulling from **Loki** (error logs), **VictoriaMetrics** (5xx rates, DB query health), and **CloudWatch** (CPU utilization) with configurable thresholds before promoting a release.
- Adopted org-wide: mobile, frontend, and devops teams migrated their own repos onto this platform.
- Also built/maintains `github-actions-testApp` — a sample service+library combo used to validate the platform's workflows before rollout.
- **Claude Code Actions rollout (org-wide):** integrated Claude Code into GitHub Actions across the org — devs trigger `/claude` via PR/issue comments to get code fixes, PR creation, PR review, and workflow debugging help. He owned: OAuth/token management for secure API access, per-repo access control, and cross-workflow context management so Claude has the right repo/CI context when invoked. This is the seed that grew into Mimir (below).

**Resume-relevant metrics (finalized, user-provided real numbers — 2026-09 update):**
- Intern-era build (Jenkins → GitHub Actions cutover): ~40% average pipeline-time reduction, adopted across multiple engineering teams.
- Full-time-era further optimization (EFS-backed persistent caching + SQL/Docker sidecars for faster testing/local inference): additional 60% workflow-time reduction on top of the intern-era baseline — these are two distinct, sequential wins, not the same fact restated. Keep them in separate resume entries (intern vs. full-time) to avoid double-counting the same number.
- Failed-deploy incidents cut 80% via observability-driven automated deployment (Loki/Prometheus) with dynamic rollback (intern-era).
- Adopted by 3+ teams beyond backend (mobile, frontend, devops).
- Note: the "8 reusable workflows / 20+ composite actions / 3 environments" counts are real but were flagged by the user as weak, low-impact metrics for a resume — don't lead with activity counts; use them only as background color if asked in an interview, not as headline bullets.

### 2. Medusa — event-driven data platform (primary full-time role)
**What it is:** A server-side, event-driven service ingesting **events** (analytics-style occurrences) and **entity updates** (state changes for different user/domain object types — e.g. email/domain entities) from all internal services/clients across the org.

**Pipeline (in his own words, confirmed via code structure — 6 modules, 779 Java files total):**
1. Events/entities arrive → validated against maintained schemas.
2. Events → pipelined to an **S3**-based storage/file pipeline; also fanned out to third-party integrations (MoEngage, Pendo) used by other teams for analytics.
3. Entity updates → validated, processed, written to DB and/or forwarded to third-party integrations.
4. Fan-out to third parties happens through **Chidori**, a companion service: Medusa routes events/entities onto per-integration **SQS** queues; Chidori polls those queues, validates, handles SQS lifecycle (ack/retry/dead-letter), and calls the third-party APIs — with **semaphore-based rate limiting** to respect each third party's own constraints.
5. **MedusaReports** mini-service owns core DB/schema management and scheduled cron jobs (e.g., a daily job that queries **Athena** for last-usage stats per event type).
6. Shared contracts live in two libraries used by every dependent service: **medusa-commons** (domain models/utilities) and **medusa-interface** (client library other services use to register/send events to Medusa).
7. **medusa-athena-scripts** (in `suite-scripts/k8s-scripts`): Java ETL pipelines running as **Airflow DAGs** — compact/split S3 event files, snapshot entities from DB to S3, so multiple teams can query customer/event data in **Athena** easily.

**Stack (verified):**
- Java 25 with **virtual threads (Project Loom)** enabled (`spring.threads.virtual.enabled=true`), Spring Boot 3.5.6 / Spring Framework 6.2.11, Jetty + Reactor Netty for async I/O.
- AWS SDK v1 (SQS, S3, SSM, ELBv2, STS, EC2) — he worked on **AWS SDK v2 migration** for the ETL scripts side.
- MySQL via JDBC pooling (50 max connections, 12 max idle) tuned by him.
- Data formats: CSV, Parquet, Parquet.gz, Avro; **Spark/Hadoop** for heavy ETL; explored **Iceberg** and **Redshift** as alternative destinations; used **CDC (change-data-capture)** strategies to get near-zero-latency ETL from source DBs instead of batch dumps.
- Observability: Loki + Grafana dashboards backed by Prometheus metrics that he built out himself for multiple data stats.
- Legacy piece: `medusa-scripts` still runs on Java 1.8 / Spring Boot 2.1.3 — he has to bridge old and new stacks.

**What he personally worked on (his framing, consistent with repo) — finalized with real metrics (2026-09):**
- **Ownership/scale:** full ownership of Medusa (event-processing + analytics service), which ingests **50M+ events** and **200K+ entity updates** in production across all clients.
- **Virtual threads perf work:** migrated core APIs and SQS consumers to JDK 25 virtual threads, restructured platform thread pools, optimized tracing — cut **P99 latency by 65%** under peak load, lifted SQS consumer throughput by **~30%**.
- **Third-party delivery layer (Pendo, MoEngage):** owned this layer; redesigned it from an SQS-only pipeline to concurrent, virtual-thread-backed HTTP dispatch; iteratively shifted traffic to **90% HTTP** (corrected 2026-09, was previously logged as 100%) with near-zero downtime while holding strict per-vendor rate limits; cut SQS spend by **$1.5K+/year**. Independently led the MoEngage integration into the in-house analytics stack.
- **ETL/Athena pipeline:** redesigned the Athena-bound entity-snapshot pipeline using an Iceberg/CDC pattern, cutting pipeline **CPU usage by 70%**; refined multiple data-heavy Airflow pipelines to reduce time-to-availability for downstream consumers.
- **CI/CD (full-time-era continuation):** further optimized GitHub Actions with EFS-backed persistent caching + SQL/Docker sidecars for faster testing/local inference — cut workflow time by an additional **60%** (distinct from the intern-era 40% Jenkins-cutover win — see the CI/CD section above for how these two numbers relate).
- **Mimir/AI tooling:** built the Athena-AI MCP integration linking internal analytics to AI agents; rolled out Claude Code Actions org-wide (auth/token management, per-repo access control, embedded MCP servers); delivered a JIRA ticket-resolution workflow letting non-technical teams file tickets that agents autonomously triage/resolve from context.
- Also: distributed-systems correctness work, caching optimizations, AWS SDK v1→v2 migration, multi-format (csv/parquet/parquet.gz) handling, Spark/Hadoop/Avro work — real, but background-color rather than headline material per user feedback (see [[feedback-resume-bullet-quality]]).

**These 6 full-time + 3 intern bullets (see `resumes/sde.tex`) are now the CANONICAL DEFAULT Titan bullet set** — the source of truth for all resume variants going forward. See `context/resume-strategy.md` → "Default Titan bullets" for the exact text and the AI-focused tailoring rule (cut 1-2, expand Mimir).

**Other services maintained (lower-priority context, not headline resume material):**
- Hades (Flock's chat service — legacy, development stopped, maintenance only).
- Appointment Booking (simple client-facing booking service).
- Hephaestus (internal dashboard service) — also touched during internship.

### 3. Mimir — multi-tenant agent execution platform (grew out of the Claude Code Actions rollout; primary focus, last 3-4 months)
**What it is (updated 2026-09, supersedes the earlier "centralized AI-toolchain repo" framing below):** Mimir evolved from a shared slash-command/agent repo into a multi-tenant, secure agent execution platform integrating **OpenCode, MCP, AWS Athena, GitHub, Grafana, Jira, and internal Titan services**. It provides scoped MCP access per tenant, workspace isolation, dynamic/short-lived credentials, Athena-backed analytics, and OpenCode-based orchestration of agent runs.

**Verified structure (original toolchain-repo layer, still underlies the platform):**
- 15–17 org-wide slash commands (`/cap` commit+push, `/gd` git diff, `/jira`, `/preview-publish`, `/explain_diff`, `/fix-issue`, `/sentry`, `/sync-agent-configs`, `/prreview_learn`, `/refactor_validate`, plus backend-namespaced ones like `/backend:cpr`, `/backend:debug`, `/backend:new-feature`, `/backend:pr-self-review`, `/backend:service_security_audit`, `/backend:sos_graph`, `/backend:sentry_debug`).
- 6+ custom agents (add-javadoc, security-review, db-schema-check, scale-check, claude-md-staleness, api-register-envoy).
- 4 scoped workspaces with isolated configs: **athena-ai**, frontend-dev, issue-fix-ai, titan-ask.
- **Athena AI workspace** (his stated MCP work): Python tooling (~489 lines) calling the internal Flock Reporting API (`api.ops.flock.com/mr`) for events/entities/default-attributes; MCP integrations to **Metabase** (analytics dashboards) and a code-review-graph MCP server; used for duplicate-event/entity analysis, late-arrival detection, cross-suite duplication metrics.
- Layered documentation: root + workspace-level `CLAUDE.md`/`AGENTS.md`, backend coding guides (common-coding, development, debug, security, test) written in Simplified Technical English conventions.

**Recent platform work (last 3-4 months, real metrics — 2026-09 update, supersedes the fabricated placeholders in `context/mimir-ai-expansion.md`):**
- **Offline eval benchmarks:** built an offline evaluation suite that grew from an initial 15 tasks to **30+ realistic tasks** spanning debugging/SOS handling, ticket management, PR reviews, analytics, and tool selection, giving robust regression-detection coverage across agent/model changes before rollout.
- **Model routing + confidence-based escalation:** built routing across a model family — frontier models (GPT-5, Opus, Sonnet) plus cheaper open-source models (DeepSeek, Qwen) — with confidence-based escalation to a stronger model on low-confidence outputs instead of accepting them outright.
- **AI observability layer:** designed a tracing/observability layer capturing model/tool call traces, token usage, latency, cost, and policy outcomes per run; used it to identify high-cost workflows.
- **Context management layer:** extended OpenCode with a workspace-aware memory layer — structured task checkpoints, semantic retrieval, and cost-aware context assembly — while preserving OpenCode's native session/compaction behavior.
- **R&D — bandit-based selection policies:** explored model/tool/retrieval selection policies via contextual-bandit experimentation to optimize cost per successful task beyond static routing rules.

**Combined, measured impact (2026-09 clarification — attribution correction):** the ~74% → ~90% task success rate improvement and the ~40% average cost reduction are NOT attributable to model routing alone — they were measured after all four pieces above (routing, escalation, context layer, observability) were in place together, versus the original single-frontier-model baseline. P95 latency held flat despite escalation's extra model calls (measured, not assumed). Per-layer secondary metrics: the context management layer independently cut average input tokens by **~30%**, context size by **~13%**, and inference cost per successful task by **~7%**; the observability layer's high-cost-workflow identification independently trimmed cost-per-task a further **~8%**. When writing resume bullets, credit the **combined system** for the headline 74%→90%/~40%-cost numbers — don't attribute that jump to routing in isolation, since cheaper models alone would not explain a success-rate increase.

**Resume framing:** This is his strongest concrete "AI engineering applied to internal tooling" story — a real multi-tenant agent platform with measured eval/routing/observability/context wins, not just prompting. `context/mimir-ai-expansion.md`'s fabricated-placeholder bullets (token-cost governance, security guardrails, policy ACLs, PR auto-fix, JIRA routing) are now superseded for the routing/cost/observability/context claims above, which have real numbers; the security-guardrail and PR-auto-fix ideas in that file remain unbuilt and should stay flagged as aspirational, not resume claims, until built.

## Launchpad.ai — Software Engineering Fellow (Jul 2024 – Sep 2024, remote)
- Cohort-based SWE fellowship; task: robotic motion planning.
- Optimized a robotic arm for sunscreen application using vision-based grasping + Deep RL (DQN and TD3 approaches); ~45% improvement in movement precision/efficiency (resume-stated).
- Built a PyBullet simulation environment for training RL agents; implemented 10+ motion-planning algorithms.
- Was Scrum Master for the team.
- Public reference: teammate's Medium blog post on the project (https://medium.com/@gauthamsathyan/automating-sunscreen-application-with-robotics-a-deep-dive-into-two-approaches-34304dbdd719).

## MIDAS Lab, IIIT Delhi — Undergraduate Researcher (Aug 2024 – Dec 2024)
- Analyzed 20+ LLM research papers on code generation; explored using semantic knowledge graphs to guide generation and improve context retention while solving Codeforces-style problems.
- Fine-tuned Qwen on 5K+ code-test pairs; built AST-based and runtime-based evaluation plus graph-alignment scoring.
- Self-assessment: "very basic researchers" at the time, but the direction (agentic code-solving guided by structured context) predates and mirrors what later shipped as mainstream agentic coding tools (Claude Code, etc.) — good talking point for AI/ML-flavored interviews, framed with humility.

## Related memory
See [[profile]], [[projects-overview]], [[resume-strategy]].
