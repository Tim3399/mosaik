# mosaik

A design kit for agents: a versioned React component library that lets agents assemble tool
frontends from ready-made, consistent building blocks instead of writing individual frontend
code. The repository contains the library (`@tim3399/mosaik`) and a showcase built from it.

**Status:** early development. Nothing is published yet, and the API will change.

## License

mosaik is **source-available, not open source**. [LICENSE.md](LICENSE.md) combines the
PolyForm Noncommercial License 1.0.0 with an additional permission for small companies. In
short, and without legal effect:

- Noncommercial use is permitted, including by charities, educational, research and government
  institutions.
- Commercial use is permitted for companies whose combined annual revenue, including affiliated
  organizations, is below 100,000 euros. Commissioned work is only covered if the client also
  stays below that limit.
- Any other commercial use is not permitted.

Only the text of [LICENSE.md](LICENSE.md) is binding. External contributions are not accepted at
this time.

## Requirements

- Node.js 22.23.2 (see `.nvmrc`) and npm 10.9.8
- Git

## Setup

```bash
npm ci
npm run doctor
```

## Commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run doctor`       | Report runtime, dependency and browser prerequisites |
| `npm run format`       | Format all maintained files (Biome and Prettier)     |
| `npm run check:format` | Verify formatting without writing                    |

The complete command map, pins and pending work are in
[docs/PROJECT_PROFILE.md](docs/PROJECT_PROFILE.md).

## Documentation

- [Implementation plan](docs/implementation-plan.md) (German): requirements and work packages
- [Decisions](docs/decisions.md) (German): technical and licensing decisions with evidence
- [Component contract](docs/component-contract.md): rules for every public component
- [Frontend styleguide](docs/design/FRONTEND_STYLEGUIDE.md) (German): general design quality rules
- [Agent instructions](AGENTS.md)
