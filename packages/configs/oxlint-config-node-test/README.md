# @brutalway/oxlint-config-node-test

Oxlint config for suites written with `node:test`, applied to `*.test.ts` files:

- each case is an `it()` inside a `describe()`, both imported from `node:test`. Importing `test` is rejected
- an `it()` at the top level of the file is rejected
- assertions come from `node:assert/strict`, not `node:assert`

```sh
npm install --save-dev @brutalway/oxlint-config-node-test oxlint
```

```ts
import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';
import { defineConfig } from 'oxlint';

export default defineConfig({ extends: [nodeTestConfig] });
```

It only adds rules for test files, so it goes next to another config such as `@brutalway/oxlint-config-fastify`.
