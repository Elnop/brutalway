# @brutalkit/alint-config

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
