# @brutalkit/dependency-cruiser-config

## 0.7.0

### Minor Changes

- 5485d9e: The sub-feature rules of `layers` apply inside a shared feature too, so a sub-feature of `src/shared-features/<x>/features/` can no longer import its siblings or the root of its parent. A feature or a shared feature can hold sub shared features in `shared-features/<y>/`: the new `no-cross-sub-shared-feature` rule keeps one from importing another, a sub-feature or the root of its parent, and `feature-shared-not-to-sub-features` keeps the parent `shared/` from importing them. A sub-feature can import the sub shared features of its parent.

## 0.6.0

### Minor Changes

- 284c471: `analytics-in-client` also keeps `posthog-react-native` inside `analyticsClient.ts`, for the React Native apps.

## 0.5.0

### Minor Changes

- 854b682: New `analytics` option on vite: `none` by default, `module` or `posthog`. Both write `src/shared/analyticsClient.ts`, the only place events leave the app (`analyticsClient.track('todo_added')`, which the example calls when a task is added). With `module` it dispatches an `analytics` event on `window` for any tool to plug in. With `posthog` it sends to PostHog when `VITE_POSTHOG_KEY` is set, and nothing otherwise, with autocapture and remote scripts off and the PostHog hosts allowed in `connect-src`.

  `@brutalway/dependency-cruiser-config` adds `analytics-in-client`: `posthog-js`, `@segment/analytics-next`, `mixpanel-browser`, `@amplitude/analytics-browser`, `react-ga4` and `@vercel/analytics` are only imported from an `analyticsClient.ts`.

- 4207bd2: New `library` config for a published package: the entry points are files at the root of `src/`, nothing but a test imports them, and there is no `src/app/`.
  It also lets the code import a peer dependency that is a dev dependency too, as `oxlint` is for a lint config.
- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.

  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.

- b7940fa: New `ui` option on vite, `none` by default. `--ui shadcn` (with `--styling tailwind`) copies the Button, Input, Checkbox and Card of shadcn/ui into `third-party/shadcn/`, outside `src/`, and the example uses them. `components.json` points every alias of the shadcn CLI to `@third-party/shadcn`, so `npx shadcn add <name>` writes there too. The vendored files are checked by a TypeScript project of their own, `tsconfig.third-party.json`, referenced by the app and built with `tsc -b`. Prettier, Oxlint and check-tree skip the folder, knip takes its files as entries, and alint refuses any folder in `third-party/` but `shadcn/`. The tokens of `src/app/globals.css` give the primitives the look of the series without touching their files.

  `@brutalway/tsconfig` ships `react-vite-third-party.json`: `react-vite.json` without `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`, for code copied from a registry.

  `@brutalway/dependency-cruiser-config/shadcn` extends the layers with `third-party-not-to-src` and `third-party-packages-only-from-third-party`: vendored code imports nothing from the app, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`. Projects made with `--ui shadcn` use it and run `depcruise src third-party`.

  `@brutalway/oxlint-config-shadcn` is a new package with `primitives-first` (no raw `<button>`, `<input>`, `<select>` or `<textarea>`, the message names the primitive and the `npx shadcn add` command) and `one-icon-library` (icons only from `lucide-react`). Projects made with `--ui shadcn` extend it.

  `@brutalway/agent-hook` takes `--vendored <folder>`: the `PostToolUse` hook runs no check on a file there, and the same command as a `PreToolUse` hook refuses the edit with what to do instead (`npx shadcn add <name> --overwrite`, the tokens or a `data-slot` rule in `src/app/globals.css`, a wrapper in `src/`). Projects made with `--ui shadcn` and the Claude Code hook get both.

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
