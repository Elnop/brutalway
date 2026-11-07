# template-vite

A Vite + React + TypeScript starter where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them puts a file in the wrong folder, imports across features or leaves a comment, `npm run check` fails and says what to do.

The example app is a todo list. It is there so every rule has real code to check: delete it and keep the structure. The look is neo-brutalist (thick black borders, flat bright colors, hard shadows), shared by every template of the series and easy to swap: the tokens are at the top of `src/app/globals.css`.

Part of [brutalway](https://github.com/Elnop/brutalway), which also publishes the `@brutalway/*` packages holding the rules and configs: this repository only holds what is specific to it.

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
| `npm run check` | Prettier, both `tsc` projects, Oxlint, stylelint, dependency-cruiser, check-tree, jscpd, i18next-cli, alint, knip |
| `npm test` | Vitest: unit tests in Node, component tests in headless Chromium |
| `npm run e2e` | builds, then runs Playwright against `vite preview` |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build` in one job and `e2e` in another.

## Translations

Every string the user reads goes through [i18next](https://www.i18next.com), even with a single language: `t('add')`, not `Add`. The messages are JSON, one file per language and namespace in `src/app/locales/en/`, and each slice has its own namespace (`app`, `todoList`, `todoStats`). `src/app/createI18n.ts` imports them and `src/main.tsx` hands the instance to the app. To add a language, add its folder next to `src/app/locales/en/`, import its files in `src/app/createI18n.ts` and list it under `locales` in `i18next.config.ts`.

## Layout

```
src/
  app/              composes the features
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain, used everywhere
```

Each layer only imports the layers below it. A feature can hold sub-features in `features/<x>/features/<y>/` and a `shared/` folder for what its sub-features have in common, and a sub-feature can do the same, down to ten levels. In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`. No slice name appears in two layers.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props. One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.

[docs/verifications.md](docs/verifications.md) lists every rule and the tool that enforces it.

[docs/architecture.md](docs/architecture.md) lists the architecture patterns this template borrows from, with what it takes and what it leaves out.

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.

## Working with an agent

`.claude/settings.json` runs `@brutalway/agent-hook` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree when a file is created. Errors go back to the agent, which fixes them before moving on. Every message says what to change, so the agent does not need to know the convention beforehand.

## Starting your own app

1. Delete `src/features/`, `src/shared-features/todos/`, the `todoList` and `todoStats` namespaces (their JSON in `src/app/locales/en/` and their lines in `src/app/createI18n.ts`), the files in `src/shared/` and `e2e/todos.spec.ts`. `e2e/app.spec.ts` and `e2e/openApp.ts` work on any app whose first screen has an `h1`.
2. Write your first feature in `src/features/<name>/` and render it from `src/app/App.tsx`.
3. Run `npm run check` often. The structure rules only make sense once there are a few files, so expect it to push you toward folders as the app grows.
