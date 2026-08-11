# Contributing to Physics Command Center

## Change workflow

1. Inspect the current route, registry data, calculation utility, tests, and responsive styles that
   already serve the requested feature.
2. Make the smallest complete change that preserves existing behavior.
3. Keep educational content in the registries and physics calculations in `src/utils/`.
4. Add or update tests for calculations, conversions, relationships, or registry integrity.
5. Run `pnpm verify` and fix every failure before committing.
6. Review `git status` and stage only files that belong to the change.
7. Create one concise, descriptive commit. Do not combine unrelated work.

## Physics module quality gate

A specialized simulation is complete only when:

- its controls and numerical outputs use consistent SI units;
- vectors, signs, magnitude, motion, and graphs reflect the same state;
- assumptions and model limits are visible;
- play, pause, reset, and scrubbing remain synchronized where time is involved;
- keyboard, reduced-motion, tablet, and phone behavior have been checked;
- calculations and registry connections have automated coverage.

Do not replace a pending module with a decorative generic animation. Use the Newton’s Second Law
vertical slice as the reference standard.

## Formula registry changes

When adding or changing a formula:

- update the appropriate file in `src/data/formulas/`;
- reuse definitions from `src/data/variables.ts`;
- keep expression tokens linked to declared variable IDs;
- provide units, rearrangements, dimensional analysis, assumptions, common mistakes, examples,
  practice templates, relationships, difficulty, and search tags;
- update data-integrity or calculation tests as needed;
- render through the existing Formula Inspector rather than creating a separate page.

## Git and commits

The canonical remote is `https://github.com/vivodrinkfanta/Physics_command_center.git`, and the
release branch is `main`. A normal local change does not require running `git init`, replacing the
remote, or using destructive reset commands.

Examples of focused commit messages:

- `Build kinetic energy simulation`
- `Add synchronized kinematics graphs`
- `Expand projectile calculation coverage`
- `Improve Formula Inspector accessibility`

For the current project-owner workflow, commit locally on `main`, then publish through
**GitHub Desktop → Push origin**. Never include generated `dist/` output or unrelated working-tree
changes in a commit.
