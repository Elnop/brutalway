# @brutalkit/agent-hook

## 0.3.0

### Minor Changes

- 8ec0f81: When a check fails, the message sent back to the agent ends with a line telling it not to turn a wrong check off, but to tell the user and offer to report it on the brutalway issues.

## 0.2.1

### Patch Changes

- 13485ca: A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.
- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

## 0.2.0

### Minor Changes

- a82da02: `--root-entries` passes the same flag to `check-tree` when a file is created, for a package that keeps its entry points at the root of `src/`.
- afbf814: New `css-modules` value for the `styling` option on vite: each component of the example gets its own `X.module.css` next to it, and `happy-css-modules` writes the types of the class names so `styles.typo` fails `tsc`. Projects in plain CSS or CSS Modules now run stylelint with `@brutalway/stylelint-config`, a new package with three rules: `color-tokens` (a color is a `var()` of a custom property declared in `src/app/globals.css`, with the closest tokens in the message), `module-next-to-component` and `no-unused-class`. In a `.module.css`, classes are camelCase. check-tree leaves `X.module.css` next to its component instead of asking to move it into `styles/`, and the agent hook runs stylelint on each edited stylesheet.
- b7940fa: New `ui` option on vite, `none` by default. `--ui shadcn` (with `--styling tailwind`) copies the Button, Input, Checkbox and Card of shadcn/ui into `third-party/shadcn/`, outside `src/`, and the example uses them. `components.json` points every alias of the shadcn CLI to `@third-party/shadcn`, so `npx shadcn add <name>` writes there too. The vendored files are checked by a TypeScript project of their own, `tsconfig.third-party.json`, referenced by the app and built with `tsc -b`. Prettier, Oxlint and check-tree skip the folder, knip takes its files as entries, and alint refuses any folder in `third-party/` but `shadcn/`. The tokens of `src/app/globals.css` give the primitives the look of the series without touching their files.

  `@brutalway/tsconfig` ships `react-vite-third-party.json`: `react-vite.json` without `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`, for code copied from a registry.

  `@brutalway/dependency-cruiser-config/shadcn` extends the layers with `third-party-not-to-src` and `third-party-packages-only-from-third-party`: vendored code imports nothing from the app, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`. Projects made with `--ui shadcn` use it and run `depcruise src third-party`.

  `@brutalway/oxlint-config-shadcn` is a new package with `primitives-first` (no raw `<button>`, `<input>`, `<select>` or `<textarea>`, the message names the primitive and the `npx shadcn add` command) and `one-icon-library` (icons only from `lucide-react`). Projects made with `--ui shadcn` extend it.

  `@brutalway/agent-hook` takes `--vendored <folder>`: the `PostToolUse` hook runs no check on a file there, and the same command as a `PreToolUse` hook refuses the edit with what to do instead (`npx shadcn add <name> --overwrite`, the tokens or a `data-slot` rule in `src/app/globals.css`, a wrapper in `src/`). Projects made with `--ui shadcn` and the Claude Code hook get both.

### Patch Changes

- 737b295: When a check cannot start, for example because the project root does not exist, the hook prints the command, the folder it ran in, the project root and the error from Node, and exits with code 2. It used to print `oxlint found problems` followed by `undefinedundefined`.

## 0.1.0

### Minor Changes

- 56103f8: First release: tsconfig, Prettier, dependency-cruiser and alint configs, Playwright fixtures and the Claude Code agent hook, moved out of the elnop-stacks templates so they share one copy.
