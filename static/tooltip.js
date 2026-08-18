// Shared tooltip logic — used by index, krytyk, osoba pages.
// Requires <div id="tooltip"></div> in the page body.

function fmt(v, digits = 2) {
  return v != null ? Number(v).toFixed(digits) : '—';
}

function fmtVotes(n) {
  if (n == null) return null;
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'k';
  return String(n);
}

const SRC_LABELS = { jarek: 'Jarek', michal: 'Michał', imdb: 'IMDb', filmweb: 'Filmweb' };

// Gender: data model uses F/M, the URL param uses Polish for consistency with
// the other params (kraj=Polska, sortuj=…).
const PLEC_TO_PARAM = { F: 'kobieta', M: 'mezczyzna' };
const PLEC_TO_CODE  = { kobieta: 'F', mezczyzna: 'M' };

// Shared score → CSS class. Null renders as muted. (The film list at index.html
// deliberately keeps its own variant that returns '' for null.)
function scoreClass(s) {
  if (s == null) return 'muted';
  if (s >= 7) return 'score';
  if (s >= 5) return 'score mid';
  return 'score low';
}

const TIP_ICO_PERSON = `<svg style="vertical-align:middle;margin-right:.25em;opacity:.55" viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M12 12c2.66 0 4.8-2.14 4.8-4.8S14.66 2.4 12 2.4 7.2 4.54 7.2 7.2 9.34 12 12 12zm0 2.4c-3.2 0-9.6 1.61-9.6 4.8v2.4h19.2v-2.4c0-3.19-6.4-4.8-9.6-4.8z"/></svg>`;
const TIP_ICO_CAL   = `<svg style="vertical-align:middle;margin-right:.25em;opacity:.55" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

function _tipRows(rows) {
  return '<table>' + rows.map(([l, v]) =>
    `<tr><td>${l}</td><td>${v}</td></tr>`
  ).join('') + '</table>';
}

function _moveTip(el) {
  const tip = document.getElementById('tooltip');
  const rect = el.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = tw < rect.width ? rect.left : rect.left + rect.width / 2 - tw / 2;
  let y = rect.top - th - 8;
  if (y < 8) y = rect.bottom + 8;
  x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
  tip.style.left = x + 'px';
  tip.style.top  = y + 'px';
}

function _showTip(el, html) {
  const tip = document.getElementById('tooltip');
  tip.innerHTML = html;
  tip.style.display = 'block';
  _moveTip(el);
}

function _hideTip() {
  document.getElementById('tooltip').style.display = 'none';
}

function attachTip(el, buildHtml) {
  el.style.cursor = 'default';
  // Position once on enter; the anchor doesn't move during a hover, and
  // _moveTip ignores cursor position, so a mousemove handler would only
  // recompute an identical position while thrashing layout.
  el.addEventListener('mouseenter', () => _showTip(el, buildHtml()));
  el.addEventListener('mouseleave', _hideTip);
}

// Upgrade elements carrying data-tip-text into instant JS tooltips (avoids the
// slow native title= delay). Selector is data-tip-text (not title), so only
// explicitly-marked elements are converted — native title stays on the rest.
function upgradeTitleTips(root = document) {
  root.querySelectorAll('[data-tip-text]').forEach(el => {
    if (el._tipUpgraded) return;
    el._tipUpgraded = true;
    attachTip(el, () => `<div class="tip-title" style="margin:0">${el.getAttribute('data-tip-text')}</div>`);
  });
}

function rankStr(rk) {
  return rk ? `<span class="tip-rank">#${rk.rank} <span style="opacity:.65">z ${rk.total}</span></span>` : '';
}

function tipScore(r, score, rk) {
  const rows = [];
  for (const [src, label] of Object.entries(SRC_LABELS)) {
    const n = (r || {})[src]?.normalized;
    if (n != null) rows.push([label, fmt(n)]);
  }
  return `<div class="tip-title">Ocena końcowa</div>
    <div class="tip-main-val">${fmt(score)}${rankStr(rk)}</div>` +
    (rows.length ? `<div class="tip-sub-label">składowe</div>` + _tipRows(rows) : '');
}

function tipCritic(data, label, rk) {
  const dec = (label === 'Michał' || label === 'Jarek') ? 0 : 2;
  const rows = [];
  if (data.normalized != null) rows.push(['Znorm.', fmt(data.normalized)]);
  if (data.date_rated)         rows.push([`${TIP_ICO_CAL}Data`, data.date_rated]);
  return `<div class="tip-title">${label}</div>
    <div class="tip-main-val">${data.rating != null ? Number(data.rating).toFixed(dec) : '—'}${rankStr(rk)}</div>` +
    (rows.length ? _tipRows(rows) : '');
}

function tipService(data, label, rk) {
  const rows = [];
  if (data.normalized != null) rows.push(['Znorm.', fmt(data.normalized)]);
  if (data.votes != null)      rows.push([`${TIP_ICO_PERSON}Głosów`, fmtVotes(data.votes)]);
  return `<div class="tip-title">${label}</div>
    <div class="tip-main-val">${fmt(data.rating, 2)}${rankStr(rk)}</div>` +
    (rows.length ? _tipRows(rows) : '');
}

function tipFilm(m) {
  const poster = m.image_url
    ? `<img src="${m.image_url}" alt="" style="width:54px;height:80px;object-fit:cover;border-radius:4px;flex-shrink:0">`
    : `<div style="width:54px;height:80px;border-radius:4px;background:var(--border);flex-shrink:0"></div>`;
  const rows = [];
  if (m.directors?.length)
    rows.push(`<tr><td class="muted" style="padding-right:.6em;vertical-align:top;white-space:nowrap">Reż.</td>` +
      `<td style="white-space:normal">${m.directors.map(p => `<a href="/osoba/?id=${p.id}" style="color:inherit">${p.name}</a>`).join(', ')}</td></tr>`);
  if (m.stars?.length)
    rows.push(`<tr><td class="muted" style="padding-right:.6em;vertical-align:top;white-space:nowrap">Obsada</td>` +
      `<td style="white-space:normal">${m.stars.map(p => `<a href="/osoba/?id=${p.id}" style="color:inherit">${p.name}</a>`).join(', ')}</td></tr>`);
  const info = rows.length
    ? `<table style="border-collapse:collapse;font-size:.85rem;max-width:240px">${rows.join('')}</table>`
    : '';
  return `<div style="display:flex;gap:.9rem;align-items:flex-start">${poster}<div>${info}</div></div>`;
}
