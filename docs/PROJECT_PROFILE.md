# mosaik project profile

## Adoption

| Field                       | Value                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Project/product             | mosaik: React component library `@tim3399/mosaik` (`packages/ui`) and its Next.js showcase (`apps/showcase`)           |
| Project-start template      | `project-start` 1.3.0                                                                                                  |
| Baseline target             | Cross-project engineering standard 1.3.0                                                                               |
| Baseline location           | [standards/README.md](standards/README.md), copied unchanged on 2026-09-16                                             |
| Mode and requested scopes   | Start; agents, formatting, languages, tooling, cicd                                                                    |
| Overall status              | Partial: agents, formatting and languages adopted; tooling partial (release commands pending); CI/CD partial (CI only) |
| Active profiles             | Web (TypeScript/JavaScript, JSON, CSS), documentation (Markdown/YAML/HTML), core whitespace                            |
| Supported developer systems | Windows (primary) and Linux; CI on Ubuntu 24.04 and Windows Server 2025                                                |

| Scope      | Component             | Adopted version | Target version | Status  | Evidence / retained exception                                                                |
| ---------- | --------------------- | --------------- | -------------- | ------- | -------------------------------------------------------------------------------------------- |
| Agents     | Agent instructions    | 1.3.0           | 1.3.0          | adopted | `AGENTS.md` contains the standard fragment; `CLAUDE.md` imports it                           |
| Formatting | Core ownership        | 1.3.0           | 1.3.0          | adopted | Verification 2026-09-16 (drift, write, idempotence)                                          |
| Languages  | Web profile           | 1.3.0           | 1.3.0          | adopted | Biome owns JS/TS/JSON/CSS formatting and lint                                                |
| Languages  | Documentation profile | 1.3.0           | 1.3.0          | adopted | Prettier owns Markdown/YAML/HTML                                                             |
| Tooling    | Commands and runtime  | —               | 1.3.0          | partial | All commands below verified on 2026-09-16; `release:preflight` and `set-version` pending     |
| CI/CD      | Delivery pipeline     | —               | 1.3.0          | partial | CI workflow declared; hosted run evidence pending; no publication until a registry is chosen |

## Formatting and toolchains

| Item                         | Source/configuration                                             | Value or policy                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Runtime/build pins           | `.nvmrc`, `package.json` `packageManager`/`engines`              | Node 22.23.2 and npm 10.9.8 exactly for CI and releases; development supports Node >=22.22.0 <23, npm >=10.9.0 <12                                                             |
| Dependency pins              | Workspace `package.json` files                                   | Exact versions only. Key tools: TypeScript 7.0.2, React 19.3.0, Next.js 16.3.5, Vite 8.3.0, Vitest 5.0.1, Playwright 1.63.0, Lightning CSS 1.33.0, publint 0.3.24, attw 0.18.5 |
| Package manager and lockfile | Root `package-lock.json` (npm workspaces `packages/*`, `apps/*`) | `npm ci`. Consumer fixtures carry their own lockfiles under `tests/package-consumer/fixtures/*/`. Lockfiles are npm-owned and excluded from formatters                         |
| Formatter owners             | `biome.json`, `.prettierrc`, `.prettierignore`                   | Biome 2.5.14: JS/JSX/MJS/CJS/TS/TSX/JSON/JSONC/CSS, plus `biome lint`. Prettier 3.9.7: Markdown/YAML/HTML, embedded code formatting off                                        |
| Editor and Git whitespace    | `.editorconfig`, `.gitattributes`                                | UTF-8, LF, final newline; Markdown keeps trailing whitespace                                                                                                                   |
| Pin consistency gate         | `npm run doctor -- --strict` in CI                               | Fails when Node differs from `.nvmrc` or npm differs from `packageManager`; locally the same deviations are warnings                                                           |

Maintained source: TypeScript/TSX (`packages/ui/src`, `packages/ui/test`, `apps/showcase/src`, `tests`), JavaScript modules (`scripts`, `packages/ui/scripts`, `tests`), CSS (`packages/ui/src`, `apps/showcase/src/app`), JSON configuration, Markdown documentation, the CI workflow (YAML) and one HTML file (Vite fixture). No other file types.

Excluded from formatting: dependencies, build output (`dist`, `.next`), test reports, npm lockfiles, the immutable `docs/standards/` snapshot, `LICENSE.md` and its package copy (the PolyForm text must stay byte-identical), and the `next dev`-managed agent files of the showcase.

## Command map

Run commands from the repository root. Browser commands need `npx playwright install chromium` once.

| Operation             | Command                                                    | Scope/prerequisites                                                                                                                                                                                         |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install               | `npm ci`                                                   | Locked workspace install                                                                                                                                                                                    |
| Doctor                | `npm run doctor` (`npm run doctor -- --strict` in CI)      | Read-only: Node/npm pins, Git, installed dependency tree, Playwright Chromium                                                                                                                               |
| Complete local start  | `npm start` or `npm run dev` (same launcher)               | Frontend-only project: library build, library watch rebuilds and the showcase dev server                                                                                                                    |
| Production preview    | `npm run preview`                                          | Requires `npm run build`; `next start` with launch identity check                                                                                                                                           |
| Format / check format | `npm run format` / `npm run check:format`                  | All active profiles; the check never writes                                                                                                                                                                 |
| Static checks         | `npm run check`                                            | `check:format`, `biome lint`, library typecheck including tests, library build (declarations for the showcase), `next typegen` and showcase typecheck. Excludes unit, browser and package tests             |
| Production build      | `npm run build`                                            | Library `dist` (`tsc`, Lightning CSS, license notice, verification of client directives) and `next build` of the showcase (includes its type check)                                                         |
| Unit tests            | `npm test`                                                 | Vitest with jsdom: components, color normalization, token contrast and stylesheet contract, package metadata                                                                                                |
| End-to-end tests      | `npm run test:e2e`                                         | Requires `npm run build`. Playwright starts the production preview and verifies its launch identity; Chromium locally, Chromium/Firefox/WebKit with `CI` or `MOSAIK_ALL_BROWSERS=1`; includes axe checks    |
| Launcher tests        | `npm run test:launcher`                                    | `node:test`: occupied port, invalid port override, alternate port with readiness, stop and port release (SIGINT on POSIX, tree stop on Windows)                                                             |
| Package acceptance    | `npm run test:package` (optionally `next-app`, `vite-app`) | Build and `npm pack`, tarball content, `publint --strict`, Are the Types Wrong (ESM), then per consumer outside the workspace: `npm ci`, tarball install, production build, served build, Playwright checks |
| Release preflight     | Pending                                                    | No release before the registry is chosen                                                                                                                                                                    |
| Version update        | Pending                                                    | Version source `packages/ui/package.json`; no transactional updater yet                                                                                                                                     |

## Local runtime

| Service            | Bind address/default port | Override/config source                                                                       | Readiness and identity                                                                                  |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Showcase (dev)     | 127.0.0.1:3310            | `MOSAIK_SHOWCASE_PORT`, read by `scripts/config.mjs` for launcher, preview and browser tests | `/api/health` must return this launch's `launchId`; deadline 120 s; prints URL, mode, version, revision |
| Showcase (preview) | 127.0.0.1:3310            | Same                                                                                         | Same check, deadline 60 s                                                                               |
| Library watch      | none                      | none                                                                                         | Log line `built N modules and styles.css`                                                               |

- **Port conflicts:** An occupied port fails with a message naming the override; the launcher never picks another port.
- **Startup failures:** An invalid override fails before anything starts. An early child exit stops the other owned processes and exits with 1.
- **Stopping:** Ctrl+C or SIGTERM stops the owned process trees (POSIX process groups; `taskkill /T /F` of owned children on Windows).
- **Reload:** Library sources rebuild into `dist` in place; Next.js picks up the change. No backend, no development data.
- **Parallel checkouts:** Next.js 16.3 allows one `next dev` per checkout (`.next/dev/lock`). A second server needs a separate worktree and port, for example in Git Bash: `MOSAIK_SHOWCASE_PORT=3320 npm run dev`, or in PowerShell: `$env:MOSAIK_SHOWCASE_PORT = "3320"; npm run dev`.

## Version and release

- **Product version:** The authoritative version of the independently released library is `packages/ui/package.json` (currently `0.0.0`). The showcase is private and not released.
- **Build identity:** The showcase build embeds library version, Git revision (12 characters), dirty flag and build mode (`next.config.ts`), shown in its footer and in `/api/health`. In development they reflect the state at server start.
- **Build output:** `dist`, `.next` and packed tarballs are ignored by Git.
- **Release policy (target):** tagged releases of the library with version/tag agreement, a manifest with digests and publication of the verified tarball without rebuilding. Nothing is implemented yet because no registry is chosen (npm account `tim3399` or GitHub Packages). No publication trigger exists.

## CI/CD

- **Provider and workflow:** GitHub Actions, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
- **Triggers:** pull requests and pushes to `main`. **Permissions:** `contents: read`.
- **Concurrency:** grouped per pull request or ref; superseded pull request runs are cancelled.
- **Jobs and local equivalents:**
  - `checks` (Ubuntu 24.04): `npm ci`, `npm run doctor -- --strict`, `npm run check`, `npm test`, `npm run build`, `npm run test:launcher`.
  - `browser` (needs `checks`): Playwright Chromium, Firefox and WebKit with system dependencies, `npm run build`, `npm run test:e2e`; uploads report and traces on failure (7 days).
  - `package` (needs `checks`): Playwright Chromium, `npm run test:package`; uploads results on failure.
  - `windows` (Windows Server 2025): `npm ci`, `npm test`, `npm run build`.
- **Action pins (full commit SHAs):** `actions/checkout` v7.0.1 `3d3c42e5aac5ba805825da76410c181273ba90b1`, `actions/setup-node` v7.0.0 `820762786026740c76f36085b0efc47a31fe5020`, `actions/upload-artifact` v7.0.1 `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`. Pin updates are reviewed changes by the owner.
- **Delivery:** CI only. No publication, deployment, environments or secrets.
- **Remote enforcement:** No branch protection or required checks are configured (not read or changed).

## Exceptions and pending work

| Scope / component   | Requirement                            | Actual behavior/status                                  | Reason                                                      | Follow-up/review condition                                     |
| ------------------- | -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| Tooling / release   | `release:preflight` and `set-version`  | pending                                                 | No registry chosen, nothing to release                      | Implement before the first package release (AP5)               |
| Tooling / identity  | Release artifact manifest with digests | pending                                                 | No releases yet; the tarball version identifies the package | Together with the release pipeline                             |
| Tooling / launcher  | Ctrl+C cleanup verified                | Automated on Linux (SIGINT); Windows test ends the tree | Node cannot send a console Ctrl+C to a process on Windows   | Check manually in a Windows terminal when the launcher changes |
| Tooling / worktrees | Parallel development instances         | One `next dev` per checkout                             | Next.js 16.3 dev lock                                       | Use separate worktrees with `MOSAIK_SHOWCASE_PORT`             |
| CI/CD / enforcement | Required checks and branch protection  | not configured                                          | New repository; remote settings are the owner's decision    | Decide after the first green hosted run                        |
| CI/CD / delivery    | Tagged release pipeline                | pending                                                 | No registry, no release                                     | AP5                                                            |
| Tooling / visuals   | Visual regression baselines            | not started                                             | Design direction not chosen yet (decisions D-10)            | After the owner approves the design direction (AP2)            |

## Verification

| Date       | Mode / requested scopes              | Immutable expected baseline                                                              | Actual state inspected                                            | Checks and results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Component status changes                                 |
| ---------- | ------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 2026-09-16 | Start; agents, formatting, languages | `docs/standards/` 1.3.0, byte-identical to the installed skill assets (SHA-256 compared) | Empty repository; new configuration files                         | Disposable fixture outside the repository with drifted TS, CSS, JSON, Markdown and YAML: `biome format .` exit 1 and `prettier --check` exit 1; after both write commands both checks exit 0; a second write produced no Git diff. `npm run check:format` on the repository passes. `npm run doctor` passes on Node 22.23.2 / npm 10.9.8.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | agents, formatting, languages: adopted                   |
| 2026-09-16 | Start; tooling, cicd                 | `docs/standards/` 1.3.0                                                                  | Workspace with library, showcase, launcher, tests and CI workflow | Windows 11, Node 22.23.2, npm 10.9.8, after a fresh `npm ci` (16 s): `doctor` 0 failing; `check` passed; `test` 82 passed in 6 files; `build` passed; `test:e2e` 8 passed (Chromium: launch identity, axe in light and dark, color scheme, nested mode scopes, field descriptions, hydration, 320 px width); `test:launcher` 3 passed; `test:package`: tarball 15 files, `publint --strict` and attw passed, Next.js consumer 4 passed, Vite consumer 4 passed; no leftover Node processes. Mutation checks failed as expected: undefined token and unprefixed class in component CSS, tokens only on `:root` (nested scope test), `ColorField` without `"use client"` (Next.js consumer build), `doctor --strict` with a drifted Node pin. Manual: launcher readiness, occupied port, second `next dev` in the same checkout (early exit stopped the other owned process), built-in browser review in light and dark and at 320 px. Not run: Firefox and WebKit locally, hosted CI, Ctrl+C in a real Windows console. | tooling: partial; CI/CD: partial (declared, not yet run) |
