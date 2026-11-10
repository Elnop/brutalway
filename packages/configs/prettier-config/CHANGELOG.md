# @brutalkit/prettier-config

## 0.3.0

### Minor Changes

- 310cccc: Prettier wraps lines at 100 columns instead of 200, the closest to the 80 of the Norminette that the templates fit today. A project that extends the config gets reformatted on its next `prettier --write`, and some `if` bodies need braces once they move to their own line. The vite, fastify and package templates are formatted at 100 and pin `@brutalway/prettier-config` 0.3.0.

## 0.2.0

### Minor Changes

- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.

## 0.1.0

### Minor Changes

- 56103f8: First release: tsconfig, Prettier, dependency-cruiser and alint configs, Playwright fixtures and the Claude Code agent hook, moved out of the elnop-stacks templates so they share one copy.
