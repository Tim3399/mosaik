# Component contract

Rules for every public component in `@tim3399/mosaik`. The requirements behind them are in the
[implementation plan](implementation-plan.md) (sections 4, 5, 8 and 9); the reasons for the
technical choices are in [decisions.md](decisions.md). This contract grows with real components.
Values that depend on the design direction (tokens, color roles) are settled in AP2.

## Purpose and API

- A public component has one clear purpose, a small typed API and sensible defaults. Internal
  parts stay private; not every HTML node becomes a public component.
- Content, accessible names and actions are controlled by the consumer. Components never assume
  a backend, authentication, routes or product wording.
- **No hard-coded visible text.** Labels, hints and accessible names are props. An unavoidable
  default string is English and replaceable through a prop.
- Recurring API terms are used consistently across components. Native element props are passed
  through where the component renders a native element.
- Generic behavior is included where it helps the component. Integration with the application
  (requests, tokens, business decisions) stays in the application. A separate hook or controller
  is added only when it is actually useful.
- A capability that the underlying transport or browser cannot deliver is never shown as working,
  for example progress or cancellation of a download.

## Styling

- Styles ship precompiled in one file. Consumers import `@tim3399/mosaik/styles.css` once; JS
  modules do not import CSS.
- Every rule lives in `@layer mosaik`. Classes use the prefix `mosaik-`; variants and states are
  `data-*` attributes on the element, not extra class names.
- No global resets and no rules for elements the library does not render.
- Colors, spacing, radii and text styles come from foundation tokens with semantic roles. Text
  styles are named roles (not a bare size scale).
- `className` and `style` on the root are for outer layout: margin, placement and width. Inner
  sizing, such as minimum heights and hit areas, is not a supported override. A missing variant
  is added to the component instead.
- Undocumented internal selectors are not a stable interface.

## Color contract

- Each component supports at most **two consumer-chosen base colors**, and many need none. The
  meaning of each color is documented per component.
- The library derives shades, text colors, borders and interaction states for light and dark
  mode from those inputs. Neutral surfaces, readable text and fixed status colors are internal.
- Derived colors are set as custom properties on the component root, so a color change never
  affects neighbors.
- Contrast targets are WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text and for essential
  non-text indicators. Where an input cannot reach them, a safe fallback is used and a warning is
  emitted in development.
- Meaning is never conveyed by color alone.
- Accepted input format in v1: opaque hex (`#rrggbb`). The exact role set and derivation are
  defined in AP2.

## Light and dark mode

- `data-mosaik-mode="light" | "dark" | "system"` on any container selects the mode for its
  subtree, including nested scopes, and sets `color-scheme` there. Without a scope, components
  render in light mode. Applications built mainly from mosaik set `data-mosaik-mode="system"`
  on `<html>`.
- Color tokens never use `light-dark()`. Consumer bundlers (Next.js 16.3) rewrite it into a form
  that only resolves at `:root`. Every color token is written as
  `var(--_mosaik-light, <light>) var(--_mosaik-dark, <dark>)` and declared on `:root` and on
  every mode scope; `tokens.test.ts` enforces the form. See decisions D-15.
- No JavaScript state is needed for the mode, so server output and hydration always agree.
- Overlays render inside the mode scope or carry its attribute.

## React and Next.js compatibility

- `"use client"` only in modules that use state, effects, context or browser APIs. `useId`,
  `useMemo` and `useCallback` are available in Server Components and need no directive.
  Components without the directive stay usable directly in Server Components.
- Stateful components also offer an uncontrolled mode without function props where that is
  meaningful (for example `defaultValue` plus `name` for form fields), so a Server Component can
  render them directly. The build must preserve directives; the package test proves it with a
  Next.js consumer.
- No unguarded access to `window`, `document` or storage at import time or during server
  rendering.
- React and React DOM are peer dependencies (`^19.0.0`) and are never bundled.

## Deliverables per component

A component is done when every applicable item holds:

1. Name, import and a short description.
2. When to use it and when not to.
3. Typed interface with defaults, events and data shapes.
4. A minimal example that compiles against the public package API.
5. Relevant variants and states, reachable in the showcase.
6. Color contract: allowed base colors and their meaning.
7. Behavior in light and dark mode, at different widths, with keyboard and, where relevant,
   touch.
8. Responsibility boundary: what the component does and what the application does.
9. Constraints: client boundary, extra dependencies, known limits.
10. Tests: behavior and accessibility in Vitest; browser scenarios in Playwright where rendering
    or interaction matters. Scenarios cover long and empty content, disabled and error states
    where they exist, and a narrow container.
11. The showcase uses the real package component, never a separate demo copy.
