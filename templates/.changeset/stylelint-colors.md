---
'template-vite': minor
---

stylelint checks the stylesheets with `@brutalway/stylelint-config`: outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there, and the message names the closest tokens. `npm run check` runs it through `npm run styles`.
