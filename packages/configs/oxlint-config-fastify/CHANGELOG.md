# @brutalkit/oxlint-config-fastify

## 0.2.0

### Minor Changes

- cd29bdf: Give HTTP clients (`xClient.ts`) and background workers (`xWorker.ts`) a place in the server conventions. check-tree groups them in `clients/` and `workers/`, and no longer counts `xEnv.ts` as a lib file. In the dependency-cruiser server config, a worker may import queries, only `src/app/` starts a worker (`workers-started-from-app`) and only a client imports `undici`, `axios`, `got`, `node-fetch` or `node:http(s)` (`http-in-clients`). `sqlite-in-queries` is renamed `database-in-queries` and also covers `pg`, `postgres`, `mysql2` and `better-sqlite3`. The Fastify oxlint config exempts clients and workers from the file-named-after-export rule, and allows `fetch` only in a client or a test.

## 0.1.1

### Patch Changes

- abcac8c: The file-name blocklist now lives only in the TypeScript base, which also rejects orchestrators and routes under `shared-features/`. In `@elnop/oxlint-config-react-vite`, the base extended through the zustand config replaced the React config's blocklist, so `XContainer.tsx` files under `shared-features/` went unreported.
- Updated dependencies [abcac8c]
  - @elnop/oxlint-config-typescript@0.4.0

## 0.1.0

### Minor Changes

- 6e9d843: New `@elnop/oxlint-config-fastify` (env read in xEnv.ts, no decorate, async handlers return, Zod schemas in xSchemas.ts, no route under shared-features/) and `@elnop/oxlint-config-node-test` (it() inside describe() from node:test, node:assert/strict). The React config rejects orchestrators under shared-features/.
