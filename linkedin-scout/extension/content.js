// Injected into the LinkedIn feed by background.js. Defines window.__scoutStep,
// which expands posts, returns the ones not returned before, and scrolls once.
// background.js calls it once per scroll step so results stream to the server.
// LinkedIn's DOM changes often: POST_SELECTORS are tried in order, and the step
// reports which one matched so the popup can show it.
(() => {
  if (window.__scoutStep) return;

  const POST_SELECTORS = [
    'div[data-urn^="urn:li:activity"]',
    'div[data-id^="urn:li:activity"]',
    'div[data-urn^="urn:li:aggregate"]',
    '[data-view-name="feed-full-update"]',
    '.feed-shared-update-v2',
    'main [role="article"]',
    'main article',
  ];
  const SEL = {
    text: '.update-components-text, .feed-shared-inline-show-more-text, .feed-shared-text, .update-components-update-v2__commentary, [data-view-name="feed-commentary"]',
    actor: '.update-components-actor__title, .update-components-actor__name, .update-components-actor__single-line-truncate, [data-view-name="feed-actor-name"]',
    subDesc: '.update-components-actor__sub-description',
    seeMore: 'button.feed-shared-inline-show-more-text__see-more-less-toggle, button[aria-label*="see more" i]',
    jobCard: 'a[href*="/jobs/view/"]',
  };

  const clean = (s) => (s || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };

  function normalizeLink(href) {
    try {
      const u = new URL(href, location.href);
      if (u.hostname.endsWith('linkedin.com')) {
        const job = u.pathname.match(/\/jobs\/view\/(\d+)/) || u.search.match(/currentJobId=(\d+)/);
        if (job) return `https://www.linkedin.com/jobs/view/${job[1]}/`;
        if (u.pathname.startsWith('/redir/redirect')) return u.searchParams.get('url');
        return null; // profiles, hashtags, company pages
      }
      return /^https?:$/.test(u.protocol) ? u.href : null;
    } catch { return null; }
  }

  const URN_RE = /urn:li:(?:activity|ugcPost|share):\d+/;
  function urnOf(el) {
    for (const node of [el, ...el.querySelectorAll('*')].slice(0, 400)) {
      for (const a of node.attributes) {
        const m = a.value.includes('urn:li:') && decodeURIComponent(a.value).match(URN_RE);
        if (m) return m[0];
      }
    }
    return null;
  }

  // New LinkedIn markup: "Feed post" heading, "X likes this" context line, header, body, action bar.
  const NOISE = /^(feed post|follow|like|comment|repost|send|visit my website|…?\s*more|see more|\d[\d,]*\s*(reactions?|comments?|reposts?)?|•.*)$/i;
  const CONTEXT = /\b(likes|loves|celebrates|supports|finds this|commented on|reposted|reacted to|follows)\b/i;
  const AGE = /^(\d+\s*(m|h|d|w|mo|yr)s?)\b/i;
  function parseCard(whole) {
    const lines = whole.split('\n').map((l) => l.trim()).filter(Boolean);
    const body = lines.filter((l) => !NOISE.test(l));
    let i = 0;
    while (i < body.length && CONTEXT.test(body[i]) && body[i].length < 120) i++;
    const author = (body[i] || '').replace(/\s*•.*$/, '');
    const ageLine = lines.find((l) => AGE.test(l));
    return { author, age: ageLine ? ageLine.match(AGE)[1] : '', text: body.join('\n') };
  }

  function extract(el) {
    const sub = clean(el.querySelector(SEL.subDesc)?.innerText);
    const whole = clean(el.innerText);
    if (/\bpromoted\b/i.test(sub) || /^.{0,300}\bPromoted\b/s.test(whole)) return null;
    const parsed = parseCard(whole);
    let text = clean(el.querySelector(SEL.text)?.innerText);
    if (!text) text = parsed.text.slice(0, 4000); // unknown markup: let Jev read the whole card
    if (text.length < 20) return null;
    // Fingerprint only long body lines, so "37m" -> "39m" or like counts don't create duplicates.
    const stable = text.split('\n').filter((l) => l.length > 40).join('\n') || text;
    const urn = urnOf(el) || `hash:${hash(stable.slice(0, 600))}`;
    const links = new Set();
    el.querySelectorAll('a[href]').forEach((a) => {
      const l = normalizeLink(a.getAttribute('href'));
      if (l) links.add(l);
    });
    (text.match(/https?:\/\/[^\s)]+/g) || []).forEach((l) => links.add(l));
    const card = el.querySelector(SEL.jobCard);
    const cardText = card ? clean(card.innerText).slice(0, 300) : '';
    return {
      urn,
      author: clean(el.querySelector(SEL.actor)?.innerText).split('\n')[0] || parsed.author.slice(0, 80),
      age: (sub.split('•')[0] || '').trim() || parsed.age,
      text: cardText ? `${text}\n\n[Attached job card] ${cardText}` : text,
      links: [...links].slice(0, 12),
      emails: [...new Set(text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || [])],
      postUrl: urn.startsWith('urn:') ? `https://www.linkedin.com/feed/update/${urn}/` : location.href,
    };
  }

  // Class-name-free fallback: every feed post has exactly one "Comment" action button.
  // Climb from each button to the largest ancestor that still holds only that one button.
  function structuralPosts() {
    const bars = [...document.querySelectorAll('button, [role="button"]')].filter((b) =>
      /^comment$/i.test((b.innerText || '').trim()) || /^comment\b/i.test(b.getAttribute('aria-label') || ''));
    const holds = (el) => bars.reduce((n, b) => n + (el.contains(b) ? 1 : 0), 0);
    const out = new Set();
    for (const b of bars) {
      let el = b;
      while (el.parentElement && el.parentElement !== document.body && holds(el.parentElement) === 1) el = el.parentElement;
      if (el !== b) out.add(el);
    }
    return [...out];
  }

  function findPosts() {
    for (const s of POST_SELECTORS) {
      const els = [...document.querySelectorAll(s)];
      if (els.length) return { els, strategy: s };
    }
    const els = structuralPosts();
    return { els, strategy: els.length ? 'structural:comment-button' : null };
  }

  window.__scoutDebug = () => {
    const count = (arr) => Object.entries(arr.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {}))
      .sort((a, b) => b[1] - a[1]).slice(0, 40);
    const all = [...document.querySelectorAll('*')];
    const dataAttrs = all.flatMap((el) => [...el.attributes].map((a) => a.name).filter((n) => n.startsWith('data-')));
    const viewNames = all.map((el) => el.getAttribute('data-view-name')).filter(Boolean);
    const urnEls = all.filter((el) => [...el.attributes].some((a) => a.value.includes('urn:li:activity'))).slice(0, 5)
      .map((el) => ({ tag: el.tagName, attrs: [...el.attributes].map((a) => `${a.name}=${a.value.slice(0, 80)}`) }));
    const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')}` +
      [...el.attributes].filter((a) => a.name.startsWith('data-') || a.name === 'role').map((a) => `[${a.name}=${a.value.slice(0, 40)}]`).join('');
    const commentBtn = [...document.querySelectorAll('button, [role="button"]')]
      .find((b) => /comment/i.test((b.innerText || '') + (b.getAttribute('aria-label') || '')));
    const chain = [];
    for (let el = commentBtn; el && chain.length < 25; el = el.parentElement) chain.push(describe(el));
    return {
      url: location.href, title: document.title, readyState: document.readyState,
      visibility: document.visibilityState, hasFocus: document.hasFocus(),
      bodyTextLength: document.body.innerText.length, iframes: document.querySelectorAll('iframe').length,
      shadowHosts: all.filter((el) => el.shadowRoot).map(describe).slice(0, 10),
      dataAttrs: count(dataAttrs), viewNames: count(viewNames), urnEls,
      commentButtonChain: chain,
      mainTextSample: (document.querySelector('main') || document.body).innerText.slice(0, 1500),
    };
  };

  function scrollContainer(el) {
    for (let p = el?.parentElement; p; p = p.parentElement) {
      const oy = getComputedStyle(p).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight + 50) return p;
    }
    return document.scrollingElement;
  }

  const returned = new Set();
  window.__scoutStep = async () => {
    document.querySelectorAll(SEL.seeMore).forEach((b) => {
      if (/more/i.test(b.innerText || b.getAttribute('aria-label') || '')) b.click();
    });
    document.querySelectorAll('button').forEach((b) => {
      if (/^(show more feed updates|load more|show more posts|new posts)$/i.test((b.innerText || '').trim())) b.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    const { els, strategy } = findPosts();
    const posts = [];
    for (const el of els) {
      const p = extract(el);
      if (p && !returned.has(p.urn)) { returned.add(p.urn); posts.push(p); }
    }
    if (!els.length) {
      // Feed list is lazy-mounted: nudge scroll so its observers fire, then return to top.
      const main = document.querySelector('main') || document.scrollingElement;
      [document.scrollingElement, scrollContainer(main.firstElementChild) ].forEach((b) => b && b.scrollBy(0, 600));
      window.dispatchEvent(new Event('scroll'));
    }
    const last = els[els.length - 1];
    const box = scrollContainer(last);
    const before = box.scrollTop;
    if (last) last.scrollIntoView({ block: 'start' });
    box.scrollBy(0, Math.round(box.clientHeight * 0.6));
    window.dispatchEvent(new Event('scroll'));
    return {
      posts, strategy, matched: els.length, total: returned.size,
      visibility: document.visibilityState, scrolled: box.scrollTop - before,
      container: box === document.scrollingElement ? 'document' : `${box.tagName.toLowerCase()}.${[...box.classList].slice(0, 2).join('.')}`,
    };
  };
})();
