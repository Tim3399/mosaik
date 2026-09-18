# AP2 design checkpoint: design directions

Three candidate design directions for `@tim3399/mosaik`, prepared for the owner's choice at the
start of AP2 (implementation plan §4.1 and §12). This directory is an exploration, not part of
the library or the showcase. After the choice it is removed; only the decision is recorded in
[docs/decisions.md](../../docs/decisions.md).

| Direction   | Character                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| A · Precise | Dense and crisp: cool neutrals, hairline borders, small radii, ink accent, 36 px controls            |
| B · Soft    | Open and calm: warm neutrals, tonal layers instead of lines, rounded shapes, blue accent, 44 px      |
| C · Bold    | Graphic and unambiguous: pure neutrals, flat surfaces with lines, 2 px outlines, square, bold labels |

## Rules

- **Values only.** Each file in [directions/](directions/) sets values for exactly the token
  roles of `packages/ui/src/foundations/tokens.css`: color, text roles, spacing, radii, borders
  and focus ring. Role names, component APIs and component CSS stay unchanged.
- **Mode mechanism untouched.** Color tokens use the toggle form of decisions D-15; the private
  mode toggles are never redefined.
- **Public surface only.** The specimen pages render the built package with its
  `styles.css`; the direction file is loaded unlayered after it.
- **Checked.** `packages/ui/src/foundations/tokens.test.ts` runs every contrast pair against the
  library tokens and each direction, and fails when a direction adds, drops or renames a role or
  touches a mode toggle.

## Render and capture

Run from the repository root:

```bash
npm run build -w @tim3399/mosaik
node explorations/design-directions/render.mjs
node explorations/design-directions/capture.mjs
```

`render.mjs` writes one static page per direction and mode to `.tmp/design-directions/`
(ignored by Git); open `index.html` there to browse them. `capture.mjs` renders the pages again
and writes full-page screenshots and comparison sheets to `.tmp/design-directions/screenshots/`:
light and dark, at 320 px as a touch device (coarse pointer) and at 1440 px on the desktop. It
forces hover, pressed and focus as real pseudo-classes through the Chrome DevTools Protocol and
fails if a forced state does not change the rendering. It needs Playwright's Chromium.

## Limits of this comparison

- There is no depth or shadow role yet, so depth is expressed through surface steps, borders
  and border width. A shadow role would be part of the final tokens if the chosen direction
  needs one.
- The library has no heading roles yet; page headings are page layout, not part of a direction.
- Fields have no hover or pressed style in the component CSS, so those states cannot differ.
- All directions use the system font stack, as agreed for now.
- Screenshots come from Chromium on Windows. Visual reference images follow only after the
  choice, in the pinned Linux container (decisions D-10).
