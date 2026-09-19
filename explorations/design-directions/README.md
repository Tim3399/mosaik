# AP2 design checkpoint: design concepts

Five design concepts for `@tim3399/mosaik`, prepared for the owner's choice at the start of AP2
(implementation plan §4.1 and §12). This directory is an exploration, not part of the library or
the showcase. After the choice it is removed; only the decision is recorded in
[docs/decisions.md](../../docs/decisions.md).

Round 1 (three directions that only changed token values) was rejected as too generic. Round 2
starts from motifs of recent awwwards Sites of the Day and lets each concept restyle the
components' look.

| Concept      | Character                                                                               | Motif sources on awwwards              |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------- |
| 1 Riso       | Two-color risograph print: blue ink on paper, misregistered pink, halftone, grain       | Unseen Studio, Boon Global, Aspen      |
| 2 Signal     | Control room at night: dot grid, signal green, monospaced labels, corner brackets, glow | Cerebrium, Locomotive, basement studio |
| 3 Plakat     | Street poster: condensed capitals, vermilion and yellow, heavy frames, zigzag bands     | MONOGRID, Maison AUGE, Malvah          |
| 4 Feuilleton | Magazine page: didone serif, hairlines, underlined fields, one accent                   | ERA Costa del Sol, Raw Materials, Resn |
| 5 Mosaik     | The name as the idea: color tiles on a grout grid, keycap buttons, sunken fields        | NOHO, Léo Parpeix, Neutral Studio      |

## Rules

- **Same components, same content.** Every concept renders the real package components with the
  same scenario and the same states. Component APIs and markup stay unchanged.
- **Tokens first.** Each file in [concepts/](concepts/) sets every library token role; color
  tokens use the toggle form of decisions D-15 and the private mode toggles are never
  redefined. Concept-specific properties use the prefix `--dd-`.
- **Prototype restyling.** The rules after the token block restyle the rendered components
  (shapes, shadows, textures, type). A chosen concept is then built properly into the tokens and
  component CSS of the library.
- **Checked.** `packages/ui/src/foundations/tokens.test.ts` runs every contrast pair against the
  library tokens and each concept. `capture.mjs` runs axe on every page while hover, pressed and
  focus are forced and fails on contrast violations. axe cannot measure text on background
  images, so the decorative textures are switched off during that run and text is measured
  against the solid colors underneath.
- **Fonts.** Linked from Google Fonts, never copied into the repository. All ten families are
  licensed under the SIL Open Font License 1.1 (checked in the `google/fonts` repository):
  Bricolage Grotesque, DM Mono, Chakra Petch, JetBrains Mono, Big Shoulders Display, Archivo,
  Bodoni Moda, Hanken Grotesk, Unbounded and Onest.

## Render and capture

Run from the repository root; the pages need network access for the fonts:

```bash
npm run build -w @tim3399/mosaik
node explorations/design-directions/capture.mjs
```

`capture.mjs` renders one static page per concept and mode to `.tmp/design-directions/`
(ignored by Git; open `index.html` there to browse) and writes screenshots and comparison sheets
to `.tmp/design-directions/screenshots/`: light and dark, at 320 px as a touch device and at
1440 px on the desktop. Pass concept ids, for example `capture.mjs riso signal`, to capture only
some. It forces hover, pressed and focus as real pseudo-classes through the Chrome DevTools
Protocol and fails when fonts are missing, a forced state does not render or the pointer
emulation is lost. It needs Playwright's Chromium.

## Limits of this comparison

- There is no heading role in the library yet; page headings and the hero are page layout.
- Fields have no hover style in the component CSS; the concepts keep that gap.
- The only text on a background image is the Riso error highlighter. Its blend was computed by
  hand instead: 4.84:1 in light and 5.12:1 in dark mode.
- Screenshots come from Chromium on Windows. Visual reference images follow only after the
  choice, in the pinned Linux container (decisions D-10).
