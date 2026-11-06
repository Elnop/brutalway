# @brutal/eslint-plugin-file-named-after-export

A file with a single named export is named after that export. `formatPrice.ts` exporting only `price` is reported: rename the file to `price.ts`, or the export to `formatPrice`.

Files whose name ends with one of `exemptSuffixes` are skipped. The default is `['Types', 'Config', 'Content']`, for files that group several types or constants.

Works with oxlint and ESLint.

```sh
npm install --save-dev @brutal/eslint-plugin-file-named-after-export
```

## oxlint

```json
{
  "jsPlugins": ["@brutal/eslint-plugin-file-named-after-export"],
  "rules": {
    "file-named-after-export/file-named-after-export": ["error", { "exemptSuffixes": ["Types", "Config"] }]
  }
}
```

## ESLint

```js
import fileNamedAfterExport from '@brutal/eslint-plugin-file-named-after-export';

export default [
  {
    plugins: { 'file-named-after-export': fileNamedAfterExport },
    rules: { 'file-named-after-export/file-named-after-export': 'error' },
  },
];
```
