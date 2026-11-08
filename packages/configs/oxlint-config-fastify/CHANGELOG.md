# @brutalkit/oxlint-config-fastify

## 0.2.1

### Patch Changes

- 78d304c: New package `@brutalway/oxlint-config-node`: the TypeScript base plus the `#src/` alias instead of relative imports and `fetch` only in `xClient.ts` files. `@brutalway/oxlint-config-fastify` now extends it instead of repeating those rules.
- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.
  
  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.
- Updated dependencies [78d304c]
  - @brutalway/oxlint-config-node@0.2.0

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
