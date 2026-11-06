# @brutal/eslint-plugin-store-layout

A store file named `xStore` (any extension) exports `xStore` and, optionally, `xActions`, and nothing else. `viewStore.ts` may export `viewStore` and `viewActions`. Any other export is reported, and so is a missing `viewStore`.

Written for zustand stores, but the rule only looks at file and export names.

Works with oxlint and ESLint.

```sh
npm install --save-dev @brutal/eslint-plugin-store-layout
```

## oxlint

```json
{
  "jsPlugins": ["@brutal/eslint-plugin-store-layout"],
  "rules": { "store-layout/store-layout": "error" }
}
```

## ESLint

```js
import storeLayout from '@brutal/eslint-plugin-store-layout';

export default [
  {
    plugins: { 'store-layout': storeLayout },
    rules: { 'store-layout/store-layout': 'error' },
  },
];
```
