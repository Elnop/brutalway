# @brutalkit/dependency-cruiser-config

## 0.14.0

### Minor Changes

- 2dbd7b1: The tests live in `test/`: `test/unit/` at the path of their source, `test/support/` for the helpers they share and `test/e2e/`. Every file of `test/` counts as a test, and `test-utils/`, `e2e/` and the `.test.ts` files under `src/` no longer do. Move the tests with `npx check-tree src --fix` from @brutalway/check-tree, and run `depcruise src test`.

  A new rule, `unit-test-own-source`, keeps a unit test on its own source: from `src/`, it imports the file at its mirrored path, a platform variant of it, and `xConfig.ts` or `xTypes.ts` files, nothing else. A unit test also follows the layer rules of its source, so `test/unit/features/cart/` cannot import another feature. A test that drives several files has to be split, or its setup moved into `test/support/`.

## 0.13.0

### Minor Changes

- 28aee4e: `xClient.ts` means a client of an external API, with no exception. The analytics rule becomes `analytics-in-tracker`: the SDK is only imported from `analyticsTracker.ts`, so rename `analyticsClient.ts` to `analyticsTracker.ts`. `orchestrators-use-hooks` no longer lets an orchestrator import `analyticsClient.ts`.

## 0.12.4

### Patch Changes

- 9814049: `orchestrators-use-hooks` lets an orchestrator import `analyticsClient.ts`, which only sends events and is the one way out for them.

## 0.12.3

### Patch Changes

- bcca4c7: Two rules in `layers`: `orchestrators-use-hooks`, an `XContainer`, `XLayout` or `XPage` imports no `xClient.ts` and reads server data through a hook, and `app-composes-orchestrators`, `src/app/` imports the orchestrators and providers of a feature, never one of its presenters.

## 0.12.2

### Patch Changes

- 66fa040: The messages of `no-cross-shared` and of the nested shared features rule name the move that was missing: a file that combines two shared features moves up into the feature that uses it. Merging the two stays the answer when they are one concept.

## 0.12.1

### Patch Changes

- 2b81eb2: The messages say "shared feature" for a folder of a `shared/`, where they said "slice", "kind folder" where the docs also said "category folder", and "entry points" for the files at the root of `src/`. `split it into one slice per group` becomes `split it into one shared feature per group`, and `shared/ holds one folder per slice` becomes `shared/ holds one folder per shared feature`. The terms are defined in the new glossary of the docs, `docs/reference/glossary.md` in the brutalway repository.

  A `.check-tree-known-violations.json` file holds the printed messages, so its entries no longer match: run `npx check-tree src --write-known-violations` once after the upgrade, and check that the diff only changes words.

## 0.12.0

### Minor Changes

- e5ab8b9: `presenters-are-pure` no longer counts an `XProvider.tsx` as a presenter, as `@brutalway/oxlint-config-next` already does: a provider wires a context, so it may import `@tanstack/react-query` or a store, like the `QueryProvider` of template-next with its `server-state` option.

## 0.11.0

### Minor Changes

- e9eaa81: `presenters-are-pure` follows the imports: a presenter is reported when it reaches a store, an `xClient.ts`, `zustand` or `@tanstack/react-query` through any chain of imports, at any depth. Before, it only looked at the direct imports and at the name of the hooks of `src/shared/`. A presenter could call `useTodoList`, which reads the store through `useTodos`, and could not call `useCopyToClipboard`, which only holds local state. Now it is the other way around.

  New rule `presenters-render-presenters`: a presenter does not import an `XContainer`, `XLayout` or `XPage`. Without it, a presenter that renders an orchestrator would reach its store. A project where a presenter renders an orchestrator moves that orchestrator up into the orchestrator that renders the presenter.

## 0.10.0

### Minor Changes

- 8109226: `src/shared/` and `src/shared-features/` merge into a single `src/shared/` split into slices, one folder per concept, at any depth. `no-cross-shared` keeps a slice from importing another one, which replaces `no-cross-shared-feature` and `shared-features-not-to-features`. Inside a feature or a slice, `no-cross-sub-shared` keeps a slice of its `shared/` from importing another slice, a sub-feature or the root of its parent, which replaces `no-cross-sub-shared-feature` and `feature-shared-not-to-sub-features`. `presenters-are-pure` looks for the hooks of `src/shared/<slice>/`, and `stores-in-their-folder` accepts a store at the root or in the `stores/` folder of a slice.

  To migrate, rename `src/shared-features/<x>/` to `src/shared/<x>/`, and move each file of the old `src/shared/` into a slice named after its concept (`shared/errors/errorMessage.ts`). A file a single slice uses moves into that slice. Do the same in the `shared/` and `shared-features/` of each feature.

## 0.9.0

### Minor Changes

- 1bc7463: `app-only-to-features` rejects an import of `shared-features/` or `shared/` from `src/app/`, which only composes the features. With `server`, a service builds its queries from the database it gets, `src/app/` no longer wires them (`queries-behind-services`), the connection is opened in `src/features/database/` instead of `src/shared/` and a test may open its own (`database-in-queries`), and a worker lives in a feature so that `src/app/` can start it.

## 0.8.0

### Minor Changes

- ce02622: `no-prod-to-tests` also rejects production code importing `test-utils/` or `e2e/`, and the server and library rules treat a file in those folders as a test.

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
