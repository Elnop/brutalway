---
'create-brutal': minor
'@brutalway/tsconfig': minor
'@brutalway/dependency-cruiser-config': minor
'@brutalway/oxlint-config-shadcn': minor
'@brutalway/agent-hook': minor
---

New `ui` option on vite, `none` by default. `--ui shadcn` (with `--styling tailwind`) copies the Button, Input, Checkbox and Card of shadcn/ui into `third-party/shadcn/`, outside `src/`, and the example uses them. `components.json` points every alias of the shadcn CLI to `@third-party/shadcn`, so `npx shadcn add <name>` writes there too. The vendored files are checked by a TypeScript project of their own, `tsconfig.third-party.json`, referenced by the app and built with `tsc -b`. Prettier, Oxlint and check-tree skip the folder, knip takes its files as entries, and alint refuses any folder in `third-party/` but `shadcn/`. The tokens of `src/app/globals.css` give the primitives the look of the series without touching their files.

`@brutalway/tsconfig` ships `react-vite-third-party.json`: `react-vite.json` without `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`, for code copied from a registry.

`@brutalway/dependency-cruiser-config/shadcn` extends the layers with `third-party-not-to-src` and `third-party-packages-only-from-third-party`: vendored code imports nothing from the app, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`. Projects made with `--ui shadcn` use it and run `depcruise src third-party`.

`@brutalway/oxlint-config-shadcn` is a new package with `primitives-first` (no raw `<button>`, `<input>`, `<select>` or `<textarea>`, the message names the primitive and the `npx shadcn add` command) and `one-icon-library` (icons only from `lucide-react`). Projects made with `--ui shadcn` extend it.

`@brutalway/agent-hook` takes `--vendored <folder>`: the `PostToolUse` hook runs no check on a file there, and the same command as a `PreToolUse` hook refuses the edit with what to do instead (`npx shadcn add <name> --overwrite`, the tokens or a `data-slot` rule in `src/app/globals.css`, a wrapper in `src/`). Projects made with `--ui shadcn` and the Claude Code hook get both.
