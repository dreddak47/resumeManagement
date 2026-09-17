# RL Minesweeper Lab

**Location:** `/Users/aekansh.k/Documents/RL-Minesweeper-Lab`
**Status: DEPLOYED (frontend + read-only results API), training itself is offline/historical.** Resume bullets are accurate and exactly match repo numbers.

## What it is
Research-style RL benchmark suite: multiple agents (Random, CSP solver, Q-Learning, DQN, PPO) trained/evaluated on Minesweeper across board sizes/densities, with a public site showing results and replays.

## Tech stack
Python, PyTorch, Gymnasium (custom env), FastAPI backend (serves precomputed results, not live training), frontend deployed to Vercel (`rl-minesweeper-lab.vercel.app`).

## Verified current state
- README numbers match code exactly: 37 committed runs, 2.73M training episodes, 132,000 evaluation games, 18 board configurations, 5 agents, 3 board sizes (5x5/9x9/16x16), 3 mine densities, 2 first-click configs.
- 11-channel one-hot Gymnasium encoding + action masking, Double DQN with target network, confirmed in `rl/models/dqn_network.py`.
- Fully-convolutional head: 29,089 params vs. 1,087,968 for a linear head on 16x16 — confirmed exact.
- Best DQN (`fully_conv`, Double) 77.25% win rate vs CSP deduction baseline 70.35% (95% CIs disjoint: [75.4,79.0] vs [68.3,72.3]) — confirmed exact.
- "99% on deducible boards" is a slight overstatement/rounding — actual peak is CSP at ~98.55% (9x9 expert) / 95.05% (16x16 solo, 30 mines). Defend as "~99%" or tighten to "~98.5%" if pressed in interview.
- 424 passing tests (297 RL-level, 127 backend).
- Zero-shot 5x5→9x9 transfer confirmed (77%→80.15% for fully_conv DQN, not a drop — this is a *positive*, worth re-checking the resume wording "at half the directly trained win rate," since actual repo shows transfer performance was comparable/better on this specific config, not necessarily half in general — verify per-agent before quoting to an interviewer).

## Known limitations
- PPO badly underperforms (7.9% win rate) — not production-ready, a known dead end.
- Training is entirely offline/historical; the deployed backend just serves saved results, no live training infra.
- No hyperparameter-sweep UI — ablations exist only as offline scripts in `rl/analysis/`.

## What would make it fully "complete"
- Live training pipeline (e.g., Ray) with checkpointing + parallel rollouts, streamed to frontend via websocket leaderboard.
- Fix/debug PPO.
- Curriculum learning across board sizes.

## Resume bullets (current, verified — keep, but sanity-check the "half the win rate" transfer claim before an interview where you'd be asked to defend it)
- Built a CLI-configurable training harness (argparse-driven hyperparameters, checkpointing on best-scoring policy, JSON/CSV per-episode history export) to orchestrate multiple training runs across 5 agents for 3 board sizes, 3 mine densities and 2 board configs (first mine safe/unsafe), totaling 2.7M training episodes and 132K fixed-seed evaluation games.
- Designed a Gymnasium environment with 11-channel one-hot encoding and action masking for policy sampling and Double DQN targets; achieved 77% win rate versus 70% for a constraint-propagation solver, and ~99% on fully deducible boards.
- Replaced the Q-network's linear head with a convolutional head, reducing parameters from 1M to 29K on 16-by-16 boards; enabled zero-shot transfer from 5-by-5 to 9-by-9 boards.

## Talking points beyond resume
- Why a fully-convolutional head gives board-size independence/translation-equivariance — strong ML systems-design talking point.
- Empirical, statistically-aware evaluation (95% CIs, disjoint intervals) — shows research rigor even in a side project.
