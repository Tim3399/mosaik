#!/usr/bin/env node
// Renders the AP2 design checkpoint: one static page per design direction and mode. The pages
// use only the public package (@tim3399/mosaik and its styles.css) plus the direction's token
// values, loaded unlayered after the library stylesheet. Every direction shows the same
// content and states. Output goes to .tmp/design-directions/, which Git and the formatters
// ignore. Requires a built package: npm run build -w @tim3399/mosaik.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const here = dirname(fileURLToPath(import.meta.url));
export const outputDir = resolve(here, "..", "..", ".tmp", "design-directions");

export const directions = [
  {
    id: "precise",
    letter: "A",
    name: "Precise",
    summary:
      "Dense and crisp for frequent work: cool neutrals, hairline borders, small radii, an ink accent and 36 px controls.",
  },
  {
    id: "soft",
    letter: "B",
    name: "Soft",
    summary:
      "Open and calm for occasional use: warm neutrals, tonal layers instead of lines, rounded shapes, a blue accent and 44 px controls.",
  },
  {
    id: "bold",
    letter: "C",
    name: "Bold",
    summary:
      "Graphic and unambiguous: pure neutrals, flat surfaces separated by lines, 2 px outlines, square corners, bold labels and 44 px controls.",
  },
];
export const modes = ["light", "dark"];

export const pageFile = (direction, mode) => `${direction.id}-${mode}.html`;

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

function scenario() {
  return h(
    "section",
    { className: "dd-section", "aria-labelledby": "dd-scenario" },
    h("h2", { className: "dd-heading", id: "dd-scenario" }, "Scenario"),
    h("p", { className: "dd-note" }, "A small form as a download tool would use it."),
    h(
      "form",
      { className: "dd-panel dd-scenario", "aria-labelledby": "dd-scenario-title" },
      h("h3", { className: "dd-panel-title", id: "dd-scenario-title" }, "New download"),
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
  );
}

function states() {
  const longLink = "D:\\Medien\\Vorträge\\2026\\Designsysteme-und-Komponentenbibliotheken";
  return h(
    "section",
    { className: "dd-section", "aria-labelledby": "dd-states" },
    h("h2", { className: "dd-heading", id: "dd-states" }, "States"),
    h(
      "p",
      { className: "dd-note" },
      "Hover, pressed and focus are forced in the screenshots. In a browser, point at the buttons or move to the fields with Tab. Long texts are German, as in quiltor and mediagrab.",
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
    panel(
      "TextField",
      "Fields have no hover or pressed style yet, so those states look like Default.",
      [
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
              defaultValue: longLink,
              description:
                "Gilt für alle künftigen Downloads dieser Warteschlange, bis du ihn wieder änderst.",
              error:
                "Der Ordner existiert nicht oder ist schreibgeschützt. Wähle einen anderen Speicherort.",
            }),
          ],
          "de",
        ),
      ],
    ),
    panel(
      "ColorField",
      "No hover, pressed or error style: invalid text returns to the last valid color on blur.",
      [
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
      ],
    ),
  );
}

function header(direction, mode) {
  const link = (href, label, current) =>
    h("a", { href, "aria-current": current ? "page" : undefined }, label);
  return h(
    "header",
    { className: "dd-header" },
    h(
      "p",
      { className: "dd-kicker" },
      "mosaik · AP2 design checkpoint · exploration, not part of the library",
    ),
    h("h1", { className: "dd-title" }, `${direction.letter} · ${direction.name} · ${mode}`),
    h("p", { className: "dd-summary" }, direction.summary),
    h(
      "nav",
      { className: "dd-nav", "aria-label": "Specimen pages" },
      h(
        "div",
        { className: "dd-nav-group" },
        ...directions.map((other) =>
          link(pageFile(other, mode), `${other.letter} · ${other.name}`, other === direction),
        ),
      ),
      h(
        "div",
        { className: "dd-nav-group" },
        ...modes.map((other) => link(pageFile(direction, other), other, other === mode)),
      ),
      link("index.html", "All pages", false),
    ),
  );
}

function documentHtml({ title, mode, styles, body }) {
  const css = styles.map((style) => `<style>\n${style}\n</style>`).join("\n");
  return `<!doctype html>
<html lang="en" data-mosaik-mode="${mode}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${css}
</head>
<body class="dd-body">${body}</body>
</html>
`;
}

export function renderPages() {
  const libraryCss = readFileSync(
    fileURLToPath(import.meta.resolve("@tim3399/mosaik/styles.css")),
    "utf8",
  );
  const pageCss = readFileSync(join(here, "page.css"), "utf8");
  mkdirSync(outputDir, { recursive: true });
  const files = [];
  for (const direction of directions) {
    const tokensCss = readFileSync(join(here, "directions", `${direction.id}.css`), "utf8");
    for (const mode of modes) {
      const body = renderToStaticMarkup(
        h("main", { className: "dd-page" }, header(direction, mode), scenario(), states()),
      );
      const file = join(outputDir, pageFile(direction, mode));
      writeFileSync(
        file,
        documentHtml({
          title: `${direction.letter} · ${direction.name} · ${mode} – mosaik design checkpoint`,
          mode,
          styles: [libraryCss, tokensCss, pageCss],
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
      h("h1", { className: "dd-title" }, "mosaik · AP2 design checkpoint"),
      h(
        "ul",
        { className: "dd-index" },
        ...directions.flatMap((direction) =>
          modes.map((mode) =>
            h(
              "li",
              null,
              h(
                "a",
                { href: pageFile(direction, mode) },
                `${direction.letter} · ${direction.name} · ${mode}`,
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
      title: "mosaik design checkpoint",
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
