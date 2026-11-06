# @brutal/oxlint-config-zustand

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
