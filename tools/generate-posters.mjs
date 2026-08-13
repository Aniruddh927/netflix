/**
 * Netflix UI clone (educational demo) — poster art generator.
 * ------------------------------------------------------------------
 * Generates procedurally-drawn SVG artwork for every catalog item:
 *   images/poster/<id>.svg   — 2:3 poster art (cards)
 *   images/backdrop/<id>.svg — 16:9 backdrop art (hero + modal)
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

function defs(g1, g2) {
  return `  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.18" r="0.85">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" role="img" aria-label="${esc(item.title)} poster">
${defs(g1, g2)}
  <g filter="url(#grain)">
    <rect width="400" height="600" fill="url(#bg)"/>
    <rect width="400" height="600" fill="url(#glow)"/>
    <g opacity="0.16" stroke="#ffffff" fill="none">
  ${decorations(rand, 400, 600)}
    </g>
    <text x="368" y="52" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="700" fill="#E50914" text-anchor="end">N</text>
    <rect width="400" height="600" fill="url(#fade)"/>
    <rect x="26" y="${barY}" width="36" height="4" fill="#E50914"/>
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="${esc(item.title)} backdrop">
${defs(g1, g2)}
  <g filter="url(#grain)">
    <rect width="800" height="450" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#glow)"/>
    <g opacity="0.16" stroke="#ffffff" fill="none">
  ${decorations(rand, 800, 450)}
    </g>
    <text x="752" y="52" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" fill="#E50914" text-anchor="end">N</text>
    <rect width="800" height="450" fill="url(#fade)"/>
    <rect x="48" y="${barY}" width="44" height="5" fill="#E50914"/>
  ${textBlock(lines, 48, baseline, size, leading)}
  </g>
</svg>`;
}

/* --- Generate ------------------------------------------------------------ */
const posterDir = join(root, 'images', 'poster');
const backdropDir = join(root, 'images', 'backdrop');
mkdirSync(posterDir, { recursive: true });
mkdirSync(backdropDir, { recursive: true });

let count = 0;
for (const item of catalog) {
  writeFileSync(join(posterDir, `${item.id}.svg`), posterSvg(item) + '\n');
  writeFileSync(join(backdropDir, `${item.id}.svg`), backdropSvg(item) + '\n');
  count++;
}
console.log(`Generated ${count} posters + ${count} backdrops under images/.`);
