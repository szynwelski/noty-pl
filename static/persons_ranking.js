// Shared logic for persons ranking pages (directors, writers, actors).
// Requires tooltip.js. Call initPersonsRanking(opts) after the page loads.
//
// opts: { dataUrl, searchLabel, countLabel }

function initPersonsRanking(opts) {
  const SRCS   = ['jarek', 'michal', 'imdb', 'filmweb'];
  const LABELS = { jarek: 'Jarek', michal: 'Michał', imdb: 'IMDb', filmweb: 'Filmweb' };

  let allPersons = [];
  let sortCol = 'ocena', sortDir = -1;
  let rankMap = {};
  let filterGender = '';
  let filterCountry = '';

  // Infinite scroll: filter/sort run on the full array, but rows render in
  // chunks so a 35k-row list (e.g. actors) doesn't build all at once.
  const PAGE_SIZE = 100;
  let currentList = [], rendered = 0;

  function computeRanks(data) {
    rankMap = {};
    const byScore = data.filter(p => p.score != null).sort((a, b) => b.score - a.score);
    byScore.forEach((p, i) => { rankMap[p.id] = { score: { rank: i + 1, total: byScore.length } }; });
    for (const src of SRCS) {
      const sorted = data.filter(p => p.ratings?.[src]?.bayesian != null)
        .sort((a, b) => b.ratings[src].bayesian - a.ratings[src].bayesian);
      sorted.forEach((p, i) => {
        if (!rankMap[p.id]) rankMap[p.id] = {};
        rankMap[p.id][src] = { rank: i + 1, total: sorted.length };
      });
    }
  }


  function tipPerson(label, bayesian, avg, count, rk) {
    return `<div class="tip-title">${label}</div>
      <div class="tip-main-val">${fmt(bayesian)}${rankStr(rk)}</div>` +
      _tipRows([['Średnia', fmt(avg)], ['Filmów', String(count)]]);
  }

  function tipTopFilms(p) {
    if (!p.top_films?.length) return '';
    const rows = p.top_films.map(f =>
      `<tr><td class="muted" style="padding-right:.75em">${f.year ?? '—'}</td>` +
      `<td style="max-width:200px;white-space:normal"><a href="/film/?id=${f.imdb_id}" style="color:inherit">${f.title}</a></td>` +
      `<td class="num" style="padding-left:.75em"><span class="${scoreClass(f.score)}">${fmt(f.score)}</span></td></tr>`
    ).join('');
    const photo = p.image_url
      ? `<img src="${p.image_url}" alt="" style="width:64px;height:80px;object-fit:cover;border-radius:4px;flex-shrink:0">`
      : `<div style="width:64px;height:80px;border-radius:4px;background:var(--border);flex-shrink:0"></div>`;
    return `<div style="display:flex;gap:.9rem;align-items:flex-start">` +
      photo +
      `<div><div class="tip-title" style="margin-bottom:.4rem">Najlepsze filmy</div>` +
      `<table style="border-collapse:collapse;font-size:.85rem">${rows}</table></div></div>`;
  }

  function buildRow(p, i) {
    const r   = p.ratings || {};
    const rks = rankMap[p.id] || {};
    const tr  = document.createElement('tr');
    tr.dataset.id = p.id;
    tr.innerHTML = `
      <td class="num muted">${(rks.score?.rank) ?? i + 1}</td>
      <td data-tip="name"><a href="/osoba/?id=${p.id}">${p.name}</a></td>
      <td class="num muted">${p.film_count}</td>
      <td class="num" data-tip="score"><span class="${scoreClass(p.score)}">${fmt(p.score)}</span></td>
      <td class="num" data-tip="jarek">${r.jarek   ? fmt(r.jarek.bayesian)   : '<span class="muted">—</span>'}</td>
      <td class="num" data-tip="michal">${r.michal  ? fmt(r.michal.bayesian)  : '<span class="muted">—</span>'}</td>
      <td class="num muted" data-tip="imdb">${r.imdb    ? fmt(r.imdb.bayesian)    : '<span class="muted">—</span>'}</td>
      <td class="num muted" data-tip="filmweb">${r.filmweb ? fmt(r.filmweb.bayesian) : '<span class="muted">—</span>'}</td>`;

    const nameTd = tr.querySelector('[data-tip="name"]');
    if (nameTd && p.top_films?.length)
      attachTip(nameTd, () => tipTopFilms(p));

    const scoreTd = tr.querySelector('[data-tip="score"]');
    if (scoreTd && p.score != null)
      attachTip(scoreTd, () => tipPerson('Ocena końcowa', p.score, p.score_avg, p.film_count, rks.score));

    for (const src of SRCS) {
      const td = tr.querySelector(`[data-tip="${src}"]`);
      if (td && r[src]?.bayesian != null)
        attachTip(td, () => tipPerson(LABELS[src], r[src].bayesian, r[src].avg, r[src].count, rks[src]));
    }
    return tr;
  }

  function renderChunk() {
    const tbody = document.getElementById('tbody');
    const frag = document.createDocumentFragment();
    const end = Math.min(rendered + PAGE_SIZE, currentList.length);
    for (let i = rendered; i < end; i++) frag.appendChild(buildRow(currentList[i], i));
    tbody.appendChild(frag);
    rendered = end;
  }

  // Render more chunks while the viewport bottom is near the end of the list.
  function maybeLoadMore() {
    while (rendered < currentList.length &&
           window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 600) {
      renderChunk();
    }
  }

  function renderList(list) {
    currentList = list;
    rendered = 0;
    document.getElementById('tbody').innerHTML = '';
    renderChunk();
    document.getElementById('count').textContent = `${list.length} ${opts.countLabel}`;
    maybeLoadMore();
  }

  // Render chunks until the row for `id` exists (for ?zaznacz= deep-linking,
  // where the target may sit past the first page). Returns false if filtered out.
  function expandTo(id) {
    const idx = currentList.findIndex(p => p.id === id);
    if (idx < 0) return false;
    while (rendered <= idx && rendered < currentList.length) renderChunk();
    return true;
  }

  // Flash-highlight a row once the smooth scroll to it settles. Adding the 2s
  // flash before a long scroll finishes would let it fade out off-screen.
  function highlightRow(row) {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let settle, scrolled = false;
    const flash = () => {
      window.removeEventListener('scroll', onScroll);
      void row.offsetHeight;               // reflow so the animation restarts
      row.classList.add('row-highlight');
    };
    const onScroll = () => { scrolled = true; clearTimeout(settle); settle = setTimeout(flash, 120); };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(() => { if (!scrolled) flash(); }, 250);  // row was already in view
  }

  // Fold to lowercase and strip combining diacritics, matching search.js norm()
  // so an ASCII query ("Muller") also matches accented names ("Müller").
  function fold(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function sortedList() {
    const q = fold(document.getElementById('search').value);
    let list = [...allPersons];
    if (q) list = list.filter(p => fold(p.name).includes(q));
    if (filterGender) list = list.filter(p => p.gender === filterGender);
    if (filterCountry) list = list.filter(p => (p.nationality || []).includes(filterCountry));
    list.sort((a, b) => {
      if (sortCol === 'nazwa')
        return a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }) * sortDir;
      let av, bv;
      if (sortCol === 'ocena')       { av = a.score;                        bv = b.score; }
      else if (sortCol === 'filmy')  { av = a.film_count;                   bv = b.film_count; }
      else { av = a.ratings?.[sortCol]?.bayesian; bv = b.ratings?.[sortCol]?.bayesian; }
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * sortDir;
    });
    return list;
  }

  function hasActiveFilters() {
    return !!(filterGender || filterCountry);
  }

  function syncUrl() {
    const q = document.getElementById('search').value;
    const p = new URLSearchParams();
    if (q) p.set('szukaj', q);
    if (sortCol !== 'ocena' || sortDir !== -1) {
      p.set('sortuj', sortCol);
      if (sortDir === 1) p.set('kier', 'rosnaco');
    }
    if (filterGender)  p.set('plec', PLEC_TO_PARAM[filterGender]);
    if (filterCountry) p.set('kraj', filterCountry);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    const clearBtn = document.getElementById('filter-clear');
    if (clearBtn) clearBtn.classList.toggle('visible', hasActiveFilters());
  }

  function refresh() {
    syncUrl();
    if (window.scrollY > 0) window.scrollTo(0, 0);  // new sort/filter → back to the top
    renderList(sortedList());
  }

  // Infinite scroll trigger (throttled to one check per frame)
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => { scrollTicking = false; maybeLoadMore(); });
  }, { passive: true });

  fetch(opts.dataUrl)
    .then(r => r.json())
    .then(data => {
      allPersons = data;
      computeRanks(data);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('table').style.display  = '';

      // Build country dropdown sorted by person count, excluding redundant historical entries
      const countryCounts = {};
      data.forEach(p => filterNationality(p.nationality || []).forEach(c => {
        countryCounts[c] = (countryCounts[c] || 0) + 1;
      }));
      const countryEl = document.getElementById('filter-country');
      Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        countryEl.appendChild(opt);
      });

      const urlP = new URLSearchParams(location.search);
      const ps = urlP.get('sortuj');
      if (ps) {
        sortCol = ps;
        sortDir = urlP.get('kier') === 'rosnaco' ? 1 : -1;
        document.querySelectorAll('th[data-col]').forEach(t => { t.classList.remove('sorted'); t.removeAttribute('data-dir'); });
        const th = document.querySelector(`th[data-col="${ps}"]`);
        if (th) { th.classList.add('sorted'); th.dataset.dir = String(sortDir); }
      }
      const sq = urlP.get('szukaj');
      if (sq) {
        const searchEl = document.getElementById('search');
        searchEl.value = sq;
        document.getElementById('search-clear').style.display = 'flex';
      }
      const pg = PLEC_TO_CODE[urlP.get('plec')] || '';
      if (pg) {
        filterGender = pg;
        document.getElementById('filter-gender').value = pg;
      }
      const pk = urlP.get('kraj');
      if (pk) {
        filterCountry = pk;
        countryEl.value = pk;
      }

      refresh();
      const hlId = urlP.get('zaznacz');
      if (hlId) {
        expandTo(hlId);  // render chunks up to the target so its row exists
        setTimeout(() => {
          const row = document.querySelector(`tr[data-id="${hlId}"]`);
          if (row) highlightRow(row);
        }, 0);
      }
    })
    .catch(e => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').textContent = 'Błąd: ' + e;
      document.getElementById('error').style.display = '';
    });

  document.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (col === 'rank') return;
      if (sortCol === col) { sortDir *= -1; }
      else { sortCol = col; sortDir = col === 'nazwa' ? 1 : -1; }
      document.querySelectorAll('th').forEach(t => { t.classList.remove('sorted'); t.removeAttribute('data-dir'); });
      th.classList.add('sorted');
      th.dataset.dir = sortDir === 1 ? '1' : '-1';
      refresh();
    });
  });

  const searchEl = document.getElementById('search');
  const clearBtn = document.getElementById('search-clear');
  let searchTimer;
  searchEl.addEventListener('input', () => {
    clearBtn.style.display = searchEl.value ? 'flex' : 'none';
    clearTimeout(searchTimer);  // debounce: full filter+sort+re-render is heavy on 35k rows
    searchTimer = setTimeout(refresh, 120);
  });
  clearBtn.addEventListener('click', () => {
    searchEl.value = '';
    clearBtn.style.display = 'none';
    searchEl.focus();
    refresh();
  });

  document.getElementById('filter-gender').addEventListener('change', e => {
    filterGender = e.target.value;
    refresh();
  });
  document.getElementById('filter-country').addEventListener('change', e => {
    filterCountry = e.target.value;
    refresh();
  });

  const filterClearBtn = document.getElementById('filter-clear');
  if (filterClearBtn) {
    filterClearBtn.addEventListener('click', () => {
      filterGender = '';
      filterCountry = '';
      document.getElementById('filter-gender').value = '';
      document.getElementById('filter-country').value = '';
      refresh();
    });
  }
}
