# Starting your own package

1. Delete `src/features/`, `src/shared-features/todos/` and `src/shared/`, then empty the entry points at the root of `src/` and their tests.
2. Rename the entry points after your package, in `src/`, `package.json` and `tsdown.config.ts`, and write the end-to-end test of each one.
3. Add a feature per thing the package does, and a shared feature when two of them need the same code.
4. Run `npm run check` often. It tells you where each file goes as the package grows.
