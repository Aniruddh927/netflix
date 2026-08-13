/**
 * Netflix UI clone (educational demo) — login page logic.
 * ------------------------------------------------------------------
 * Two sign-in paths:
 *   1. Demo email/password form — any valid-looking email + password
 *      (min 4 chars) signs you in with a name derived from the email.
 *   2. Real "Sign in with Google" via Google Identity Services —
 *      active only when js/config.js has a Google OAuth Client ID.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const err = document.getElementById('login-error');
    const googleSlot = document.getElementById('google-btn');
    if (!form || !email || !password || !err || !googleSlot) return;

    /* --- 1. Demo email/password login ---------------------------------- */
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const em = email.value.trim();
      const pw = password.value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) || pw.length < 4) {
        err.textContent = 'Please enter a valid email and a password (min 4 characters).';
        return;
      }
      const name = em
        .split('@')[0]
        .replace(/[._\-+]+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      Auth.signIn({ name: name || 'Viewer', email: em, avatar: null });
      location.replace('index.html');
    });

    /* --- 2. Google Sign-In (real, if configured) ------------------------ */
    const clientId = window.APP_CONFIG && APP_CONFIG.googleClientId;

    function showDisabledNote(message) {
      googleSlot.hidden = true;
      const note = document.createElement('p');
      note.className = 'login__note';
      note.textContent = message;
      googleSlot.insertAdjacentElement('afterend', note);
    }

    if (!clientId) {
      showDisabledNote(
        'Sign in with Google is disabled until a Google OAuth Client ID is added to js/config.js (see README).'
      );
      return;
    }

    if (!window.google || !google.accounts) {
      showDisabledNote('Google Sign-In script failed to load — use the email form above.');
      return;
    }

    function onCredential(resp) {
      try {
        const payload = decodeJwt(resp.credential);
        Auth.signIn({
          name: payload.name,
          email: payload.email,
          avatar: payload.picture || null
        });
        location.replace('index.html');
      } catch (e) {
        err.textContent = 'Google sign-in failed. Please use the email form.';
      }
    }

    google.accounts.id.initialize({ client_id: clientId, callback: onCredential });
    google.accounts.id.renderButton(googleSlot, {
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: 300
    });
  });

  /** Decode the JWT payload Google returns (no verification — demo only). */
  function decodeJwt(token) {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = part.length % 4 === 0 ? '' : '='.repeat(4 - (part.length % 4));
    const bin = atob(part + pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
})();
