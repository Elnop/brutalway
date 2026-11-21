# @brutalkit/alint-config

## 0.2.4

### Patch Changes

- 50bf892: `exact-dependency-versions` keeps the message of alint, which quotes the range it found, instead of the same sentence for every dependency, and links to a README section that says how to pin them.

## 0.2.3

### Patch Changes

- 2b81eb2: The messages say "shared feature" for a folder of a `shared/`, where they said "slice", "kind folder" where the docs also said "category folder", and "entry points" for the files at the root of `src/`. `split it into one slice per group` becomes `split it into one shared feature per group`, and `shared/ holds one folder per slice` becomes `shared/ holds one folder per shared feature`. The terms are defined in the new glossary of the docs, `docs/reference/glossary.md` in the brutalway repository.

  A `.check-tree-known-violations.json` file holds the printed messages, so its entries no longer match: run `npx check-tree src --write-known-violations` once after the upgrade, and check that the diff only changes words.

## 0.2.2

### Patch Changes

- 6ec96e4: The `@asamarts/alint` peer dependency also accepts 0.22.x.

## 0.2.1

### Patch Changes

- 610f27f: The `@asamarts/alint` peer dependency accepts any 0.21.x, so a project can take an alint patch without waiting for a new alint-config.

## 0.2.0

### Minor Changes

- e2bbd8d: New `library.yml` for a published package: the rules of `base.yml`, with `exact-dependency-versions` only checking `devDependencies`, so `dependencies` and `peerDependencies` keep their ranges.

## 0.1.0

### Minor Changes

- 56103f8: First release: tsconfig, Prettier, dependency-cruiser and alint configs, Playwright fixtures and the Claude Code agent hook, moved out of the elnop-stacks templates so they share one copy.
