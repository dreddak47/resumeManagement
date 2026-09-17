# Remote Connector

**Location:** `/Users/aekansh.k/Documents/remoteConnector`
**Status: ~70% MVP, unshipped, Stage 1 of 2 planned stages.** Systems/networking project — not AI-flavored, better fit for SDE/systems-leaning resumes than AI/ML ones. Not currently on resume.

## What it is
Personal utility: control a Mac's mouse/keyboard from an Android phone over home WiFi LAN (e.g., controlling the desktop from bed).

## Tech stack
Go (backend daemon on Mac, using `robotgo` for input injection, `coder/websocket`, `systray` for a tray icon, `launchd` for autostart). Phone client: vanilla JS/HTML/CSS PWA served directly by the Go server. Optional pairing bridge: Node.js on Vercel + Upstash Redis for short-lived pairing codes (so the phone can connect via a 6-digit code instead of typing an IP).

## Verified current state
- Core architecture built and working: single Go HTTP server (port 8740) serving the PWA and a token-authenticated WebSocket endpoint (`/ws`) dispatching move/click/scroll/key/text messages to `robotgo`.
- Phone UI: full-screen Pointer-Events touch surface, batches input via `requestAnimationFrame`.
- Security model: shared token at WS handshake — adequate for a private home LAN, explicitly not hardened beyond that.
- Small, focused codebase: ~5 Go files (~2,000 LOC), ~200 LOC JS. No persistent DB — config is a flat file at `~/.remoteconnector.conf`.
- Active, recent development (commits as recent as the day before this context was written) — config.go refactor and install-script cleanup.
- Not deployed/shipped: no real-device testing documented beyond a manual smoke-test checklist in PLAN.md, no packaged `.app` yet (that's Stage 2).

## Known limitations
- No automated tests — verification is a manual checklist.
- Known unresolved issues documented in the repo itself: Retina display coordinate scaling, rough multi-monitor support in `robotgo`, macOS Accessibility (TCC) re-prompt on rebuild due to code-signature changes.
- Pairing-server path (Vercel + Redis) adds real complexity for a "nice-to-have" UX feature; direct LAN connection works without it.
- No graceful error surfacing on the phone UI when pairing fails.

## What's needed to complete the vision
1. Finish Stage 1: real-device validation on multiple Android phones, fix Retina/multi-monitor coordinate issues, resolve the TCC re-signing gotcha.
2. Package as a proper `.app` bundle with a simple installer (Stage 2).
3. Add minimal automated tests (at least for the WebSocket message dispatch layer).
4. Polish phone UI (icons, gesture hints, animations — explicitly deferred to Stage 2).

## Resume bullet draft (SDE/systems-leaning resume)
- Built a low-latency remote-input system in Go, streaming touch/gesture events from an Android PWA client to a macOS daemon over a token-authenticated WebSocket, translating them to native mouse/keyboard events via direct OS input injection.
- Designed an optional pairing flow (Vercel + Redis short-lived code mapping) so a phone can connect to the LAN-only control channel via a 6-digit code instead of manual IP/token entry, keeping all control traffic on the local network.

## Talking points beyond resume
- Good "real OS integration" story: launchd lifecycle management, macOS Accessibility/TCC permissions, cross-device PWA — shows comfort below the web-app abstraction layer, useful contrast to his mostly-web personal projects.
