#!/usr/bin/env python3
"""Fast, cheap bullet-level ratings via TypeSafe's Jev model — for finer review
passes on top of the ATS/Fit scores from the resume-score-checker agent.

Rates every \\item bullet in a resume .tex file on:
  1. metric_density (Score, 0-4): how quantified/impact-driven the bullet is.
  2. jd_relevance (Choice: strong_match/weak_match/no_match) — only if --jd is given.

Reads TYPESAFE_API_KEY from the environment (populate .env and `source` it,
or export it in your shell — this script does not read .env itself).

Usage:
  export $(grep -v '^#' .env | xargs)   # or set TYPESAFE_API_KEY another way
  scripts/jev_review.py resumes/ai-swe.tex
  scripts/jev_review.py resumes/ai-swe.tex --jd path/to/jd.txt
"""
import argparse
import json
import os
import re
import sys
import urllib.request

API_URL = "https://api.typesafe.ai/v1/systemone"

METRIC_CRITERIA = [
    "No metrics; purely qualitative",
    "Vague or unverifiable metric",
    "One concrete, specific metric",
    "Multiple concrete metrics tied to business impact",
    "Rich, well-contextualized metrics showing clear scale and outcome",
]


def extract_bullets(tex_path: str) -> list[str]:
    text = open(tex_path).read()
    bullets = re.findall(r"\\item\s+(.*)", text)
    # strip LaTeX bold/math markup for cleaner model input
    cleaned = []
    for b in bullets:
        b = re.sub(r"\\textbf\{([^}]*)\}", r"\1", b)
        b = re.sub(r"\$[^$]*\$", "", b)
        b = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", b)
        cleaned.append(b.strip())
    return cleaned


def call_jev(api_key: str, state, questions: dict) -> dict:
    body = json.dumps({"state": state, "model": "jev-latest", "questions": questions}).encode()
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("tex_path")
    parser.add_argument("--jd", help="path to a job description text file for relevance scoring")
    args = parser.parse_args()

    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        print("error: TYPESAFE_API_KEY not set in environment", file=sys.stderr)
        sys.exit(1)

    jd_text = open(args.jd).read() if args.jd else None
    bullets = extract_bullets(args.tex_path)

    for i, bullet in enumerate(bullets, 1):
        questions = {
            "metric_density": {
                "type": "score",
                "instructions": "How strong is the metric density / quantified impact in this resume bullet?",
                "criteria": METRIC_CRITERIA,
            }
        }
        state = {"bullet": bullet}
        if jd_text:
            state["job_description"] = jd_text
            questions["jd_relevance"] = {
                "type": "choice",
                "instructions": "Is `bullet` a strong keyword/skill match for `job_description`?",
                "criteria": {
                    "strong_match": "Bullet uses terminology/skills directly matching the JD",
                    "weak_match": "Some overlap but missing key JD terms",
                    "no_match": "Little to no relevant overlap",
                },
            }

        result = call_jev(api_key, state, questions)
        answers = result["answers"]
        metric_score = answers["metric_density"]["score"]
        line = f"[{i}] metric_density={metric_score:.2f}/4"
        if jd_text:
            jd_answer = answers["jd_relevance"]
            line += f"  jd_relevance={jd_answer['choice']} (conf {jd_answer['confidence']:.2f})"
        print(line)
        print(f"    {bullet[:110]}{'...' if len(bullet) > 110 else ''}")


if __name__ == "__main__":
    main()
