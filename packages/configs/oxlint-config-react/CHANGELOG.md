# @brutalkit/oxlint-config-react

## 0.5.2

### Patch Changes

- b0d9598: A function prop that returns `ReactNode`, `ReactElement` or `JSX.Element` is a render prop, named `children` or `renderX`, so a container that calls `children(plan)` passes. Any other function prop is still a callback named `onX`, and `renderSave: () => void` is reported as one.

## 0.5.1

### Patch Changes

- 2b81eb2: The messages say "shared feature" for a folder of a `shared/`, where they said "slice", "kind folder" where the docs also said "category folder", and "entry points" for the files at the root of `src/`. `split it into one slice per group` becomes `split it into one shared feature per group`, and `shared/ holds one folder per slice` becomes `shared/ holds one folder per shared feature`. The terms are defined in the new glossary of the docs, `docs/reference/glossary.md` in the brutalway repository.

  A `.check-tree-known-violations.json` file holds the printed messages, so its entries no longer match: run `npx check-tree src --write-known-violations` once after the upgrade, and check that the diff only changes words.

## 0.5.0

### Minor Changes

- 7966823: `@brutalway/oxlint-config-typescript` goes from `^0.6.0` to `^0.8.0`, which brings two of its rules:

  - `export default` is rejected, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `.d.ts` files, `fixtures/`)
  - no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`. This follows the single `shared/` split into slices of `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0

## 0.4.1

### Patch Changes

- Updated dependencies [c438506]
- Updated dependencies [13485ca]
- Updated dependencies [11f6d20]
  - @brutalway/oxlint-config-typescript@0.6.0

## 0.4.0

### Minor Changes

- f1b60f3: `@brutalway/oxlint-config-typescript` reports a function whose cognitive complexity is above 15 with Sonar's own rule, `sonarjs/cognitive-complexity`. The whole `eslint-plugin-sonarjs` does not load under Oxlint with TypeScript 7, so a small plugin loads the file of that rule alone, from an exact version of the package.

  `@brutalway/oxlint-config-react` adds rules taken from bedrock: no array index as a `key`, `localStorage` and `sessionStorage` only in an `xStorage.ts` file, no `useX.tsx` hook file, no formatting (`toFixed`, `Intl`, `sort`, `filter`, `reduce`...) in a presenter, an orchestrator that calls at least one hook, and at most 6 props per component.

  `@brutalway/oxlint-config-i18next` leaves test files alone, since they pass literal props to what they render.

  New `coverage` option on vite, off by default, which needs component tests: `npm test` runs `vitest run --coverage` and fails under 90 % of presenters, pure functions, selectors and stores. With `i18n`, `LanguageSwitch.tsx` gets its component test, and `languagePreference.ts` becomes `languageStorage.ts`.

- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.

  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.

### Patch Changes

- Updated dependencies [5aad351]
- Updated dependencies [f1b60f3]
- Updated dependencies [0b57e92]
  - @brutalway/oxlint-config-typescript@0.5.0

## 0.3.1

### Patch Changes

- abcac8c: The file-name blocklist now lives only in the TypeScript base, which also rejects orchestrators and routes under `shared-features/`. In `@elnop/oxlint-config-react-vite`, the base extended through the zustand config replaced the React config's blocklist, so `XContainer.tsx` files under `shared-features/` went unreported.
- Updated dependencies [abcac8c]
  - @elnop/oxlint-config-typescript@0.4.0

## 0.3.0

### Minor Changes

- 6e9d843: New `@elnop/oxlint-config-fastify` (env read in xEnv.ts, no decorate, async handlers return, Zod schemas in xSchemas.ts, no route under shared-features/) and `@elnop/oxlint-config-node-test` (it() inside describe() from node:test, node:assert/strict). The React config rejects orchestrators under shared-features/.

## 0.2.1

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.
- Updated dependencies [548743b]
  - @elnop/oxlint-config-typescript@0.3.1

## 0.2.0

### Minor Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.

### Patch Changes

- Updated dependencies
  - @elnop/oxlint-config-typescript@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @elnop/oxlint-config-typescript@0.2.0

## 0.1.1

### Patch Changes

- Turn off `react/immutability`: oxlint 1.91.0 reports a `let` declared inside an effect and reassigned by a closure in it (oxc-project/oxc#28401).
