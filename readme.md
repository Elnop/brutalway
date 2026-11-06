# BRUTAL

Project templates where the conventions are enforced by deterministic checks. When several people or AI agents write in the same codebase, a convention that is only written down drifts within days. Here each one is a lint rule, an import rule or a tree rule, and `npm run check` fails with a message that says what to change.

Every template builds the same todo list, so the stacks can be compared side by side. The front ends share one neo-brutalist look (thick black borders, flat bright colors, hard shadows), and so does the Swagger UI of the API.

| Template | Stack | Status |
|---|---|---|
| [template-vite](https://github.com/Elnop/template-vite) | Vite, React, zustand, Vitest, Playwright | ready |
| [template-fastify](https://github.com/Elnop/template-fastify) | Fastify, Zod, node:sqlite, node:test, Swagger UI | ready |
| template-next | Next.js | planned |
| template-react-native | React Native | planned |

[docs/intent.md](docs/intent.md) explains why the conventions are checked by tools and the six axioms behind them, which spell BRUTAL. [docs/inspirations.md](docs/inspirations.md) lists the architecture principles the templates borrow from, with what they take and what they leave out.

## The common rules

- the code is split into layers (`app`, `features`, `shared-features`, `shared`), each importing only the ones below, and features never import each other
- on the front end, components are orchestrators, which read stores, or presenters, which only get props
- on the API, a route calls its service, and only queries files run SQL
- one way to write each construct, no comments, no relative imports, no barrel files
- files are named after what they export and placed by kind: one file stays at the root of its folder, two or more move into `components/`, `hooks/`, `routes/`, `lib/` and so on
- every dependency is pinned, every path cited in the docs exists, no export goes unused
- a Claude Code hook lints each file the agent edits and sends the errors back to it

## Packages

The rules and every shared config are published from `packages/` as `@brutal/*`. The rule plugins run in both oxlint and ESLint, and each package has its own README. Each template README lists the tools it uses and how they map to the rules above.

| Package | Checks |
|---|---|
| [`@brutal/oxlint-config-typescript`](packages/configs/oxlint-config-typescript) | TypeScript base: no comments, no `index.ts`, file named after its single export, exported types in `XTypes.ts` and exported constants in `XConfig.ts`, function declarations, `type` over `interface` |
| [`@brutal/oxlint-config-react`](packages/configs/oxlint-config-react) | extends the TypeScript base: React hooks rules, a component types its props with a named `XProps` type |
| [`@brutal/oxlint-config-zustand`](packages/configs/oxlint-config-zustand) | `xStore.ts` only exports `xStore` and `xActions`, `xSelectors.ts` only exports `selectX` functions |
| [`@brutal/oxlint-config-vitest`](packages/configs/oxlint-config-vitest) | `it()` inside `describe`, `test()` outside, typed mocks, `toThrow` with the expected message |
| [`@brutal/oxlint-config-react-vite`](packages/configs/oxlint-config-react-vite) | React + Vite + zustand + Vitest preset: imports through aliases, CSS and `?raw` imports allowed, Node env for `e2e/` and `*.config.ts` |
| [`@brutal/oxlint-config-fastify`](packages/configs/oxlint-config-fastify) | Fastify + Zod: env read in `xEnv.ts`, no `decorate`, async handlers return, schemas in `xSchemas.ts`, no route under `shared-features/` |
| [`@brutal/oxlint-config-node-test`](packages/configs/oxlint-config-node-test) | `node:test` suites: `it()` inside `describe()`, `node:assert/strict` |
| [`@brutal/dependency-cruiser-config`](packages/configs/dependency-cruiser-config) | the four layers, route, service and query rules for servers, no import between features, pure presenters, stores in their folder |
| [`@brutal/alint-config`](packages/configs/alint-config) | category folders hold only their kind, pinned dependencies, doc links and anchors resolve |
| [`@brutal/tsconfig`](packages/configs/tsconfig) | strict TypeScript base with every extra strictness flag, Node and React + Vite variants |
| [`@brutal/prettier-config`](packages/configs/prettier-config) | single quotes, trailing commas, 200 columns |
| [`@brutal/eslint-plugin-file-named-after-export`](packages/plugins/eslint-plugin-file-named-after-export) | a file with a single export is named after it |
| [`@brutal/eslint-plugin-store-layout`](packages/plugins/eslint-plugin-store-layout) | `xStore.ts` only exports `xStore` and `xActions` |
| [`@brutal/check-tree`](packages/tools/check-tree) | no empty folder, no category folder holding a single file, stylesheets in `styles/` |
| [`@brutal/playwright-fixtures`](packages/tools/playwright-fixtures) | fail a test when the page throws, axe-core violations as readable lines |
| [`@brutal/agent-hook`](packages/tools/agent-hook) | Claude Code hook: oxlint on each edited file, alint and check-tree on each created file, errors sent back to the agent |
| [`@brutal/lint-utils`](packages/utils/lint-utils) | helpers shared by the plugins |
| [`create-brutal`](packages/tools/create-brutal) | the CLI behind `npm create brutal` |

## Claude Code plugin

`plugins/brutal-checks` runs `@brutal/agent-hook` after each `Edit` or `Write`, in any project that has `@brutal/agent-hook` installed, without editing the project's `.claude/settings.json`. In other projects it does nothing.

```
/plugin install brutal-checks --marketplace Elnop/brutal
```

## Using a template

```sh
npm create brutal my-app
```

The CLI asks for a stack, then for the parts to keep (the example app, e2e tests, the Claude Code hook, CI...). Every combination passes `npm run check`. [create-brutal](packages/tools/create-brutal/README.md) lists the options and the flags to run it without questions.

Each template is also its own GitHub template repository: open it and click "Use this template". This repository holds them as submodules in `templates/`. To get everything at once:

```sh
git clone --recurse-submodules https://github.com/Elnop/brutal.git
```

## Working on this repository

| Folder | |
|---|---|
| `packages/` | the published packages, one npm workspace each |
| `templates/` | template-vite and template-fastify, as git submodules |
| `site/` | the landing page and the docs, made from template-vite and deployed to GitHub Pages |
| `docs/` | the intent and the inspirations |
| `plugins/`, `.claude-plugin/` | the Claude Code plugin and its marketplace |
| `scripts/` | the script that creates a GitHub release for each published version |

```sh
nvm use
npm install
npm run build
npm run check
```

The root lints itself with the packages of the workspace, and the tests load the packages through their built `exports`, so `npm run build` comes first. `npm run check` runs Prettier, both tsc projects, oxlint, knip and every test.

`npm run matrix` creates a project for every combination of CLI options and runs its `npm run check` and `npm test`. With `--local-packages`, the projects install the `@brutal/*` packages packed from this checkout instead of the versions on npm, so a rule can be tried on both templates before it is published. CI runs it that way, with `--e2e`.

Versions are managed with [changesets](https://github.com/changesets/changesets): add one with `npx changeset` for each change to a published package, `create-brutal` included. `npx changeset version` bumps the versions and writes the changelogs, then `npm run release` builds, checks, publishes what changed and creates the GitHub releases. The CLI records the commit of each template submodule when it is built, so commit the submodule bumps before releasing.

`site/` has its own `package.json` and its own `npm run check`. The Pages workflow deploys it on each push that changes it.
