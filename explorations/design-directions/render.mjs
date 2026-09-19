#!/usr/bin/env node
// Renders the AP2 design concepts: one static page per concept and mode. The pages use the
// public package (@tim3399/mosaik and its styles.css) and load the concept stylesheet unlayered
// after it. Concepts restyle the components' look for this exploration; component APIs and
// markup stay unchanged. Every concept shows the same content and states. Fonts are linked from
// Google Fonts (all SIL OFL) and never copied into the repository. Output goes to
// .tmp/design-directions/, which Git and the formatters ignore. Requires a built package:
// npm run build -w @tim3399/mosaik.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const here = dirname(fileURLToPath(import.meta.url));
export const outputDir = resolve(here, "..", "..", ".tmp", "design-directions");

export const concepts = [
  {
    id: "riso",
    name: "Riso",
    families: ["Bricolage Grotesque", "DM Mono"],
    fonts: "family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Mono:wght@400;500",
    summary:
      "Two-color risograph print: blue ink on warm paper, a misregistered fluorescent pink layer, halftone dots and paper grain.",
    motif: "Unseen Studio, Boon Global and Aspen: duotone print, halftone and dithered images.",
    signature:
      "Pink offset under buttons and panels that closes when pressed, halftone for disabled states, a highlighter behind errors, grain on the canvas.",
    type: "Bricolage Grotesque, DM Mono",
  },
  {
    id: "signal",
    name: "Signal",
    families: ["Chakra Petch", "JetBrains Mono"],
    fonts: "family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400..700",
    summary:
      "A control room at night: dot grid, signal green, monospaced labels, corner brackets and a glowing focus.",
    motif: "Cerebrium, Locomotive and basement studio: dark technical stages and glowing signals.",
    signature:
      "Corner brackets on controls and panels, status lights beside labels, hatched offline states, a dot grid with scanlines.",
    type: "Chakra Petch, JetBrains Mono",
  },
  {
    id: "plakat",
    name: "Plakat",
    families: ["Big Shoulders Display", "Archivo"],
    fonts: "family=Big+Shoulders+Display:wght@500..900&family=Archivo:wdth,wght@62..125,400..800",
    summary:
      "A street poster: condensed capitals, vermilion and sun yellow on paper, heavy black frames and zigzag bands.",
    motif: "MONOGRID, Maison AUGE and Malvah: oversized condensed type and op-art stripes.",
    signature:
      "Buttons that tilt like pasted posters, error messages as vermilion stickers, black title bands with a zigzag edge.",
    type: "Big Shoulders Display, Archivo",
  },
  {
    id: "feuilleton",
    name: "Feuilleton",
    families: ["Bodoni Moda", "Hanken Grotesk"],
    fonts:
      "family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Hanken+Grotesk:wght@400..700",
    summary:
      "A quiet magazine page: high-contrast serif, hairlines instead of boxes, underlined fields and one accent, oxblood by day and champagne at night.",
    motif: "ERA Costa del Sol, Raw Materials and Resn: didone headlines and gallery calm.",
    signature:
      "Italic serif labels, underline fields, spaced capitals on buttons, section numbers and double rules.",
    type: "Bodoni Moda, Hanken Grotesk",
  },
  {
    id: "mosaik",
    name: "Mosaik",
    families: ["Unbounded", "Onest"],
    fonts: "family=Unbounded:wght@400..800&family=Onest:wght@400..700",
    summary:
      "The name as the idea: colored tiles on a grout grid, keycap buttons with a real press and sunken fields.",
    motif: "NOHO, Léo Parpeix and Neutral Studio: color-block tiles and toy-like 3D objects.",
    signature:
      "Keycaps that travel when pressed, tile colors in panels and hero, a grout grid on the canvas, rounded wells for fields.",
    type: "Unbounded, Onest",
  },
];
export const modes = ["light", "dark"];

export const pageFile = (concept, mode) => `${concept.id}-${mode}.html`;

function state(name, caption, children, lang) {
  return h(
    "div",
    { className: "dd-state", "data-dd-state": name },
    h("p", { className: "dd-caption" }, caption),
    h("div", { className: "dd-state-body", lang }, ...children),
  );
}

function buttonPair(props = {}) {
  return [
    h(Button, { variant: "primary", ...props }, "Start download"),
    h(Button, props, "Cancel"),
  ];
}

function panel(title, note, states) {
  return h(
    "div",
    { className: "dd-panel" },
    h(
      "div",
      { className: "dd-panel-header" },
      h("h3", { className: "dd-panel-title" }, title),
      h("p", { className: "dd-note" }, note),
    ),
    h("div", { className: "dd-states" }, ...states),
  );
}

function hero(concept, mode, index) {
  const link = (href, label, current) =>
    h("a", { href, "aria-current": current ? "page" : undefined }, label);
  return h(
    "header",
    { className: "dd-hero" },
    h(
      "div",
      { className: "dd-hero-text" },
      h(
        "p",
        { className: "dd-kicker" },
        `mosaik · design concept ${index + 1} of ${concepts.length} · ${mode}`,
      ),
      h("h1", { className: "dd-title" }, concept.name),
      h("p", { className: "dd-summary" }, concept.summary),
      h(
        "nav",
        { className: "dd-nav", "aria-label": "Concepts" },
        ...concepts.map((other, otherIndex) =>
          link(pageFile(other, mode), `${otherIndex + 1} ${other.name}`, other === concept),
        ),
        ...modes.map((other) => link(pageFile(concept, other), other, other === mode)),
      ),
    ),
    h(
      "div",
      { className: "dd-hero-art", "aria-hidden": "true" },
      ...Array.from({ length: 9 }, () => h("span", null)),
    ),
  );
}

function intro(concept) {
  const fact = (term, text) => [h("dt", null, term), h("dd", null, text)];
  return h(
    "div",
    { className: "dd-intro" },
    h(
      "form",
      { className: "dd-panel dd-scenario", "aria-labelledby": "dd-scenario-title" },
      h("h2", { className: "dd-panel-title", id: "dd-scenario-title" }, "New download"),
      h(TextField, {
        className: "dd-field",
        label: "Video link",
        name: "link",
        defaultValue: "https://media.example.com/talks/design-systems.mp4",
        description: "Links to YouTube, Vimeo and direct video files work.",
      }),
      h(TextField, {
        className: "dd-field",
        label: "File name",
        name: "fileName",
        placeholder: "Uses the video title if empty",
      }),
      h(ColorField, {
        className: "dd-field",
        label: "Label color",
        name: "labelColor",
        defaultValue: "#0f766e",
        description: "Marks this download in the queue.",
      }),
      h(
        "div",
        { className: "dd-actions" },
        h(Button, { type: "submit", variant: "primary" }, "Start download"),
        h(Button, null, "Cancel"),
      ),
    ),
    h(
      "section",
      { className: "dd-panel dd-about", "aria-labelledby": "dd-about-title" },
      h("h2", { className: "dd-panel-title", id: "dd-about-title" }, "About this concept"),
      h(
        "dl",
        { className: "dd-facts" },
        ...fact("Motif", concept.motif),
        ...fact("Signature", concept.signature),
        ...fact("Type", `${concept.type} (SIL Open Font License, linked from Google Fonts)`),
      ),
    ),
  );
}

function states() {
  const longPath = "D:\\Medien\\Vorträge\\2026\\Designsysteme-und-Komponentenbibliotheken";
  return h(
    "section",
    { className: "dd-section", "aria-labelledby": "dd-states" },
    h("h2", { className: "dd-heading", id: "dd-states" }, "States"),
    h(
      "p",
      { className: "dd-note" },
      "Hover, pressed and focus are forced in the screenshots. In a browser, point at the buttons or move through the fields with Tab. Long texts are German, as in quiltor and mediagrab.",
    ),
    panel("Button", "Primary and secondary variant. Buttons have no error state.", [
      state("default", "Default", buttonPair()),
      state("hover", "Hover", buttonPair()),
      state("pressed", "Pressed", buttonPair()),
      state("focus", "Focus", buttonPair()),
      state("disabled", "Disabled", buttonPair({ disabled: true })),
      state(
        "long",
        "Long text",
        [
          h(
            Button,
            { variant: "primary" },
            "Alle markierten Downloads erneut in die Warteschlange stellen",
          ),
          h(Button, null, "Abbrechen und Einstellungen verwerfen"),
        ],
        "de",
      ),
    ]),
    panel("TextField", "The library has no hover style for fields yet.", [
      state("default", "Default", [
        h(TextField, {
          className: "dd-field",
          label: "File name",
          placeholder: "Uses the video title if empty",
          description: "Letters, numbers, spaces and hyphens.",
        }),
      ]),
      state("focus", "Focus", [
        h(TextField, {
          className: "dd-field",
          label: "Video link",
          defaultValue: "https://media.example.com/talk.mp4",
        }),
      ]),
      state("disabled", "Disabled", [
        h(TextField, {
          className: "dd-field",
          label: "Download folder",
          defaultValue: "D:\\Videos\\Talks",
          description: "Fixed while a download is running.",
          disabled: true,
        }),
      ]),
      state("error", "Error", [
        h(TextField, {
          className: "dd-field",
          label: "Video link",
          defaultValue: "media.example.com/talk.mp4",
          error: "Enter a complete link that starts with https://.",
        }),
      ]),
      state(
        "long",
        "Long text",
        [
          h(TextField, {
            className: "dd-field",
            label: "Speicherort für automatisch heruntergeladene Untertiteldateien",
            defaultValue: longPath,
            description:
              "Gilt für alle künftigen Downloads dieser Warteschlange, bis du ihn wieder änderst.",
            error:
              "Der Ordner existiert nicht oder ist schreibgeschützt. Wähle einen anderen Speicherort.",
          }),
        ],
        "de",
      ),
    ]),
    panel("ColorField", "No error style: invalid text returns to the last valid color on blur.", [
      state("default", "Default", [
        h(ColorField, {
          className: "dd-field",
          label: "Label color",
          defaultValue: "#0f766e",
          description: "Marks this download in the queue.",
        }),
      ]),
      state("focus", "Focus", [
        h(ColorField, { className: "dd-field", label: "Label color", defaultValue: "#0f766e" }),
      ]),
      state("disabled", "Disabled", [
        h(ColorField, {
          className: "dd-field",
          label: "Label color",
          defaultValue: "#0f766e",
          description: "Fixed while a download is running.",
          disabled: true,
        }),
      ]),
      state(
        "long",
        "Long text",
        [
          h(ColorField, {
            className: "dd-field",
            label: "Hervorhebungsfarbe für fehlgeschlagene Downloads in der Warteschlange",
            defaultValue: "#b91c1c",
            description:
              "Gilt für alle Einträge, deren letzter Versuch abgebrochen wurde oder fehlgeschlagen ist.",
          }),
        ],
        "de",
      ),
    ]),
  );
}

function documentHtml({ title, mode, concept, styles, body }) {
  const css = styles.map((style) => `<style>\n${style}\n</style>`).join("\n");
  const fonts = concept
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${concept.fonts.replaceAll("&", "&amp;")}&amp;display=swap">`
    : "";
  return `<!doctype html>
<html lang="en" data-mosaik-mode="${mode}"${concept ? ` data-concept="${concept.id}"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${fonts}
${css}
</head>
<body class="dd-body">${body}</body>
</html>
`;
}

export function renderPages(selection = concepts) {
  const libraryCss = readFileSync(
    fileURLToPath(import.meta.resolve("@tim3399/mosaik/styles.css")),
    "utf8",
  );
  const pageCss = readFileSync(join(here, "page.css"), "utf8");
  mkdirSync(outputDir, { recursive: true });
  const files = [];
  for (const concept of selection) {
    const index = concepts.indexOf(concept);
    const conceptCss = readFileSync(join(here, "concepts", `${concept.id}.css`), "utf8");
    for (const mode of modes) {
      const body = renderToStaticMarkup(
        h("main", { className: "dd-page" }, hero(concept, mode, index), intro(concept), states()),
      );
      const file = join(outputDir, pageFile(concept, mode));
      writeFileSync(
        file,
        documentHtml({
          title: `${index + 1} ${concept.name} · ${mode} – mosaik design concepts`,
          mode,
          concept,
          styles: [libraryCss, pageCss, conceptCss],
          body,
        }),
      );
      files.push(file);
    }
  }
  const index = renderToStaticMarkup(
    h(
      "main",
      { className: "dd-page" },
      h("h1", { className: "dd-title" }, "mosaik · AP2 design concepts"),
      h(
        "ul",
        { className: "dd-index" },
        ...concepts.flatMap((concept, conceptIndex) =>
          modes.map((mode) =>
            h(
              "li",
              null,
              h(
                "a",
                { href: pageFile(concept, mode) },
                `${conceptIndex + 1} ${concept.name} · ${mode}`,
              ),
            ),
          ),
        ),
      ),
    ),
  );
  writeFileSync(
    join(outputDir, "index.html"),
    documentHtml({
      title: "mosaik design concepts",
      mode: "light",
      styles: [libraryCss, pageCss],
      body: index,
    }),
  );
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = renderPages();
  console.log(`rendered ${files.length} pages to ${outputDir}`);
}
