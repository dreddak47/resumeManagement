# Metrics Needed — Titan Bullets

## sde.tex — RESOLVED (2026-09)
All Titan bullets in `sde.tex` now use real, user-provided numbers (50M+ events, 200K+ entity updates, P99 -65%, SQS throughput +30%, $1.5K+/year, 100% HTTP migration, GH Actions -60%, ETL CPU -70%, intern pipeline -40%, failed-deploy -80%). No placeholders remain in this file. This bullet set is now the **canonical default** — see `context/resume-strategy.md` → "Default Titan bullets."

Two placeholders remain inside the AI-expansion example set for future AI-heavy tailoring (not in `sde.tex` itself) — see `context/mimir-ai-expansion.md`:
- Token-cost reduction % (bullet 1)
- Number of exposure paths closed by a security review (bullet 2)
- Repo count under policy-based ACLs (bullet 3)
- PR auto-fix rate % and review-cycle-time reduction % (bullet 4)
- JIRA auto-resolve rate % and resolution-time before/after (bullet 5)
These are lower priority — they require Aekansh to actually build the described mechanisms first (see that file's "To make this real" notes per bullet).

## aiml.tex and fde.tex — NOT YET SYNCED to the new canonical default
These two files still have the earlier (pre-finalization) Titan bullets with `[X]`/`[N]` placeholders, written before the 2026-09 finalization captured in `sde.tex`. They have NOT been updated to match the new canonical bullet set yet — only `sde.tex` was touched per explicit request. This means:
- Some facts may currently read differently across resumes (e.g., aiml.tex/fde.tex still describe Medusa/CI-CD generically rather than with the 50M+ events / 65% P99 / $1.5K numbers now locked in for sde.tex).
- Recommend syncing aiml.tex and fde.tex to pull from the same canonical bullet set (`context/resume-strategy.md`) next, reworded per their existing role-specific framing, so all three resumes tell the same underlying story with the same numbers. Ask for this explicitly when ready — not done automatically to respect "don't touch files unless asked."

## Note on consistency
Once aiml.tex/fde.tex are synced, keep the same real number for the same underlying fact across all three files (e.g., the $1.5K/year SQS savings, the 65% P99 reduction) — don't let one fact drift into different numbers across variants.
