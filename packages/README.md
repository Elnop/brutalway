# Packages

The rules and every shared config are published from this folder as `@brutalway/*`, next to `create-brutal`, the CLI behind `npm create brutal`. Each package has its own README. The templates use them through their configs, and each template README lists the tools it uses and how they map to the [common rules](../docs/reference/rules.md).

Each one installs on its own, in a project that did not start from a template: `npm install --save-dev @brutalway/oxlint-config-typescript`, for example. Their npm pages are linked below, and all of them are listed under the [`@brutalway`](https://www.npmjs.com/org/brutalway) scope.

## Tools

| Package | What it does | npm |
|---|---|---|
| [`create-brutal`](tools/create-brutal) | the CLI behind `npm create brutal` | [npm](https://www.npmjs.com/package/create-brutal) |
| [`@brutalway/playwright-fixtures`](tools/playwright-fixtures) | fail a test when the page throws, axe-core violations as readable lines | [npm](https://www.npmjs.com/package/@brutalway/playwright-fixtures) |

## AI

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/agent-hook`](tools/agent-hook) | Claude Code hook: oxlint on each edited file, stylelint on each edited stylesheet, alint and check-tree on each created file, errors sent back to the agent | [npm](https://www.npmjs.com/package/@brutalway/agent-hook) |

## Checks

### Source tree

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/check-tree`](tools/check-tree) | no empty folder, no category folder holding a single file, stylesheets in `styles/`, query key factories in `keys/`, except a CSS Module, which stays next to its component | [npm](https://www.npmjs.com/package/@brutalway/check-tree) |

### Docs

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/check-doc-length`](tools/check-doc-length) | fails when a Markdown file is longer than 300 lines, and splits it into a folder along its headings, rewriting the links that point into it | [npm](https://www.npmjs.com/package/@brutalway/check-doc-length) |
| [`@brutalway/check-doc-links`](tools/check-doc-links) | fails when a Markdown doc links to a page that is gone, and skips the check offline | [npm](https://www.npmjs.com/package/@brutalway/check-doc-links) |
| [`@brutalway/check-doc-sources`](tools/check-doc-sources) | warns when a file cited by a Markdown doc changed and the doc did not | [npm](https://www.npmjs.com/package/@brutalway/check-doc-sources) |

## Plugins

The rules these plugins hold run in both Oxlint and ESLint.

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/eslint-plugin-file-named-after-export`](plugins/eslint-plugin-file-named-after-export) | a file with a single export is named after it | [npm](https://www.npmjs.com/package/@brutalway/eslint-plugin-file-named-after-export) |
| [`@brutalway/eslint-plugin-store-layout`](plugins/eslint-plugin-store-layout) | `xStore.ts` only exports `xStore` and `xActions` | [npm](https://www.npmjs.com/package/@brutalway/eslint-plugin-store-layout) |

## Configs

### Oxlint

#### Base

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/oxlint-config-typescript`](configs/oxlint-config-typescript) | TypeScript base: no comments, no `index.ts`, file named after its single export, exported types in `XTypes.ts` and exported constants in `XConfig.ts`, function declarations, `type` over `interface` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript) |
| [`@brutalway/oxlint-config-node`](configs/oxlint-config-node) | Node code in TypeScript: the TypeScript base, the `#src/` alias instead of relative imports, `fetch` only in an `xClient.ts` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-node) |
| [`@brutalway/oxlint-config-node-test`](configs/oxlint-config-node-test) | `node:test` suites: `it()` inside `describe()`, `node:assert/strict` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-node-test) |

#### Front-end

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/oxlint-config-react`](configs/oxlint-config-react) | extends the TypeScript base: React hooks rules, a component types its props with a named `XProps` type, `fetch` only in an `xClient.ts` and never in an effect | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-react) |
| [`@brutalway/oxlint-config-react-vite`](configs/oxlint-config-react-vite) | React + Vite + zustand + Vitest preset: imports through aliases, CSS and `?raw` imports allowed, Node env for `e2e/` and `*.config.ts` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-react-vite) |
| [`@brutalway/oxlint-config-tailwind`](configs/oxlint-config-tailwind) | Tailwind CSS v4: colors only from the `@theme` tokens, with the closest tokens in the message, `font-display` on headings and `font-mono` on code, no `dark:` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-tailwind) |
| [`@brutalway/oxlint-config-shadcn`](configs/oxlint-config-shadcn) | shadcn/ui: no raw `<button>`, `<input>`, `<select>` or `<textarea>` when a primitive does the job, icons only from `lucide-react` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-shadcn) |
| [`@brutalway/oxlint-config-i18next`](configs/oxlint-config-i18next) | i18next: no visible text in JSX, in `aria-label`, `placeholder`, `title` or `alt`, nor in a template literal, through `eslint-plugin-i18next` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-i18next) |
| [`@brutalway/oxlint-config-react-hook-form`](configs/oxlint-config-react-hook-form) | react-hook-form: every `useForm` validates through `zodResolver`, no validation passed to `register` or a `Controller` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-react-hook-form) |
| [`@brutalway/oxlint-config-tanstack-query`](configs/oxlint-config-tanstack-query) | TanStack Query: query keys from an `xKeys` factory, `staleTime` and `gcTime` from named profiles, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-tanstack-query) |
| [`@brutalway/oxlint-config-zustand`](configs/oxlint-config-zustand) | `xStore.ts` only exports `xStore` and `xActions`, `xSelectors.ts` only exports `selectX` functions | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-zustand) |
| [`@brutalway/oxlint-config-vitest`](configs/oxlint-config-vitest) | `it()` inside `describe`, `test()` outside, typed mocks, `toThrow` with the expected message | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-vitest) |

#### Back-end

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/oxlint-config-fastify`](configs/oxlint-config-fastify) | Fastify + Zod: env read in `xEnv.ts`, no `decorate`, async handlers return, schemas in `xSchemas.ts`, no route under `shared-features/` | [npm](https://www.npmjs.com/package/@brutalway/oxlint-config-fastify) |

### TypeScript

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/tsconfig`](configs/tsconfig) | strict TypeScript base with every extra strictness flag, Node and React + Vite variants, and a React + Vite variant for vendored code that lifts the two flags shadcn/ui breaks | [npm](https://www.npmjs.com/package/@brutalway/tsconfig) |

### Formatting

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/prettier-config`](configs/prettier-config) | single quotes, trailing commas, 100 columns, and a `tailwind` variant that sorts the classes | [npm](https://www.npmjs.com/package/@brutalway/prettier-config) |

### Styles

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/stylelint-config`](configs/stylelint-config) | stylesheets: colors only from the custom properties of `src/app/globals.css`, with the closest tokens in the message, each `X.module.css` next to its `X.tsx` with every class used and written in camelCase | [npm](https://www.npmjs.com/package/@brutalway/stylelint-config) |

### Architecture

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/dependency-cruiser-config`](configs/dependency-cruiser-config) | the four layers, route, service and query rules for servers, no import between features, pure presenters, stores in their folder and holding no server data | [npm](https://www.npmjs.com/package/@brutalway/dependency-cruiser-config) |
| [`@brutalway/alint-config`](configs/alint-config) | category folders hold only their kind, pinned dependencies, doc links and anchors resolve | [npm](https://www.npmjs.com/package/@brutalway/alint-config) |

## Shared helpers

The lint packages install it as a dev dependency, and tsdown bundles it into their `dist`.

| Package | What it does | npm |
|---|---|---|
| [`@brutalway/lint-utils`](utils/lint-utils) | helpers for the plugins and configs: exports of a module, oxlint rule and fixture testers, oklab conversion and cached color token reading | [npm](https://www.npmjs.com/package/@brutalway/lint-utils) |
