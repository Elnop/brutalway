# @brutalway/oxlint-config-tailwind

## 0.1.0

### Minor Changes

- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.
