# template-next

## 0.7.3

### Patch Changes

- eaa23d3: Moves to `@brutalway/check-tree` 0.10.0 and `@brutalway/agent-hook` 0.4.0. check-tree reads its options from the `"check-tree"` key of `package.json`, and the agent hook runs it with no flag, so both check the tree the same way. On react-native, a platform variant such as `useScreenTitle.web.ts` has the kind of `useScreenTitle.ts` and counts as one file with it, and `docs/reference/layout.md` says when to write one instead of `Platform.select`. On next and package, `--root-entries` moves from the `tree` script and `.claude/settings.json` to `"rootEntries": true` in that key.

## 0.7.2

### Patch Changes

- 01e6370: Moves to `@brutalway/check-tree` 0.9.0, which reads `.check-tree-known-violations.json` when it exists. The templates have no violation to list, so nothing else changes.

## 0.7.1

### Patch Changes

- 356f65f: The options page describes the three values of `i18n`: `none`, `en` and `en-fr`.

## 0.7.0

### Minor Changes

- 70cf121: `npm create brutal` gives template-next a `server-state` option, for an app that reads and writes its data through an API with TanStack Query. It adds a `QueryProvider` to `src/app/layout.tsx` and extends `noServerFunctionsConfig` of `@brutalway/oxlint-config-next` 0.4.0, which rejects every `'use server'` and every `'use cache'`. With the example, the todos come from a catch-all route handler under `src/app/api/` that keeps them in memory, one list per browser. `@brutalway/dependency-cruiser-config` 0.12.0 no longer counts an `XProvider.tsx` as a presenter.

## 0.6.0

### Minor Changes

- 6f9fb20: The checks catch up with the single `src/shared/` split into slices. `@brutalway/dependency-cruiser-config` 0.11.0 follows the imports of a presenter: it is refused when it reaches a store, a client, zustand or react-query through any chain of imports, and when it imports an orchestrator, while a hook of local state stays fine. The oxlint config of each template (`oxlint-config-react-vite` 0.5.0, `-next` 0.3.0, `-react-native` 0.3.0, `-fastify` 0.3.0, `-node` 0.3.0) rejects an orchestrator or an `xRoutes.ts` in a `shared/` at any depth, and an `export default` outside the files a tool or the framework loads by their default export.

## 0.5.0

### Minor Changes

- 2349b0e: `src/shared-features/` and `src/shared/` merge into one `src/shared/` that holds one folder per slice, as `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0 ask. `src/shared-features/todos/` becomes `src/shared/todos/`, with `normalizeTitle.ts` next to `todosSelectors.ts` in its `lib/`, `readEnv.ts` and `EnvTypes.ts` of template-fastify go into `src/shared/env/`, and the empty `src/shared/` of template-package goes. In `src/features/todo-list/shared/`, `TitleInput`, `TitleError` and `useTitleForm` do not import each other, so each one gets its slice: `title-input/`, `title-error/` and `title-form/`. The docs follow.

## 0.4.0

### Minor Changes

- e115048: The i18n setup is the `src/features/i18n/` feature (`createI18n.ts`, and `I18nProvider.tsx` on next and react-native), and the messages move out of `src/` into `locales/` at the root of the project, imported through the `@locales/*` alias. On next and react-native, `src/app/` now holds only what the router reads, plus `globals.css` on next. React Native drops the `root` option of the `expo-router` plugin, which the Expo docs advise against: the routes move from `src/app/screens/` to `src/app/`, where Expo Router looks by default.

### Patch Changes

- aad3ecb: The agent hook runs check-tree with `--root-entries`, like `npm run tree`. It used to ask the agent to move `src/instrumentation.ts` and `src/proxy.ts` into `lib/`, where Next.js no longer finds them.

## 0.3.0

### Minor Changes

- 311e7fc: `src/app/` imports features only, and a file of a `shared/` folder that a single feature uses moves into it. On fastify, the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`, a service builds its queries from the database it gets, the route tests mount their feature on `test-utils/createTestServer.ts`, `ErrorSchema` moves into `src/features/todo-list/TodoListSchemas.ts` and `readEnv.ts` to the root of `src/shared/`. On react-native, the frame of the page and the themed stack come from `src/features/page-shell/`. On package, `todosFile.ts` reads and writes the JSON itself, since it was the only user of `src/shared/jsonFile.ts`.

## 0.2.0

### Minor Changes

- 5853e3b: `npm run check` runs knip a second time with `--production`, on `src/` without its tests, so a file or an export of `src/` that only a test uses is reported. A helper shared by tests goes in `test-utils/`, at the root, imported through `@test-utils/` (`#test-utils/` on fastify and package), and `@brutalway/dependency-cruiser-config` 0.8.0 rejects an import of it from production code. On vite, next and react-native, dependency-cruiser reads `tsconfig.test.json` to resolve that alias. On next, `check-tree` runs with `--root-entries`, so `src/proxy.ts` and the other files Next.js reads at the root of `src/` stay there. template-next moves to `@brutalway/oxlint-config-next` 0.1.2, which accepts `src/instrumentation-client.ts`.

## 0.1.3

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.1.2

### Patch Changes

- 51ebbed: `@brutalway/oxlint-config-next` 0.1.1, which lets a `'use client'` file import `analyticsClient.ts`.

## 0.1.1

### Patch Changes

- d8ea465: `oxlint.config.ts` extends `@brutalway/oxlint-config-next`: `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, a `'use client'` file imports no `xClient.ts`, and a server action lives in a `.ts` file of its own.

## 0.1.0

### Minor Changes

- 7ccf13a: First version of template-next: the todo list of template-vite on the Next.js App Router. The route files of `src/app/` are server components that lay out the features, the orchestrators that read the zustand store start with `'use client'`, and `src/proxy.ts` sends a Content Security Policy with a nonce per request. `npm run check`, Vitest and Playwright run as on template-vite.
