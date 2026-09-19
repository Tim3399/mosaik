#!/usr/bin/env node
// Renders the AP2 design directions: one static page per direction and mode. The pages use the
// public package (@tim3399/mosaik and its styles.css) and load the direction stylesheet
// unlayered after it. Directions restyle the components' look for this exploration; component
// APIs and markup stay unchanged. Every direction shows the same content and states. Fonts are
// linked from Google Fonts (all SIL OFL) and never copied into the repository. Output goes to
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
    id: "grundriss",
    letter: "A",
    name: "Grundriss",
    families: ["Inter Tight", "Inter"],
    fonts: "family=Inter+Tight:wght@400..800&family=Inter:opsz,wght@14..32,400..700",
    summary:
      "Swiss precision: charcoal on white, white on charcoal at night, gray for what can wait, rules instead of boxes, square controls and one arrow.",
    references: "M3 Planungsgruppe",
    taken:
      "Label column beside the content, headlines in charcoal and gray, a rule under every section title, underlined text actions, the charcoal footer as dark mode.",
    signature:
      "Numbered sections, primary buttons with an arrow, secondary actions as underlined text, focus as a heavier frame.",
    type: "Inter Tight, Inter",
  },
  {
    id: "kern",
    letter: "B",
    name: "Kern",
    families: ["Inter", "Geist Mono"],
    fonts: "family=Inter:opsz,wght@14..32,100..900&family=Geist+Mono:wght@400..600",
    summary:
      "A black stage with visible columns, bone paper by day: thin and heavy type in one line, monospaced micro labels and a single amber signal.",
    references: "DAQ Consulting, Boon Global",
    taken:
      "Weight contrast in headlines and faint column lines (DAQ), bone type on black and the amber highlight (Boon), mono labels and arrow buttons (both).",
    signature:
      "Column grid on the canvas, mono labels, hairline buttons with an arrow, amber only for focus and emphasis.",
    type: "Inter, Geist Mono",
  },
  {
    id: "orbit",
    letter: "C",
    name: "Orbit",
    families: ["Geist", "Geist Mono"],
    fonts: "family=Geist:wght@300..700&family=Geist+Mono:wght@400..600",
    summary:
      "Deep indigo at night, pale lavender by day, lit by a soft violet: pill buttons, calm cards with one large rounded corner and a status dot.",
    references: "Orchid Security, Cyber Prime",
    taken:
      "Indigo light, violet pills and the light secondary pill (Orchid), the single large corner of the dialog and mono status labels (Cyber Prime).",
    signature:
      "Pills for actions, one large corner on surfaces, a violet focus halo, a status dot in the kicker.",
    type: "Geist, Geist Mono",
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

/** A numbered section: label column (number, title, note) beside the content. */
function block(number, title, note, content, id) {
  return h(
    "section",
    { className: "dd-block", "aria-labelledby": id },
    h(
      "div",
      { className: "dd-block-label" },
      h("p", { className: "dd-number" }, number),
      h("h2", { className: "dd-block-title", id }, title),
      note ? h("p", { className: "dd-note" }, note) : null,
    ),
    h("div", { className: "dd-block-body" }, ...content),
  );
}

function hero(concept, mode) {
  const link = (href, label, current) =>
    h("a", { href, "aria-current": current ? "page" : undefined }, label);
  return h(
    "header",
    { className: "dd-hero" },
    h(
      "div",
      { className: "dd-hero-meta" },
      h(
        "p",
        { className: "dd-kicker" },
        `mosaik · direction ${concept.letter} of ${concepts.length} · ${mode}`,
      ),
      h(
        "nav",
        { className: "dd-nav", "aria-label": "Directions" },
        ...concepts.map((other) =>
          link(pageFile(other, mode), `${other.letter} ${other.name}`, other === concept),
        ),
        ...modes.map((other) => link(pageFile(concept, other), other, other === mode)),
      ),
    ),
    h(
      "div",
      { className: "dd-hero-main" },
      h(
        "h1",
        { className: "dd-title" },
        h("span", { className: "dd-title-quiet" }, "mosaik "),
        h(
          "span",
          { className: "dd-title-loud" },
          concept.name,
          h("span", { className: "dd-title-mark" }, "."),
        ),
      ),
      h("p", { className: "dd-summary" }, concept.summary),
    ),
    h(
      "div",
      { className: "dd-hero-art", "aria-hidden": "true" },
      ...Array.from({ length: 12 }, () => h("span", null)),
    ),
  );
}

function scenario() {
  return h(
    "form",
    { className: "dd-scenario", "aria-labelledby": "dd-scenario-title" },
    h("h3", { className: "dd-form-title", id: "dd-scenario-title" }, "New download"),
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
  );
}

function facts(concept) {
  const fact = (term, text) =>
    h("div", { className: "dd-fact" }, h("dt", null, term), h("dd", null, text));
  return h(
    "dl",
    { className: "dd-facts" },
    fact("References", concept.references),
    fact("Taken from them", concept.taken),
    fact("Signature", concept.signature),
    fact("Type", `${concept.type}. SIL Open Font License, linked from Google Fonts.`),
  );
}

function buttonStates() {
  return h(
    "div",
    { className: "dd-states" },
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
  );
}

function textFieldStates() {
  return h(
    "div",
    { className: "dd-states" },
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
          defaultValue: "D:\\Medien\\Vorträge\\2026\\Designsysteme-und-Komponentenbibliotheken",
          description:
            "Gilt für alle künftigen Downloads dieser Warteschlange, bis du ihn wieder änderst.",
          error:
            "Der Ordner existiert nicht oder ist schreibgeschützt. Wähle einen anderen Speicherort.",
        }),
      ],
      "de",
    ),
  );
}

function colorFieldStates() {
  return h(
    "div",
    { className: "dd-states" },
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
  );
}

function page(concept, mode) {
  return h(
    "main",
    { className: "dd-page" },
    hero(concept, mode),
    block(
      "01",
      "Scenario",
      "A small form as a download tool would use it.",
      [scenario()],
      "dd-block-scenario",
    ),
    block("02", "Direction", null, [facts(concept)], "dd-block-direction"),
    block(
      "03",
      "Button",
      "Primary and secondary. Hover, pressed and focus are forced in the screenshots; in a browser, point at them or use Tab.",
      [buttonStates()],
      "dd-block-button",
    ),
    block(
      "04",
      "TextField",
      "Fields have no hover style in the library yet. Long texts are German, as in quiltor and mediagrab.",
      [textFieldStates()],
      "dd-block-text-field",
    ),
    block(
      "05",
      "ColorField",
      "No error style: invalid text returns to the last valid color on blur.",
      [colorFieldStates()],
      "dd-block-color-field",
    ),
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
    const conceptCss = readFileSync(join(here, "directions", `${concept.id}.css`), "utf8");
    for (const mode of modes) {
      const file = join(outputDir, pageFile(concept, mode));
      writeFileSync(
        file,
        documentHtml({
          title: `${concept.letter} ${concept.name} · ${mode} – mosaik design directions`,
          mode,
          concept,
          styles: [libraryCss, pageCss, conceptCss],
          body: renderToStaticMarkup(page(concept, mode)),
        }),
      );
      files.push(file);
    }
  }
  const index = renderToStaticMarkup(
    h(
      "main",
      { className: "dd-page" },
      h("h1", { className: "dd-title" }, "mosaik · AP2 design directions"),
      h(
        "ul",
        { className: "dd-index" },
        ...concepts.flatMap((concept) =>
          modes.map((mode) =>
            h(
              "li",
              null,
              h(
                "a",
                { href: pageFile(concept, mode) },
                `${concept.letter} ${concept.name} · ${mode}`,
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
      title: "mosaik design directions",
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
