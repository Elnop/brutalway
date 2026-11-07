# Verifications

Everything below runs locally, in the pre-commit hook and in CI. Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.

## TypeScript

`tsc` runs twice: on the production code (`tsconfig.app.json`) and on tests, e2e and configs (`tsconfig.test.json`). Both extend `@brutalway/tsconfig/react-vite.json`, which turns on `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`. That last one is why `playwright.config.ts` reads `process.env['CI']`.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-react-vite`, which brings the TypeScript base, the React, zustand and Vitest configs. Each package README details its rules. The main ones:

- no comments anywhere, tests included (directives like `oxlint-` and `@ts-expect-error` are allowed)
- no relative imports: `@/` in `src/`, `@e2e/` in `e2e/`. Root config files are the only exception
- no `index.ts`, no `export *`, no `types.ts` without a domain, file names in camelCase or PascalCase
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`. Functions, classes and objects holding functions (like `todosActions`) can live anywhere
- a file with a single export is named after it
- `xStore.ts` exports only `xStore` and `xActions`
- a component types its props with a named `XProps` type, and callback props are named `onX`
- no orchestrator (`XContainer`, `XLayout`, `XPage`) under `shared-features/`: the components that read shared state belong to a feature
- a hook lives in a `useX.ts` that only exports hooks, a `xSelectors.ts` only exports `selectX` functions
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`, `curly` only for multi-line blocks
- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)

## Dependencies

dependency-cruiser checks the direction of imports. The rules come from `@brutalway/dependency-cruiser-config`, and `.dependency-cruiser.cjs` only adds the parser options:

- `src/shared/` imports neither `src/shared-features/` nor features, `src/shared-features/` imports no feature, no feature imports `src/app/`
- a feature never imports another feature, a shared feature never imports another shared feature
- a sub-feature imports neither its siblings nor its feature root, only its feature `shared/`, at every nesting level, and features nest at most ten levels deep
- a presenter imports no store and no shared-feature hook
- a store lives at the root or in the `stores/` folder of its level
- no cycles, no import of a test file or a devDependency from production code

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and category folders (`components`, `hooks`, `lib`...) holding a single file. One file of a kind stays at the root of its folder, two or more go in the category folder. Inside `components/`, the same goes for `orchestrators/` and `presenters/`. Tests do not count: a test sits next to its source. It also rejects two CSS files outside a `styles/` folder.

## Repository

alint checks that every path in backticks, link and anchor in the README and in `docs/` still exists, that `styles/`, `types/` and `configs/` only hold what their name says, and that every dependency in `package.json` is pinned to an exact version. The rules come from `@brutalway/alint-config`, except the path check, which `.alint.yml` declares itself because its prefixes depend on this repository's folders. Paths are resolved from the repository root, so the docs always write full paths like `src/app/App.tsx`.

knip (`knip.json`) rejects exports nobody imports, unused files, unused dependencies and packages used without being declared. `@swc/core` is ignored because dependency-cruiser loads it by name.

## Tests

| Kind | What it tests | Where | Command |
|---|---|---|---|
| Unit | a pure function, a selector | `src/shared/lib/normalizeTitle.test.ts` next to its source | `npm run test:unit` |
| Component | a presenter alone, through its props | `src/features/todo-list/components/presenters/TodoInput.test.tsx` | `npm run test:component` |
| E2e | a user flow on the built app | `e2e/app.spec.ts` | `npm run e2e` |

The extension picks the kind: `.test.ts` runs in Node, `.test.tsx` in Chromium. Only presenters get component tests, since orchestrators read stores and e2e covers them. Find elements by role and accessible name, wait with retrying assertions, never with a timeout.

The specs import `test`, `expect` and `axeViolations` from `@brutalway/playwright-fixtures`: `test` fails any test during which the page throws, `axeViolations` runs axe-core. `e2e/openApp.ts` opens the app and waits for its `h1`. `e2e/app.spec.ts` checks the first screen: no axe violation, no sideways scroll at 320 px. `e2e/todos.spec.ts` covers the example: the same two checks while a task is being renamed, the counters while adding, checking, filtering and clearing tasks, and renaming.

Before keeping a test, break the code it protects and watch it fail.
