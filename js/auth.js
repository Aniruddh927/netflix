/**
 * Netflix UI clone (educational demo) — shared auth store.
 * ------------------------------------------------------------------
 * Keeps the signed-in profile in localStorage (name, email, avatar),
 * gates browsing pages behind a login, and wires the account menu.
 */
(function () {
  'use strict';

  const KEY = 'netflix-demo-user';
  const LOG_KEY = 'netflix-login-log';

  function addLog(entry) {
    try {
      const log = JSON.parse(localStorage.getItem(LOG_KEY)) || [];
      log.unshift(Object.assign({ t: new Date().toISOString() }, entry));
      localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 50)));
    } catch (e) {
      /* storage unavailable — ignore */
    }
  }

  window.LoginLog = {
    get() {
      try {
        return JSON.parse(localStorage.getItem(LOG_KEY)) || [];
      } catch (e) {
        return [];
      }
    },
    clear() {
      localStorage.removeItem(LOG_KEY);
    }
  };

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function signIn(profile, method) {
    localStorage.setItem(KEY, JSON.stringify(profile));
    addLog({ action: 'sign-in', method: method || 'unknown', name: profile.name, email: profile.email });
  }

  function signOut() {
    const user = getUser();
    localStorage.removeItem(KEY);
    addLog({ action: 'sign-out', method: '-', name: user && user.name, email: user && user.email });
  }

  window.Auth = { getUser, signIn, signOut };

  const isLoginPage = /login\.html(\?.*)?$/.test(location.pathname);
  const isProfilesPage = /profiles\.html(\?.*)?$/.test(location.pathname);

  /** Active profile for the signed-in user (set on the "Who's watching?" page). */
  function getActiveProfile() {
    const user = getUser();
    if (!user) return null;
    try {
      const suffix = (user.email || 'anon').toLowerCase();
      const profiles = JSON.parse(localStorage.getItem('netflix-profiles-' + suffix)) || [];
      const activeId = localStorage.getItem('netflix-active-profile-' + suffix);
      return profiles.find((p) => p.id === activeId) || null;
    } catch (e) {
      return null;
    }
  }
  window.Auth.getActiveProfile = getActiveProfile;

  // Gate: every page except login/profiles requires a signed-in profile.
  if (!isLoginPage && !isProfilesPage && !getUser()) {
    location.replace('login.html');
  }

  // Netflix flow: signed in but no profile chosen → "Who's watching?" first.
  if (!isLoginPage && !isProfilesPage && getUser() && !getActiveProfile()) {
    location.replace('profiles.html');
  }

  // Wire the account menu (avatar + dropdown) on browsing pages.
  if (!isLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('user-btn');
      const menu = document.getElementById('user-menu');
      if (!btn || !menu) return;

      const user = getUser() || {};
      const active = getActiveProfile();
      // With a chosen profile show the profile avatar; otherwise the account photo/initial.
      if (!active && user.avatar) {
        const img = document.createElement('img');
        img.src = user.avatar;
        img.alt = user.name || 'Account';
        img.addEventListener('error', () => {
          btn.textContent = initialOf(user);
        });
        btn.textContent = '';
        btn.appendChild(img);
      } else {
        btn.textContent = initialOf(active || user);
      }

      const nameEl = document.getElementById('user-menu-name');
      if (nameEl) nameEl.textContent = active ? active.name : (user.name || user.email || 'Signed in');

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
