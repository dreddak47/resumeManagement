---
name: tailor-resume
description: Produce a tailored one-page LaTeX resume for a specific job application, using the base SDE/AI-ML/FDE resumes and the project/work-experience context store. Use when the user wants an actual resume file generated for a specific company/role, typically after running jd-analyze.
---

# Tailor Resume

Generate a tailored, one-page LaTeX resume for a specific job application.

## Preconditions
If a `jd-analyze` brief hasn't been produced yet for this JD in the current conversation, run that analysis first (see `.claude/skills/jd-analyze/SKILL.md`) before writing any resume file.

## Steps

1. **Start from the right base.** Copy the recommended base file from `resumes/sde.tex`, `resumes/aiml.tex`, or `resumes/fde.tex` (per the jd-analyze brief) as the starting point — don't write from scratch.

2. **Swap in the recommended projects.** Pull bullet text for the chosen projects from `context/projects/<project>.md` ("Resume bullets" section) or from `aekanshResume.tex` if the project isn't yet drafted for LaTeX. Keep bullets metric-dense and consistent with the style of existing bullets (bold key numbers with `\textbf{}`, one line of setup + one line of impact per bullet, 2 bullets per project typically, 3 max for the lead project).

3. **Reweight work-experience bullets** per the jd-analyze brief's guidance — reorder which achievement leads each role's bullet list, but do not remove any of the 4 work-experience entries (Directi x2, MIDAS Lab, Launchpad.ai) — all 4 stay per standing instruction in `context/resume-strategy.md`.

   For the Titan blocks specifically: start from the **canonical default bullets** in `context/resume-strategy.md` ("Default Titan bullets" section, verbatim in `resumes/sde.tex`) — don't regenerate the underlying facts/numbers from scratch. If the target JD is AI/ML-heavy, apply the AI-focused tailoring rule from that same section: cut 1-2 of the 6 default full-time bullets and expand the Mimir bullet into 4-5 using the examples in `context/mimir-ai-expansion.md` (these carry `[X]` placeholders the user still needs to fill — keep them as placeholders, don't invent numbers).

4. **Reorder Technical Skills** so the category most relevant to the JD comes first, and fold in any real-but-missing keywords flagged by jd-analyze (never invent skills — cross-check against `context/work-experience.md` / `context/projects/`).

5. **Enforce one-page discipline.** Work Experience (4 entries, ~1-2 bullets each) + Projects (2-3, ~2-3 bullets each) + Skills (4-5 lines) + Education (1 line) + Achievements (2 lines) is the budget that has historically fit on one page with this template's margins/font. If a tailored version runs long, cut a project bullet before cutting a work-experience entry, and cut Achievements before cutting Projects.

6. **Save the output** to `resumes/tailored/<company-slug>-<role-slug>.tex` (create the `tailored/` directory if it doesn't exist). Never overwrite `resumes/sde.tex`, `resumes/aiml.tex`, or `resumes/fde.tex` — those are the reusable base templates.

7. **Try to compile.** If a LaTeX toolchain (`pdflatex`/`tectonic`) is available, compile to PDF and report page count. If not available, say so explicitly rather than claiming it's verified to fit one page — do a manual line-budget sanity check instead and note the caveat to the user.

8. **Run a review pass.** After generating the tailored resume, invoke the `resume-fact-checker` agent (`.claude/agents/resume-fact-checker.md`) to cross-check every claim against the context store before presenting the final file to the user.
