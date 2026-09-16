# Cross-project engineering standard

Baseline version: **1.3.0**.

This is the reusable baseline for the owner's projects. Adoption is explicit per repository;
adding this directory does not change tooling or make another project compliant. Normative
requirements below describe the target; each project records its own current behavior and
remaining work separately.

Use this baseline in three explicit modes: **Start** bootstraps a new project, **Check** reports
the current state without changing it, and **Update** changes only requested scopes. The five
selectable scopes are `agents`, `formatting`, `languages`, `tooling` and `cicd`. Start a new project with
the [project profile template](templates/PROJECT_PROFILE.md) and the
[formatting templates](templates/formatting/README.md). Merge the
[agent instruction fragment](templates/agent-instructions.md) into the project's existing
instructions so coding agents use the same commands and constraints as developers.

## 1. One baseline, explicit project choices

Every adopting repository records per-scope adopted and target baseline versions, status,
active language profiles, command map, runtime pins, local services, version source, CI gates
and exceptions in `docs/PROJECT_PROFILE.md`. Store a copy of this baseline and its required templates under
`docs/standards/`, or link to an immutable revision in a shared standards repository. A floating
link to another project's working tree is insufficient.

A selective update advances only a scope whose changes and checks completed. Keep the other
scopes' adopted versions, locked tool versions and exceptions unchanged unless they were
requested or compatibility makes a change unavoidable and it is reported. Do not replace the
project-level status with the newest target version when some components remain older, pending
or unverified. Before an update, retain the previous expected baseline as immutable copied
content or an immutable revision; after it, record the new target, actual checks and results.
Historical evidence says what was verified at that time and must not be rewritten to imply that
the newer baseline had already passed.

Requirements apply only to capabilities the project actually has. A static frontend does not
need Python, an API server, containers or native signing. Existing projects may retain a working
package manager or framework command convention by recording the equivalent commands. New
JavaScript/TypeScript projects use npm with a committed lockfile by default.

An exception names the requirement, reason, actual behavior and condition for reviewing it.
An unimplemented requirement is recorded as pending, not as a passing check. Changes to the
baseline are reviewed and versioned independently of product releases: breaking requirements
increment its major version, compatible additions its minor version, and clarifications its patch.

## 2. Deterministic formatting

Each source file type has one authoritative formatter. Editor settings support that formatter;
they do not replace the command-line and CI checks.

| Files                                                  | Authority                              | Baseline                                                                                   |
| ------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| JS, JSX, MJS, CJS, TS, TSX                             | Biome                                  | Spaces, indent 2, width 100, double quotes, semicolons, trailing commas, arrow parentheses |
| JSON, JSONC, CSS                                       | Biome                                  | Spaces, indent 2, width 100; CSS double quotes                                             |
| Python                                                 | Ruff                                   | Spaces, indent 4, width 100, double quotes; target the oldest supported Python             |
| Markdown, YAML, HTML                                   | Prettier                               | Spaces, indent 2, width 100, preserve prose wrapping                                       |
| Rust                                                   | rustfmt from the pinned Rust toolchain | Tool defaults unless the Rust profile declares overrides                                   |
| Other formats, including framework-specific components | Project profile                        | Assign a compatible owner before enabling a formatter                                      |

Text is UTF-8 with LF and a final newline. Remove trailing whitespace except where Markdown
uses it deliberately. `.editorconfig` records editor defaults and `.gitattributes` contains
`* text=auto eol=lf` so Windows checkouts preserve the same text bytes. Makefile recipes retain
tabs; Python and Rust use four-space editor indentation.

Keep formatter scopes disjoint, including embedded code. Exclude dependencies, generated builds,
caches, vendored assets and local runtime data explicitly. Generated files that remain committed
must be reproduced by their generator, not manually reformatted. Lockfiles belong to their
package manager; exclude them from writing formatters when their serialization differs.

`format` writes formatting changes. `check:format` verifies all active language profiles without
writing and exits nonzero on differences. Both use the same pinned tools and scopes; include
Rust when present. Linting, import reordering and type checking are separately named operations.
CI runs the check command; formatting on save and local hooks are conveniences.

For adoption, format the affected files first and put any repository-wide normalization into
a dedicated change. Do not mix it into a functional change or overwrite unrelated local edits.

## 3. Predictable commands and toolchains

For an npm-based project, expose this command interface. A profile may document equivalent
commands where an established framework or another language requires them.

| Command                        | Meaning                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `npm ci`                       | Install the committed JavaScript dependency graph                                             |
| `npm run doctor`               | Report required runtimes, versions and dependencies; give actionable failures                 |
| `npm start`                    | Start the complete local application, including required services                             |
| `npm run dev`                  | Start only the frontend with hot reload; document its backend requirement                     |
| `npm run format`               | Format every active language profile                                                          |
| `npm run check:format`         | Check the same formatting scopes without writing                                              |
| `npm run check`                | Run static quality gates; enumerate them in the profile                                       |
| `npm run build`                | Type-check compiled frontend code and create the production build                             |
| `npm test`                     | Run the documented default automated suite once                                               |
| `npm run test:e2e`             | If applicable, test the documented running application mode                                   |
| `npm run release:preflight`    | Validate the release inputs and all applicable release gates                                  |
| `npm run set-version -- patch` | Prepare a reviewed version update; also accept `minor`, `major` or an explicit stable version |

A green `check` does not imply tests or a production build passed unless it actually runs them.
Do not implement placeholder commands that succeed while required work is skipped.

Pin build runtimes and formatter versions exactly in tracked configuration. Record the package
manager version and commit its lockfile. Runtime-manager files and CI values are generated from
or checked against the project's declared source. Upgrades are reviewed changes to these pins;
the baseline does not freeze every project to the illustrative version numbers in its templates.

Language and formatter profiles are extensible. Inventory maintained source before adding one,
excluding dependencies, generated output, caches and vendored code. Unknown languages require
a project-specific, verified profile: this baseline does not guess commands or versions, install
packages automatically, or require Node solely to provide a common command surface.

Development may support a broader runtime range if documented. Release checks use exact pins.
Select Python through the project environment or a resolver that tests both version compatibility
and required imports. Verify the actual interpreter used by the operation. A bare `python` is
appropriate inside a selected environment; arbitrary PATH discovery alone is insufficient.

## 4. Complete and identifiable local startup

The launcher resolves paths from its own repository location, starts the services in dependency
order, and reports ready only when all required services are usable. Starting never implicitly
installs dependencies, builds a release or changes a version.

- Bind development services to loopback by default. Validate configured ports as integers in
  the range 1–65535. Distinct services have distinct ports.
- Resolve frontend URL, backend URL, proxy target and test target from one configuration. An
  override must reach every consumer; document any intentionally separate test server.
- Fail clearly on an occupied port. Do not silently choose the next port, terminate an unknown
  listener or mistake it for the process just launched.
- Probe application identity and readiness with a bounded deadline. A successful HTTP status
  alone is insufficient. In local development, verify a per-launch instance identity or another
  mechanism that proves the response belongs to this launch and checkout.
- Prefix logs by service and print the effective URLs, mode, version and source revision. Report
  missing tools, spawn errors, timeouts and early child exits with a nonzero result.
- Ctrl+C, startup failure and unexpected service exit clean up the launcher's own process trees.
  Use bounded graceful shutdown followed by termination of only the owned processes.
- Document backend reload behavior. After a backend change, either reload automatically or
  restart the owned server before claiming the running application includes the change.

Parallel projects and worktrees use separate port sets and isolated writable development data.
Make those settings explicit; shared default ports do not constitute worktree support. Local
checkout paths and instance identifiers stay in local diagnostics, not public metadata endpoints.

Keep development mode and production-preview mode explicit. If end-to-end tests use built assets,
build first and launch that artifact. Hot-reload or unit-test success cannot prove a packaged
frontend is fresh.

## 5. Product version and build identity

Each independently released product has one authoritative version source. For a multi-language
application, use a root `VERSION` file with `MAJOR.MINOR.PATCH`; a single-package project may use
`package.json` when its profile declares that as the source. Independently released packages may
have separate sources with explicit ownership and compatibility rules.

Use patch for compatible fixes, minor for compatible functionality, and major for incompatible
public contracts. Before 1.0, document compatibility expectations. Prereleases require an explicit
profile and parser support; do not assume a three-integer updater handles them.

All manifest copies and runtime displays derive from the authoritative source. The updater
validates the complete target set before changing files, updates it as one transaction with
rollback on failure, and rejects non-increasing stable versions. It does not commit, push, tag or
publish implicitly. Existing tags and published versions are checked again at the release gate.

For a production frontend, embed the version and source identity at build time. A diagnostic or
About view reads that bundle's metadata; it must not label an old frontend using only the current
backend version. Record at least product version, source identity and build mode in artifacts.
For untracked builds, use the source revision and mark local modifications as dirty. Use an
explicit unknown revision for source archives where Git metadata is unavailable.

For committed build output, use a deterministic source-content digest with a declared input set
that excludes generated output. Embedding the hash of the commit that contains those generated
bytes would make an identical rebuild impossible. Bind the exact release commit through packaging
metadata and the release manifest after the tracked-output freshness check, then test that final
artifact. If version changes affect committed assets, regenerate them as part of the version
update and include them in its validated transaction and rollback behavior.

Release manifests add the exact source revision, artifact digests and build-run identity. Build and test the exact revision
being released, then publish those verified artifacts without rebuilding them. Public release
versions are immutable. The profile names what triggers publication so a merge or push cannot
unexpectedly be treated as a harmless version-file update.

Generated build output is normally ignored by Git. If distribution requires committed output,
record the reason, rebuild it with source changes, and make CI reject any difference, including
new untracked build files. This is a distribution choice, not a requirement for every frontend.

## 6. CI/CD and tagged releases

CI uses the project's actual local commands and declared runtime pins with locked dependency
installation. Run applicable formatting, static checks, meaningful tests, and production/artifact
checks; name what the aggregate gate includes. Require success for all relevant jobs, including
matrix entries. Tests cover changed behavior and important failure paths; a placeholder or a
suite that discovered no required tests is not evidence of correctness. Add integration, end-to-end,
installation, or platform checks where the supported product needs them, not as empty scaffolding.

Record the provider, triggers, required checks, permissions, supported targets and evidence in the
project profile. Use the optional [CI/CD profile](templates/CI_CD_PROFILE.md) for a larger delivery
pipeline. Keep required-check reporting stable when optimizing paths, matrices or concurrency;
do not leave a required workflow permanently pending or let an aggregate gate conceal failure.
Bound job time and cancel obsolete change checks where safe. Serialize publication/deployment to
the same target without cancelling an operation that may already have changed external state.
Record queued-release retention/retry policy and prevent stale channel promotion; serial execution
alone does not promise that every tag is processed in version order.

New release configurations build on tagged product versions by default. Resolve the tag to an
exact commit, validate its pattern against the authoritative product version, and run release
gates for that revision before publishing. The tag pattern, permitted source lineage, channels,
and any signature policy are explicit project decisions. A passing earlier PR run or the existence
of a tag does not establish release readiness. Existing other triggers remain documented local
exceptions or migration needs until their change is requested.

Separate validation/build from publication and deployment. Produce identifiable artifacts with a
manifest binding version, exact source revision, build-run identity, and digests. Promotion verifies
the expected producer and manifest, then reuses those artifacts without rebuilding. Missing or
mismatched artifacts and required tests, signatures or attestations fail the release. Enable only
supported targets with real entrypoints and validation. CI-only projects need no deployment stub.

Use least-privilege job credentials and protected trust boundaries. Untrusted change code must
not execute with release credentials. Pin external actions to verified immutable revisions and
container build inputs to digests where applicable; record update ownership. Dependency caches
are a speed optimization, never successful-check evidence or an unchecked release handoff.
Record secret names and their owning environment, never secret values, in project documentation.

Publication and deployment triggers, environments, gates, and recovery are declared separately.
Automation is allowed within that policy; this standard does not impose manual-only releases.
Keep published versioned artifacts immutable, make retry/recovery behavior explicit, and document
rollback to an identified verified artifact plus any data/schema constraints. A rollback must not
overwrite an existing version with different bytes.

`cicd` owns pipeline wiring and delivery policy; `tooling` owns the local commands it calls.
Read-only Check never triggers a pipeline or changes remote controls. An Update changes remote
rules, secrets or environments only within the authorized scope. Local syntax validation,
remote enforcement settings and successful pipeline runs are distinct evidence; unavailable
credentials or hosted checks remain unverified. Profiles predating this scope start unassessed.

## 7. Adoption, selective updates and evidence

**Check** inspects only the requested scopes and reports actual state against the selected
immutable baseline. It keeps local files untouched: do not edit the profile, install tools, run a
formatter in write mode, start the application or apply fixes. Existing read-only commands may
run when their prerequisites are already available. Report unavailable checks as unverified and
do not advance adopted versions or replace historical evidence.

For **Start** and **Update**:

1. Record the requested scopes, inspect current configuration and local changes, and fill out the
   applicable profile components with verified commands and sources.
2. Adopt only active language templates in scope, merging settings and preserving unrelated
   scripts. Record pending command or launcher work before claiming compliance.
3. For formatting or language changes, verify write/check parity in disposable fixtures and run
   relevant static gates. Apply formatter writes to maintained source only when that
   normalization is part of the requested change.
4. For launcher changes, check readiness, a missing dependency, an occupied port, a configured
   alternate port, early child failure and Ctrl+C cleanup. Check worktree isolation if supported.
5. For version tooling changes, verify manifest agreement, rejected downgrade, failure rollback
   and served frontend identity. Run destructive failure cases in disposable fixtures.
6. Update affected CI checks within the authorized scope; otherwise record the dependency. For
   CI/CD changes validate event/ref/version handling, job gates, permissions and artifact handoff,
   with accepted and rejected inputs for changed contract logic. Record actual remote checks and
   runs separately from local validation.
7. Record adopted and target versions for each completed
   component, and document justified exceptions. Preserve previous immutable baseline material
   and verification history. Upgrade other repositories through separate reviewed changes; this
   baseline does not migrate them automatically.
