# @brutalkit/check-tree

## 0.5.0

### Minor Changes

- 6c02dd7: `--root-entries` (`{ rootEntries: true }` for the function) leaves the files at the root of the checked folder where they are: a published package keeps one entry point per bin or export there, whatever their kind.
- afbf814: New `css-modules` value for the `styling` option on vite: each component of the example gets its own `X.module.css` next to it, and `happy-css-modules` writes the types of the class names so `styles.typo` fails `tsc`. Projects in plain CSS or CSS Modules now run stylelint with `@brutalway/stylelint-config`, a new package with three rules: `color-tokens` (a color is a `var()` of a custom property declared in `src/app/globals.css`, with the closest tokens in the message), `module-next-to-component` and `no-unused-class`. In a `.module.css`, classes are camelCase. check-tree leaves `X.module.css` next to its component instead of asking to move it into `styles/`, and the agent hook runs stylelint on each edited stylesheet.
- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.
  
  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.

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
