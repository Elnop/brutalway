# @brutalway/oxlint-config-node

## 0.3.2

### Patch Changes

- 8efcf1b: Depends on `@brutalway/oxlint-config-typescript` ^0.10.0. A project that adds the `line-width` config of that package next to this one needs both on the same version: with two copies, oxlint fails with "Plugin name 'sonarjs' is already registered". Update this package with the others, nothing else to do.

## 0.3.1

### Patch Changes

- ae7b854: `@brutalway/oxlint-config-typescript` goes from `^0.8.0` to `^0.9.0` and `@brutalway/oxlint-config-react` from `^0.5.0` to `^0.6.0`, so a project that extends react-vite, next or react-native gets the overrides of `test/e2e/**`.

## 0.3.0

### Minor Changes

- 7966823: `@brutalway/oxlint-config-typescript` goes from `^0.6.0` to `^0.8.0`, which brings two of its rules:

  - `export default` is rejected, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `.d.ts` files, `fixtures/`)
  - no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`. This follows the single `shared/` split into slices of `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0

## 0.2.1

### Patch Changes

- Updated dependencies [c438506]
- Updated dependencies [13485ca]
- Updated dependencies [11f6d20]
  - @brutalway/oxlint-config-typescript@0.6.0

## 0.2.0

### Minor Changes

- 78d304c: New package `@brutalway/oxlint-config-node`: the TypeScript base plus the `#src/` alias instead of relative imports and `fetch` only in `xClient.ts` files. `@brutalway/oxlint-config-fastify` now extends it instead of repeating those rules.

### Patch Changes

- Updated dependencies [5aad351]
- Updated dependencies [f1b60f3]
- Updated dependencies [0b57e92]
  - @brutalway/oxlint-config-typescript@0.5.0
