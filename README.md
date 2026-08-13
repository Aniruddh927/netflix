# Netflix UI Clone — educational demo

A pure HTML/CSS/JavaScript recreation of the Netflix browsing experience, built as a front-end learning exercise: dark themed browsing page with hero banner, genre rows (including "New & Popular"), hover cards, a working **My List / favourites** system, a detail modal with a demo trailer player, live search, a "Who's watching?" profiles page, a sign-in page with an activity log, and **real "Sign in with Google"** support. The catalog uses real, well-known movie and series titles (titles are not copyrightable) with original descriptions, but no video is streamed and no copyrighted poster images are used — all poster/backdrop/thumbnail artwork is procedurally generated SVG, so there is no copyrighted imagery and no external assets (other than Google's official Sign-In script).

Built with no frameworks, no build tools, and no external libraries or fonts.

## Pages

- `login.html` — sign-in page: demo email/password form, one-click demo user, optional Google Sign-In, and a login activity log for testers
- `index.html` — the browsing UI (redirects to `login.html` until signed in)

## Run locally

Open `index.html` directly in a browser (the demo email login works from `file://` too), or serve the folder:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Demo login

Any valid-looking email + a password of at least 4 characters signs you in, or use the **"Sign in as Demo User"** button. Profiles, the My List, and the activity log live only in your browser's `localStorage` — sign out from the avatar menu (top right).

## My List (favourites)

Hover any poster and click **＋** (top-right corner) — or use the **"＋ My List"** button inside a title's detail modal — to add/remove favourites. The My List row always sits at the top of the page, per signed-in user. The navbar's **My List** link scrolls to it.

## Real Google Sign-In (optional)

The Google button uses Google Identity Services and activates once a Client ID is configured:

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create a project, configure the **OAuth consent screen** (External; add your own email as a test user — no app review needed).
3. Create **Credentials → OAuth client ID → Web application**.
4. Add these **Authorized JavaScript origins**:
   - `https://aniruddh927.github.io` (live site)
   - `http://localhost:8000` (local testing)
5. Paste the Client ID into `js/config.js` (`googleClientId`) and push.

Without a Client ID the button is replaced by an explanatory note and the demo email login continues to work.

## Deployment

Static site deployed to GitHub Pages from the repo root via the included GitHub Actions workflow (`.github/workflows/pages.yml`). Pushing to `main` publishes automatically.

## Regenerating poster art

```sh
node tools/generate-posters.mjs
```

Reads `js/data.js` and regenerates `images/poster/*.svg` and `images/backdrop/*.svg`.

## Disclaimer

This is an educational, fan-made demo of the Netflix UI. Not affiliated with, endorsed by, or connected to Netflix. Movie and series titles are used for educational demonstration only; all artwork is original.
