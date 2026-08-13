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
  const FULL_CATALOG_ROWS = ['Trending Now', 'Popular on Cloneflix'];

  /* ================================================================
   * 3. App state
   * ================================================================ */

  const state = {
    rows: [],        // row <section> elements currently in #rows
    heroItems: [],   // trending items the hero banner rotates through
    heroIndex: 0,
    modalOpen: false,
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
     * 4a. Posters & cards
     * ---------------------------------------------------------------- */

    /**
     * Gradient poster art: a .card__poster div whose background is the
     * item's two-color gradient, with the title overlaid bottom-left
     * (the stylesheet positions the span via .card__poster).
     */
    function buildPoster(item) {
      const poster = el('div', 'card__poster');
      const [g1, g2] = item.gradient;
      poster.style.background = `linear-gradient(135deg, ${g1}, ${g2})`;
      poster.appendChild(el('span', 'card__poster-title', item.title));
      return poster;
    }

    /**
     * One browsable card: poster + an info layer (shown on hover via CSS)
     * with match %, duration and a round play button. Clicking the card
     * (or pressing Enter when focused) opens the detail modal.
     */
    function renderCard(item) {
      const card = el('div', 'card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${item.title} — open details`);

      card.appendChild(buildPoster(item));

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
      items.forEach((item) => cards.appendChild(renderCard(item)));
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
      const labels = [
        'Trending Now',
        ...genreRows.filter((label) => label !== 'Trending Now'),
      ];

      const fragment = document.createDocumentFragment();
      labels.forEach((label) => {
        const matches = itemsForRow(label);
        if (matches.length === 0) return; // skip rows with no content
        const row = renderRow(label, shuffle(matches)); // shuffled within the row
        state.rows.push(row);
        fragment.appendChild(row);
      });

      rowsEl.appendChild(fragment);
    }

    /* ----------------------------------------------------------------
     * 4c. Hero banner
     * ---------------------------------------------------------------- */

    /** Fills #hero with the first trending item and rotates every 10s. */
    function buildHero() {
      state.heroItems = itemsForRow('Trending Now');
      state.heroIndex = 0;

      const content = el('div', 'hero__content');
      const titleEl = el('h1', 'hero__title');
      const metaEl = el('div', 'hero__meta');
      const descEl = el('p', 'hero__desc');
      const buttonsEl = el('div', 'hero__buttons');

      const playBtn = el('button', 'btn btn--play', '▶ Play');
      const infoBtn = el('button', 'btn btn--info', 'ℹ More Info');
      buttonsEl.appendChild(playBtn);
      buttonsEl.appendChild(infoBtn);

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
        titleEl.textContent = item.title;

        render(
          metaEl,
          el('span', 'match', `${item.match}% Match`),
          el('span', 'year', String(item.year)),
          el('span', 'badge', item.rating),
          el('span', 'duration', item.duration)
        );

        descEl.textContent = item.description;

        // Deep-to-darker gradient from the item's palette.
        const [g1, g2] = item.gradient;
        heroEl.style.background = `linear-gradient(180deg, ${g1}, ${g2})`;
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

      // Poster art: gradient backdrop with the big title over it.
      const backdrop = el('div', 'modal__backdrop');
      const [g1, g2] = item.gradient;
      backdrop.style.background = `linear-gradient(135deg, ${g1}, ${g2})`;
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
      playBtn.addEventListener('click', () => {
        alert('Demo: video playback is not included in this educational clone.');
      });
      body.appendChild(playBtn);

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
        return;
      }

      heroEl.classList.add('hidden');
      state.rows.forEach((row) => row.classList.add('hidden'));

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

    // Navbar scroll effect.
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
})();
