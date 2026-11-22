# @brutalway/check

## 0.2.0

### Minor Changes

- e73c7d3: Every step is now an npm script of the project, run when it exists: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets` and `exceptions`. Prettier, alint, knip, check-secrets and check-exceptions are no longer run directly, so knip sees the tools in `package.json`.

## 0.1.0

### Minor Changes

- 2862b5e: New package: `brutal-check` runs every check of a brutalway project in a fixed order, the npm scripts it has and the tools it installed, keeps going after a failure and names the steps that failed and the ones it skipped.
