/**
 * Cloneflix — Netflix-style UI clone (educational demo)
 * File: js/profiles.js
 * --------------------------------------------------------------------------
 * "Who's watching?" profile picker.
 *
 * Per signed-in user (keyed by e-mail in localStorage):
 *   - 'netflix-profiles-<email>'        → JSON array of { id, name, color }
 *   - 'netflix-active-profile-<email>'  → id of the last-selected profile
 *
 * Pure DOM APIs throughout (textContent only — no innerHTML with user input).
 */
(function () {
  'use strict';

  /* 8 gradient pairs (start/end hex) used as profile avatar backgrounds. */
  const PALETTE = [
    ['#e50914', '#7b0a10'],
    ['#f5a623', '#b06a00'],
    ['#46d369', '#1d7a3c'],
    ['#2196f3', '#0d47a1'],
    ['#9c27b0', '#4a148c'],
    ['#00bcd4', '#006064'],
    ['#ff4081', '#9c0f3d'],
    ['#ffd54f', '#a97b00']
  ];

  /* The add-profile form offers the first 6 palette colours. */
  const ADD_COLORS = PALETTE.slice(0, 6);

  const MAX_NAME_LENGTH = 20;

  /* --- state (initialised on DOMContentLoaded) --------------------------- */
  let container = null;
  let titleEl = null;
  let manageBtn = null;
  let doneBtn = null;
  let signoutBtn = null;
  let user = null;
  let profiles = [];
  let manageMode = false;

  /* --- helpers ------------------------------------------------------------ */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function userSuffix() {
    const email = user && user.email ? user.email : 'anon';
    return email.toLowerCase();
  }

  function profilesKey() {
    return 'netflix-profiles-' + userSuffix();
  }

  function activeKey() {
    return 'netflix-active-profile-' + userSuffix();
  }

  function loadProfiles() {
    try {
      const list = JSON.parse(localStorage.getItem(profilesKey())) || [];
      return Array.isArray(list) ? list.filter(isProfile) : [];
    } catch (e) {
      return [];
    }
  }

  function isProfile(p) {
    return (
      p &&
      typeof p === 'object' &&
      typeof p.id === 'string' &&
      typeof p.name === 'string'
    );
  }

  function saveProfiles() {
    try {
      localStorage.setItem(profilesKey(), JSON.stringify(profiles));
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  function getActiveId() {
    try {
      return localStorage.getItem(activeKey());
    } catch (e) {
      return null;
    }
  }

  function setActiveId(id) {
    try {
      localStorage.setItem(activeKey(), id);
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  function nameOf(profile) {
    return (profile.name || '').trim() || 'Profile';
  }

  function colorOf(profile) {
    const c = profile.color;
    if (
      Array.isArray(c) &&
      c.length === 2 &&
      typeof c[0] === 'string' &&
      typeof c[1] === 'string'
    ) {
      return c;
    }
    return PALETTE[0];
  }

  function findProfile(id) {
    for (let i = 0; i < profiles.length; i += 1) {
      if (profiles[i].id === id) return profiles[i];
    }
    return null;
  }

  /* --- rendering ---------------------------------------------------------- */
  function render() {
    if (!container) return;

    const manage = manageMode;
    if (titleEl) titleEl.textContent = manage ? 'Manage Profiles' : "Who's watching?";
    if (doneBtn) doneBtn.hidden = !manage;
    if (manageBtn) manageBtn.hidden = manage;

    container.textContent = '';

    const frag = document.createDocumentFragment();
    profiles.forEach(function (profile) {
      frag.appendChild(buildCard(profile, manage));
    });
    if (manage) frag.appendChild(buildAddCard());
    container.appendChild(frag);
  }

  function buildCard(profile, manage) {
    const name = nameOf(profile);
    const color = colorOf(profile);
    const card = document.createElement(manage ? 'div' : 'button');
    if (!manage) card.type = 'button';
    card.className = 'profile-card';
    card.dataset.id = profile.id;

    const avatar = document.createElement('span');
    avatar.className = 'profile-card__avatar';
    avatar.style.background = 'linear-gradient(135deg, ' + color[0] + ', ' + color[1] + ')';
    avatar.textContent = name.charAt(0).toUpperCase();
    card.appendChild(avatar);

    const nameEl = document.createElement('span');
    nameEl.className = 'profile-card__name';
    nameEl.textContent = name;
    card.appendChild(nameEl);

    if (manage) {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'profile-card__edit';
      edit.setAttribute('aria-label', 'Rename ' + name);
      edit.textContent = '✎'; /* ✎ */
      card.appendChild(edit);

      if (profiles.length > 1) {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'profile-card__delete';
        del.setAttribute('aria-label', 'Delete ' + name);
        del.textContent = '×'; /* × */
        card.appendChild(del);
      }
    }
    return card;
  }

  function buildAddCard() {
    const card = document.createElement('div');
    card.className = 'profile-card profile-card__add';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', 'Add profile');

    card.addEventListener('keydown', function (e) {
      if (e.target !== card) return; /* let the inner form handle its own keys */
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAddForm(card);
      }
    });

    const avatar = document.createElement('span');
    avatar.className = 'profile-card__avatar';
    avatar.textContent = '＋'; /* ＋ */
    card.appendChild(avatar);

    const name = document.createElement('span');
    name.className = 'profile-card__name';
    name.textContent = 'Add Profile';
    card.appendChild(name);

    return card;
  }

  /* --- interactions ------------------------------------------------------- */
  function onClick(e) {
    if (manageMode) {
      const del = e.target.closest('.profile-card__delete');
      if (del) {
        deleteProfile(del.closest('.profile-card'));
        return;
      }

      const add = e.target.closest('.profile-card__add');
      if (add) {
        openAddForm(add);
        return;
      }

      const card = e.target.closest('.profile-card');
      if (card) startRename(card);
    } else {
      const card = e.target.closest('.profile-card');
      if (card) selectProfile(card);
    }
  }

  function selectProfile(card) {
    const profile = findProfile(card.dataset.id);
    if (!profile) return;
    setActiveId(profile.id);
    location.replace('index.html');
  }

  function startRename(card) {
    if (!card.dataset.id || card.querySelector('input')) return;
    const profile = findProfile(card.dataset.id);
    if (!profile) return;

    const nameEl = card.querySelector('.profile-card__name');
    if (!nameEl) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'profile-card__input';
    input.maxLength = MAX_NAME_LENGTH;
    input.value = profile.name;
    input.setAttribute('aria-label', 'Profile name');

    nameEl.textContent = '';
    nameEl.appendChild(input);
    input.focus();
    input.select();

    let finished = false;
    const finish = function (save) {
      if (finished) return;
      finished = true;
      if (save) {
        const value = input.value.trim();
        if (value) profile.name = value; /* empty input keeps the old name */
        saveProfiles();
      }
      render();
    };

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') finish(true);
      else if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', function () {
      finish(true);
    });
  }

  function deleteProfile(card) {
    const profile = findProfile(card.dataset.id);
    if (!profile || profiles.length <= 1) return;

    const name = nameOf(profile);
    if (!window.confirm('Delete "' + name + '" profile?')) return;

    const wasActive = getActiveId() === profile.id;
    profiles = profiles.filter(function (p) {
      return p.id !== profile.id;
    });
    saveProfiles();
    if (wasActive) {
      try {
        localStorage.removeItem(activeKey());
      } catch (e) {
        /* storage unavailable — ignore */
      }
    }
    render();
  }

  function openAddForm(card) {
    if (card.querySelector('form')) return; /* already open */

    const form = document.createElement('form');
    form.className = 'profile-add__form';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'profile-add__name';
    input.maxLength = MAX_NAME_LENGTH;
    input.placeholder = 'Name';
    input.setAttribute('aria-label', 'New profile name');
    form.appendChild(input);

    const swatches = document.createElement('div');
    swatches.className = 'profile-add__swatches';
    let selected = 0;

    ADD_COLORS.forEach(function (pair, i) {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'profile-add__swatch' + (i === 0 ? ' selected' : '');
      swatch.style.background = 'linear-gradient(135deg, ' + pair[0] + ', ' + pair[1] + ')';
      swatch.setAttribute('aria-label', 'Avatar colour ' + (i + 1));
      swatch.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      swatch.addEventListener('click', function () {
        selected = i;
        form.querySelectorAll('.profile-add__swatch').forEach(function (s) {
          const on = s === swatch;
          s.classList.toggle('selected', on);
          s.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
      swatches.appendChild(swatch);
    });
    form.appendChild(swatches);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'profile-add__submit';
    submit.textContent = 'Create';
    form.appendChild(submit);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = input.value.trim() || 'Profile';
      profiles.push({ id: uid(), name: name, color: ADD_COLORS[selected] });
      saveProfiles();
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        render(); /* close the form, back to the plain add card */
      }
    });

    card.textContent = '';
    card.appendChild(form);
    input.focus();
  }

  /* --- boot --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    container = document.getElementById('profiles');
    if (!container) {
      console.warn('profiles.js: #profiles element not found — bailing out.');
      return;
    }

    user = window.Auth ? Auth.getUser() : null;
    if (!user) return; /* auth.js already redirected to login.html */

    titleEl = document.getElementById('profiles-title');
    manageBtn = document.getElementById('manage-btn');
    doneBtn = document.getElementById('done-btn');
    signoutBtn = document.getElementById('signout-btn');

    profiles = loadProfiles();
    if (!profiles.length) {
      const name = (user.name || '').trim() || 'Profile';
      profiles = [{ id: uid(), name: name, color: PALETTE[0] }];
      saveProfiles();
    }

    container.addEventListener('click', onClick);

    if (manageBtn) {
      manageBtn.addEventListener('click', function () {
        manageMode = true;
        render();
      });
    }
    if (doneBtn) {
      doneBtn.addEventListener('click', function () {
        manageMode = false;
        render();
      });
    }
    if (signoutBtn) {
      signoutBtn.addEventListener('click', function () {
        Auth.signOut();
        location.replace('login.html');
      });
    }

    render();
  });
})();
