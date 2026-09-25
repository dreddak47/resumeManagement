const DEFAULTS = { intervalMin: 60, scrolls: 15, enabled: true };
const $ = (id) => document.getElementById(id);

function renderStatus(s) {
  const el = $('status');
  if (!s) return;
  const when = new Date(s.finishedAt || s.startedAt).toLocaleTimeString();
  const c = s.counts || {};
  const tally = `${s.seen || 0} posts seen, ${s.sent || 0} new classified\n` +
    `${c.job_post || 0} jobs · ${c.research || 0} research · ${c.dev_resource || 0} dev\n` +
    `${s.matches || 0} matching tabs kept · ${s.todos || 0} reach-out todos`;
  if (s.phase === 'failed') {
    el.innerHTML = '';
    const err = document.createElement('span');
    err.className = 'err';
    err.textContent = `Failed at ${when}:\n${s.error}`;
    el.append(err);
  } else if (s.phase === 'done') {
    el.textContent = `Last scan ${when}\n${tally}` + (s.stoppedEarly ? `\n(${s.stoppedEarly})` : '') +
      `\n\nmatch: ${s.selector || '-'}\n${s.diag || ''}`;
  } else if (Date.now() - s.startedAt > 10 * 60 * 1000) {
    el.textContent = `Scan from ${when} was interrupted. Click Scan now.`;
  } else {
    el.textContent = `Running since ${when}: ${s.phase}\n${tally}`;
  }
}

(async () => {
  const s = { ...DEFAULTS, ...(await chrome.storage.local.get([...Object.keys(DEFAULTS), 'lastScan'])) };
  $('enabled').checked = s.enabled;
  $('intervalMin').value = s.intervalMin;
  $('scrolls').value = s.scrolls;
  renderStatus(s.lastScan);
  chrome.action.setBadgeText({ text: '' });
})();

chrome.storage.onChanged.addListener((changes) => changes.lastScan && renderStatus(changes.lastScan.newValue));

for (const id of ['enabled', 'intervalMin', 'scrolls']) {
  $(id).addEventListener('change', async () => {
    const v = id === 'enabled' ? $(id).checked : Number($(id).value);
    await chrome.storage.local.set({ [id]: v });
    chrome.runtime.sendMessage({ type: 'reschedule' });
  });
}
$('scan').onclick = () => chrome.runtime.sendMessage({ type: 'scanNow' });
$('dash').onclick = () => chrome.tabs.create({ url: 'http://localhost:8765/' });
