# E2. CSS Modules

Source: Wizcard (`docs/feature-modules.md`, `src/components/*/`).

Wizcard gives each component a `.module.css`. Here the stylesheet sits in the same folder as its component and takes its name: `TodoItem.module.css` next to `TodoItem.tsx`. check-tree moves the `.css` files of a folder into `styles/` as soon as there are two of them, so `.module.css` files leave that group: they follow their component, not their kind.

The first plan was [css-modules-kit](https://github.com/mizdra/css-modules-kit): its `cmk` command types the class names and its stylelint plugin has the two rules of E2-S2. Both need the JavaScript API of TypeScript, which TypeScript 7 no longer ships, and the plugin crashes on `ts.server`. So `happy-css-modules`, which only needs PostCSS, writes one `.d.ts` per stylesheet into `node_modules/.cache/css-modules`, and a second entry in `paths` (`"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]`) lets tsc find them through the `@/` alias (`rootDirs` does not apply to aliased imports). The rules of E2-S2 are written in `@brutalway/stylelint-config`, which brings stylelint into the series, and with it a check E1 could not give to plain CSS: colors written in a stylesheet (E2-S3).

**E2-S1. CSS Modules as a styling value.** As someone creating a project, I want `--styling css-modules`, so that styles are scoped to their component without a utility framework.
- The example uses `TodoItem.module.css` and friends, each next to its component. `globals.css` keeps the tokens, the reset and the shared `button` and `visually-hidden` classes, as the Tailwind version keeps a `button` utility.
- Classes are written in camelCase (`.todoItem`, enforced by `selector-class-pattern` on `.module.css` files) and read as `styles.todoItem`, so the name is the same in both files.
- `npm run css-types` runs before tsc in `typecheck` and in `prepare`, so a fresh clone has the types after `npm install`. The editor sees a new class after `npm run css-types`, or with `npm run css-types -- --watch`.
- check-tree no longer counts `.module.css` files in the `styles/` group.

**E2-S2. A stylesheet sits next to its component.** As someone working on the project, I want an error when `X.module.css` has no `X.tsx` beside it or holds a class no component uses, so that no stylesheet is left behind after a rename.
- New package `@brutalway/stylelint-config` with `brutalway/module-next-to-component` and `brutalway/no-unused-class`. The second one reads `styles.name` and `styles['name']` in `X.tsx`, and reports a component that does not import its stylesheet.
- `stylelint` runs in `npm run check` through `npm run styles`, and the agent hook runs it on an edited `.css` file.

**E2-S3. Only tokens in stylesheets.** As someone working on the project, I want an error when a stylesheet writes a color that is not a token, so that the palette stays in one file whatever the styling value.
- `brutalway/color-tokens`: hex, color functions and named colors are only allowed in `src/app/globals.css`. Anywhere else a color is a `var()` of a custom property declared there.
- Applies to `--styling css` and `--styling css-modules`, the message names the three closest tokens in OKLab, as `@brutalway/oxlint-config-tailwind` does. A Tailwind project has no stylelint: its only stylesheet is `globals.css`, and the colors in its classes are checked by oxlint.
