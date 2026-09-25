export type ProjectCategory = "systems" | "ai-ml" | "research" | "interest-driven";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categories: ProjectCategory[];
  tech: string[];
  repo?: string; // GitHub repo name for live stats, owner is dreddak47
  demo?: string;
  period: string;
  highlights: string[];
};

export const categoryLabels: Record<ProjectCategory, string> = {
  systems: "Systems",
  "ai-ml": "AI / ML",
  research: "Research",
  "interest-driven": "Interest-Driven",
};

export const projects: Project[] = [
  {
    slug: "collab-docs",
    name: "Collab-Docs",
    tagline: "Google-Docs-style real-time collaborative editor",
    description:
      "A real-time collaborative text editor with two swappable concurrency engines behind one interface — a CRDT engine (Yjs) and a hand-written Operational Transform implementation — so the trade-offs between the two approaches could be compared empirically instead of picked dogmatically.",
    categories: ["systems"],
    tech: ["Node.js", "PostgreSQL", "Redis", "WebSockets", "Yjs"],
    repo: "collab-docs",
    demo: "https://collab-client-kvn5.onrender.com/",
    period: "2026",
    highlights: [
      "Server-side batching cut broadcast messages 25x under simulated 100-editor load; CRDT state-vector diffing cut reconnect payload size 408x on a 100K-character document.",
      "Google OAuth, 4-tier per-endpoint rate limiting, Redis-backed sessions with automatic in-process fallback.",
      "Crash-durability verified against an append-only Postgres write log — 0 characters lost on recovery after a hard kill.",
      "23 ADRs documenting every major architecture decision and trade-off.",
    ],
  },
  {
    slug: "rl-minesweeper-lab",
    name: "RL Minesweeper Lab",
    tagline: "A research-style reinforcement learning benchmark suite",
    description:
      "Multiple RL agents (Random, CSP solver, Q-Learning, DQN, PPO) trained and evaluated on Minesweeper across board sizes and mine densities, with statistically rigorous evaluation and a public results site.",
    categories: ["ai-ml", "research"],
    tech: ["Python", "PyTorch", "Gymnasium", "FastAPI"],
    repo: "RL-Minesweeper-Lab",
    demo: "https://rl-minesweeper-lab.vercel.app/",
    period: "May 2026 – Jul 2026",
    highlights: [
      "2.7M training episodes and 132K fixed-seed evaluation games across 5 agents, 3 board sizes, 3 mine densities.",
      "Best DQN variant reached a 77% win rate vs. 70% for a constraint-propagation baseline, with disjoint 95% confidence intervals.",
      "Replaced the Q-network's linear head with a fully convolutional head — 29K params vs. 1M on 16×16 boards — enabling zero-shot transfer from 5×5 to 9×9 boards.",
    ],
  },
  {
    slug: "vitalis",
    name: "Vitalis",
    tagline: "Privacy-first AI health tracker",
    description:
      "Ingests prescriptions, lab reports, doctor notes, and voice memos, extracts structured data with LLM extraction agents, and compiles persona-aware generative health reports instead of a fixed dashboard.",
    categories: ["ai-ml"],
    tech: ["TypeScript", "Fastify", "React", "Supabase", "Zod"],
    period: "2026",
    highlights: [
      "3-tier OCR/vision pipeline (embedded text → classical OCR → vision-model fallback) that escalates only on low confidence or detected handwriting.",
      "Zod schemas shared across frontend and backend as the single source of truth, eliminating a whole category of drift bugs.",
      "Privacy-by-design: row-level security, user-controlled retention, one-click export/deletion, append-only audit log.",
    ],
  },
  {
    slug: "cortex",
    name: "Cortex",
    tagline: "A personal AI orchestration control plane",
    description:
      "A local-first control plane that routes ideas through an agent layer, dispatches approved work to a coding harness, and tracks every run's cost and outcome in a persistent ledger — built around swappable registries for models, harnesses, agents, and tools.",
    categories: ["ai-ml", "systems"],
    tech: ["Python", "FastAPI", "LiteLLM", "SQLite", "Typer"],
    period: "2026",
    highlights: [
      "Contracts-first design — harness, model, agent, and memory interfaces defined before any implementation.",
      "Dual-rail budget governance enforced both at the LLM gateway and in-app, queuing over-budget work instead of failing it outright.",
      "Tiered multi-provider model routing (Anthropic, Groq, OpenRouter) by task type — free tier for triage, premium tier for actual code generation.",
    ],
  },
  {
    slug: "remote-connector",
    name: "Remote Connector",
    tagline: "Control a Mac from an Android phone over LAN",
    description:
      "A Go daemon on the desktop paired with an Android PWA client, streaming touch/gesture events over a token-authenticated WebSocket and translating them into native OS input via direct injection.",
    categories: ["systems"],
    tech: ["Go", "WebSockets", "PWA"],
    period: "2026",
    highlights: [
      "Single self-hosted Go server dispatching move/click/scroll/key events to native OS input.",
      "Optional pairing flow (Vercel + Redis short-lived codes) so a phone connects via a 6-digit code instead of a manual IP, while all control traffic stays on the LAN.",
      "Real OS-integration work: launchd lifecycle management, macOS Accessibility/TCC permission handling.",
    ],
  },
  {
    slug: "vedaspace",
    name: "Vedaspace",
    tagline: "A grounded RAG engine over Sanskrit sacred texts",
    description:
      "An AI-grounded knowledge engine over the Bhagavad-gita and roughly 1,000 lecture transcripts, built to answer questions about the text while proving every claim against its sources rather than trusting the model to not hallucinate.",
    categories: ["ai-ml", "interest-driven"],
    tech: ["Next.js", "FastAPI", "sentence-transformers", "SQLite + sqlite-vec"],
    period: "2026",
    highlights: [
      "Hybrid retrieval combining BM25, local sentence-transformer embeddings, and deterministic verse-number lookup.",
      "A custom, deterministic citation-verification layer that cross-checks every generated claim against retrieved source chunks before it reaches the user — a real anti-hallucination mechanism, not a prompt instruction.",
      "A 103-question stratified evaluation harness tracking retrieval MRR, exact-citation accuracy, and abstention rate.",
      "Provider-agnostic generation layer (local embeddings, swappable OpenRouter/Anthropic backends) with a hard cap on LLM calls per run to keep dev cost predictable.",
    ],
  },
  {
    slug: "chantbetter",
    name: "chantBetter (Japa Coach)",
    tagline: "An on-device audio coach for mantra practice",
    description:
      "A privacy-first, fully client-side coach for japa — repetitive mantra chanting practice. Listens via microphone, tracks progress through a fixed word sequence, and gives post-session feedback on missed or mispronounced words, all without anything leaving the device.",
    categories: ["ai-ml", "interest-driven"],
    tech: ["TypeScript", "Preact", "Web Audio API", "Python (offline training)"],
    period: "2026",
    highlights: [
      "Real-time mel-spectrogram DSP running identically in a browser Web Worker and a Node replay harness off one shared ~2,000-line core.",
      "A deliberately small error taxonomy (order swaps, dropped words, repeat-count errors, mispronunciation) designed to avoid false positives during live practice — a product-thinking problem as much as an ML one.",
      "135 tests (111 vitest + 24 pytest) covering the DSP pipeline and state machine end-to-end.",
    ],
  },
];
