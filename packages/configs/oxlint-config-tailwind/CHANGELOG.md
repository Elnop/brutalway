# @brutalway/oxlint-config-tailwind

## 0.1.1

### Patch Changes

- 96b9f92: The oklab conversion, the color distance and the cached reading of the color tokens come from the private `@brutalway/color-utils`, bundled into `dist` at build time. Each package keeps its own parsing of the stylesheet, and the reported colors and suggestions are the same.

## 0.1.0

### Minor Changes

- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.
