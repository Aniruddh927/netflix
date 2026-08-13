# Cloneflix — Netflix-style UI clone

Cloneflix is a pure HTML/CSS/JavaScript educational demo that recreates the look and feel of a streaming-video interface. Every title, show, and genre on the site is fictional, and Cloneflix does not stream or play any actual video — it is a front-end exercise in layout, theming, and interactivity, built with no frameworks, no build tools, and no external libraries, fonts, images, or CDN resources.

## Run locally

Open `index.html` directly in a browser, or serve the folder with a static server:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Cloneflix is a static site and is deployed to GitHub Pages from the repo root via the included GitHub Actions workflow (`.github/workflows/pages.yml`). The workflow runs on every push to `main` (and can also be triggered manually), so pushing to GitHub is all that is needed to publish the site.

## Disclaimer

Cloneflix is an educational demo of a streaming UI. Not affiliated with, endorsed by, or connected to Netflix. All titles are fictional.
