# mosaik project profile

## Adoption

| Field                       | Value                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Project/product             | mosaik: React component library `@tim3399/mosaik` (`packages/ui`) and its Next.js showcase (`apps/showcase`) |
| Project-start template      | `project-start` 1.3.0                                                                                        |
| Baseline target             | Cross-project engineering standard 1.3.0                                                                     |
| Baseline location           | [standards/README.md](standards/README.md), copied unchanged on 2026-09-16                                   |
| Mode and requested scopes   | Start; agents, formatting, languages, tooling, cicd                                                          |
| Overall status              | Partial: agents, formatting and languages adopted; tooling and CI/CD pending (see component rows)            |
| Active profiles             | Web (TypeScript/JavaScript, JSON, CSS), documentation (Markdown/YAML/HTML), core whitespace                  |
| Supported developer systems | Windows (primary) and Linux                                                                                  |

| Scope      | Component             | Adopted version | Target version | Status  | Evidence / retained exception                                      |
| ---------- | --------------------- | --------------- | -------------- | ------- | ------------------------------------------------------------------ |
| Agents     | Agent instructions    | 1.3.0           | 1.3.0          | adopted | `AGENTS.md` contains the standard fragment; `CLAUDE.md` imports it |
| Formatting | Core ownership        | 1.3.0           | 1.3.0          | adopted | Verification 2026-09-16 (drift, write, idempotence)                |
| Languages  | Web profile           | 1.3.0           | 1.3.0          | adopted | Biome owns JS/TS/JSON/CSS                                          |
| Languages  | Documentation profile | 1.3.0           | 1.3.0          | adopted | Prettier owns Markdown/YAML/HTML                                   |
| Tooling    | Commands and runtime  | —               | 1.3.0          | pending | Only `doctor`, `format` and `check:format` exist so far            |
| CI/CD      | Delivery pipeline     | —               | 1.3.0          | pending | No workflow yet                                                    |

## Formatting and toolchains

| Item                         | Source/configuration                                | Value or policy                                                                                                    |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Runtime/build pins           | `.nvmrc`, `package.json` `packageManager`/`engines` | Node 22.23.2 and npm 10.9.8 exactly for CI and releases; development supports Node >=22.22.0 <23, npm >=10.9.0 <12 |
| Package manager and lockfile | Root `package-lock.json` (npm workspaces)           | `npm ci`; the lockfile is npm-owned and excluded from formatters                                                   |
| Formatter owners             | `biome.json`, `.prettierrc`, `.prettierignore`      | Biome 2.5.14: JS/JSX/MJS/CJS/TS/TSX/JSON/JSONC/CSS. Prettier 3.9.7: Markdown/YAML/HTML, embedded code off          |
| Editor and Git whitespace    | `.editorconfig`, `.gitattributes`                   | UTF-8, LF, final newline; Markdown keeps trailing whitespace                                                       |
| Pin consistency gate         | Pending                                             | `npm run doctor` reports deviations locally; a CI gate is pending                                                  |

Excluded from formatting: dependencies, build output (`dist`, `.next`), test reports, the npm
lockfile, the immutable `docs/standards/` snapshot, `LICENSE.md` and its package copy (the
PolyForm text must stay byte-identical), and the `next dev`-managed agent files of the showcase.

## Command map

| Operation             | Command                                   | Scope/prerequisites                                                           |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| Install               | `npm ci`                                  | Locked dependency install                                                     |
| Doctor                | `npm run doctor`                          | Read-only: Node/npm pins, Git, installed dependency tree, Playwright Chromium |
| Format / check format | `npm run format` / `npm run check:format` | All active profiles; the check never writes                                   |
| Static checks         | Pending                                   | Lint and type checks arrive with the first package                            |
| Production build      | Pending                                   | —                                                                             |
| Unit tests            | Pending                                   | —                                                                             |
| End-to-end tests      | Pending                                   | —                                                                             |
| Complete local start  | Pending                                   | —                                                                             |
| Release preflight     | Pending                                   | No release before the registry is chosen                                      |
| Version update        | Pending                                   | No release before the registry is chosen                                      |

## Exceptions and pending work

| Scope / component | Requirement                | Actual behavior/status | Reason                                  | Follow-up/review condition              |
| ----------------- | -------------------------- | ---------------------- | --------------------------------------- | --------------------------------------- |
| Tooling           | Complete command interface | pending                | Package and showcase not yet scaffolded | Add with the first vertical slice (AP1) |
| CI/CD             | CI gates                   | pending                | No workflow yet                         | Add with AP1                            |

## Verification

| Date       | Mode / requested scopes              | Immutable expected baseline                                                              | Actual state inspected                    | Checks and results                                                                                                                                                                                                                                                                                                                        | Component status changes               |
| ---------- | ------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 2026-09-16 | Start; agents, formatting, languages | `docs/standards/` 1.3.0, byte-identical to the installed skill assets (SHA-256 compared) | Empty repository; new configuration files | Disposable fixture outside the repository with drifted TS, CSS, JSON, Markdown and YAML: `biome format .` exit 1 and `prettier --check` exit 1; after both write commands both checks exit 0; a second write produced no Git diff. `npm run check:format` on the repository passes. `npm run doctor` passes on Node 22.23.2 / npm 10.9.8. | agents, formatting, languages: adopted |
