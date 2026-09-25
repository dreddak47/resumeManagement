---
name: tailor-resume
description: Produce a tailored one-page LaTeX resume for a specific job application, using the base SDE/AI-SWE resumes and the project/work-experience context store. Use when the user wants an actual resume file generated for a specific company/role, typically after running jd-analyze.
---

# Tailor Resume

Generate a tailored, one-page LaTeX resume for a specific job application, then iterate it toward the highest ATS/Fit score the one-page constraint allows.

## Preconditions
If a `jd-analyze` brief hasn't been produced yet for this JD in the current conversation, run that analysis first (see `.claude/skills/jd-analyze/SKILL.md`) before writing any resume file.

## Steps

1. **Start from the right base.** Copy the recommended base file — `resumes/sde.tex` or `resumes/ai-swe.tex` (per the jd-analyze brief) — as the starting point. **Standing instruction (2026-09): these are the only two active base variants.** `resumes/aiml.tex` and `resumes/fde.tex` are retired — do not use them for new tailoring unless the user explicitly asks.

2. **Swap in the recommended projects.** Pull bullet text for the chosen projects from `context/projects/<project>.md` ("Resume bullets" section). Keep bullets metric-dense and consistent with the style of existing bullets (bold key numbers with `\textbf{}`, one line of setup + one line of impact per bullet, 2 bullets per project typically, 3 max for the lead project).

3. **Reweight work-experience bullets** per the jd-analyze brief's guidance — reorder which achievement leads each role's bullet list, but do not remove any of the 4 work-experience entries (Directi x2, MIDAS Lab, Launchpad.ai) — all 4 stay per standing instruction in `context/resume-strategy.md`.

   For the Titan blocks specifically: start from the **canonical default bullets** in `context/resume-strategy.md` ("Default Titan bullets" section) — don't regenerate the underlying facts/numbers from scratch. `resumes/ai-swe.tex` already has the Mimir expansion done with real, verified metrics (see `context/work-experience.md` Mimir section) — pull from there for AI-leaning JDs rather than reinventing bullets.

4. **Reorder Technical Skills** so the category most relevant to the JD comes first, and fold in any real-but-missing keywords flagged by jd-analyze (never invent skills — cross-check against `context/work-experience.md` / `context/projects/`).

5. **Enforce one-page discipline.** Work Experience (4 entries, ~1-2 bullets each) + Projects (2-3, ~2-3 bullets each) + Skills (4-5 lines) + Education (1 line) + Achievements (2 lines) is the budget that has historically fit on one page with this template's margins/font. If a tailored version runs long, cut a project bullet before cutting a work-experience entry, and cut Achievements before cutting Projects.

6. **Save the working `.tex`** to `resumes/tailored/<company-slug>-<role-slug>.tex` (create the `tailored/` directory if it doesn't exist). Never overwrite `resumes/sde.tex` or `resumes/ai-swe.tex` — those are the reusable base templates.

7. **Compile.** Run `scripts/compile.sh resumes/tailored/<file>.tex` and confirm `PAGES: 1`. If it overflows, trim per the priority order in step 5 and recompile — don't hand off a 2-page draft.

8. **Score and iterate to maximize.** Extract the compiled PDF's text (`scripts/pdf_info.py build/<file>.pdf`) and invoke the `resume-score-checker` agent with that text plus the target JD to get an ATS score and a Recruiter/Model Fit score. Read its line-level feedback, make targeted edits (word choice, keyword coverage, bullet ordering — not new fabricated content), recompile, and re-score. Repeat until scores plateau or the one-page budget is exhausted — the goal is the highest score achievable within one page, not a single pass. If a round produces ATS/Fit both notably high (Fit > 90 per `resumes/best/README.md`'s convention), copy the `.tex`+`.pdf` to `resumes/best/` as a snapshot before continuing to edit.

9. **Optional finer-grained bullet review with Jev.** If `TYPESAFE_API_KEY` is set in the environment, run `scripts/jev_review.py resumes/tailored/<file>.tex --jd <jd-file>` for a fast per-bullet rating (metric density + JD-relevance) to catch weak bullets the holistic scorer might average out. Treat this as a supplementary signal alongside resume-score-checker, not a replacement — resume-score-checker is the primary scoring loop.

10. **Run a fact-check pass.** After the score is maximized, invoke the `resume-fact-checker` agent (`.claude/agents/resume-fact-checker.md`) to cross-check every claim against the context store. Fix any flagged issues and recompile before finalizing.

11. **Produce the final deliverable.** Copy the compiled PDF to `build/aekansh_Resume_<Company>.pdf` (company name in the naming convention the user specified — e.g. `aekansh_Resume_Stripe.pdf`) and report the final ATS/Fit scores plus the file path.
