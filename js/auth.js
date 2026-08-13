/**
 * Netflix UI clone (educational demo) — shared auth store.
 * ------------------------------------------------------------------
 * Keeps the signed-in profile in localStorage (name, email, avatar),
 * gates browsing pages behind a login, and wires the account menu.
 */
(function () {
  'use strict';

  const KEY = 'netflix-demo-user';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function signIn(profile) {
    localStorage.setItem(KEY, JSON.stringify(profile));
  }

  function signOut() {
    localStorage.removeItem(KEY);
  }

  window.Auth = { getUser, signIn, signOut };

  const isLoginPage = /login\.html(\?.*)?$/.test(location.pathname);

  // Gate: every page except the login page requires a signed-in profile.
  if (!isLoginPage && !getUser()) {
    location.replace('login.html');
  }

  // Wire the account menu (avatar + dropdown) on browsing pages.
  if (!isLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('user-btn');
      const menu = document.getElementById('user-menu');
      if (!btn || !menu) return;

      const user = getUser() || {};
      if (user.avatar) {
        const img = document.createElement('img');
        img.src = user.avatar;
        img.alt = user.name || 'Account';
        img.addEventListener('error', () => {
          btn.textContent = initialOf(user);
        });
        btn.textContent = '';
        btn.appendChild(img);
      } else {
        btn.textContent = initialOf(user);
      }

      const nameEl = document.getElementById('user-menu-name');
      if (nameEl) nameEl.textContent = user.name || user.email || 'Signed in';

      btn.addEventListener('click', () => {
        const hidden = menu.hidden;
        menu.hidden = !hidden;
        btn.setAttribute('aria-expanded', String(hidden));
      });

      document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar__user')) {
          menu.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      const outBtn = document.getElementById('user-signout');
      if (outBtn) {
        outBtn.addEventListener('click', () => {
          signOut();
          location.replace('login.html');
        });
      }
    });
  }

  function initialOf(user) {
    const n = (user.name || user.email || 'A').trim();
    return n.charAt(0).toUpperCase();
  }
})();
