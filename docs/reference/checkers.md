# Checkers by stack

Every tool `npm run check` runs in a project created with `npm create brutal`, the stacks that run it and what it rejects. The pre-commit hook and CI run the same command. The details and the messages are in each template's `verifications.md`: [vite](../../templates/vite/docs/reference/verifications.md), [next](../../templates/next/docs/reference/verifications.md), [react-native](../../templates/react-native/docs/reference/verifications.md), [fastify](../../templates/fastify/docs/reference/verifications.md), [package](../../templates/package/docs/reference/verifications.md). The rules themselves, grouped by theme, are in [Common rules](rules.md).

## Every stack

| Checker | Config | vite | next | react-native | fastify | package | What it rejects |
|---|---|---|---|---|---|---|---|
| Prettier | [`@brutalway/prettier-config`](../../packages/configs/prettier-config) | yes | yes | yes | yes | yes | a file not formatted: single quotes, trailing commas, 100 columns |
| tsc | [`@brutalway/tsconfig`](../../packages/configs/tsconfig) | `react-vite.json` | `react-vite.json` | `base.json` | `node.json` | `node.json` | a type error, with `strict` and every extra strictness flag on |
| Oxlint | [`@brutalway/oxlint-config-typescript`](../../packages/configs/oxlint-config-typescript) and the config of the stack | yes | yes | yes | yes | yes | comments, relative imports, `index.ts`, `export *`, a file not named after its single export, a function over 25 lines, 4 parameters or 5 variables, a file over 5 top-level functions |
| dependency-cruiser | [`@brutalway/dependency-cruiser-config`](../../packages/configs/dependency-cruiser-config) | `layers` | `layers` | `layers` | `server` | `library` | an import that goes up a layer or crosses features, a cycle, a test file, `test-utils/` or a devDependency imported by production code |
| check-tree | [`@brutalway/check-tree`](../../packages/tools/check-tree) | yes | yes | yes | yes | `--root-entries` | an empty folder, a category folder holding a single file, two files of a kind outside their folder, a folder the layout does not name |
| jscpd | `.jscpd.json` | yes | yes | yes | yes | yes | a block of 8 lines or 120 tokens that appears twice in `src/`, tests left out |
| check-doc-length | [`@brutalway/check-doc-length`](../../packages/tools/check-doc-length) | yes | yes | yes | yes | yes | a Markdown file over 300 lines |
| check-doc-sources | [`@brutalway/check-doc-sources`](../../packages/tools/check-doc-sources) | yes | yes | yes | yes | yes | warns, without failing, when a cited file changed and the doc did not |
| check-doc-links | [`@brutalway/check-doc-links`](../../packages/tools/check-doc-links) | yes | yes | yes | yes | yes | an external link that answers `404` or `410`, or whose domain is gone |
| alint | [`@brutalway/alint-config`](../../packages/configs/alint-config) | `base.yml` | `base.yml` | `base.yml` | `base.yml` | `library.yml` | a path, link or anchor of the docs that does not exist, a category folder holding another kind, a dependency not pinned |
| knip | `knip.json` | yes | yes | yes | yes | yes | an unused export, file or dependency, a package used without being declared, and with `--production` a file or an export of `src/` that only a test uses |

The package stack pins only its devDependencies: `dependencies` and `peerDependencies` keep their ranges.

A test sits next to its source, and a helper several tests share goes in `test-utils/` at the root of the project, outside `src/`. `npm run check` runs knip twice: the second run, `knip --production`, only reads `src/` without its tests, so a file or an export that only a test reaches is reported. dependency-cruiser keeps production code from importing `test-utils/`.

## Oxlint config of each stack

| Stack | Config | What it adds to the TypeScript base |
|---|---|---|
| vite, next | [`@brutalway/oxlint-config-react-vite`](../../packages/configs/oxlint-config-react-vite) | the aliases `@/` and `@e2e/`, then the configs below |
| vite, react-native | [`@brutalway/oxlint-config-react`](../../packages/configs/oxlint-config-react) | hooks rules, props typed with a named `XProps`, callback props named `onX`, no orchestrator under `shared-features/`, `fetch` only in an `xClient.ts` and never in an effect |
| vite, next, react-native | [`@brutalway/oxlint-config-zustand`](../../packages/configs/oxlint-config-zustand) | `xStore.ts` exports only `xStore` and `xActions`, `xSelectors.ts` only `selectX` functions |
| vite, next | [`@brutalway/oxlint-config-vitest`](../../packages/configs/oxlint-config-vitest) | `it()` inside `describe`, `toStrictEqual`, typed mocks, `toThrow` with the expected message |
| vite, next, react-native | [`@brutalway/oxlint-config-i18next`](../../packages/configs/oxlint-config-i18next) | visible text in JSX, `aria-label`, `placeholder`, `title`, `alt`, `accessibilityLabel`, `accessibilityHint` or a template literal |
| react-native | `oxlint.config.ts` | the Jest rules of oxlint: `it()` inside `describe`, `toStrictEqual`, `toBe` for primitives, `toThrow` with the expected message. The route files of `src/app/screens/` may export a default |
| fastify | [`@brutalway/oxlint-config-fastify`](../../packages/configs/oxlint-config-fastify) | `process.env` read only in an `xEnv.ts`, no `app.decorate`, an `async` handler returns its value, Zod schemas in an `xSchemas.ts`, no route under `shared-features/` |
| package | [`@brutalway/oxlint-config-node`](../../packages/configs/oxlint-config-node) | the alias `#src/`, `console.error` only, `fetch` only in an `xClient.ts` |
| fastify, package | [`@brutalway/oxlint-config-node-test`](../../packages/configs/oxlint-config-node-test) | `describe` and `it` from `node:test`, `node:assert/strict` |

## Only on the front-end stacks

| Checker | Config | Stacks | What it rejects |
|---|---|---|---|
| stylelint | [`@brutalway/stylelint-config`](../../packages/configs/stylelint-config) | vite, next | a color outside the custom properties of `src/app/globals.css`, with the closest tokens in the message, an `X.module.css` away from its `X.tsx` or holding an unused class |
| i18next-cli | `i18next.config.ts` | vite, next, react-native | a key missing from a language, a key no code uses, and through `i18next-cli types`, an unknown key or a missing `{{name}}` in a call to `t()` |

On vite and next, with the `e2e` option, `npm run e2e` runs Playwright with [`@brutalway/playwright-fixtures`](../../packages/tools/playwright-fixtures), which fails a test when the page throws, when axe-core finds a violation or when the browser reports a CSP violation.

The options of the front-end stacks add their own Oxlint config:

| Option | Config | Stacks | What it rejects |
|---|---|---|---|
| `styling=tailwind` | [`@brutalway/oxlint-config-tailwind`](../../packages/configs/oxlint-config-tailwind) | vite, next | a color that is not a `@theme` token, a heading without `font-display`, code without `font-mono`, `dark:`. Prettier also sorts the classes |
| `ui=shadcn` | [`@brutalway/oxlint-config-shadcn`](../../packages/configs/oxlint-config-shadcn) | vite, next | a raw `<button>`, `<input>`, `<select>` or `<textarea>` when a primitive does the job, an icon outside `lucide-react` |
| `server-state` | [`@brutalway/oxlint-config-tanstack-query`](../../packages/configs/oxlint-config-tanstack-query) | vite, react-native | a query key outside an `xKeys` factory, a `staleTime` or `gcTime` outside a named profile, a key missing a variable of its `queryFn`, a `QueryClient` created in a component |
| `forms` | [`@brutalway/oxlint-config-react-hook-form`](../../packages/configs/oxlint-config-react-hook-form) | vite, next, react-native | a `useForm` without `zodResolver`, validation passed to `register` or a `Controller` |

## With Claude Code

With the `claude-hook` option, [`@brutalway/agent-hook`](../../packages/tools/agent-hook) runs Oxlint and stylelint on each file Claude Code edits, alint and check-tree on each file it creates, and sends the errors back before the agent moves on.
