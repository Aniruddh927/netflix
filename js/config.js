/**
 * Netflix UI clone (educational demo) — site configuration.
 * ------------------------------------------------------------------
 * Google Sign-In is real once a Google OAuth Client ID is provided:
 *
 *   1. Go to https://console.cloud.google.com/apis/credentials
 *   2. Create a project → "OAuth consent screen" → External → add your
 *      own email as a test user (no app review needed for test mode).
 *   3. Create Credentials → "OAuth client ID" → Web application.
 *   4. Under "Authorized JavaScript origins" add:
 *        https://aniruddh927.github.io
 *        http://localhost:8000        (only if testing locally)
 *   5. Paste the Client ID below (it ends with .apps.googleusercontent.com)
 *      and push — the "Sign in with Google" button activates.
 *
 * Leave the string empty to keep the demo email login only.
 */
window.APP_CONFIG = {
  googleClientId: "209261891911-b0g5rdmq0v988bl5udl114jqjt3n541j.apps.googleusercontent.com"
};
