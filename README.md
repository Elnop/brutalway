# template-vite

A Vite + React + TypeScript starter where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them puts a file in the wrong folder, imports across features or leaves a comment, `npm run check` fails and says what to do.

The example app is a small floor plan editor. It is there so every rule has real code to check: delete it and keep the structure.

Part of [elnop-stacks](https://github.com/Elnop/elnop-stacks). The lint rules come from the `@elnop/*` packages published from [Elnop/eslint-plugins](https://github.com/Elnop/eslint-plugins).

## Getting started

Node 26 is required (`.nvmrc`, and `.npmrc` refuses other versions).

```sh
nvm use
npm install
npx playwright install --only-shell chromium
npm run dev
```

`npm install` also points git to `.githooks/`, so every commit runs `npm run check` first.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run check` | Prettier, both `tsc` projects, Oxlint, dependency-cruiser, check-tree, alint, knip |
| `npm test` | Vitest: unit tests in Node, component tests in headless Chromium |
| `npm run e2e` | builds, then runs Playwright against `vite preview` |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build` in one job and `e2e` in another.

## Layout

```
src/
  app/        composes the features
  features/   one folder per feature, never imported by another feature
  states/     business state shared by several features
  shared/     code with no domain, used everywhere
```

Each layer only imports the layers below it. A feature can hold sub-features in `features/<x>/features/<y>/` and a `shared/` folder for what its sub-features have in common. In the example, `src/states/floor-plan/` holds the rooms and the selected room, read by both `src/features/editor/` and `src/features/summary/`.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props. One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.

[docs/verifications.md](docs/verifications.md) lists every rule and the tool that enforces it.

## Working with an agent

`.claude/settings.json` runs `.claude/hooks/lintEditedFile.ts` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree when a file is created. Errors go back to the agent, which fixes them before moving on. Every message says what to change, so the agent does not need to know the convention beforehand.

## Starting your own app

1. Delete `src/features/`, `src/states/floor-plan/`, the files in `src/shared/` and the specs in `e2e/` except `e2e/fixtures.ts`.
2. Write your first feature in `src/features/<name>/` and render it from `src/app/App.tsx`.
3. Run `npm run check` often. The structure rules only make sense once there are a few files, so expect it to push you toward folders as the app grows.
