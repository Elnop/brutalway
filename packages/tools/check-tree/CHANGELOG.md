# @brutalkit/check-tree

## 0.9.0

### Minor Changes

- ddfff38: check-tree reads `.check-tree-known-violations.json` from the current folder when it exists, and stops reporting the violations listed there. A violation missing from the list still fails, and so does an entry that no longer happens, so the list can only shrink. `--write-known-violations` writes the current violations to that file.

## 0.8.0

### Minor Changes

- f15ffc6: `src/shared/` and `src/shared-features/` merge into a single `shared/` split into slices, at any depth. A `shared/` holds one folder per slice and no file, a slice is laid out like a feature, and `shared-features/` is no longer a layer. The consumers rule covers every slice: a file of a slice, or a whole slice, used by a single feature is reported, which the slices of `shared-features/` used to escape. A new rule asks the files of a slice, tests aside, to form one group in the import graph: `src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one slice per group`. `sharedViolations` returns both.

  To migrate, rename `shared-features/<x>/` to `shared/<x>/`, move each file of the old `shared/` into a slice named after its concept, and split each slice the way check-tree lists its groups.

### Patch Changes

- 3bce77b: `app/` belongs to the router: its files stay where they are, whatever their kind. `src/app/` holding `sitemap.ts`, `robots.ts` and `manifest.ts` (Next.js), or `hello+api.ts` and `+middleware.ts` (Expo Router), used to be told to move them into `lib/`, where the router no longer finds them. Empty folders under `app/` are still reported.
- 123dc8e: The check on `shared/` gives its paths from the parent of the checked folder, like the folder checks. `check-tree packages/ws/src` used to print `src/features/stock/lib holds a single child` next to `packages/ws/src/shared/seul.ts is only used by packages/ws/src/features/panier`, and `./src/` with a trailing slash was not matched at all.

## 0.7.0

### Minor Changes

- 99a9f44: check-tree rejects a file of a `shared/` folder that a single consumer uses. For `src/shared/`, a consumer is a feature or a shared feature. For the `shared/` of a feature, it is one of its sub-features, one of its sub shared features or its own files outside them. A file imported by another file of the same `shared/` gets the consumers of that file, and a test counts for the feature it sits in. To resolve the imports, check-tree reads the dependency-cruiser config of the current folder: `dependency-cruiser` is now a peer dependency, and check-tree stops with a message when the folder has no config. `@brutalway/check-tree/sharedViolations` runs this check from code.

### Patch Changes

- 422ddc9: A category folder whose files all belong to one group keeps them. `components/` with two presenters and nothing else used to ask for `presenters/`, then rejected `components/` for holding a single child.

## 0.6.0

### Minor Changes

- 5485d9e: check-tree rejects a folder the layout does not name. `src/` holds `app/`, `features/`, `shared-features/` and `shared/` next to its entry files, `src/shared/` holds kind folders only, and a feature or a shared feature, at any depth, holds kind folders, `features/`, `shared-features/` and `shared/`. A kind folder holds kind folders only, and `app/` is not checked. A concept folder like `src/shared/authentication/` now gets `src/shared/authentication is not a kind folder: src/shared/ holds no domain, move its files into lib/, types/, configs/... or into a shared feature`. `--categories` also sets the kind folders the layout accepts.

## 0.5.1

### Patch Changes

- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

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
