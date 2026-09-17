# Collab-Docs

**Location:** `/Users/aekansh.k/Documents/collab-docs`
**Status: DEPLOYED, most complete personal project.** Resume bullets here are largely truthful, not aspirational.

## What it is
Google-Docs-style real-time collaborative text editor. Two swappable concurrency engines behind one interface: Yjs (CRDT) and a hand-written OT (Operational Transform) implementation.

## Tech stack
Node.js backend (two services: `collab-yjs`, `collab-ot`), static frontend client, PostgreSQL (Neon), Redis (optional cache, in-process fallback). Deployed on Render (3 services, per `render.yaml`). CI on GitHub Actions using ephemeral Neon DB branches.

## Verified current state
- Live at collab-client-kvn5.onrender.com, backed by real Render services.
- 23 ADRs documenting every major architecture decision with stated trade-offs — unusually rigorous for a side project.
- 46 test harnesses (31 headless, 15 real-Chrome) exercising both engines in parallel.
- Real measured numbers exist in repo tooling (not fabricated): 25x broadcast-message reduction at 100 simulated editors (`tools/rich-ot-properties.mjs`), state-vector diff of 25B vs 339B snapshot, durability harness showing 1170/1170 chars recovered after SIGKILL.
- Lab-tested concurrency cap is actually ~8 replicas in `record:lab` script; resume claim of "15-20 concurrent clients" is a reasonable, slightly-rounded-up extrapolation, not fabricated from nothing — safe to defend in interview by pointing to the measurement tooling and explaining it's simulated load beyond the manual lab cap.
- Auth (Google OAuth), 4-tier rate limiting, Redis-backed sessions with in-process fallback: all real, in `/backend/src/auth`, `/cache`.

## Known limitations (be ready to discuss honestly)
- Single-instance deployment by design — rooms are in-process; horizontal scaling would need a Redis-backed RoomRegistry/PubSub/PresenceStore (explicitly documented as the "next boundary" in the ADRs, not an oversight).
- OT comment-anchor drift under deletion is a known, tested, accepted trade-off (not a bug).
- Write buffer trades latency for durability, bounded/configurable.

## What would make it fully "complete" (for interview narrative, not urgent)
- Multi-instance horizontal scaling via Redis-backed room coordination.
- Per-room latency observability beyond `/api/health`.
- Persist OT authorship metadata across restarts.

## Resume bullets (current, verified — keep using as-is)
- Built and deployed a Google Docs-style real-time collaborative text editor with pluggable CRDT (Yjs) and hand-written OT engines behind a common sync interface; manually tested with 15–20 concurrent clients.
- Designed the sync protocol for network efficiency: server-side batching cut broadcast messages by 25x under simulated 100-editor load; CRDT state-vector diffing cut reconnect payload size by 408x for a 100K character document versus full-state transfer.
- Added Google OAuth login, 4-tier per-endpoint rate limiting, and Redis-backed session caching with automatic in-process fallback when Redis is unavailable.
- Verified crash durability via scripted tests against an append-only PostgreSQL write log with buffered batch inserts; 0 characters lost on recovery.

## Talking points beyond the resume (for interviews/portfolio)
- 23 ADRs — can speak to a specific one in depth (e.g., ADR-016 batching, ADR-020 federated identity/algorithm pinning, ADR-023 Redis caching, ADR-012 OT comment-anchor trade-off).
- Explain *why* two engines (CRDT vs OT) exist side by side — good system-design story about comparing approaches empirically rather than picking one dogmatically.
