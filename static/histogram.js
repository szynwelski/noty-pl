// Shared distribution charts — stat cards + a bar histogram.
// Used by the critic pages and the film-scoring methodology page.
// Requires tooltip.js (attachTip, upgradeTitleTips) and the .stat-card/.histogram
// CSS in style.css.

function stddev(arr, mean) {
  if (arr.length < 2) return null;
  return Math.sqrt(arr.reduce((s, x) => s + (x - mean) ** 2, 0) / arr.length);
}

function renderStats(containerId, vals, dec) {
  const mean = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  const sd   = mean != null ? stddev(vals, mean) : null;
  const el = document.getElementById(containerId);
  el.innerHTML = [
    ['Filmów',    String(vals.length)],
    ['Średnia',   mean != null ? Number(mean).toFixed(dec) : '—'],
    ['Odch. std.', sd != null ? Number(sd).toFixed(dec) : '—', 'Odchylenie standardowe'],
  ].map(([label, value, tip]) =>
    `<div class="stat-card"><div class="label${tip ? ' has-tip' : ''}"${tip ? ` data-tip-text="${tip}"` : ''}>${label}</div><div class="value">${value}</div></div>`
  ).join('');
  upgradeTitleTips(el);
}

function renderHistogram(containerId, vals, useUniqueVals) {
  if (!vals.length) return;
  let buckets;
  if (useUniqueVals) {
    const r2 = v => Math.round(v * 100) / 100;
    const rounded = vals.map(r2);
    const unique = [...new Set(rounded)].sort((a, b) => a - b);
    buckets = unique.map(u => ({ label: Number.isInteger(u) ? String(u) : u.toFixed(1), count: rounded.filter(v => v === u).length }));
  } else {
    const step = 0.5;
    const minB = Math.floor(Math.min(...vals) * 2) / 2;
    const maxB = Math.ceil(Math.max(...vals) * 2) / 2;
    const keys = [];
    for (let b = minB; b <= maxB; b = Math.round((b + step) * 100) / 100) keys.push(b);
    buckets = keys
      .map(b => ({ label: Number(b).toFixed(1), count: vals.filter(v => v >= b && v < b + step).length }))
      .filter(b => b.count > 0);
  }
  const maxC = Math.max(...buckets.map(b => b.count), 1);
  const showEvery = buckets.length > 15 ? Math.ceil(buckets.length / 12) : 1;
  const el = document.getElementById(containerId);
  el.innerHTML = buckets.map((b, i) => {
    const h = Math.max(1, Math.round(Math.sqrt(b.count / maxC) * 90));
    const showLabel = buckets.length <= 15 || i % showEvery === 0;
    return `<div class="hbar"><div class="hbar-fill" style="height:${h}px"></div>` +
      `<div class="hbar-label"${showLabel ? '' : ' style="visibility:hidden"'}>${b.label}</div></div>`;
  }).join('');
  el.querySelectorAll('.hbar').forEach((hbar, i) => {
    attachTip(hbar, () => `<strong>${buckets[i].count}</strong> filmów`);
  });
}
