# Agent instructions

mosaik is a versioned React component library for agent-built frontends (npm package
`@tim3399/mosaik` in `packages/ui`) plus a Next.js showcase built from that library
(`apps/showcase`). The goal is to minimize individual frontend work in the owner's tools.

## Read first

- [docs/implementation-plan.md](docs/implementation-plan.md): confirmed requirements, scope and
  work packages (German). Requirements marked "festgelegt" are not reinterpreted; technical
  deviations are justified briefly in [docs/decisions.md](docs/decisions.md).
- [docs/component-contract.md](docs/component-contract.md): rules every public component follows.
- [docs/PROJECT_PROFILE.md](docs/PROJECT_PROFILE.md): commands, pins, gates and pending work.

## Project standard

Read `docs/PROJECT_PROFILE.md` before changing formatting, language profiles, development
startup, build/version tooling or CI/CD. Follow its adopted component versions, retained exceptions
and actual command map. Run a project-standard Check or Update only when the user requests it;
ordinary feature work does not trigger startup, adoption or a baseline update. Update only the
requested `agents`, `formatting`, `languages`, `tooling` or `cicd` scopes, preserve local overrides and
locked versions outside them, and record checks actually performed without rewriting historical
evidence. Use each file type's declared formatter and keep repository-wide formatting separate
from functional work. A standard or product version update must not implicitly commit, push or
publish.

Preserve the project's agent instructions, configured model and reasoning defaults, and local
overrides unless the user requests a change. Handle small or tightly coupled changes directly.
For substantial work with independently useful subtasks, use the available
`orchestrated-development` skill when delegation adds clear value; otherwise apply the same
ownership and review discipline directly. Assign explicit file ownership, require workers not
to delegate further or revert shared changes, and review their actual diff and scoped checks.

## Frontend design

For frontend work, `docs/design/FRONTEND_STYLEGUIDE.md` applies. Read its entry section,
section 1 and Definition of Done first, then the task-relevant sections, `DESIGN.md` once it
exists, the token files and comparable components. Preserve the approved scope and existing
identity. A review alone does not authorize edits. Check plans against the current code and
report the checks actually performed and remaining gaps.

## Repository rules

- **Public surface only.** The showcase, examples and tests import `@tim3399/mosaik` and
  `@tim3399/mosaik/styles.css`, never files under `packages/ui/src`. The workspace link resolves
  to `packages/ui/dist`, so build the package before consuming it.
- **Library code stays generic.** No routes, backends, stores or product wording in
  `packages/ui`. Showcase catalog data, preview state and example scenarios belong to
  `apps/showcase`.
- **Component rules** from the contract, in short: no hard-coded visible text (labels come from
  props); classes are prefixed `mosaik-` and live in `@layer mosaik`; variants and states are
  `data-*` attributes; no global resets; at most two consumer-chosen base colors per component;
  `"use client"` only in modules that use hooks, context or browser APIs.
- **A missing building block in a consumer** is built locally in that tool. Report to the owner:
  purpose, why the library lacks it, which library components it uses, and whether it looks
  reusable. Do not add it to the library without that decision.
- **Language.** Code, comments, identifiers, commit messages, test titles, this file, READMEs,
  the project profile and component documentation are English. The implementation plan,
  `docs/decisions.md` and `DESIGN.md` are German. The showcase UI is English.
- **Licensing.** `LICENSE.md` embeds the PolyForm Noncommercial License 1.0.0 verbatim; never
  reformat or edit that part. Do not copy third-party code, icons or fonts into the repository
  without checking and recording their license. External contributions are not accepted yet.
- **Commits** use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `ci:`).

## Proving a change

A test that passes after a change proves little on its own. For a fix or a new gate, reverse the
change temporarily and confirm the test fails, then restore it.
