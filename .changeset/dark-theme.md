---
'create-brutal': minor
'@brutalway/oxlint-config-tailwind': patch
---

New `dark-theme` option on vite, off by default. It adds a `@media (prefers-color-scheme: dark)` block to `src/app/globals.css` that gives each color token a dark value, so the app follows the theme of the system with the same classes and stylesheets, in plain CSS, CSS Modules and Tailwind. Text keeps a contrast of 4.5:1 on every color, and with e2e tests on, `e2e/darkTheme.spec.ts` runs axe with the system in dark mode.

With `--ui shadcn`, the `dark:` classes of the vendored primitives now only apply under a `.dark` class (`@custom-variant dark` in `src/app/globals.css`). Before, a system in dark mode turned the fields and checkboxes grey on a light page.

`@brutalway/oxlint-config-tailwind`: the message of `no-dark-variant` no longer says the project is light only. It says to give the token its dark value in the stylesheet that declares it.
