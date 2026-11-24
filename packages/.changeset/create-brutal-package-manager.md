---
'create-brutal': minor
---

A `--package-manager` option on the five stacks, `npm` by default or `pnpm`. With `pnpm`, the project gets `"packageManager": "pnpm@12.23.0"` and a `pnpm-workspace.yaml` that holds the build scripts allowed to run (`allowBuilds`), the overrides, `saveExact` and `engineStrict`, plus `nodeLinker: hoisted` on react-native for Expo and Metro: pnpm 12 no longer reads the `pnpm` field of `package.json`, so `allowScripts`, `overrides` and `.npmrc` go. The hook, the CI workflow (with `pnpm/action-setup` before `setup-node`), the scripts and the docs call `pnpm`, `pnpm exec` for a tool of the project and `pnpm dlx` for `create-brutal@latest` or `eas-cli`. `pnpm-lock.yaml` replaces `package-lock.json`, create-brutal installs with pnpm when asked to install, and the next steps it prints use pnpm.

The example todo `Run npm run check` becomes `Run the checks`, and `playwright.config.ts` starts `vite preview` or `next start` without `npx`, which the `e2e` script puts on the `PATH` for npm and pnpm alike.
