# @brutalway/oxlint-config-node

Oxlint config for Node code written in TypeScript: a package, a CLI, a script. It extends `@brutalway/oxlint-config-typescript` and adds:

| Rule             | Rejects                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| aliases          | relative imports: use the `#src/` alias from the `imports` field of `package.json`              |
| fetch in clients | `fetch` outside an `xClient.ts` file or a test: clients are the only files that call another API |

An `xClient.ts` exports an object whose methods call the API, so it is exempt from the "file named after its single export" rule.

```sh
npm install --save-dev @brutalway/oxlint-config-node oxlint
```

`oxlint.config.ts`:

```ts
import { nodeConfig } from '@brutalway/oxlint-config-node';
import { defineConfig } from 'oxlint';

export default defineConfig({ extends: [nodeConfig] });
```

`package.json`:

```json
"imports": { "#src/*": "./src/*" }
```

For tests written with `node:test`, add `@brutalway/oxlint-config-node-test` next to it. `@brutalway/oxlint-config-fastify` extends this config.
