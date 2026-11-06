# @brutal/check-tree

## 0.4.0

### Minor Changes

- cd29bdf: Give HTTP clients (`xClient.ts`) and background workers (`xWorker.ts`) a place in the server conventions. check-tree groups them in `clients/` and `workers/`, and no longer counts `xEnv.ts` as a lib file. In the dependency-cruiser server config, a worker may import queries, only `src/app/` starts a worker (`workers-started-from-app`) and only a client imports `undici`, `axios`, `got`, `node-fetch` or `node:http(s)` (`http-in-clients`). `sqlite-in-queries` is renamed `database-in-queries` and also covers `pg`, `postgres`, `mysql2` and `better-sqlite3`. The Fastify oxlint config exempts clients and workers from the file-named-after-export rule, and allows `fetch` only in a client or a test.

## 0.3.0

### Minor Changes

- 8cdd0fe: Server files get their own kinds: `xRoutes.ts`, `xService.ts`, `xQueries.ts` and `xSchemas.ts` stay at the root of their folder while there is one of them and move into `routes/`, `services/`, `queries/` or `schemas/` from two on. They no longer count as `lib` files.

## 0.2.1

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.

## 0.2.0

### Minor Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.
