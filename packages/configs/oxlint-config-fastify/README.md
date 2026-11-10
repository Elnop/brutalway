# @brutalway/oxlint-config-fastify

Oxlint config for a Fastify API validated with Zod. It extends `@brutalway/oxlint-config-node`, which extends `@brutalway/oxlint-config-typescript`.

## Install

```sh
npm install --save-dev @brutalway/oxlint-config-fastify oxlint
```

`oxlint.config.ts`:

```ts
import { fastifyConfig } from '@brutalway/oxlint-config-fastify';
import { defineConfig } from 'oxlint';

export default defineConfig({ extends: [fastifyConfig] });
```

`package.json`:

```json
{
  "imports": { "#src/*": "./src/*" }
}
```

## Rules

| Rule                        | Rejects                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| env in one place            | `process.env` outside an `xEnv.ts` file, which parses it with Zod and hands the values on                                         |
| factories, not decorators   | `app.decorate`, `decorateRequest`, `decorateReply`: dependencies are parameters of `createXService({ ... })`, wired in `src/app/` |
| async handlers return       | `reply.send()` inside an `async` function: return the value                                                                       |
| fetch in clients            | `fetch` outside an `xClient.ts` file or a test: clients are the only files that call another API                                  |
| schemas file                | an `xSchemas.ts` exporting anything but Zod schemas. Infer types in an `XTypes.ts`. The rule comes from the TypeScript base       |
| no route in shared-features | an `xRoutes.ts` under `shared-features/`: routes belong to a feature                                                              |
| aliases                     | relative imports: use the `#src/` alias from the `imports` field of `package.json`                                                |

`xService.ts`, `xQueries.ts`, `xSchemas.ts`, `xRoutes.ts`, `xClient.ts` and `xWorker.ts` are exempt from the "file named after its single export" rule. `xSchemas.ts` files are also exempt from the "constants in `XConfig.ts`" rule.

## Why

Factories and plugins are named `createX` or `xRoutes` while their file is named after the kind, which is why those files skip the "file named after its single export" rule. Schemas are constants, which is why an `xSchemas.ts` skips the "constants in `XConfig.ts`" rule.
