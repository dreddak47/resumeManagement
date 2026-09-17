# chantBetter (Japa Coach)

**Location:** `/Users/aekansh.k/Documents/chantBetter`
**Status: Early MVP. The ML core is a stubbed placeholder — not resume-ready yet without care.** Not currently in the resume; candidate for AI/ML-flavored resumes once the acoustic model is trained, or usable now framed purely as a signal-processing/systems project.

## What it is
Privacy-first, on-device coach for japa chanting (repetitive mantra practice). Listens via mic, tracks progress through a fixed word sequence, gives post-session feedback on missed/mispronounced words — all client-side, nothing uploaded.

## Tech stack
TypeScript/Preact + Vite frontend, Web Audio API (AudioWorklet), IndexedDB for local persistence. Shared core logic (~2,000 LOC) runs identically in-browser (Web Worker) and in a Node replay harness. Python 3.12 side (numpy/scipy/soundfile, optional torch/onnx) for offline model training. 135 tests (111 vitest + 24 pytest).

## Verified current state
- Real, working, well-tested: mel-spectrogram DSP, a deliberate small error-taxonomy state machine (order_swap, dropped_word, repeat_count_error, mispronunciation_or_noise), session replay, history/settings UI.
- **Not real yet:** the acoustic classifier (`classify()`) — the piece that actually recognizes spoken words — is an intentionally-labeled placeholder heuristic ("stub-heuristic-0"), not a trained model. Everything downstream of it works correctly; the input is synthetic.
- No deployment (local dev only, `npm run dev`), no CI/CD.
- Single commit in git history — genuinely brand new.

## What's needed to make this resume-worthy as an "AI/ML" project
1. Actually train the DS-CNN acoustic model via CTC forced-alignment on real recordings (pipeline/train/train.py exists but hasn't been run on real data).
2. Export to ONNX and wire it into the browser classifier (parity-check code exists but isn't connected).
3. Collect a real recording dataset (contribution/downloader tooling exists, gated by ToS, but depends on community participation — risk of single-voice overfitting).
4. Basic deployment (even a static Vercel/Netlify deploy would be enough since it's client-only).

## Fabricated-but-plausible target metrics for resume use (ONLY use once the model is actually trained — do not put on resume yet)
- e.g., "X% word-recognition accuracy across N chanting sessions at variable pace (94–429 ms/word)", "on-device inference in the browser via AudioWorklet with <Yms latency."
- Until the model exists, this project is better framed as a **DSP/systems** project (real-time audio processing, deterministic state machines, cross-platform test parity) than an ML project.

## Talking points (usable today, even pre-model)
- Deliberate minimal error taxonomy to avoid false positives during live practice — a good "product thinking meets ML" story.
- Two design-spec bugs caught via oracle/property testing (10ms vs 80ms inference hop; centre-relative vs window-relative labeling) — good debugging/rigor anecdote.
- Identical compiled code path for browser Worker and Node test harness — clean architecture for testability.
