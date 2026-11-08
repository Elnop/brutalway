---
'@brutalway/eslint-plugin-file-named-after-export': minor
---

A named default export (`export default function price() {}`, `export default class Price {}`) counts as a named export: `formatPrice.ts` holding only one is reported with `rename formatPrice to price`. Anonymous default exports are not checked, and a file with one named export and a named default export has two exports, so it is not reported.
