/**
 * Cloneflix — js/app.js
 * ------------------------------------------------------------------
 * Vanilla-JS UI layer for the Cloneflix static demo (educational use).
 * Loaded with `defer` AFTER js/data.js, which provides:
 *
 *   window.CATALOG    — 45 items: {id, title, year, rating, match, genres,
 *                       duration, description, gradient: [hex, hex]}
 *   window.GENRE_ROWS — 8 row label strings.
 *
 * Renders the genre rows + rotating hero banner, drives the detail modal
 * and the live search, and toggles the navbar scrolled state.
 * No frameworks, no modules, no network calls.
 */
(function () {
  'use strict';

  /* ================================================================
   * 1. Helpers
   * ================================================================ */

  /** getElementById shortcut. */
  function byId(id) {
    return document.getElementById(id);
  }

  /**
   * Create an element with optional classes and text content.
   * @param {string} tag
   * @param {string} [className]  space-separated class list
   * @param {string} [text]       text content
   */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  /** Clear `container`, then append every node passed after it. */
  function render(container, ...nodes) {
    container.textContent = '';
    nodes.forEach((node) => container.appendChild(node));
  }

  /** Fisher–Yates shuffle; returns a new array (input untouched). */
  function shuffle(items) {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ================================================================
   * 2. Row → genre mapping (see spec)
   * ================================================================ */

  const ROW_GENRES = {
    'Action & Adventure': ['Action', 'Adventure'],
    'Sci-Fi & Fantasy': ['Sci-Fi', 'Fantasy'],
    'Comedies': ['Comedy', 'Family'],
    'Dramas': ['Drama', 'Romance'],
    'Horror & Thriller': ['Horror', 'Thriller', 'Mystery'],
    'Documentaries': ['Documentary', 'History'],
  };

  /** Rows that always contain the full catalog. */
  const FULL_CATALOG_ROWS = ['Trending Now', 'Popular on Netflix'];

  /* ================================================================
   * 3. App state
   * ================================================================ */

  const state = {
    rows: [],        // row <section> elements currently in #rows
    heroItems: [],   // trending items the hero banner rotates through
    heroIndex: 0,
    modalOpen: false,
    myList: new Set(), // favourite ids (per signed-in user)
  };

  /* ================================================================
   * 4. Bootstrap — everything is wired up on DOMContentLoaded
   * ================================================================ */

  document.addEventListener('DOMContentLoaded', () => {
    // Defensive: without the data layer there is nothing to render.
    if (!window.CATALOG || !Array.isArray(window.CATALOG) || window.CATALOG.length === 0) {
      console.warn('Cloneflix: window.CATALOG is missing or empty — app.js bailing out.');
      return;
    }
    const CATALOG = window.CATALOG;

    // DOM hooks (written by the HTML agent) — bail quietly if any are gone.
    const rowsEl = byId('rows');
    const heroEl = byId('hero');
    const modalEl = byId('modal');
    const modalContent = byId('modal-content');
    const searchForm = byId('search-form');
    const searchInput = byId('search-input');
    const closeBtn = modalEl ? modalEl.querySelector('.modal__close') : null;

    if (!rowsEl || !heroEl || !modalEl || !modalContent || !searchForm || !searchInput) {
      console.warn('Cloneflix: one or more DOM hooks are missing — app.js bailing out.');
      return;
    }

    const genreRows = Array.isArray(window.GENRE_ROWS) ? window.GENRE_ROWS : [];

    /* ----------------------------------------------------------------
     * 4a2. My List (favourites) — per-user, persisted in localStorage
     * ---------------------------------------------------------------- */
    const user = (window.Auth && Auth.getUser()) || null;
    const listKey = 'netflix-mylist-' + (user && user.email ? user.email.toLowerCase() : 'anon');

    function loadMyList() {
      try {
        state.myList = new Set(JSON.parse(localStorage.getItem(listKey)) || []);
      } catch (e) {
        state.myList = new Set();
      }
    }

    function persistMyList() {
      localStorage.setItem(listKey, JSON.stringify([...state.myList]));
    }

    function inMyList(item) {
      return state.myList.has(item.id);
    }

    function toggleMyList(item, btn) {
      if (state.myList.has(item.id)) {
        state.myList.delete(item.id);
      } else {
        state.myList.add(item.id);
      }
      persistMyList();
      if (btn) {
        const added = inMyList(item);
        if (btn.classList.contains('card__add')) {
          btn.textContent = added ? '✓' : '＋';
        } else {
          btn.textContent = added ? '✓ In My List' : '＋ My List';
        }
        btn.classList.toggle('in-list', added);
      }
      renderMyListRow();
    }

    /** The always-present "My List" row, directly after Continue Watching. */
    function renderMyListRow() {
      const existing = rowsEl.querySelector('.row--mylist');
      if (existing) existing.remove();

      const row = el('section', 'row row--mylist');
      row.appendChild(el('h2', 'row__title', 'My List'));

      const items = CATALOG.filter((item) => state.myList.has(item.id));
      if (items.length === 0) {
        row.appendChild(el('p', 'row__empty', 'Your list is empty — hover any title and click ＋ to add it.'));
      } else {
        const cards = el('div', 'row__cards');
        items.forEach((item) => cards.appendChild(renderCard(item)));
        row.appendChild(cards);
      }
      // Keep the row between Continue Watching and the genre rows.
      const anchor = rowsEl.querySelector('.row--continue');
      if (anchor) rowsEl.insertBefore(row, anchor);
      else rowsEl.prepend(row);
    }

    /** Deterministic per-id progress percent for Continue Watching cards. */
    function progressForId(id) {
      let h = 0;
      const s = String(id);
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return (h % 70) + 10; // 10–79%
    }

    /** Display name of the active profile ("You" when none is chosen). */
    function activeProfileName() {
      try {
        const active =
          window.Auth && typeof Auth.getActiveProfile === 'function' ? Auth.getActiveProfile() : null;
        if (active && active.name) return active.name;
      } catch (e) {
        /* storage unavailable — ignore */
      }
      return 'You';
    }

    /** The "Continue Watching" row, always first in #rows (before My List). */
    function renderContinueRow() {
      const existing = rowsEl.querySelector('.row--continue');
      if (existing) existing.remove();

      const row = el('section', 'row row--continue');
      row.appendChild(el('h2', 'row__title', `Continue Watching for ${activeProfileName()}`));

      const cards = el('div', 'row__cards');
      cards.style.overflowX = 'auto';
      // Deterministic selection and progress — deliberately no Math.random.
      CATALOG.slice(0, 6).forEach((item) => {
        cards.appendChild(renderCard(item, { thumb: true, progress: progressForId(item.id) }));
      });
      row.appendChild(cards);

      const mylist = rowsEl.querySelector('.row--mylist');
      if (mylist) rowsEl.insertBefore(row, mylist);
      else rowsEl.prepend(row);
    }

    /** Fake "trailer" player overlaid on the modal (demo only). */
    function startPlayer(item) {
      const box = modalEl.querySelector('.modal__box');
      if (!box) return;
      box.querySelectorAll('.player').forEach((p) => p.remove());

      const player = el('div', 'player');

      const img = el('img', 'player__img');
      img.src = `images/backdrop/${item.id}.svg`;
      img.alt = item.title;
      player.appendChild(img);

      const top = el('div', 'player__top');
      const back = el('button', 'player__back', '← Back');
      top.appendChild(back);
      top.appendChild(el('span', 'player__title', `${item.title} — trailer (demo)`));
      player.appendChild(top);

      player.appendChild(el('p', 'player__demo', 'Demo player — no real video is streamed.'));

      const bar = el('div', 'player__bar');
      const fill = el('div', 'player__fill');
      bar.appendChild(fill);
      player.appendChild(bar);

      function stop() {
        player.remove();
        document.removeEventListener('keydown', onKey);
      }
      function onKey(event) {
        if (event.key === 'Escape') stop();
      }
      back.addEventListener('click', stop);
      document.addEventListener('keydown', onKey);
      fill.addEventListener('animationend', stop);

      box.appendChild(player);
    }

    /* ----------------------------------------------------------------
     * 4a. Posters & cards
     * ---------------------------------------------------------------- */

    /**
     * Gradient poster art: a .card__poster div whose background is the
     * item's two-color gradient, with the title overlaid bottom-left
     * (the stylesheet positions the span via .card__poster).
     */
    function buildPoster(item, thumb) {
      const poster = el('div', 'card__poster');
      // Gradient fallback behind the generated SVG artwork.
      const [g1, g2] = item.gradient;
      poster.style.background = `linear-gradient(135deg, ${g1}, ${g2})`;
      const img = el('img', 'card__poster-img');
      img.src = thumb ? `images/thumb/${item.id}.svg` : `images/poster/${item.id}.svg`;
      img.alt = item.title;
      img.loading = 'lazy';
      poster.appendChild(img);
      return poster;
    }

    /**
     * One browsable card: poster + an info layer (shown on hover via CSS)
     * with match %, duration and a round play button. Clicking the card
     * (or pressing Enter when focused) opens the detail modal.
     */
    function renderCard(item, options) {
      const opts = options || {};
      const card = el('div', opts.thumb ? 'card card--thumb' : 'card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${item.title} — open details`);

      card.appendChild(buildPoster(item, opts.thumb));

      const info = el('div', 'card__info');
      info.appendChild(el('p', 'match', `${item.match}% Match`));
      info.appendChild(el('p', 'meta', item.duration));

      const playBtn = el('button', 'card__play', '▶');
      playBtn.setAttribute('aria-label', `Play ${item.title}`);
      playBtn.addEventListener('click', (event) => {
        // Swallow the event so the card's own click handler doesn't fire twice.
        event.stopPropagation();
        openModal(item);
      });
      info.appendChild(playBtn);

      card.appendChild(info);

      const addBtn = el('button', 'card__add', inMyList(item) ? '✓' : '＋');
      addBtn.setAttribute('aria-label', `${item.title} — toggle My List`);
      addBtn.classList.toggle('in-list', inMyList(item));
      addBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMyList(item, addBtn);
      });
      card.appendChild(addBtn);

      // Top-10 rank number (first ten trending items only).
      if (opts.num) {
        const num = el('span', 'card__num', String(opts.num));
        num.setAttribute('aria-hidden', 'true');
        card.appendChild(num);
      }

      // Continue Watching progress bar (width set inline by the caller).
      if (typeof opts.progress === 'number') {
        const bar = el('div', 'card__progress');
        const fill = el('div', 'card__progress-fill');
        fill.style.width = `${opts.progress}%`;
        bar.appendChild(fill);
        card.appendChild(bar);
      }

      card.addEventListener('click', () => openModal(item));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          openModal(item);
        }
      });

      return card;
    }

    /* ----------------------------------------------------------------
     * 4b. Rows
     * ---------------------------------------------------------------- */

    /** Items belonging to a given row label (per the spec's mapping). */
    function itemsForRow(label) {
      if (FULL_CATALOG_ROWS.includes(label)) return CATALOG.slice();
      if (label === 'New & Popular') {
        return CATALOG.filter((item) => item.year >= 2024).sort((a, b) => b.year - a.year);
      }
      const wanted = ROW_GENRES[label];
      if (!wanted) return [];
      return CATALOG.filter((item) => item.genres.some((g) => wanted.includes(g)));
    }

    /**
     * A .row section: title, scroll controls (❮ / ❯) and a horizontally
     * scrollable card strip. Buttons scroll smoothly by ~3 card widths.
     */
    function renderRow(label, items) {
      const row = el('section', 'row');

      row.appendChild(el('h2', 'row__title', label));

      const controls = el('div', 'row__controls');
      const leftBtn = el('button', 'row__btn row__btn--left', '❮');
      const rightBtn = el('button', 'row__btn row__btn--right', '❯');
      leftBtn.setAttribute('aria-label', `Scroll ${label} left`);
      rightBtn.setAttribute('aria-label', `Scroll ${label} right`);
      controls.appendChild(leftBtn);
      controls.appendChild(rightBtn);
      row.appendChild(controls);

      const cards = el('div', 'row__cards');
      // Inline overflow-x guarantees native horizontal swipe on touch
      // devices (the stylesheet also styles .row__cards with overflow-x).
      cards.style.overflowX = 'auto';
      // "Trending Now" is Netflix's Top-10 row: landscape thumbs + giant rank
      // numbers (1–10); every other row keeps the portrait posters.
      const isTopTen = label === 'Trending Now';
      items.forEach((item, index) => {
        cards.appendChild(
          renderCard(item, isTopTen ? { thumb: true, num: index < 10 ? index + 1 : null } : null)
        );
      });
      row.appendChild(cards);

      // Step of ~3 card widths, measured from the rendered cards.
      const firstCard = cards.firstElementChild;
      const gap = parseFloat(getComputedStyle(cards).columnGap) || 0;
      const cardWidth = firstCard ? firstCard.offsetWidth : 300;
      const step = (cardWidth + gap) * 3;

      leftBtn.addEventListener('click', () => cards.scrollBy({ left: -step, behavior: 'smooth' }));
      rightBtn.addEventListener('click', () => cards.scrollBy({ left: step, behavior: 'smooth' }));

      return row;
    }

    /** Build every genre row into #rows, guaranteeing "Trending Now" first. */
    function buildRows() {
      loadMyList();
      const labels = [
        'Trending Now',
        ...genreRows.filter((label) => label !== 'Trending Now'),
      ];

      const fragment = document.createDocumentFragment();
      labels.forEach((label) => {
        const matches = itemsForRow(label);
        if (matches.length === 0) return; // skip rows with no content
        const row = renderRow(label, shuffle(matches)); // shuffled within the row
        if (label === 'New & Popular') row.classList.add('row--new');
        state.rows.push(row);
        fragment.appendChild(row);
      });

      rowsEl.appendChild(fragment);
      renderMyListRow();
      renderContinueRow();
    }

    /* ----------------------------------------------------------------
     * 4c. Hero banner
     * ---------------------------------------------------------------- */

    /** Fills #hero with the first trending item and rotates every 10s. */
    function buildHero() {
      state.heroItems = itemsForRow('Trending Now');
      state.heroIndex = 0;

      const content = el('div', 'hero__content');
      const badgeEl = el('div', 'hero__badge');
      badgeEl.appendChild(el('span', 'hero__badge-n', 'N'));
      const badgeLabelEl = el('span', 'hero__badge-label');
      badgeEl.appendChild(badgeLabelEl);
      const titleEl = el('h1', 'hero__title');
      const metaEl = el('div', 'hero__meta');
      const descEl = el('p', 'hero__desc');
      const buttonsEl = el('div', 'hero__buttons');

      const playBtn = el('button', 'btn btn--play', '▶ Play');
      const infoBtn = el('button', 'btn btn--info', 'ℹ More Info');
      buttonsEl.appendChild(playBtn);
      buttonsEl.appendChild(infoBtn);

      content.appendChild(badgeEl);
      content.appendChild(titleEl);
      content.appendChild(metaEl);
      content.appendChild(descEl);
      content.appendChild(buttonsEl);
      heroEl.appendChild(content);

      let currentItem = null;
      playBtn.addEventListener('click', () => currentItem && openModal(currentItem));
      infoBtn.addEventListener('click', () => currentItem && openModal(currentItem));

      /** Re-render the banner for one item (content + gradient background). */
      function showItem(item) {
        currentItem = item;
        badgeLabelEl.textContent =
          item.duration && item.duration.includes('Season') ? 'SERIES' : 'FILM';
        titleEl.textContent = item.title;

        render(
          metaEl,
          el('span', 'match', `${item.match}% Match`),
          el('span', 'year', String(item.year)),
          el('span', 'badge', item.rating),
          el('span', 'duration', item.duration)
        );

        descEl.textContent = item.description;

        // Backdrop art (generated SVG) over a gradient fallback.
        const [g1, g2] = item.gradient;
        heroEl.style.backgroundImage = `linear-gradient(180deg, ${g1}, ${g2}), url("images/backdrop/${item.id}.svg")`;
      }

      if (state.heroItems.length > 0) showItem(state.heroItems[0]);

      // Rotate to the next trending item every 10s. Kept simple: content +
      // background are swapped in place (no CSS transition dependency).
      // The rotation is paused while the modal is open.
      setInterval(() => {
        if (state.modalOpen || state.heroItems.length < 2) return;
        state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
        showItem(state.heroItems[state.heroIndex]);
      }, 10000);
    }

    /* ----------------------------------------------------------------
     * 4d. Detail modal
     * ---------------------------------------------------------------- */

    /** Fill #modal-content with the item details and show the modal. */
    function openModal(item) {
      if (!item) return;
      state.modalOpen = true;
      modalEl.querySelectorAll('.player').forEach((p) => p.remove());

      // Backdrop art with the big title overlaid.
      const backdrop = el('div', 'modal__backdrop');
      const img = el('img', 'modal__backdrop-img');
      img.src = `images/backdrop/${item.id}.svg`;
      img.alt = '';
      backdrop.appendChild(img);
      backdrop.appendChild(el('h1', 'modal__backdrop-title', item.title));

      const body = el('div', 'modal__body');
      body.appendChild(el('h2', 'modal__title', item.title));

      const meta = el('div', 'modal__meta');
      meta.appendChild(el('span', 'match', `${item.match}% Match`));
      meta.appendChild(el('span', 'year', String(item.year)));
      meta.appendChild(el('span', 'badge', item.rating));
      meta.appendChild(el('span', 'duration', item.duration));
      meta.appendChild(el('span', 'genres', item.genres.join(' • ')));
      body.appendChild(meta);

      body.appendChild(el('p', 'modal__desc', item.description));

      const playBtn = el('button', 'btn btn--play', '▶ Play');
      playBtn.addEventListener('click', () => startPlayer(item));

      const listBtn = el('button', 'btn btn--info btn--list', inMyList(item) ? '✓ In My List' : '＋ My List');
      listBtn.classList.toggle('in-list', inMyList(item));
      listBtn.addEventListener('click', () => toggleMyList(item, listBtn));

      body.appendChild(playBtn);
      body.appendChild(listBtn);

      render(modalContent, backdrop, body);

      modalEl.classList.add('modal--open');
      modalEl.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      if (closeBtn) closeBtn.focus();
    }

    /** Reverse everything openModal did. */
    function closeModal() {
      if (!state.modalOpen) return;
      state.modalOpen = false;
      modalEl.querySelectorAll('.player').forEach((p) => p.remove());
      modalEl.classList.remove('modal--open');
      modalEl.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    /* ----------------------------------------------------------------
     * 4e. Search
     * ---------------------------------------------------------------- */

    /** Case-insensitive match on title or any genre. */
    function matchesQuery(item, query) {
      const needle = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(needle) ||
        item.genres.some((genre) => genre.toLowerCase().includes(needle))
      );
    }

    /**
     * Non-empty query: hide the hero + normal rows and show one results
     * row. Empty query: remove the results row and restore the layout.
     */
    function applySearch(rawQuery) {
      const query = rawQuery.trim();

      const prevResults = rowsEl.querySelector('.row--results');
      if (prevResults) prevResults.remove();

      if (query === '') {
        heroEl.classList.remove('hidden');
        state.rows.forEach((row) => row.classList.remove('hidden'));
        rowsEl.querySelectorAll('.row--mylist, .row--continue').forEach((row) => row.classList.remove('hidden'));
        return;
      }

      heroEl.classList.add('hidden');
      state.rows.forEach((row) => row.classList.add('hidden'));
      rowsEl.querySelectorAll('.row--mylist, .row--continue').forEach((row) => row.classList.add('hidden'));

      const matches = CATALOG.filter((item) => matchesQuery(item, query));

      if (matches.length === 0) {
        const emptyRow = el('section', 'row row--results');
        emptyRow.appendChild(el('h2', 'row__title', 'Search Results'));
        emptyRow.appendChild(el('p', 'row__empty', `No results for '${query}'.`));
        rowsEl.appendChild(emptyRow);
        return;
      }

      const resultsRow = renderRow('Search Results', matches);
      resultsRow.classList.add('row--results');
      rowsEl.appendChild(resultsRow);
    }

    /* ----------------------------------------------------------------
     * 4f. Navbar scrolled state
     * ---------------------------------------------------------------- */

    /** Body gets .scrolled once the page is scrolled past 50px. */
    function onScroll() {
      document.body.classList.toggle('scrolled', window.scrollY > 50);
    }

    /* ----------------------------------------------------------------
     * 4g. Wire everything up
     * ---------------------------------------------------------------- */

    buildRows();
    buildHero();

    // Modal: close button, backdrop click (outside .modal__box), Escape key.
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (event) => {
      if (state.modalOpen && !event.target.closest('.modal__box')) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && state.modalOpen) closeModal();
    });

    // Search: form submit plus debounced typing (~250ms).
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      applySearch(searchInput.value);
    });
    let searchDebounce = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => applySearch(searchInput.value), 250);
    });

    // Navbar links ("My List", "New & Popular"): scroll to their row and
    // briefly highlight it (reuses .row--flash).
    function wireNavScroll(id, rowSelector) {
      const link = document.getElementById(id);
      if (!link) return;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const row = rowsEl.querySelector(rowSelector);
        if (!row) return;
        row.scrollIntoView({ behavior: 'smooth', block: 'start' });
        row.classList.add('row--flash');
        setTimeout(() => row.classList.remove('row--flash'), 1600);
      });
    }
    wireNavScroll('nav-mylist', '.row--mylist');
    wireNavScroll('nav-new', '.row--new');

    // Navbar scroll effect.
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
