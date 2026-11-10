# @brutalway/oxlint-config-zustand

Oxlint config for zustand stores and their selectors. It extends [@brutalway/oxlint-config-typescript](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript) and turns on [@brutalway/eslint-plugin-store-layout](https://www.npmjs.com/package/@brutalway/eslint-plugin-store-layout).

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-zustand
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, zustandConfig],
});
```

## Rules

- `viewStore.ts` only exports `viewStore` and `viewActions` (`store-layout`)
- an `xSelectors.ts` file only exports functions named `selectX`
- in `*Store.ts` files, the base config's placement rule only refuses exported types, and the file naming rule is off

## Why

In `*Store.ts` files the placement rule only refuses exported types, since a store exports the result of `create(...)`. The file naming rule is off in `*Store.ts` files since `store-layout` already checks the names.
