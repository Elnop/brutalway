# @brutalkit/oxlint-config-zustand

## 0.3.2

### Patch Changes

- ae7b854: `@brutalway/oxlint-config-typescript` goes from `^0.8.0` to `^0.9.0` and `@brutalway/oxlint-config-react` from `^0.5.0` to `^0.6.0`, so a project that extends react-vite, next or react-native gets the overrides of `test/e2e/**`.

## 0.3.1

### Patch Changes

- 98f97a7: A store hook takes a selector: `useStore(xStore)` with a single argument and `useXStore()` without one are reported, since the component would re-render on every change of the store.
- Updated dependencies [75ff7d8]
  - @brutalway/oxlint-config-typescript@0.8.3

## 0.3.0

### Minor Changes

- 7966823: `@brutalway/oxlint-config-typescript` goes from `^0.6.0` to `^0.8.0`, which brings two of its rules:

  - `export default` is rejected, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `.d.ts` files, `fixtures/`)
  - no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`. This follows the single `shared/` split into slices of `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0

## 0.2.5

### Patch Changes

- Updated dependencies [c438506]
- Updated dependencies [13485ca]
- Updated dependencies [11f6d20]
  - @brutalway/oxlint-config-typescript@0.6.0

## 0.2.4

### Patch Changes

- Updated dependencies [5aad351]
- Updated dependencies [f1b60f3]
- Updated dependencies [0b57e92]
  - @brutalway/oxlint-config-typescript@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [abcac8c]
  - @elnop/oxlint-config-typescript@0.4.0

## 0.2.2

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.
- Updated dependencies [548743b]
  - @elnop/oxlint-config-typescript@0.3.1
  - @elnop/eslint-plugin-store-layout@0.1.3

## 0.2.1

### Patch Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.
- Updated dependencies
  - @elnop/oxlint-config-typescript@0.3.0
  - @elnop/eslint-plugin-store-layout@0.1.2

## 0.2.0

### Minor Changes

- An `xSelectors.ts` file only exports functions named `selectX`.

### Patch Changes

- Updated dependencies
  - @elnop/oxlint-config-typescript@0.2.0
