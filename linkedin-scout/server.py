#!/usr/bin/env python3
"""LinkedIn Scout — local server.

The Chrome extension scrapes your feed and posts it here. This server asks Jev
(TypeSafe System One) typed questions about each post, stores results in
SQLite, tells the extension which job links to open, judges those job pages,
and serves a dashboard at http://localhost:<port>/.

Zero dependencies (stdlib only). Reads TYPESAFE_API_KEY from the environment,
or from linkedin-scout/.env or the repo-root .env.

Usage:
  python3 linkedin-scout/server.py
"""
import json
import os
import re
import sqlite3
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "scout.db"
CONFIG = json.loads((ROOT / "config.json").read_text())
PORT = CONFIG.get("port", 8765)
CANDIDATE = CONFIG["candidate"]
THRESH = CONFIG["thresholds"]
API_URL = "https://api.typesafe.ai/v1/systemone"
MAX_POST_CHARS = 4000
MAX_PAGE_CHARS = 9000


# ---------------------------------------------------------------- Jev client

def load_api_key() -> str:
    key = os.environ.get("TYPESAFE_API_KEY")
    if key:
        return key
    for env_file in (ROOT / ".env", ROOT.parent / ".env"):
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                m = re.match(r"\s*(?:export\s+)?TYPESAFE_API_KEY\s*=\s*['\"]?([^'\"\s]+)", line)
                if m:
                    return m.group(1)
    sys.exit("error: TYPESAFE_API_KEY not found in env, linkedin-scout/.env, or ../.env")


API_KEY = load_api_key()


def call_jev(state, questions: dict) -> dict:
    body = json.dumps({"state": state, "model": "jev-latest", "questions": questions}).encode()
    for attempt in range(5):
        req = urllib.request.Request(
            API_URL, data=body, method="POST",
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read())["answers"]
        except urllib.error.HTTPError as e:
            if e.code in (429, 529) and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"Jev {e.code}: {e.read().decode()[:300]}") from e


# ------------------------------------------------------------ Jev questions

CATEGORY_Q = {
    "type": "choice",
    "instructions": "Classify the LinkedIn post `post.text` (links in `post.links`) for a software engineer who is job hunting.",
    "criteria": {
        "research": "Shares or discusses a research paper, preprint, benchmark, or technical study (arXiv/paper links, 'we propose', experimental results).",
        "dev_resource": "A developer tool, library, open-source repo, framework or model release, AI/tech launch, or in-depth technical tutorial/blog worth checking out.",
        "job_post": "Announces a specific open role or hiring need: the poster's team or company is hiring, shares a job link, or invites applicants/referral requests for a role. NOT people who are themselves looking for a job.",
        "other": "Anything else: personal/career updates, job seekers asking for work, layoffs, motivational or advice posts, polls, generic news, ads.",
    },
}

TITLE_FIT_LEVELS = [
    "Different function or discipline (sales, design, HR, hardware-only, support), or no specific role is identifiable",
    "Adjacent engineering role that only partly matches `candidate.target_titles` (e.g. QA/test, data analyst, pure SRE on-call)",
    "Software engineering role close to `candidate.target_titles` but with a different focus (e.g. frontend-only, mobile-only, embedded)",
    "Directly matches one of `candidate.target_titles` (e.g. backend, full-stack, SDE, AI/ML/LLM engineer, forward deployed)",
]

EXPERIENCE_FIT_LEVELS = [
    "Requires far more experience than `candidate.years_experience` (5+ years, senior staff/principal, lead or manager), or is only for current students/interns",
    "Requires somewhat more experience than the candidate has (around 3-4 years)",
    "Experience requirement is not stated, or is loosely compatible with the candidate",
    "Explicitly targets the candidate's level (new grad, 0-2 or 1-3 years, SDE-1, early career)",
]


def fit_questions(subject: str) -> dict:
    return {
        "title_fit": {
            "type": "score",
            "instructions": f"Assuming {subject} describes a job opening, how well does the role match the job seeker in `candidate`?",
            "criteria": TITLE_FIT_LEVELS,
        },
        "experience_fit": {
            "type": "score",
            "instructions": f"Assuming {subject} describes a job opening, how well does its seniority/experience requirement fit `candidate.years_experience`?",
            "criteria": EXPERIENCE_FIT_LEVELS,
        },
        "location_ok": {
            "type": "noul",
            "instructions": f"Assuming {subject} describes a job opening, is its location compatible with `candidate.location_preferences`?",
            "criteria": {"true": "Location matches the preferences, is remote-friendly, or is not stated", "false": "Location clearly conflicts (e.g. onsite in another country only)"},
        },
    }


def fit_value(answers: dict) -> float:
    title = answers["title_fit"]["score"] / 3
    exp = answers["experience_fit"]["score"] / 3
    fit = 0.6 * title + 0.4 * exp
    if answers["location_ok"]["noul"] < 0.3:
        fit *= 0.5
    return round(fit, 3)


def classify_post(post: dict) -> dict:
    links = post.get("links", [])[:12]
    state = {
        "candidate": CANDIDATE,
        "post": {"author": post.get("author", ""), "text": post.get("text", "")[:MAX_POST_CHARS], "links": links},
    }
    questions = {"category": CATEGORY_Q, **fit_questions("`post`")}
    # Speculative: asked for every post, only consumed for its category.
    questions["apply_channel"] = {
        "type": "choice",
        "instructions": "Assuming `post` advertises a job opening, how does it tell candidates to apply?",
        "criteria": {
            "link": "Points to a specific job listing, careers page, or application form link",
            "dm": "Asks candidates to DM/message the poster, comment, or reach out for referral",
            "email": "Asks candidates to email a resume to an address",
            "unclear": "No clear way to apply",
        },
    }
    if links:
        opts = {f"link_{i}": url for i, url in enumerate(links)}
        opts["none"] = "None of the links is the main resource of the post"
        questions["primary_link"] = {
            "type": "choice",
            "instructions": "Which link in `post.links` is the main resource the post is about (the paper, repo, tool page, or job listing / application page)?",
            "criteria": opts,
        }
    answers = call_jev(state, questions)
    primary = None
    if links:
        pick = answers["primary_link"]["choice"]
        primary = links[int(pick.split("_")[1])] if pick.startswith("link_") else None
    return {
        "category": answers["category"]["choice"],
        "category_conf": answers["category"]["confidence"],
        "fit": fit_value(answers),
        "title_fit": answers["title_fit"]["score"],
        "experience_fit": answers["experience_fit"]["score"],
        "location_ok": answers["location_ok"]["noul"],
        "apply_channel": answers["apply_channel"]["choice"],
        "primary_link": primary,
    }


def judge_job_page(page: dict) -> dict:
    state = {
        "candidate": CANDIDATE,
        "page": {"url": page["url"], "title": page.get("title", ""), "text": page.get("text", "")[:MAX_PAGE_CHARS]},
    }
    questions = {
        "page_kind": {
            "type": "choice",
            "instructions": "What kind of web page is `page`, opened from a job link in a LinkedIn post?",
            "criteria": {
                "open_listing": "A specific job listing that is still accepting applications",
                "closed_listing": "A specific job listing that says it is closed, expired, filled, or no longer accepting applications",
                "careers_index": "A careers page or job board listing many roles, without one specific role",
                "not_job": "Login wall, error/404, an article, or otherwise not a job page",
            },
        },
        **fit_questions("`page`"),
    }
    answers = call_jev(state, questions)
    return {
        "page_kind": answers["page_kind"]["choice"],
        "page_kind_conf": answers["page_kind"]["confidence"],
        "fit": fit_value(answers),
        "title_fit": answers["title_fit"]["score"],
        "experience_fit": answers["experience_fit"]["score"],
        "location_ok": answers["location_ok"]["noul"],
    }


# ------------------------------------------------------------------ storage

_db_lock = threading.Lock()


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


CONN = db()
CONN.executescript("""
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urn TEXT UNIQUE,
  category TEXT,
  status TEXT,
  author TEXT,
  age TEXT,
  text TEXT,
  post_url TEXT,
  links TEXT,
  primary_link TEXT,
  emails TEXT,
  fit REAL,
  details TEXT,
  created_at REAL,
  done INTEGER DEFAULT 0
);
""")


def row_to_dict(r: sqlite3.Row) -> dict:
    d = dict(r)
    for k in ("links", "emails", "details"):
        d[k] = json.loads(d[k] or "null")
    return d


def seen(urn: str) -> bool:
    with _db_lock:
        return CONN.execute("SELECT 1 FROM items WHERE urn = ?", (urn,)).fetchone() is not None


def insert_item(post: dict, cls: dict, status: str) -> int:
    with _db_lock:
        cur = CONN.execute(
            """INSERT OR IGNORE INTO items (urn, category, status, author, age, text, post_url, links,
               primary_link, emails, fit, details, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (post["urn"], cls["category"], status, post.get("author", ""), post.get("age", ""),
             post.get("text", ""), post.get("postUrl", ""), json.dumps(post.get("links", [])),
             cls.get("primary_link"), json.dumps(post.get("emails", [])), cls["fit"],
             json.dumps(cls), time.time()),
        )
        CONN.commit()
        return cur.lastrowid


def update_item(item_id: int, **fields):
    if "details" in fields:
        fields["details"] = json.dumps(fields["details"])
    cols = ", ".join(f"{k} = ?" for k in fields)
    with _db_lock:
        CONN.execute(f"UPDATE items SET {cols} WHERE id = ?", (*fields.values(), item_id))
        CONN.commit()


def get_item(item_id: int) -> dict:
    with _db_lock:
        return row_to_dict(CONN.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone())


# ---------------------------------------------------------------- workflow

def handle_posts(posts: list) -> dict:
    fresh = [p for p in posts if p.get("urn") and p.get("text") and not seen(p["urn"])]
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda p: (p, _safe_classify(p)), fresh))

    decisions, counts = [], {}
    for post, cls in results:
        if cls is None:
            continue
        cat = cls["category"]
        counts[cat] = counts.get(cat, 0) + 1
        if cat == "other":
            status = "ignored"
        elif cat in ("research", "dev_resource"):
            status = "todo"
        elif cls["fit"] < THRESH["post_fit_min"]:
            status = "low_fit"
        elif cls["primary_link"]:
            status = "checking"
        else:
            status = "reach_out"  # DM / email / comment — goes to todos
        item_id = insert_item(post, cls, status)
        if not item_id:
            continue
        if status == "checking":
            decisions.append({"id": item_id, "action": "check_link", "url": cls["primary_link"],
                              "author": post.get("author", ""), "fit": cls["fit"]})
        elif status == "reach_out":
            decisions.append({"id": item_id, "action": "reach_out", "channel": cls["apply_channel"],
                              "author": post.get("author", ""), "postUrl": post.get("postUrl", ""),
                              "fit": cls["fit"]})
    return {"received": len(posts), "new": len(fresh), "counts": counts, "decisions": decisions}


def _safe_classify(post):
    try:
        return classify_post(post)
    except Exception as e:  # one bad post shouldn't sink the batch
        print(f"classify failed for {post.get('urn')}: {e}", file=sys.stderr)
        return None


def handle_job_page(payload: dict) -> dict:
    item = get_item(int(payload["id"]))
    if payload.get("error"):
        update_item(item["id"], status="reach_out", details={**item["details"], "page_error": payload["error"]})
        return {"keep": False, "reason": f"could not load page ({payload['error']}); added to todos"}
    verdict = judge_job_page(payload)
    details = {**item["details"], "page": verdict, "page_url": payload["url"], "page_title": payload.get("title", "")}
    kind = verdict["page_kind"]
    if kind == "closed_listing":
        status, keep, reason = "closed", False, "listing is closed"
    elif kind == "open_listing" and verdict["fit"] >= THRESH["page_fit_min"]:
        status, keep, reason = "open_match", True, f"open listing, fit {verdict['fit']:.2f}"
    elif kind == "open_listing":
        status, keep, reason = "low_fit", False, f"open listing but fit {verdict['fit']:.2f} is below threshold"
    else:
        # careers index / login wall / not a job: can't verify, so a human should look
        status, keep, reason = "reach_out", False, f"link is a {kind.replace('_', ' ')}; added to todos"
    update_item(item["id"], status=status, fit=verdict["fit"] if kind == "open_listing" else item["fit"], details=details)
    return {"keep": keep, "reason": reason, "status": status, "fit": verdict["fit"]}


# -------------------------------------------------------------------- HTTP

class Handler(BaseHTTPRequestHandler):
    def _send(self, code: int, body, ctype="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _json(self):
        n = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(n) or b"{}")

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            return self._send(200, (ROOT / "dashboard.html").read_bytes(), "text/html; charset=utf-8")
        if self.path == "/api/health":
            return self._send(200, {"ok": True})
        if self.path == "/api/items":
            with _db_lock:
                rows = CONN.execute("SELECT * FROM items WHERE status != 'ignored' ORDER BY created_at DESC LIMIT 500").fetchall()
            return self._send(200, [row_to_dict(r) for r in rows])
        self._send(404, {"error": "not found"})

    def do_POST(self):
        try:
            if self.path == "/api/posts":
                return self._send(200, handle_posts(self._json().get("posts", [])))
            if self.path == "/api/job-page":
                return self._send(200, handle_job_page(self._json()))
            if self.path == "/api/debug":
                (ROOT / "debug").mkdir(exist_ok=True)
                (ROOT / "debug" / "dom.json").write_text(json.dumps(self._json(), indent=1))
                return self._send(200, {"ok": True})
            m = re.fullmatch(r"/api/items/(\d+)/(done|undo)", self.path)
            if m:
                update_item(int(m.group(1)), done=1 if m.group(2) == "done" else 0)
                return self._send(200, {"ok": True})
            self._send(404, {"error": "not found"})
        except Exception as e:
            print(f"error on {self.path}: {e}", file=sys.stderr)
            self._send(500, {"error": str(e)})

    def log_message(self, fmt, *args):
        if "/api/items" not in (args[0] if args else ""):
            sys.stderr.write(f"[{time.strftime('%H:%M:%S')}] {fmt % args}\n")


if __name__ == "__main__":
    print(f"LinkedIn Scout server on http://localhost:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
