# @brutal/oxlint-config-react-vite

## 0.4.1

### Patch Changes

- abcac8c: The file-name blocklist now lives only in the TypeScript base, which also rejects orchestrators and routes under `shared-features/`. In `@elnop/oxlint-config-react-vite`, the base extended through the zustand config replaced the React config's blocklist, so `XContainer.tsx` files under `shared-features/` went unreported.
- Updated dependencies [abcac8c]
  - @elnop/oxlint-config-react@0.3.1
  - @elnop/oxlint-config-zustand@0.2.3

## 0.4.0

### Minor Changes

- 6e9d843: New `@elnop/oxlint-config-fastify` (env read in xEnv.ts, no decorate, async handlers return, Zod schemas in xSchemas.ts, no route under shared-features/) and `@elnop/oxlint-config-node-test` (it() inside describe() from node:test, node:assert/strict). The React config rejects orchestrators under shared-features/.

### Patch Changes

- Updated dependencies [6e9d843]
  - @elnop/oxlint-config-react@0.3.0

## 0.3.1

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.
- Updated dependencies [548743b]
  - @elnop/oxlint-config-react@0.2.1
  - @elnop/oxlint-config-vitest@0.2.1
  - @elnop/oxlint-config-zustand@0.2.2

## 0.3.0

### Minor Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.

### Patch Changes

- Updated dependencies
  - @elnop/oxlint-config-react@0.2.0
  - @elnop/oxlint-config-vitest@0.2.0
  - @elnop/oxlint-config-zustand@0.2.1

## 0.2.0

### Minor Changes

- Extends the new `@elnop/oxlint-config-vitest`.

### Patch Changes

- Updated dependencies
  - @elnop/oxlint-config-zustand@0.2.0
  - @elnop/oxlint-config-react@0.1.2
