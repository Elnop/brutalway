# @brutal/oxlint-config-zustand

Oxlint config for zustand stores and their selectors. It extends [@brutal/oxlint-config-typescript](https://www.npmjs.com/package/@brutal/oxlint-config-typescript) and turns on [@brutal/eslint-plugin-store-layout](https://www.npmjs.com/package/@brutal/eslint-plugin-store-layout): `viewStore.ts` only exports `viewStore` and `viewActions`.

An `xSelectors.ts` file only exports functions named `selectX`.

In `*Store.ts` files, the base config's placement rule only refuses exported types, since a store exports the result of `create(...)`, and the file naming rule is off, since `store-layout` already checks the names.

```sh
npm install --save-dev oxlint @brutal/oxlint-config-zustand
```

```ts
import { reactConfig } from '@brutal/oxlint-config-react';
import { zustandConfig } from '@brutal/oxlint-config-zustand';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, zustandConfig],
});
```
