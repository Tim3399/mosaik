#!/usr/bin/env node
// Renders full tool screens composed after the owner's reference sites, with the real package
// components inside. Each screen is a page of a small download tool, not a specimen sheet.
// Output: .tmp/design-directions/screens/ with HTML and screenshots (desktop first screen,
// desktop full page, 390 px phone). Fonts are linked from Google Fonts (SIL OFL), never copied.
// Usage: node screens.mjs [screen-id ...]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, "..", "..", ".tmp", "design-directions", "screens");
const html = (element) => renderToStaticMarkup(element);

/** Deterministic pseudo-random numbers, so every render draws the same graphics. */
function sequence(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function downloadForm({ primary = "Download starten", secondary = "Abbrechen" } = {}) {
  return [
    html(
      h(TextField, {
        className: "s-field",
        label: "Video-Link",
        name: "link",
        defaultValue: "https://media.example.com/talks/designsysteme.mp4",
        description: "YouTube, Vimeo und direkte Videodateien.",
      }),
    ),
    html(
      h(TextField, {
        className: "s-field",
        label: "Dateiname",
        name: "fileName",
        placeholder: "Leer lassen für den Videotitel",
      }),
    ),
    html(
      h(ColorField, {
        className: "s-field",
        label: "Labelfarbe",
        name: "labelColor",
        defaultValue: "#0f766e",
        pickerLabel: "Farbe wählen",
      }),
    ),
    `<div class="s-actions">${html(h(Button, { type: "submit", variant: "primary" }, primary))}${html(h(Button, null, secondary))}</div>`,
  ].join("\n");
}

/* A · Grundriss, after M3 Planungsgruppe ------------------------------------------------ */

function bars(count, filled, seed, className) {
  const random = sequence(seed);
  const items = Array.from({ length: count }, (_, index) => {
    const height = 18 + Math.round(random() * 82);
    const state = index < filled ? "done" : "open";
    return `<span data-state="${state}" style="height:${height}%"></span>`;
  });
  return `<div class="${className}" aria-hidden="true">${items.join("")}</div>`;
}

function grundriss() {
  const queue = [
    ["Interview Teil 2", "2"],
    ["Keynote 2026", "3"],
    ["Workshop – Barrierefreie Formulare", "4"],
    ["Podcast Folge 12", "5"],
    ["Trailer", "6"],
  ];
  return `
<div class="a-page">
  <header class="a-header">
    <a class="a-logo" href="#">mosaik Downloader</a>
    <nav class="a-nav" aria-label="Bereiche">
      <a href="#" aria-current="page">Downloads</a>
      <a href="#">Warteschlange</a>
      <a href="#">Verlauf</a>
      <a href="#">Einstellungen</a>
    </nav>
    <a class="a-lang" href="#">EN</a>
  </header>

  <main>
    <section class="a-hero" aria-labelledby="a-hero-title">
      <p class="a-hero-label">Ein Link,<br>drei Schritte.</p>
      <div class="a-hero-main">
        <h1 class="a-hero-title" id="a-hero-title">Laden.<br>Prüfen.<br>Ablegen.</h1>
        <p class="a-hero-sub">Kein Download geht verloren.</p>
      </div>
    </section>

    <section class="a-columns" aria-label="Übersicht">
      <form class="a-column a-form" aria-labelledby="a-new">
        <h2 class="a-column-title" id="a-new">Neuer Download</h2>
        ${downloadForm()}
      </form>
      <div class="a-column">
        <h2 class="a-column-title">Läuft gerade</h2>
        <p class="a-figure">64 %</p>
        ${bars(40, 26, 7, "a-bars")}
        <p class="a-text">Konferenz-Vortrag – Designsysteme.mp4<br>1,2 GB von 1,9 GB · 18 MB/s · noch 40 Sekunden</p>
        <a class="a-link" href="#">Warteschlange ansehen</a>
      </div>
      <div class="a-column">
        <h2 class="a-column-title">Ablage</h2>
        <p class="a-text">D:\\Medien\\Vorträge\\2026</p>
        <dl class="a-stats">
          <div><dt>Dateien</dt><dd>214</dd></div>
          <div><dt>Frei</dt><dd>38,4 GB</dd></div>
        </dl>
        <a class="a-link" href="#">Ordner öffnen</a>
      </div>
    </section>

    <section class="a-queue" aria-labelledby="a-queue-title">
      <div class="a-queue-label">
        <h2 class="a-column-title" id="a-queue-title">Warteschlange</h2>
        <a class="a-link" href="#">Alle Downloads</a>
      </div>
      <div class="a-tabs">
        <article class="a-tab" data-open>
          ${bars(56, 56, 3, "a-tab-bars")}
          <h3 class="a-tab-title">Konferenz-Vortrag – Designsysteme</h3>
          <p class="a-text">Mitschnitt vom 12. September, 1080p, deutsche Untertitel. Wird nach dem Laden geprüft und in „Vorträge 2026“ abgelegt.</p>
          <a class="a-link" href="#">Details</a>
          <span class="a-tab-number">1</span>
        </article>
        ${queue
          .map(
            ([title, number]) => `<article class="a-tab">
          <h3 class="a-tab-title">${title}</h3>
          <span class="a-tab-number">${number}</span>
        </article>`,
          )
          .join("\n")}
      </div>
    </section>

    <section class="a-statement" aria-label="Haltung">
      <p><span>Jeder Download ist ein Vorgang –</span> geprüft, geladen und abgelegt.</p>
    </section>
  </main>

  <footer class="a-footer" data-mosaik-mode="dark">
    <p class="a-footer-note">Ein Werkzeug aus mosaik-Bausteinen. Jede Komponente kommt aus der Bibliothek, nur die Anordnung ist Teil dieser Seite.</p>
    <p class="a-wordmark">mosaik Downloader</p>
  </footer>
</div>`;
}

/* B · Kern, after DAQ Consulting and Boon Global ----------------------------------------- */

/** A dark liquid-chrome surface: fractal noise lit by a distant light, as in DAQ's hero. */
function liquid(id) {
  // Blurring after the lighting step removes the contour steps of the 8-bit noise; the surface
  // extends past the visible area so the lighting has no dark seam at the edges.
  return `<svg class="b-liquid" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
  <filter id="${id}" x="-80" y="-80" width="1600" height="1060" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.0021 0.0041" numOctaves="2" seed="11" result="noise"/>
    <feGaussianBlur in="noise" stdDeviation="9" edgeMode="duplicate" result="soft"/>
    <feSpecularLighting in="soft" surfaceScale="44" specularConstant="1.3" specularExponent="32" lighting-color="#c9d4e2" result="light">
      <feDistantLight azimuth="228" elevation="40"/>
    </feSpecularLighting>
    <feGaussianBlur in="light" stdDeviation="1.4" result="smooth"/>
    <feComponentTransfer in="smooth" result="dim">
      <feFuncR type="linear" slope="0.8"/><feFuncG type="linear" slope="0.86"/><feFuncB type="linear" slope="0.98"/>
    </feComponentTransfer>
    <feComposite in="dim" in2="SourceGraphic" operator="arithmetic" k2="1" k3="1"/>
  </filter>
  <rect x="-80" y="-80" width="1600" height="1060" fill="#040506" filter="url(#${id})"/>
</svg>`;
}

/** A particle field with amber at the center and gray at the edges, as in Boon's sections. */
function particles(width, height, count, seed) {
  const random = sequence(seed);
  const dots = [];
  for (let index = 0; index < count; index++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * 0.62;
    const x = 0.5 + Math.cos(angle) * radius * (width / height) * 0.62;
    const y = 0.5 + Math.sin(angle) * radius;
    if (x < 0 || x > 1 || y < 0 || y > 1) continue;
    const warm = radius < 0.34 + random() * 0.12;
    const size = (warm ? 1.2 : 0.9) + random() * (warm ? 3.4 : 2.6);
    const color = warm
      ? random() > 0.5
        ? "#e0541c"
        : "#b8401a"
      : random() > 0.5
        ? "#2c2a28"
        : "#3b3834";
    dots.push(
      `<circle cx="${(x * width).toFixed(1)}" cy="${(y * height).toFixed(1)}" r="${size.toFixed(1)}" fill="${color}"/>`,
    );
  }
  return `<svg class="b-particles" aria-hidden="true" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">${dots.join("")}</svg>`;
}

function dotProgress(total, done) {
  const dots = Array.from(
    { length: total },
    (_, index) => `<span data-state="${index < done ? "done" : "open"}"></span>`,
  );
  return `<div class="b-dots" aria-hidden="true">${dots.join("")}</div>`;
}

function kern() {
  const rows = [
    ["01", "Konferenz-Vortrag – Designsysteme", "1,2 / 1,9 GB · 18 MB/S", 30, "Lädt"],
    ["02", "Interview Teil 2", "0,4 / 0,6 GB · 11 MB/S", 26, "Lädt"],
    ["03", "Workshop – Barrierefreie Formulare", "WARTET · 2,4 GB", 0, "Wartet"],
  ];
  return `
<main class="b-page">
  <section class="b-hero" aria-labelledby="b-title">
    ${liquid("b-liquid-filter")}
    <div class="b-columns" aria-hidden="true"></div>
    <header class="b-header">
      <a class="b-logo" href="#"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 25 L14 4 L25 25 Z M8.5 25 L14 14 L19.5 25" fill="none" stroke="currentColor" stroke-width="1.2"/></svg><span>MOSAIK</span></a>
      <nav class="b-nav" aria-label="Bereiche">
        <a href="#" aria-current="page">Downloads</a>
        <a href="#">Warteschlange</a>
        <a href="#">Verlauf</a>
        <a href="#">Einstellungen</a>
      </nav>
      <div class="b-header-end">
      <div class="b-signal" aria-hidden="true"><span>SIGNAL</span><svg viewBox="0 0 90 14"><path d="M0 7 C 8 1, 14 13, 22 7 S 36 1, 44 7 S 58 13, 66 7 S 80 1, 90 7" fill="none" stroke="currentColor" stroke-width="1"/><path d="M0 8 C 10 3, 16 12, 24 8 S 38 4, 46 8 S 60 12, 70 8 S 82 4, 90 8" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1"/></svg><span>AN</span></div>
      ${html(h(Button, { variant: "primary" }, "Neuer Download"))}
      </div>
    </header>
    <div class="b-hero-text">
      <h1 class="b-title" id="b-title"><span class="b-thin">Wir laden</span><span class="b-heavy">alles.</span></h1>
      <p class="b-mono b-lead">Video-Links von YouTube, Vimeo und direkten Dateien. Wir prüfen, laden und legen sie dort ab, wo du sie wiederfindest.</p>
      ${html(h(Button, { className: "b-ghost" }, "Warteschlange öffnen"))}
    </div>
    <form class="b-panel" aria-labelledby="b-panel-title">
      <div class="b-panel-head">
        <h2 class="b-panel-title" id="b-panel-title">Neuer Download <span>Pipeline</span></h2>
        <p class="b-mono b-tags"><span>Quelle</span><span>Prüfung</span><span>Ziel</span></p>
      </div>
      ${downloadForm()}
    </form>
    <p class="b-mono b-scroll" aria-hidden="true">Scroll für mehr</p>
  </section>

  <section class="b-queue" aria-labelledby="b-queue-title">
    <p class="b-mono b-index">01 / Warteschlange</p>
    <h2 class="b-section-title" id="b-queue-title">Die Warteschlange.</h2>
    <ol class="b-rows">
      ${rows
        .map(
          ([index, title, meta, done, state]) => `<li class="b-row">
        <span class="b-mono b-row-index">${index}</span>
        <span class="b-row-title">${title}</span>
        ${dotProgress(40, done)}
        <span class="b-mono b-row-meta">${meta}</span>
        <span class="b-mono b-row-state" data-state="${state}">${state}</span>
      </li>`,
        )
        .join("\n")}
    </ol>
  </section>

  <section class="b-field" aria-labelledby="b-field-title">
    ${particles(1440, 760, 1500, 5)}
    <div class="b-field-text">
      <h2 class="b-field-title" id="b-field-title">Jeder Link bekommt<br><em>einen festen Ort.</em></h2>
      ${html(h(Button, { className: "b-ghost" }, "Ablage ansehen"))}
    </div>
    <aside class="b-note">Geprüft wird vor dem Laden: Format, Größe und Zielordner. Nichts landet irgendwo.</aside>
  </section>
</main>`;
}

/* C · Orbit, after Orchid Security and Cyber Prime --------------------------------------- */

const icons = {
  link: `<path d="M13 19 L19 13" stroke-width="3.4" stroke-linecap="round"/><rect x="6" y="15" width="12" height="12" rx="6" fill="none" stroke-width="3.4" transform="rotate(-45 12 21)"/><rect x="14" y="5" width="12" height="12" rx="6" fill="none" stroke-width="3.4" transform="rotate(-45 20 11)" data-accent/>`,
  queue: `<rect x="6" y="8" width="20" height="4" rx="1"/><rect x="6" y="15" width="14" height="4" rx="1" data-accent/><rect x="6" y="22" width="18" height="4" rx="1"/>`,
  folder: `<path d="M5 10 h8 l3 3 h11 v12 h-22 z"/><rect x="5" y="16" width="22" height="3" data-accent/>`,
  clock: `<circle cx="16" cy="16" r="10" fill="none" stroke-width="3.4"/><path d="M16 10 v6 l4 3" fill="none" stroke-width="3.4" stroke-linecap="round" data-accent/>`,
  sliders: `<rect x="6" y="10" width="20" height="3" rx="1.5"/><rect x="6" y="20" width="20" height="3" rx="1.5"/><circle cx="12" cy="11.5" r="3.5" data-accent/><circle cx="21" cy="21.5" r="3.5"/>`,
};

function icon(name) {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${icons[name]}</svg>`;
}

function orbit() {
  const apps = [
    ["link", "Neu.link"],
    ["queue", "Warteschlange.log"],
    ["folder", "Ablage.dir"],
    ["clock", "Verlauf.txt"],
    ["sliders", "Einstellungen.ini"],
  ];
  const queue = [
    ["Konferenz-Vortrag – Designsysteme", "Lädt", "active", 64, "1,9 GB"],
    ["Interview Teil 2", "Lädt", "active", 71, "0,6 GB"],
    ["Keynote 2026", "Fertig", "done", 100, "2,1 GB"],
    ["Workshop – Barrierefreie Formulare", "Wartet", "waiting", 0, "2,4 GB"],
    ["Trailer", "Fehler", "error", 12, "0,1 GB"],
  ];
  return `
<div class="c-page">
  <header class="c-header">
    <a class="c-logo" href="#"><span class="c-logo-mark" aria-hidden="true"></span>mosaik</a>
    <nav class="c-nav" aria-label="Bereiche">
      <a href="#" aria-current="page">Downloads</a>
      <a href="#">Warteschlange</a>
      <a href="#">Verlauf</a>
      <a href="#">Einstellungen</a>
    </nav>
    <div class="c-header-end">
      ${html(h(Button, { variant: "primary" }, "Anmelden"))}
      ${html(h(Button, null, "Neuer Download"))}
    </div>
  </header>

  <main>
  <section class="c-hero" aria-labelledby="c-title">
    <p class="c-chip">Warum mosaik Downloader</p>
    <h1 class="c-title" id="c-title">Jeder Link,<br>sicher abgelegt.</h1>
    <p class="c-lead">Füge einen Link ein, wir prüfen Format und Ziel, laden im Hintergrund und legen die Datei dort ab, wo du sie suchst. Ohne Umwege.</p>
    <div class="c-hero-actions">
      ${html(h(Button, { variant: "primary" }, "Download starten"))}
      ${html(h(Button, null, "So funktioniert es"))}
    </div>
  </section>

  <section class="c-desktop" aria-label="Arbeitsfläche">
    <p class="c-system"><span class="c-online">System online</span><span>13:52</span><span>2 aktiv · 1 wartet</span></p>
    <ul class="c-apps">
      ${apps.map(([name, label]) => `<li class="c-app"><span class="c-app-tile">${icon(name)}</span><span class="c-app-label">${label}</span></li>`).join("\n")}
    </ul>
    <form class="c-window c-window-form" aria-labelledby="c-form-title">
      <div class="c-window-bar"><span class="c-window-title" id="c-form-title">Neuer_Download.exe</span><span class="c-window-controls" aria-hidden="true"><i></i><i></i><i></i></span></div>
      <div class="c-window-body">
        ${downloadForm()}
      </div>
    </form>
    <section class="c-window c-window-queue" aria-labelledby="c-queue-title">
      <div class="c-window-bar"><span class="c-window-title" id="c-queue-title">Warteschlange</span><span class="c-window-meta">Aktualisiert vor 2 Sekunden</span></div>
      <table class="c-table">
        <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Fortschritt</th><th scope="col">Größe</th></tr></thead>
        <tbody>
          ${queue
            .map(
              ([title, status, tone, progress, size]) => `<tr>
            <td>${title}</td>
            <td><span class="c-status" data-tone="${tone}">${status}</span></td>
            <td><span class="c-progress" style="--c-progress:${progress}%"><span></span></span></td>
            <td class="c-size">${size}</td>
          </tr>`,
            )
            .join("\n")}
        </tbody>
      </table>
    </section>
    <div class="c-toast" role="status">
      <p>Download gestartet.<br>Konferenz-Vortrag – Designsysteme wird geladen.</p>
      <span class="c-toast-hint">Tippen zum Schließen</span>
    </div>
    <nav class="c-dock" aria-label="Dock">
      ${apps.map(([name, label]) => `<a class="c-dock-item" href="#" aria-label="${label}">${icon(name)}</a>`).join("\n")}
    </nav>
  </section>
  </main>
</div>`;
}

export const screens = [
  {
    id: "grundriss",
    title: "A · Grundriss",
    mode: "light",
    direction: "grundriss",
    families: ["Inter Tight", "Inter"],
    fonts: "family=Inter+Tight:wght@400..800&family=Inter:opsz,wght@14..32,400..700",
    body: grundriss,
  },
  {
    id: "kern",
    title: "B · Kern",
    mode: "dark",
    direction: "kern",
    families: ["Inter", "Geist Mono"],
    fonts: "family=Inter:opsz,wght@14..32,100..900&family=Geist+Mono:wght@400..600",
    body: kern,
  },
  {
    id: "orbit",
    title: "C · Orbit",
    mode: "dark",
    direction: "orbit",
    families: ["Geist", "Geist Mono"],
    fonts: "family=Geist:wght@300..700&family=Geist+Mono:wght@400..600",
    body: orbit,
  },
];

function documentHtml(screen) {
  const libraryCss = readFileSync(
    fileURLToPath(import.meta.resolve("@tim3399/mosaik/styles.css")),
    "utf8",
  );
  const directionCss = readFileSync(join(here, "directions", `${screen.direction}.css`), "utf8");
  const screenCss = readFileSync(join(here, "screens", `${screen.id}.css`), "utf8");
  return `<!doctype html>
<html lang="de" data-mosaik-mode="${screen.mode}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${screen.title} – mosaik screens</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${screen.fonts.replaceAll("&", "&amp;")}&amp;display=swap">
<style>\n${libraryCss}\n</style>
<style>\n${directionCss}\n</style>
<style>\n${screenCss}\n</style>
</head>
<body class="s-body">${screen.body()}</body>
</html>
`;
}

async function capture(browser, screen, file) {
  const url = pathToFileURL(file).href;
  const shots = [
    { name: "desktop", viewport: { width: 1440, height: 900 }, scale: 1, fullPage: false },
    { name: "desktop-full", viewport: { width: 1440, height: 900 }, scale: 1, fullPage: true },
    { name: "phone", viewport: { width: 390, height: 844 }, scale: 2, fullPage: true, touch: true },
  ];
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.scale,
      isMobile: Boolean(shot.touch),
      hasTouch: Boolean(shot.touch),
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(url);
    const missing = await page.evaluate(async (families) => {
      const absent = [];
      for (const family of families) {
        if ((await document.fonts.load(`16px "${family}"`, "Aa")).length === 0) absent.push(family);
      }
      await document.fonts.ready;
      return absent;
    }, screen.families);
    if (missing.length > 0)
      throw new Error(`${screen.id}: fonts not loaded: ${missing.join(", ")}`);
    const path = join(outputDir, `${screen.id}-${shot.name}.png`);
    if (shot.fullPage) {
      // A fullPage screenshot drops touch emulation in Chromium; grow the viewport instead.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: shot.viewport.width, height });
      await page.screenshot({ path });
    } else {
      await page.screenshot({ path });
    }
    await context.close();
    console.log(`captured ${path}`);
  }
}

const selected = process.argv.slice(2);
const chosen = selected.length > 0 ? screens.filter((s) => selected.includes(s.id)) : screens;
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const screen of chosen) {
    const file = join(outputDir, `${screen.id}.html`);
    writeFileSync(file, documentHtml(screen));
    await capture(browser, screen, file);
  }
} finally {
  await browser.close();
}
