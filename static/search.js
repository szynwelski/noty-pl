(function () {
  let moviesData = null, personsData = null, dataLoading = false;
  let currentIdx = -1;
  let imgAbort = null;

  // ── Data ──────────────────────────────────────────────────────────────────

  async function loadData() {
    if (moviesData && personsData) return;
    if (dataLoading) return;
    dataLoading = true;
    document.getElementById('search-modal-results').innerHTML =
      '<div class="search-status">Ładowanie…</div>';
    const [movies, persons] = await Promise.all([
      fetch('/data/movies_index.json').then(r => r.json()),
      fetch('/data/persons_index.json').then(r => r.json()),
    ]);
    moviesData  = movies;
    personsData = persons;
    dataLoading = false;
    const q = document.getElementById('search-modal-input').value;
    if (q.trim()) renderResults(q);
    else document.getElementById('search-modal-results').innerHTML = '';
  }

  // ── Search ────────────────────────────────────────────────────────────────

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function matchScore(text, q) {
    const t = norm(text);
    if (t === q)          return 3;
    if (t.startsWith(q)) return 2;
    if (t.includes(q))   return 1;
    return 0;
  }

  function searchMovies(query, limit) {
    const q = norm(query);
    const out = [];
    for (const m of moviesData) {
      const s = Math.max(matchScore(m.polish_title, q), matchScore(m.title, q), matchScore(m.original_title, q));
      if (s) out.push([s, m]);
    }
    return out.sort((a, b) => b[0] - a[0] || (b[1].score || 0) - (a[1].score || 0)).slice(0, limit).map(x => x[1]);
  }

  function searchPersons(query, limit) {
    const q = norm(query);
    const out = [];
    for (const p of personsData) {
      const s = matchScore(p.name, q);
      if (s) out.push([s, p]);
    }
    return out.sort((a, b) => b[0] - a[0] || (b[1].n || 0) - (a[1].n || 0)).slice(0, limit).map(x => x[1]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function imgOrPlaceholder(url, cls) {
    return url
      ? `<img src="${url}" class="${cls}" alt="" loading="lazy">`
      : `<div class="${cls} search-img-placeholder"></div>`;
  }

  function renderResults(query) {
    const el = document.getElementById('search-modal-results');
    currentIdx = -1;
    if (!query.trim()) { el.innerHTML = ''; return; }
    if (!moviesData)   { loadData(); return; }

    const movies  = searchMovies(query, 5);
    const persons = searchPersons(query, 5);
    if (!movies.length && !persons.length) {
      el.innerHTML = '<div class="search-status">Brak wyników</div>';
      return;
    }

    let html = '';
    if (movies.length) {
      html += '<div class="search-section-label">Filmy</div>';
      html += movies.map(m => {
        const title = m.polish_title || m.title;
        const sub   = (m.polish_title && m.polish_title !== m.title) ? m.title
                    : (m.original_title && m.original_title !== m.title) ? m.original_title : '';
        return `<a class="search-result" href="/film/?id=${m.id}">
          ${imgOrPlaceholder(m.image_url, 'search-result-img')}
          <div class="search-result-body">
            <div class="search-result-title">${title}</div>
            ${sub ? `<div class="search-result-sub">${sub}</div>` : ''}
          </div>
          <div class="search-result-year">${m.year || ''}</div>
        </a>`;
      }).join('');
    }
    if (persons.length) {
      html += '<div class="search-section-label">Osoby</div>';
      html += persons.map(p =>
        `<a class="search-result" href="/osoba/?id=${p.id}">
          <div class="search-result-img search-result-img--person search-img-placeholder" data-person-id="${p.id}"></div>
          <div class="search-result-body">
            <div class="search-result-title">${p.name}</div>
          </div>
        </a>`
      ).join('');
    }
    el.innerHTML = html;
    if (persons.length) loadPersonImages(persons);
  }

  function loadPersonImages(persons) {
    if (imgAbort) imgAbort.abort();
    imgAbort = new AbortController();
    const signal = imgAbort.signal;
    persons.forEach(p => {
      fetch(`/data/persons/${p.id}.json`, { signal })
        .then(r => r.json())
        .then(data => {
          if (!data.image_url) return;
          const el = document.querySelector(`[data-person-id="${p.id}"]`);
          if (!el) return;
          const img = document.createElement('img');
          img.src = data.image_url;
          img.className = 'search-result-img search-result-img--person';
          img.alt = '';
          img.loading = 'lazy';
          el.replaceWith(img);
        })
        .catch(() => {});
    });
  }

  // ── Modal open / close ────────────────────────────────────────────────────

  function openModal() {
    const modal = document.getElementById('search-modal');
    modal.classList.add('open');
    document.body.classList.add('search-open');
    const input = document.getElementById('search-modal-input');
    input.value = '';
    document.getElementById('search-modal-results').innerHTML = '';
    currentIdx = -1;
    requestAnimationFrame(() => input.focus());
    loadData();
  }

  function closeModal() {
    document.getElementById('search-modal').classList.remove('open');
    document.body.classList.remove('search-open');
    if (imgAbort) { imgAbort.abort(); imgAbort = null; }
  }

  // ── Keyboard navigation ───────────────────────────────────────────────────

  function moveSelection(dir) {
    const items = document.querySelectorAll('.search-result');
    if (!items.length) return;
    if (currentIdx >= 0) {
      items[currentIdx].classList.remove('focused');
      currentIdx = (currentIdx + dir + items.length) % items.length;
    } else {
      // No selection yet: ArrowDown → first, ArrowUp → last
      currentIdx = dir > 0 ? 0 : items.length - 1;
    }
    items[currentIdx].classList.add('focused');
    items[currentIdx].scrollIntoView({ block: 'nearest' });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const btn      = document.getElementById('search-global-btn');
    const modal    = document.getElementById('search-modal');
    const backdrop = document.getElementById('search-modal-backdrop');
    const input    = document.getElementById('search-modal-input');
    if (!btn || !modal) return;

    btn.addEventListener('click', openModal);
    backdrop.addEventListener('click', closeModal);

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderResults(input.value), 120);
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        modal.classList.contains('open') ? closeModal() : openModal();
        return;
      }
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape')    { closeModal(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1);  return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); moveSelection(-1); return; }
      if (e.key === 'Enter') {
        const items = document.querySelectorAll('.search-result');
        const sel = items[currentIdx];
        if (sel) { closeModal(); window.location.href = sel.href; }
      }
    });
  });
})();
