# Aekansh Kathunia — Profile

## Identity
- B.Tech, Electronics and Communication Engineering (ECE), IIIT Delhi, 2025.
- Chose software over core-ECE early; ECE gave him signal-processing/hardware intuition that shows up in project choices (audio DSP in Japa Coach, robotics in Launchpad.ai fellowship).
- Self-identifies primarily as a **software engineer with a strong AI/ML lean** — not a research scientist. Prefers building systems that use AI over publishing papers, but has real research exposure and enjoys reading papers.
- Strong DSA background: Codeforces Expert rating.
- High interest in system design — evident in how he talks about his own projects (ADRs, seam-based architecture, contracts-first design).
- Currently employed as SDE-Backend at Directi (Titan Email); **has resigned, serving a 2-month notice period** (as of 2026-09-16). Actively job hunting under time pressure.

## How he thinks about himself vs. his resume
- His resume needs to be crisp, one-page, metric-dense — largely fixed content reused across applications.
- This context store exists to go *beyond* the resume: for tailoring emphasis per JD, for talking fluently in interviews/portfolio about the real state of his projects, and eventually for a personal "talk to my projects" agent for recruiters.
- Important self-aware distinction he draws: resume bullets often describe the **completed vision** of a project, not its current state. E.g. Vitalis's resume bullets read like a finished product; the real repo is an unfinished MVP. He wants this tracked honestly in context (see `projects/`) so he never gets caught flat-footed in an interview, while still using the aspirational metrics on the resume itself.

## Career narrative arc
1. **College (IIIT Delhi, through 2025):** DSA/competitive programming (Codeforces Expert) + broad AI exposure — ML, DL, RL, NLP, LLMs — pursued through courses, a research assistantship, a summer fellowship, and a hackathon, layered on top of ~4 shippable-ish course/personal projects.
2. **Research exposure (MIDAS Lab, IIITD, Aug–Dec 2024):** Undergrad researcher on LLM-based code generation guided by semantic knowledge graphs (essentially early "agentic coding" ideation, pre-dating tools like Claude Code / coding agents). Also authored a paper on cross-lingual sentiment analysis around machine translation (NLP course project).
3. **Launchpad.ai SWE Fellowship (Jul–Sep 2024, remote):** Cohort-based fellowship; robotic motion planning — vision-based sunscreen-application arm, Deep RL (DQN/TD3), PyBullet sim. Was Scrum Master for the team. Public write-up exists (Medium blog by a teammate).
4. **IIT Delhi Graphics & Vision Summer School 2024:** Top-50 selection; hackathon project — vision-based house price estimation (text + images), plus SLAM exploration for depth estimation.
5. **Directi / Titan Email — SDE Intern → PPO → SDE-Backend (Jan 2025 – present, resigned, notice ends ~Nov 2026):** See `work-experience.md` for full depth. Two major bodies of work: (a) building an org-wide GitHub Actions CI/CD platform to replace Jenkins, including org-wide Claude Code Actions rollout; (b) full-time role on Medusa, a server-side event-driven data platform, plus its ETL/Athena scripts and the Mimir AI-toolchain repo.
6. **Personal projects (2025–2026, ongoing):** A cluster of self-directed projects spanning full-stack systems (Collab-Docs), RL research tooling (RL Minesweeper Lab), AI health-tech (Vitalis), AI-native audio DSP (Japa Coach / chantBetter), RAG over religious texts (Vedaspace), a personal AI orchestration control-plane (Cortex), and a systems/networking utility (Remote Connector). None are fully "finished" — most are MVP/phase-1-2 — but several are genuinely deployed and instrumented with real measurements (see `projects/` folder for per-project state).

## Interests / identity signals worth knowing for tailoring
- Deep personal interest in Krishna-conscious / ISKCON-related devotional practice — multiple side projects (chantBetter/Japa Coach, Vedaspace, bhakti-anugrah-janardan-swami, sankirtan-seva-distro, iskcon-whatsapp-chatbot, book_distribution_website) are built for this community. This is a genuine passion project cluster, not resume padding — worth knowing for culture-fit conversations but generally not resume-worthy framing (frame as "AI-grounded RAG / on-device audio ML" rather than the religious angle, unless the audience is receptive).
- Enjoys building infra/tooling that other engineers use (GitHub Actions platform adopted by mobile/frontend/devops teams at Titan; Mimir AI-toolchain shared org-wide) — this is a recurring strength: force-multiplying tooling, not just feature work.
- Comfortable across the stack: Java/Spring backend at work, Python for ML/RL/data, TypeScript/React/Node for personal full-stack projects, Go for a systems project (Remote Connector).

## Additional self-reported tools/skills (2026-09 update, not yet detailed in project files)
Aekansh confirmed these are real (used firsthand), just not yet written up in `projects/*.md` — logged here so resume claims referencing them are defensible in an interview until a fuller writeup exists:
- **Kafka** — has hands-on experience beyond the SQS-only work documented in `work-experience.md`.
- **graphRAG, LangChain/LangGraph** — used in AI/ML work beyond what's currently documented for Vedaspace/Cortex (those docs currently describe custom retrieval/routing code, not these frameworks specifically) — needs a specific project/context note before being probed in depth.
- **Hermes Agent** — a tool/framework he's used; not yet documented anywhere else in context.
- **Auth0** — used for auth beyond the generic "Google OAuth" flows documented in `collab-docs.md` and `work-experience.md`.
- **Notion** — used as a dev/workflow tool.
- Collab-Docs crash-durability testing actually included **fault-injection and property-based test suites**, beyond the scripted SIGKILL-recovery harness currently documented in `projects/collab-docs.md` — that file should be updated with specifics (framework used, e.g. Hypothesis/fast-check) before an interview.
- Collab-Docs broadcast-message reduction re-measured at **24.3x** (vs. the `25x` logged in `projects/collab-docs.md`) — that file's number should be updated/reconciled with the new measurement.

**TODO for Aekansh:** flesh these out in their respective `projects/*.md` files (what exactly was built/used, roughly when) so they hold up under interview follow-up questions — this note is a placeholder, not a substitute for the real writeup.

## Related memory
See [[work-experience]], [[projects-overview]], [[resume-strategy]].
