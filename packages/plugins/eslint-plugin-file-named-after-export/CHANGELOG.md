# @brutalkit/eslint-plugin-file-named-after-export

## 0.2.0

### Minor Changes

- 4ccbc63: A named default export (`export default function price() {}`, `export default class Price {}`) counts as a named export: `formatPrice.ts` holding only one is reported with `rename formatPrice to price`. Anonymous default exports are not checked, and a file with one named export and a named default export has two exports, so it is not reported.

## 0.1.2

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.

## 0.1.1

### Patch Changes

- Bundle the shared helpers into the plugin, so it no longer depends on `@elnop/lint-utils`.
