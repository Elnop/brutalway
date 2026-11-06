# @brutalkit/dependency-cruiser-config

## 0.4.0

### Minor Changes

- 448fdeb: Apply the sub-feature rules at every nesting level, up to 10 levels, and reject deeper features

## 0.3.0

### Minor Changes

- cd29bdf: Give HTTP clients (`xClient.ts`) and background workers (`xWorker.ts`) a place in the server conventions. check-tree groups them in `clients/` and `workers/`, and no longer counts `xEnv.ts` as a lib file. In the dependency-cruiser server config, a worker may import queries, only `src/app/` starts a worker (`workers-started-from-app`) and only a client imports `undici`, `axios`, `got`, `node-fetch` or `node:http(s)` (`http-in-clients`). `sqlite-in-queries` is renamed `database-in-queries` and also covers `pg`, `postgres`, `mysql2` and `better-sqlite3`. The Fastify oxlint config exempts clients and workers from the file-named-after-export rule, and allows `fetch` only in a client or a test.

## 0.2.0

### Minor Changes

- 8b54f74: The layer between features and shared is now `src/shared-features/` instead of `src/states/`: `states-not-to-features` becomes `shared-features-not-to-features` and `no-cross-state` becomes `no-cross-shared-feature`. New `@elnop/dependency-cruiser-config/server` entry with `routes-not-to-queries`, `queries-behind-services` and `sqlite-in-queries`.

## 0.1.0

### Minor Changes

- 56103f8: First release: tsconfig, Prettier, dependency-cruiser and alint configs, Playwright fixtures and the Claude Code agent hook, moved out of the elnop-stacks templates so they share one copy.
