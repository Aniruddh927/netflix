/**
 * Netflix UI clone (educational demo) — poster art generator.
 * ------------------------------------------------------------------
 * Generates procedurally-drawn SVG artwork for every catalog item:
 *   images/poster/<id>.svg   — 2:3 poster art (cards), 400x600
 *   images/backdrop/<id>.svg — 16:9 backdrop art (hero + modal), 800x450
 *   images/thumb/<id>.svg    — 16:9 thumbnail art (Trending / Top-10 row), 640x360
 *
 * Everything is derived from each title's own two-color gradient plus a
 * deterministic random seed — no external assets, no copyrighted imagery.
 *
 * Run from the repo root:  node tools/generate-posters.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// js/data.js assigns to `window`; give it a global shim, then read CATALOG.
globalThis.window = globalThis;
new Function(readFileSync(join(root, 'js', 'data.js'), 'utf8'))();
const catalog = globalThis.CATALOG;
if (!Array.isArray(catalog) || catalog.length === 0) {
  console.error('Could not load CATALOG from js/data.js');
  process.exit(1);
}

/* --- Deterministic pseudo-random from a string seed ---------------------- */
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wrap `title` into at most `maxLines` lines of at most `maxChars`. */
function wrapTitle(title, maxChars, maxLines) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines) break;
    } else {
      cur = test;
    }
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  return lines;
}

/**
 * Tiny hex mixer: parse #rrggbb and return the channel-wise average
 * (simple 50/50 blend) of two colors, so gradients get a soft middle stop.
 */
function mixHex(a, b) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const mix = (va, vb) => Math.round(((va + vb) / 2)).toString(16).padStart(2, '0');
  return `#${mix(pa >> 16, pb >> 16)}${mix((pa >> 8) & 0xff, (pb >> 8) & 0xff)}${mix(pa & 0xff, pb & 0xff)}`;
}

/** Decorative circles + a diagonal accent line, seeded per title. */
function decorations(rand, w, h) {
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const cx = Math.round(rand() * w);
    const cy = Math.round(rand() * h);
    const r = Math.round(40 + rand() * Math.min(w, h) * 0.35);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffffff" stroke-width="1.5"/>`);
  }
  const x1 = Math.round(rand() * w * 0.5);
  const y1 = Math.round(rand() * h);
  const x2 = x1 + Math.round(w * 0.6);
  const y2 = Math.max(0, y1 - Math.round(h * 0.8));
  parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width="1"/>`);
  return parts.join('\n  ');
}

/**
 * Seeded field of ~25 tiny white dots (r = 1-2, opacity 0.25) scattered
 * across the canvas — a subtle texture layer for posters and backdrops.
 */
function dotField(rand, w, h) {
  const parts = [];
  for (let i = 0; i < 25; i++) {
    const cx = Math.round(rand() * w);
    const cy = Math.round(rand() * h);
    const r = (1 + rand()).toFixed(2);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="0.25"/>`);
  }
  return parts.join('\n  ');
}

/** Title lines with a soft shadow, baseline-anchored bottom-left. */
function textBlock(lines, x, baseline, size, leading) {
  return lines
    .map((line, i) => {
      const y = baseline - (lines.length - 1 - i) * leading;
      return (
        `<text x="${x + 3}" y="${y + 3}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="700" fill="rgba(0,0,0,0.55)">${esc(line)}</text>\n  ` +
        `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="700" fill="#ffffff">${esc(line)}</text>`
      );
    })
    .join('\n  ');
}

/**
 * Small uppercase, letter-spaced genre caption (the item's first genre),
 * drawn above the title in muted white.
 */
function caption(genre, x, y, size) {
  const cap = String(genre || '').toUpperCase();
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="600" letter-spacing="2.5" fill="rgba(255,255,255,0.75)">${esc(cap)}</text>`;
}

/**
 * Shared defs. The bg gradient now has three stops (g1 -> blended mid -> g2)
 * so the artwork reads richer; the vignette darkens the corners only.
 */
function defs(g1, g2) {
  const mid = mixHex(g1, g2);
  return `  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${g1}"/><stop offset="0.5" stop-color="${mid}"/><stop offset="1" stop-color="${g2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.18" r="0.85">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.35"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.45" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>`;
}

function posterSvg(item) {
  const [g1, g2] = item.gradient;
  const rand = mulberry32(hashSeed(item.id + ':p'));
  const lines = wrapTitle(item.title, 14, 3);
  const size = 34;
  const leading = 40;
  const baseline = 600 - 44;
  const barY = baseline - lines.length * leading - 6;
  const capY = barY - 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" role="img" aria-label="${esc(item.title)} poster">
${defs(g1, g2)}
  <g filter="url(#grain)">
    <rect width="400" height="600" fill="url(#bg)"/>
    <rect width="400" height="600" fill="url(#glow)"/>
    <g opacity="0.16" stroke="#ffffff" fill="none">
  ${decorations(rand, 400, 600)}
    </g>
    <text x="368" y="52" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="700" fill="#E50914" text-anchor="end">N</text>
    <rect width="400" height="600" fill="url(#vignette)"/>
    <rect width="400" height="600" fill="url(#fade)"/>
  ${dotField(rand, 400, 600)}
    <rect x="26" y="${barY}" width="36" height="4" fill="#E50914"/>
  ${caption(item.genres[0], 26, capY, 13)}
  ${textBlock(lines, 26, baseline, size, leading)}
  </g>
</svg>`;
}

function backdropSvg(item) {
  const [g1, g2] = item.gradient;
  const rand = mulberry32(hashSeed(item.id + ':b'));
  const lines = wrapTitle(item.title, 24, 3);
  const size = 54;
  const leading = 64;
  const baseline = 450 - 62;
  const barY = baseline - lines.length * leading - 8;
  const capY = barY - 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="${esc(item.title)} backdrop">
${defs(g1, g2)}
  <g filter="url(#grain)">
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#glow)"/>
    <g opacity="0.16" stroke="#ffffff" fill="none">
  ${decorations(rand, 800, 450)}
    </g>
    <text x="752" y="52" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" fill="#E50914" text-anchor="end">N</text>
    <rect width="800" height="450" fill="url(#vignette)"/>
    <rect width="800" height="450" fill="url(#fade)"/>
  ${dotField(rand, 800, 450)}
    <rect x="48" y="${barY}" width="44" height="5" fill="#E50914"/>
  ${caption(item.genres[0], 48, capY, 13)}
  ${textBlock(lines, 48, baseline, size, leading)}
  </g>
</svg>`;
}

/**
 * 640x360 landscape thumbnail for the Trending / Top-10 row: 3-stop gradient,
 * radial sheen, 2-3 large decorative rings, a rotated translucent rectangle,
 * a red accent bar, and a big serif title (max 2 lines) bottom-left with a
 * small uppercase genre caption above it.
 */
function thumbSvg(item) {
  const [g1, g2] = item.gradient;
  const rand = mulberry32(hashSeed(item.id + ':t'));
  const lines = wrapTitle(item.title, 20, 2);
  const size = 40;
  const leading = 48;
  const baseline = 360 - 42;
  const barY = baseline - lines.length * leading - 6;
  const capY = barY - 8;

  // 3 large decorative rings (the thumbnail's own flavor of decorations()).
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const cx = Math.round(120 + rand() * 440);
    const cy = Math.round(30 + rand() * 300);
    const r = Math.round(50 + rand() * 130);
    rings.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.25"/>`);
  }
  // One rotated translucent rectangle for an angular, poster-like sweep.
  const rect = `<rect x="${Math.round(rand() * 200)}" y="${Math.round(rand() * 160)}" width="420" height="220" fill="#ffffff" opacity="0.07" transform="rotate(${Math.round(-14 + rand() * 28)} 320 180)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${esc(item.title)} thumbnail">
${defs(g1, g2)}
  <g filter="url(#grain)">
    <rect width="640" height="360" fill="url(#bg)"/>
    <rect width="640" height="360" fill="url(#glow)"/>
    ${rings.join('\n    ')}
    ${rect}
    <rect width="640" height="360" fill="url(#vignette)"/>
    <rect width="640" height="360" fill="url(#fade)"/>
    <rect x="28" y="${barY}" width="40" height="4" fill="#E50914"/>
  ${caption(item.genres[0], 28, capY, 13)}
  ${textBlock(lines, 28, baseline, size, leading)}
  </g>
</svg>`;
}

/* --- Generate ------------------------------------------------------------ */
const posterDir = join(root, 'images', 'poster');
const backdropDir = join(root, 'images', 'backdrop');
const thumbDir = join(root, 'images', 'thumb');
mkdirSync(posterDir, { recursive: true });
mkdirSync(backdropDir, { recursive: true });
mkdirSync(thumbDir, { recursive: true });

let count = 0;
for (const item of catalog) {
  writeFileSync(join(posterDir, `${item.id}.svg`), posterSvg(item) + '\n');
  writeFileSync(join(backdropDir, `${item.id}.svg`), backdropSvg(item) + '\n');
  writeFileSync(join(thumbDir, `${item.id}.svg`), thumbSvg(item) + '\n');
  count++;
}
console.log(`Generated ${count} posters + ${count} backdrops + ${count} thumbnails under images/.`);
