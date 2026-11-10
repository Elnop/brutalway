# @brutalway/oxlint-config-tailwind

## 0.1.3

### Patch Changes

- 13485ca: A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.
- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

## 0.1.2

### Patch Changes

- 5c45ee3: The message of `no-dark-variant` no longer says the project is light only. It says to give the token its dark value in the stylesheet that declares it, since a theme changes the values of the tokens, never a class.

## 0.1.1

### Patch Changes

- 96b9f92: The oklab conversion, the color distance and the cached reading of the color tokens come from the private `@brutalway/color-utils`, bundled into `dist` at build time. Each package keeps its own parsing of the stylesheet, and the reported colors and suggestions are the same.

## 0.1.0

### Minor Changes

- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.
