# Physics Command Center

Physics Command Center is an interactive mechanics workspace for exploring equations as physical
models rather than isolated facts. It combines a searchable formula registry, reusable Formula
Inspectors, unit and dimension tools, practice problems, relationship mapping, and calibrated
Newton’s Second Law and Kinetic Energy simulations.

- Cloudflare Pages: [physics-command-center.pages.dev](https://physics-command-center.pages.dev/)
- GitHub Pages: [vivodrinkfanta.github.io/Physics_command_center](https://vivodrinkfanta.github.io/Physics_command_center/)
- Repository: [github.com/vivodrinkfanta/Physics_command_center](https://github.com/vivodrinkfanta/Physics_command_center)

## Current scope

The V1 scope is mechanics. Eight formula records currently cover Kinematics, Forces, Energy,
Momentum, Circular Motion, Projectiles, and Oscillations.

| Area | Status |
| --- | --- |
| Application shell, responsive navigation, and command palette | Complete |
| Homepage projectile instrument and mechanics topic atlas | Complete |
| Formula Library and reusable Formula Inspector | Complete |
| Units, dimensions, rearranging, examples, practice, and relationships | Complete for all eight registry formulas |
| Newton’s Second Law simulation, graphs, prediction, and synchronized motion | Benchmark complete |
| Kinetic Energy simulation, graphs, and synchronized motion | Benchmark complete |
| Remaining specialized Formula Inspector simulations and graphs | Intentionally pending benchmark-quality implementation |

Pending does not mean that a generic animation has been counted as a completed physics model. New
specialized modules should be delivered one at a time and should meet the Newton benchmark for
accuracy, synchronization, accessibility, and responsive behavior.

## Routes

- `/` — interactive homepage
- `/explore` — mechanics topic atlas
- `/formulas` — searchable Formula Library
- `/formulas/:formulaId` — registry-driven Formula Inspector
- `/simulations` — simulation readiness index
- `/practice` — practice catalog

The Formula Inspector supports Simulate, Explain, Rearrange, Units, Dimensions, Graph, Example,
Practice, and Related modes. The global command palette opens with `Cmd/Ctrl + K` or `Cmd/Ctrl + F`.

## Run locally

Requirements:

- Node.js 24
- pnpm 11.16.0

```bash
pnpm install
pnpm dev
```

Vite prints the local URL, normally `http://localhost:5173/`.

To check the production bundle locally:

```bash
pnpm build
pnpm preview
```

## Verification

Run the complete repository gate before committing:

```bash
pnpm verify
```

That command runs the calculation and data-integrity tests, TypeScript checking, the ordinary
Cloudflare build, and the GitHub Pages build. The individual commands remain available:

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm build:github-pages
```

## Architecture

```text
src/
├── components/     Reusable interface, inspector, graph, and simulation components
├── data/           Formula, topic, and variable registries
├── hooks/          Shared interaction behavior
├── pages/          Route-level composition
├── styles/         Design tokens and feature-scoped responsive styles
├── types/          Formula and topic contracts
└── utils/          Testable physics, units, practice, search, and layout calculations
```

Important design boundaries:

- Equations, variables, assumptions, mistakes, examples, and relationships belong in the central
  registries, not inside presentation components.
- Physics calculations belong in testable utilities and use SI units internally.
- A `simulationType` or `graphTypes` registry value describes intended capability; it does not mean
  a specialized instrument is complete.
- Simple SVG and lightweight calculations are preferred when they are clearer than a dependency.
- Existing routes, keyboard behavior, reduced-motion handling, and 390px layouts must be preserved.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the implementation and commit workflow.

## Incremental roadmap

### Phase 1 — Core platform

Complete: routing, navigation, design system, formula data model, Formula Library, and Formula
Inspector shell.

### Phase 2 — Benchmark simulations

Newton’s Second Law and Kinetic Energy are complete. Continue with one high-quality vertical slice
at a time in this order: Kinematics, Projectile Motion, then Momentum/Collisions.

The homepage projectile is a compact demonstration, not the finished Projectile Formula Inspector.

### Phase 3 — Learning instruments

The shared rearranging, units, dimensions, practice, prediction, and relationship systems are in
place. Live graph and simulation synchronization is complete for Newton and Kinetic Energy and
should be extended only alongside each specialized module.

### Phase 4 — Remaining mechanics depth

The seven-domain atlas and reusable data architecture are complete. Additional formulas and
specialized instruments should be added incrementally after the Phase 2 benchmark sequence rather
than as placeholder modules.

## Deployment

Cloudflare Pages builds the repository root with `pnpm build` and publishes `dist`.

GitHub Pages is deployed by [deploy-pages.yml](.github/workflows/deploy-pages.yml). GitHub Pages mode
uses the `/Physics_command_center/` Vite base and adds `dist/404.html` for single-page route fallback.
Pull requests run the same full verification gate through
[quality.yml](.github/workflows/quality.yml).
