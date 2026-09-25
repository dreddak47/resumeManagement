// LinkedIn Scout service worker: runs scans on a timer, talks to the local
// server, opens job links in background tabs, keeps matching ones, notifies.
const SERVER = 'http://localhost:8765';
const FEED_URL = 'https://www.linkedin.com/feed/';
const DEFAULTS = { intervalMin: 60, scrolls: 15, enabled: true };
const GROUP_TITLE = 'Scout: jobs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const settings = async () => ({ ...DEFAULTS, ...(await chrome.storage.local.get(Object.keys(DEFAULTS))) });

async function schedule() {
  const s = await settings();
  await chrome.alarms.clear('scan');
  if (s.enabled) chrome.alarms.create('scan', { periodInMinutes: Math.max(5, Number(s.intervalMin)) });
}

chrome.runtime.onInstalled.addListener(schedule);
chrome.runtime.onStartup.addListener(schedule);
chrome.alarms.onAlarm.addListener((a) => a.name === 'scan' && runScan());
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'scanNow') { runScan(); reply({ ok: true }); }
  if (msg.type === 'reschedule') schedule().then(() => reply({ ok: true }));
  return true;
});

// Polling (not onUpdated) so each check is an API call that keeps the worker alive.
// Heavy pages (LinkedIn, some job boards) can sit in "loading" for a long time while
// already usable, so a timeout returns the tab as-is instead of failing.
async function waitForTab(tabId, timeoutMs = 25000) {
  const start = Date.now();
  let tab;
  while (Date.now() - start < timeoutMs) {
    tab = await chrome.tabs.get(tabId).catch(() => null);
    if (!tab) throw new Error('tab closed');
    if (tab.status === 'complete') return tab;
    await sleep(800);
  }
  return tab;
}

async function post(path, body) {
  const res = await fetch(SERVER + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

// Chrome stops rendering hidden tabs, so LinkedIn never lazy-loads more posts there.
// Scan in a small separate window that is visible but not focused, and close it afterwards.
async function openScanWindow() {
  const win = await chrome.windows.create({ url: FEED_URL, focused: false, width: 560, height: 900, left: 0, top: 0 });
  return { windowId: win.id, tabId: win.tabs[0].id };
}

let scanning = false;
async function runScan() {
  if (scanning) return;
  scanning = true;
  const keepAlive = setInterval(() => chrome.runtime.getPlatformInfo(), 20000);
  const status = { startedAt: Date.now(), phase: 'opening feed', seen: 0, sent: 0, counts: {}, matches: 0, todos: 0, error: null };
  const save = (extra) => chrome.storage.local.set({ lastScan: Object.assign(status, extra) });
  let scanWin = null;
  const linkQueue = [];
  try {
    await save();
    await fetch(SERVER + '/api/health').catch(() => { throw new Error('local server not running (python3 linkedin-scout/server.py)'); });
    const s = await settings();
    scanWin = await openScanWindow();
    const tab = await waitForTab(scanWin.tabId);
    if (!(tab.url || tab.pendingUrl || '').includes('/feed')) throw new Error(`landed on ${tab.url} — are you logged in to LinkedIn?`);
    await sleep(3000);
    await chrome.scripting.executeScript({ target: { tabId: scanWin.tabId }, files: ['content.js'] });

    let idle = 0, emptyTries = 0, raised = false, prevWin = null;
    for (let i = 0; i < Number(s.scrolls); i++) {
      const [{ result: step }] = await chrome.scripting.executeScript({
        target: { tabId: scanWin.tabId }, func: () => window.__scoutStep(),
      });
      status.seen = step.total;
      status.selector = step.strategy;
      status.diag = `${step.container}, visibility ${step.visibility}, last scroll ${step.scrolled}px`;
      const empty = !step.matched && status.seen === 0;
      if (!raised && (step.visibility === 'hidden' || (empty && emptyTries >= 2))) {
        // A covered window counts as hidden on macOS and Chrome pauses lazy loading there,
        // so bring the scan window to the front for the duration of the scan.
        raised = true;
        prevWin = await chrome.windows.getLastFocused().catch(() => null);
        await chrome.windows.update(scanWin.windowId, { focused: true });
        await sleep(1500);
      }
      if (empty) {
        await save({ phase: `waiting for feed to render (${emptyTries + 1}/12)` });
        if (++emptyTries < 12) { await sleep(3000); i--; continue; }
        const [{ result: dom }] = await chrome.scripting.executeScript({ target: { tabId: scanWin.tabId }, func: () => window.__scoutDebug() });
        await post('/api/debug', dom).catch(() => {});
        throw new Error(`feed never rendered posts after ~40s (visibility ${step.visibility}, window raised ${raised}). DOM summary saved to linkedin-scout/debug/dom.json`);
      }
      await save({ phase: `scroll ${i + 1}/${s.scrolls}` });
      if (step.posts.length) {
        const res = await post('/api/posts', { posts: step.posts });
        status.sent += res.new;
        for (const [k, v] of Object.entries(res.counts)) status.counts[k] = (status.counts[k] || 0) + v;
        for (const d of res.decisions) {
          if (d.action === 'check_link') linkQueue.push(d);
          else {
            status.todos++;
            notify(`reach-${d.id}`, `Job post: reach out via ${d.channel}`, `${d.author} · fit ${d.fit.toFixed(2)}`, d.postUrl);
          }
        }
        idle = 0;
      } else if (++idle >= 5) {
        status.stoppedEarly = `feed stopped loading after ${i + 1} steps`;
        break;
      } else {
        await sleep(2500); // give lazy loading more time
      }
      await save();
      await sleep(1200 + Math.random() * 1400);
    }
    await chrome.windows.remove(scanWin.windowId).catch(() => {});
    scanWin = null;
    if (prevWin) chrome.windows.update(prevWin.id, { focused: true }).catch(() => {});

    for (const [i, d] of linkQueue.entries()) {
      await save({ phase: `checking job link ${i + 1}/${linkQueue.length}` });
      if (await checkJobLink(d)) status.matches++;
    }
    await save({ phase: 'done', finishedAt: Date.now() });
    if (status.matches) chrome.action.setBadgeText({ text: String(status.matches) });
  } catch (e) {
    await save({ phase: 'failed', finishedAt: Date.now(), error: String(e.message || e) });
  } finally {
    if (scanWin) chrome.windows.remove(scanWin.windowId).catch(() => {});
    clearInterval(keepAlive);
    scanning = false;
  }
}

async function checkJobLink(d) {
  const tab = await chrome.tabs.create({ url: d.url, active: false });
  let page;
  try {
    await waitForTab(tab.id);
    await sleep(3000); // let SPA job boards render
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({ url: location.href, title: document.title, text: document.body.innerText.slice(0, 15000) }),
    });
    page = { id: d.id, ...result };
  } catch (e) {
    page = { id: d.id, url: d.url, error: String(e.message || e) };
  }
  const verdict = await post('/api/job-page', page).catch((e) => ({ keep: false, reason: String(e) }));
  if (!verdict.keep) {
    chrome.tabs.remove(tab.id).catch(() => {});
    if (verdict.status === 'reach_out') notify(`todo-${d.id}`, 'Job link needs a look', `${d.author}: ${verdict.reason}`, d.url);
    return false;
  }
  await addToGroup(tab.id);
  notify(`tab-${tab.id}`, `Open role matches you (fit ${verdict.fit.toFixed(2)})`, `${page.title || d.url}\nvia ${d.author}`, null, tab.id);
  return true;
}

async function addToGroup(tabId) {
  const [group] = await chrome.tabGroups.query({ title: GROUP_TITLE });
  if (group) return chrome.tabs.group({ tabIds: tabId, groupId: group.id });
  const groupId = await chrome.tabs.group({ tabIds: tabId });
  await chrome.tabGroups.update(groupId, { title: GROUP_TITLE, color: 'green' });
}

const notifTargets = {};
function notify(id, title, message, url, tabId) {
  notifTargets[id] = { url, tabId };
  chrome.notifications.create(id, { type: 'basic', iconUrl: 'icon.png', title, message, priority: 2 });
}
chrome.notifications.onClicked.addListener(async (id) => {
  const t = notifTargets[id] || {};
  if (t.tabId) {
    const tab = await chrome.tabs.update(t.tabId, { active: true }).catch(() => null);
    if (tab) return chrome.windows.update(tab.windowId, { focused: true });
  }
  chrome.tabs.create({ url: t.url || SERVER });
});
