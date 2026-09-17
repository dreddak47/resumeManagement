---
name: jd-analyze
description: Analyze a job description and recommend which base resume (SDE/AI-ML/FDE) and which projects/bullets to use for tailoring. Use when the user pastes a job description or JD URL/text and wants to know how to position their resume for it.
---

# JD Analyze

Given a job description (pasted text, file, or URL fetched via WebFetch), produce a structured tailoring brief for Aekansh Kathunia's resume.

## Steps

1. **Read context first.** Load these files before analyzing anything:
   - `context/profile.md`
   - `context/work-experience.md`
   - `context/projects-overview.md` and the relevant files under `context/projects/`
   - `context/resume-strategy.md`

2. **Classify the role** into one of the three base archetypes (or a hybrid — say so explicitly if it's a blend):
   - **SDE** — generalist backend/full-stack, distributed systems, infra emphasis.
   - **AI/ML Engineer** — LLM/RAG/agents/ML/RL emphasis.
   - **FDE (Forward Deployed Engineer)** — customer-facing, rapid prototyping, full-stack ownership, ambiguous-problem-to-shipped-tool narratives.

3. **Extract from the JD:**
   - Top 8-12 hard keywords/technologies (for ATS matching) — quote them verbatim from the JD.
   - The 2-3 core competencies the role is actually testing for (read between the lines, not just keyword-match).
   - Seniority signal (does it want 1+ YOE generalist depth, or narrow specialist depth?).

4. **Recommend, with reasoning:**
   - Which base resume file under `resumes/` (`sde.tex`, `aiml.tex`, or `fde.tex`) to start from.
   - Which 2-3 projects from `context/projects-overview.md` best match this JD's stated needs, ranked, with one-line justification each tied to a specific JD requirement.
   - Which work-experience bullets to emphasize/reword (e.g., "lead with the Mimir/MCP bullet, not the CI/CD bullet, because the JD emphasizes AI tooling"). The Titan block has a canonical default 6-bullet (full-time) + 3-bullet (intern) set — see `context/resume-strategy.md` → "Default Titan bullets." For AI/ML-heavy JDs, explicitly recommend the AI-focused tailoring rule from that section: cut 1-2 default bullets, expand Mimir into 4-5 bullets from `context/mimir-ai-expansion.md`.
   - Any tech-stack keywords from the JD that are true of Aekansh's real experience (check `context/work-experience.md` and `context/projects/`) but currently missing from the base resume's Technical Skills section — flag these as things to add, but never invent a technology he hasn't actually used.

5. **Flag honesty risks.** If the JD implies a claim that would stretch beyond what `context/projects/*.md` supports (e.g., JD wants "production ML at scale" and the closest project is Vitalis's 16-document eval), say so explicitly so the user can decide how to phrase it, rather than silently overstating.

## Output format
A short markdown brief: Role Classification, Top Keywords, Recommended Base Resume, Recommended Projects (ranked, justified), Bullets to Re-emphasize, Honesty Flags. Keep it under 400 words — this is a working brief for the next step (`tailor-resume` skill), not the final resume.
