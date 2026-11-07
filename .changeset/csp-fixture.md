---
'@brutalway/playwright-fixtures': minor
'create-brutal': patch
---

`test` from `@brutalway/playwright-fixtures` also fails when the browser reports a violation of the page's Content Security Policy. The CLI formats every `tsconfig*.json` of the project the way Prettier does after its edits, as it already did for `knip.json`, since an option can make a list fit on one line again.
