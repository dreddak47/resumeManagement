# LinkedIn Scout

Scans your LinkedIn feed on a timer and sorts posts with Jev (TypeSafe):

| Category | What happens |
| --- | --- |
| **Research** | Saved with full text and the main link (paper / repo) → dashboard "Research" |
| **Dev thing** | Saved as a todo with its main link → dashboard "Dev to check out" |
| **Job post** | Scored for title and experience fit against `config.json`. Low fit → skipped. Has a link → opened in a background tab, checked for "still open" and scored again on the full description. Matches stay open in a green **Scout: jobs** tab group, and you get a notification. No link (DM / email / comment) → reach-out todo + notification |
| Other | Ignored |

## Setup (one time)

1. **API key:** `TYPESAFE_API_KEY` goes in the repo-root `.env` (already there) or in `linkedin-scout/.env`.
2. **Start the server** (keep it running):
   ```bash
   python3 linkedin-scout/server.py
   ```
3. **Load the extension:** go to `chrome://extensions`, turn on Developer mode, click **Load unpacked**, and pick `linkedin-scout/extension/`.
4. Stay logged in to LinkedIn in that Chrome profile. Click the extension icon, then **Scan now**.

Dashboard: http://localhost:8765

## How it works

- `extension/background.js`: runs on an alarm (60 min by default, can be set in the popup). It opens the feed in a small window that doesn't take focus (Chrome stops rendering hidden tabs, so LinkedIn wouldn't load more posts there). After each scroll step it sends the new posts to the server, so the dashboard fills in live. Once scrolling is done it closes the window, then opens each job link in a background tab, reads the page text, asks the server for a verdict, and keeps or closes the tab.
- `server.py`: stdlib only, with SQLite in `scout.db`. It sends one Jev request per post: `category` (Choice), `title_fit` and `experience_fit` (Score), `location_ok` (Noul), `apply_channel` (Choice) and `primary_link` (Choice over the post's links, so it picks from real links and never makes one up). The follow-up questions are asked for every post up front but only used for job posts. Each job page gets one more request: `page_kind` (open / closed / careers index / not a job) plus the same fit questions.
- Fit = 0.6·title + 0.4·experience, halved if the location clearly doesn't match. Thresholds are in `config.json`.

## Tuning

- **Profile / target roles / location:** `config.json` → `candidate`.
- **Too many or too few jobs:** `thresholds.post_fit_min` is the filter on the short post. `page_fit_min` is the filter on the full job description.
- **"no post elements matched":** LinkedIn changed its markup. Update `POST_SELECTORS` / `SEL` at the top of `extension/content.js`. The popup shows which selector matched on the last scan.
- The scan window has to stay visible (not minimized) while it scrolls, which takes about 30-60s. Covering it with other windows is fine.
