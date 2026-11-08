# @brutalway/eslint-plugin-file-named-after-export

A file with a single named export is named after that export. `formatPrice.ts` exporting only `price` is reported: rename the file to `price.ts`, or the export to `formatPrice`.

A default export with a name counts as a named export, so `formatPrice.ts` holding only `export default function price() {}` or `export default class Price {}` is reported the same way. A file with one named export and a named default export has two exports and is not reported. An anonymous default export, such as `export default function () {}`, `export default defineConfig({})`, `export default { ... }` or `export default price`, is not checked.

```ts
export default function price() {}
```

In `formatPrice.ts`, this reports `rename formatPrice to price`.

Files whose name ends with one of `exemptSuffixes` are skipped. The default is `['Types', 'Config', 'Content']`, for files that group several types or constants.

Works with oxlint and ESLint.

```sh
npm install --save-dev @brutalway/eslint-plugin-file-named-after-export
```

## oxlint

```json
{
  "jsPlugins": ["@brutalway/eslint-plugin-file-named-after-export"],
  "rules": {
    "file-named-after-export/file-named-after-export": ["error", { "exemptSuffixes": ["Types", "Config"] }]
  }
}
```

## ESLint

```js
import fileNamedAfterExport from '@brutalway/eslint-plugin-file-named-after-export';

export default [
  {
    plugins: { 'file-named-after-export': fileNamedAfterExport },
    rules: { 'file-named-after-export/file-named-after-export': 'error' },
  },
];
```
