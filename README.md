# Physics Command Center

Physics Command Center is an independent IB-aligned Physics pathway organized around the syllabus
for first assessment 2025. It combines 24 released A–E study modules with a searchable mechanics
formula registry, reusable Formula Inspectors, unit and dimension tools, original practice,
relationship mapping, and twelve calibrated mechanics workbenches.

- Cloudflare Pages: [physics-command-center.pages.dev](https://physics-command-center.pages.dev/)
- GitHub Pages: [vivodrinkfanta.github.io/Physics_command_center](https://vivodrinkfanta.github.io/Physics_command_center/)
- Repository: [github.com/vivodrinkfanta/Physics_command_center](https://github.com/vivodrinkfanta/Physics_command_center)

## Current scope

The student pathway covers all 24 official topic codes with guided notes, representative
relationships, worked reasoning, interactive evidence inquiries, and 243 original questions. The
deep numerical-instrument layer remains deliberately mechanics-focused: 21 formula records cover
Kinematics, Forces, Energy, Momentum, Circular Motion, Projectiles, and Oscillations.

This project is not endorsed, licensed, or certified by the International Baccalaureate. “Released”
means the module passes the repository's learning-pathway contract; it does not mean every equation
has a dedicated numerical Formula Inspector or that the tool replaces the official subject guide.

| Area | Status |
| --- | --- |
| IB Study Map with SL, HL, and All pathways across themes A–E | Complete for all 24 topic codes |
| Guided module notes, worked reasoning, relationship assumptions, and evidence inquiries | Complete under the release contract |
| Original practice with module, level, style, difficulty, skill, and progress filters | 243 functional questions |
| Versioned local attempts, best scores, hint use, mastery, reset, and continue studying | Complete |
| Application shell, persistent collapsible unit navigation, and command palette | Complete |
| Homepage projectile instrument and mechanics topic atlas | Complete |
| Formula Library and reusable Formula Inspector | Complete |
| Units, dimensions, rearranging, examples, practice, and relationships | Complete for all 21 registry formulas |
| Newton’s Second Law simulation, graphs, prediction, and synchronized motion | Benchmark complete |
| Kinetic Energy simulation, graphs, and synchronized motion | Benchmark complete |
| Kinematics and Projectile simulations with synchronized graphs | Benchmark complete |
| Momentum collision and Gravitational Potential Energy simulations | Benchmark complete |
| Circular Motion and Hooke’s Law simulations with synchronized graphs | Benchmark complete |
| Speed, acceleration, complete SUVAT family, and free-fall modeling | Complete |
| Weight, friction, normal/tension diagrams, and inclined-plane guidance | Complete |
| Work, power, elastic energy, and conservation accounting | Complete |
| Impulse, momentum change, and centripetal resultant force | Complete |

Every registered V1 formula now has a specialized physical instrument and live graph mode. Future
formulas should be added only with the same calculation, interaction, accessibility, and responsive
quality standard rather than as placeholder modules.

## Routes

- `/` — interactive homepage
- `/explore` — mechanics topic atlas
- `/curriculum` — IB-aligned A–E Study Map
- `/curriculum/:topicCode` — released syllabus-module pathway
- `/formulas` — searchable Formula Library
- `/formulas/:formulaId` — registry-driven Formula Inspector
- `/simulations` — simulation readiness index
- `/practice` — practice catalog
- `/practice/:questionId` — functional question, hints, evaluation, and guidance

The Formula Inspector supports Simulate, Explain, Rearrange, Units, Dimensions, Graph, Example,
Practice, and Related modes. Each mode is a deep link that can be opened or dragged into another
browser tab or window. The global command palette opens with `Cmd/Ctrl + K` or `Cmd/Ctrl + F`.

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
├── data/           Curriculum, relationship, practice, formula, topic, route, and variable registries
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

The original eight benchmark laboratories and four shared expansion workbenches are complete. They
cover Newton’s laws, the complete constant-acceleration family, free fall, contact forces, energy
transfer and conservation, collisions and impulse, projectiles, circular motion, and springs.

The homepage projectile is a compact demonstration, not the finished Projectile Formula Inspector.

### Phase 3 — Learning instruments

The shared rearranging, units, dimensions, practice, prediction, and relationship systems are in
place. Live graph and simulation synchronization is complete across all 21 V1 formulas.

### Phase 4 — Remaining mechanics depth

The seven-domain atlas, reusable data architecture, 21 V1 formulas, and twelve mechanics
workbenches are complete. Future scope can deepen mechanics or introduce a new subject without
placeholder modules.

### Phase 5 — IB-aligned student pathway

Complete: official A–E topic structure, SL/HL availability, 24 release-gated module pages, local
student progress, 243 original assessment-style questions, explicit physics-skill filtering, and a
generated 462-deep-link production route manifest. Future additions must stay outside student
navigation until their content and route contracts pass.

## Deployment

Cloudflare Pages builds the repository root with `pnpm build` and publishes `dist`.

GitHub Pages is deployed by [deploy-pages.yml](.github/workflows/deploy-pages.yml). GitHub Pages mode
uses the `/Physics_command_center/` Vite base and adds `dist/404.html` for single-page route fallback.
Pull requests run the same full verification gate through
[quality.yml](.github/workflows/quality.yml).
