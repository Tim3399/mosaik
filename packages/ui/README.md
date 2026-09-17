# @tim3399/mosaik

React components for tool frontends, with light and dark mode, accessible defaults and no
configuration. Built so that agents can assemble interfaces from existing building blocks
instead of writing individual frontend code.

**Status:** early development (0.x); the API and the provisional visual design will change.
**License:** source-available, not open source. See [LICENSE.md](LICENSE.md): noncommercial use
is permitted; commercial use only for companies below 100,000 euros annual revenue.

## Install

Requires React 19 and React DOM 19.

```bash
npm install @tim3399/mosaik
```

Import the stylesheet once, for example in the root layout of a Next.js App Router project or
in the entry module of a Vite project:

```tsx
import "@tim3399/mosaik/styles.css";
```

Components are unstyled without it. All rules live in the CSS layer `mosaik`, so your own
unlayered CSS takes precedence. The import type-checks without extra configuration; the package
ships a declaration for it.

## Use

```tsx
import { Button, ColorField, TextField } from "@tim3399/mosaik";

export function ProjectForm() {
  return (
    <form>
      <TextField label="Project name" name="name" description="Shown in the navigation." />
      <ColorField label="Brand color" name="brandColor" defaultValue="#15803d" />
      <Button type="submit" variant="primary">
        Create project
      </Button>
    </form>
  );
}
```

This form works as a React Server Component. Event handlers such as `onClick` or `onChange`
always need a Client Component parent.

## Components

| Component    | Purpose                                                                                        | Client Component |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------- |
| `Button`     | Native button; `variant="primary"` for the main action of an area                              | no               |
| `TextField`  | Labeled text input with optional description and error message                                 | no               |
| `ColorField` | Color picker plus hex input; controlled (`value`, `onChange`) or uncontrolled (`defaultValue`) | yes              |

Every visible text and accessible name comes from props; the components contain no built-in
wording except the replaceable `pickerLabel` default of `ColorField` ("Pick color").

## Light and dark mode

Components render in light mode unless a container selects a mode:

```tsx
<html lang="en" data-mosaik-mode="system">  {/* or "light" / "dark" */}
```

`data-mosaik-mode` works on any element and can be nested, for example a dark panel inside a
light page. It also sets `color-scheme` for that subtree. The mode is pure CSS, so server
rendering and hydration always agree.

## License notice in your application

When your frontend ships mosaik to browsers, you must pass on the license terms (or their URL)
and this line, for example in your third-party notices:

```text
Required Notice: Copyright 2026 Tim Ratermann (https://github.com/Tim3399/mosaik)
```

The built files carry the notice as `/*! @license ... */` comments, but production builds do not
reliably keep them: Next.js 16.3 removes them from client JavaScript and CSS, and Vite 8 keeps
them only in CSS.
