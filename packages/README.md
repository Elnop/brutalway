# Packages

The rules and every shared config are published from this folder as `@brutalway/*`, next to `create-brutal`, the CLI behind `npm create brutal`. Each package has its own README. The templates use them through their configs, and each template README lists the tools it uses and how they map to the [common rules](../README.md#the-common-rules).

## Tools

| Package | What it does |
|---|---|
| [`create-brutal`](tools/create-brutal) | the CLI behind `npm create brutal` |
| [`@brutalway/playwright-fixtures`](tools/playwright-fixtures) | fail a test when the page throws, axe-core violations as readable lines |

## AI

| Package | What it does |
|---|---|
| [`@brutalway/agent-hook`](tools/agent-hook) | Claude Code hook: oxlint on each edited file, stylelint on each edited stylesheet, alint and check-tree on each created file, errors sent back to the agent |

## Checks

### Source tree

| Package | What it does |
|---|---|
| [`@brutalway/check-tree`](tools/check-tree) | no empty folder, no category folder holding a single file, stylesheets in `styles/`, query key factories in `keys/`, except a CSS Module, which stays next to its component |

### Docs

| Package | What it does |
|---|---|
| [`@brutalway/check-doc-length`](tools/check-doc-length) | fails when a Markdown file is longer than 300 lines, and splits it into a folder along its headings, rewriting the links that point into it |
| [`@brutalway/check-doc-links`](tools/check-doc-links) | fails when a Markdown doc links to a page that is gone, and skips the check offline |
| [`@brutalway/check-doc-sources`](tools/check-doc-sources) | warns when a file cited by a Markdown doc changed and the doc did not |

## Plugins

The rules these plugins hold run in both Oxlint and ESLint.

| Package | What it does |
|---|---|
| [`@brutalway/eslint-plugin-file-named-after-export`](plugins/eslint-plugin-file-named-after-export) | a file with a single export is named after it |
| [`@brutalway/eslint-plugin-store-layout`](plugins/eslint-plugin-store-layout) | `xStore.ts` only exports `xStore` and `xActions` |

## Configs

### Oxlint

#### Base

| Package | What it does |
|---|---|
| [`@brutalway/oxlint-config-typescript`](configs/oxlint-config-typescript) | TypeScript base: no comments, no `index.ts`, file named after its single export, exported types in `XTypes.ts` and exported constants in `XConfig.ts`, function declarations, `type` over `interface` |
| [`@brutalway/oxlint-config-node`](configs/oxlint-config-node) | Node code in TypeScript: the TypeScript base, the `#src/` alias instead of relative imports, `fetch` only in an `xClient.ts` |
| [`@brutalway/oxlint-config-node-test`](configs/oxlint-config-node-test) | `node:test` suites: `it()` inside `describe()`, `node:assert/strict` |

#### Front-end

| Package | What it does |
|---|---|
| [`@brutalway/oxlint-config-react`](configs/oxlint-config-react) | extends the TypeScript base: React hooks rules, a component types its props with a named `XProps` type, `fetch` only in an `xClient.ts` and never in an effect |
| [`@brutalway/oxlint-config-react-vite`](configs/oxlint-config-react-vite) | React + Vite + zustand + Vitest preset: imports through aliases, CSS and `?raw` imports allowed, Node env for `e2e/` and `*.config.ts` |
| [`@brutalway/oxlint-config-tailwind`](configs/oxlint-config-tailwind) | Tailwind CSS v4: colors only from the `@theme` tokens, with the closest tokens in the message, `font-display` on headings and `font-mono` on code, no `dark:` |
| [`@brutalway/oxlint-config-shadcn`](configs/oxlint-config-shadcn) | shadcn/ui: no raw `<button>`, `<input>`, `<select>` or `<textarea>` when a primitive does the job, icons only from `lucide-react` |
| [`@brutalway/oxlint-config-i18next`](configs/oxlint-config-i18next) | i18next: no visible text in JSX, in `aria-label`, `placeholder`, `title` or `alt`, nor in a template literal, through `eslint-plugin-i18next` |
| [`@brutalway/oxlint-config-react-hook-form`](configs/oxlint-config-react-hook-form) | react-hook-form: every `useForm` validates through `zodResolver`, no validation passed to `register` or a `Controller` |
| [`@brutalway/oxlint-config-tanstack-query`](configs/oxlint-config-tanstack-query) | TanStack Query: query keys from an `xKeys` factory, `staleTime` and `gcTime` from named profiles, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query` |
| [`@brutalway/oxlint-config-zustand`](configs/oxlint-config-zustand) | `xStore.ts` only exports `xStore` and `xActions`, `xSelectors.ts` only exports `selectX` functions |
| [`@brutalway/oxlint-config-vitest`](configs/oxlint-config-vitest) | `it()` inside `describe`, `test()` outside, typed mocks, `toThrow` with the expected message |

#### Back-end

| Package | What it does |
|---|---|
| [`@brutalway/oxlint-config-fastify`](configs/oxlint-config-fastify) | Fastify + Zod: env read in `xEnv.ts`, no `decorate`, async handlers return, schemas in `xSchemas.ts`, no route under `shared-features/` |

### TypeScript

| Package | What it does |
|---|---|
| [`@brutalway/tsconfig`](configs/tsconfig) | strict TypeScript base with every extra strictness flag, Node and React + Vite variants, and a React + Vite variant for vendored code that lifts the two flags shadcn/ui breaks |

### Formatting

| Package | What it does |
|---|---|
| [`@brutalway/prettier-config`](configs/prettier-config) | single quotes, trailing commas, 200 columns, and a `tailwind` variant that sorts the classes |

### Styles

| Package | What it does |
|---|---|
| [`@brutalway/stylelint-config`](configs/stylelint-config) | stylesheets: colors only from the custom properties of `src/app/globals.css`, with the closest tokens in the message, each `X.module.css` next to its `X.tsx` with every class used and written in camelCase |

### Architecture

| Package | What it does |
|---|---|
| [`@brutalway/dependency-cruiser-config`](configs/dependency-cruiser-config) | the four layers, route, service and query rules for servers, no import between features, pure presenters, stores in their folder and holding no server data |
| [`@brutalway/alint-config`](configs/alint-config) | category folders hold only their kind, pinned dependencies, doc links and anchors resolve |

## Internal

These two are private: tsdown bundles them into the packages that use them.

| Package | What it does |
|---|---|
| [`@brutalway/lint-utils`](utils/lint-utils) | helpers shared by the plugins |
| [`@brutalway/color-utils`](utils/color-utils) | oklab conversion and cached color token reading, shared by the Tailwind and Stylelint configs |
