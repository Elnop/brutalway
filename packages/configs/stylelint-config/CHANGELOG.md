# @brutalway/stylelint-config

## 0.2.2

### Patch Changes

- 6ec96e4: The `stylelint` peer dependency also accepts 18.x.

## 0.2.1

### Patch Changes

- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

## 0.2.0

### Minor Changes

- afbf814: New `css-modules` value for the `styling` option on vite: each component of the example gets its own `X.module.css` next to it, and `happy-css-modules` writes the types of the class names so `styles.typo` fails `tsc`. Projects in plain CSS or CSS Modules now run stylelint with `@brutalway/stylelint-config`, a new package with three rules: `color-tokens` (a color is a `var()` of a custom property declared in `src/app/globals.css`, with the closest tokens in the message), `module-next-to-component` and `no-unused-class`. In a `.module.css`, classes are camelCase. check-tree leaves `X.module.css` next to its component instead of asking to move it into `styles/`, and the agent hook runs stylelint on each edited stylesheet.

### Patch Changes

- 96b9f92: The oklab conversion, the color distance and the cached reading of the color tokens come from the private `@brutalway/color-utils`, bundled into `dist` at build time. Each package keeps its own parsing of the stylesheet, and the reported colors and suggestions are the same.
