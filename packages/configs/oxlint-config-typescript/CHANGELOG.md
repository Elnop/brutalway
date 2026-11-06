# @brutalkit/oxlint-config-typescript

## 0.4.0

### Minor Changes

- abcac8c: The file-name blocklist now lives only in the TypeScript base, which also rejects orchestrators and routes under `shared-features/`. In `@elnop/oxlint-config-react-vite`, the base extended through the zustand config replaced the React config's blocklist, so `XContainer.tsx` files under `shared-features/` went unreported.

## 0.3.1

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.
- Updated dependencies [548743b]
  - @elnop/eslint-plugin-file-named-after-export@0.1.2

## 0.3.0

### Minor Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.

## 0.2.0

### Minor Changes

- Named functions must be declarations, an `if` without braces must fit on one line, `interface` is refused outside `declare global`, and a `switch` over a union must cover every case.
