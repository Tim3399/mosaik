# AP2 design checkpoint: design directions

Three design directions for `@tim3399/mosaik`, prepared for the owner's choice at the start of
AP2 (implementation plan §4.1 and §12). This directory is an exploration, not part of the library
or the showcase. After the choice it is removed; only the decision is recorded in
[docs/decisions.md](../../docs/decisions.md).

Round 1 (three token-only directions) was rejected as too generic, round 2 (five concepts from
awwwards motifs) as neither clean nor original enough. Round 3 starts from five sites the owner
named as references. Its first form, a specimen page per direction, still only took their colors
and type, so the directions are now shown as **screens**: pages of a small download tool
composed like the references, with the real package components inside. The specimen pages stay
as the state matrix of each direction.

| Direction   | Character                                                                   | References                   |
| ----------- | --------------------------------------------------------------------------- | ---------------------------- |
| A Grundriss | Swiss precision: charcoal and white, gray, rules, square, arrow, text links | M3 Planungsgruppe            |
| B Kern      | Black stage with columns: thin and heavy type, bone, mono labels, amber     | DAQ Consulting, Boon Global  |
| C Orbit     | Deep indigo and lavender: violet pills, cards with one large corner, status | Orchid Security, Cyber Prime |

## Screens

`screens.mjs` renders one screen per direction to `.tmp/design-directions/screens/` and captures
the first desktop screen (1440 × 900), the full desktop page and a 390 px phone page:

- **A Grundriss:** label column, a three-line statement at poster scale, three columns under
  rules, the queue as vertical tabs with large gray numbers, bars as progress, a charcoal end
  with a wordmark.
- **B Kern:** a liquid-chrome hero drawn with SVG filters, thin and heavy capitals, monospaced
  micro text, a glass panel with the form, dot rows as progress, a particle field with an amber
  highlight.
- **C Orbit:** a pill navigation and centered headline over violet light, then a small operating
  system with app tiles, windows with one large corner, a status table, a notice and a dock.

The graphics are generated (bars, chrome, particles, icons); no image or icon is copied from the
references, and the copy is written for mosaik.

```bash
node explorations/design-directions/screens.mjs
```

## Rules

- **Same components, same content.** Every direction renders the real package components with
  the same scenario and the same states. Component APIs and markup stay unchanged.
- **Tokens first.** Each file in [directions/](directions/) sets every library token role; color
  tokens use the toggle form of decisions D-15 and the private mode toggles are never
  redefined. Direction-specific properties use the prefix `--dd-`.
- **Prototype restyling.** The rules after the token block restyle the rendered components
  (shapes, arrows, secondary style, labels). A chosen direction is then built properly into the
  tokens and component CSS of the library.
- **Checked.** `packages/ui/src/foundations/tokens.test.ts` runs every contrast pair against the
  library tokens and each direction. `capture.mjs` runs axe on every page while hover, pressed
  and focus are forced and fails on contrast violations. axe cannot measure text on background
  images, so decorative backgrounds (the column lines, the violet light) are switched off during
  that run and text is measured against the solid colors underneath.
- **Fonts.** Linked from Google Fonts, never copied into the repository. Inter, Inter Tight,
  Geist and Geist Mono are licensed under the SIL Open Font License 1.1 (checked in the
  `google/fonts` repository).

## Render and capture

Run from the repository root; the pages need network access for the fonts:

```bash
npm run build -w @tim3399/mosaik
node explorations/design-directions/capture.mjs
```

`capture.mjs` renders one static page per direction and mode to `.tmp/design-directions/`
(ignored by Git; open `index.html` there to browse) and writes screenshots and comparison sheets
to `.tmp/design-directions/screenshots/`: light and dark, at 320 px as a touch device and at
1440 px on the desktop. Pass direction ids, for example `capture.mjs kern`, to capture only
some. It forces hover, pressed and focus as real pseudo-classes through the Chrome DevTools
Protocol and fails when fonts are missing, a forced state does not render or the pointer
emulation is lost. It needs Playwright's Chromium.

## Limits of this comparison

- The library has no heading roles yet; the hero and the section headings are page layout.
- Fields have no hover style in the component CSS; the directions keep that gap.
- The references are marketing sites with motion and imagery; the directions take their type,
  color and geometry, not their animations.
- Screenshots come from Chromium on Windows. Visual reference images follow only after the
  choice, in the pinned Linux container (decisions D-10).
