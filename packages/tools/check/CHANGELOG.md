# @brutalway/check

## 0.4.0

### Minor Changes

- 0b53d91: `brutal-check` runs the scripts with the package manager that started it, npm or pnpm: it reads `npm_config_user_agent`, then the `packageManager` field of `package.json`, and falls back on npm. `pnpm run check` no longer calls npm for each step.

## 0.3.0

### Minor Changes

- 52e0b80: `brutal-check` runs its steps at the same time and prints `<step> OK (1.2s)` or `<step> FAILED (2.3s)` as each ends, with the full output of a failed step and nothing from a passing one. `--serial` runs them one after the other, for a machine short on memory.

## 0.2.0

### Minor Changes

- e73c7d3: Every step is now an npm script of the project, run when it exists: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets` and `exceptions`. Prettier, alint, knip, check-secrets and check-exceptions are no longer run directly, so knip sees the tools in `package.json`.

## 0.1.0

### Minor Changes

- 2862b5e: New package: `brutal-check` runs every check of a brutalway project in a fixed order, the npm scripts it has and the tools it installed, keeps going after a failure and names the steps that failed and the ones it skipped.
