# template-package

## 0.8.1

### Patch Changes

- 6b653ea: The README and `AGENTS.md` say how to take the changes of the template: `.brutalway.json` records how the project was made, and `npx create-brutal@latest update` merges what changed since.
- c1caf4d: `docs/reference/verifications.md` lists `oxlint-suppressions.json` and `.alint-baseline.json` among the files check-exceptions counts.

## 0.8.0

### Minor Changes

- 2971031: `npm run check` ends with `check-secrets`, which fails when a file git would commit holds a key, a token or a password, and `check-exceptions`, which fails when a disable comment or an ignore list grew since the fork point with the main branch. The CI workflow clones the whole history so that `check-exceptions` finds that fork point. `docs/reference/verifications.md` describes both, and check-tree moves to 0.13.0.

## 0.7.5

### Patch Changes

- 321e350: Moves to `@brutalway/check-tree` 0.12.0, `@brutalway/dependency-cruiser-config` 0.12.1, `@brutalway/alint-config` 0.2.3 and, on vite, next and react-native, `@brutalway/oxlint-config-react` 0.5.1. Their messages say "shared feature" for a folder of a `shared/`, like the docs, and check-tree no longer counts a test as a consumer of a shared file.

## 0.7.4

### Patch Changes

- 97fcb54: The docs and `AGENTS.md` say "shared feature" for a folder of a `shared/`, where they said "slice", and "kind folder" where they also said "category folder". `docs/reference/layout.md` ends with a Words section that defines feature, sub-feature, shared feature, kind folder, consumer and entry point, and links to the glossary of brutalway. On react-native, the layout no longer says that `src/app/` holds the i18n setup and the messages, which live in `src/features/i18n/` and `locales/`.

## 0.7.3

### Patch Changes

- 1e15cfc: Moves to `@brutalway/check-tree` 0.10.1. On react-native, a platform variant such as `alert.web.ts` gets the consumers of `alert.ts`, so a file of a slice that only the variant imports is no longer reported as used by a single feature.

## 0.7.2

### Patch Changes

- eaa23d3: Moves to `@brutalway/check-tree` 0.10.0 and `@brutalway/agent-hook` 0.4.0. check-tree reads its options from the `"check-tree"` key of `package.json`, and the agent hook runs it with no flag, so both check the tree the same way. On react-native, a platform variant such as `useScreenTitle.web.ts` has the kind of `useScreenTitle.ts` and counts as one file with it, and `docs/reference/layout.md` says when to write one instead of `Platform.select`. On next and package, `--root-entries` moves from the `tree` script and `.claude/settings.json` to `"rootEntries": true` in that key.

## 0.7.1

### Patch Changes

- 01e6370: Moves to `@brutalway/check-tree` 0.9.0, which reads `.check-tree-known-violations.json` when it exists. The templates have no violation to list, so nothing else changes.

## 0.7.0

### Minor Changes

- 6f9fb20: The checks catch up with the single `src/shared/` split into slices. `@brutalway/dependency-cruiser-config` 0.11.0 follows the imports of a presenter: it is refused when it reaches a store, a client, zustand or react-query through any chain of imports, and when it imports an orchestrator, while a hook of local state stays fine. The oxlint config of each template (`oxlint-config-react-vite` 0.5.0, `-next` 0.3.0, `-react-native` 0.3.0, `-fastify` 0.3.0, `-node` 0.3.0) rejects an orchestrator or an `xRoutes.ts` in a `shared/` at any depth, and an `export default` outside the files a tool or the framework loads by their default export.

## 0.6.0

### Minor Changes

- 2349b0e: `src/shared-features/` and `src/shared/` merge into one `src/shared/` that holds one folder per slice, as `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0 ask. `src/shared-features/todos/` becomes `src/shared/todos/`, with `normalizeTitle.ts` next to `todosSelectors.ts` in its `lib/`, `readEnv.ts` and `EnvTypes.ts` of template-fastify go into `src/shared/env/`, and the empty `src/shared/` of template-package goes. In `src/features/todo-list/shared/`, `TitleInput`, `TitleError` and `useTitleForm` do not import each other, so each one gets its slice: `title-input/`, `title-error/` and `title-form/`. The docs follow.

## 0.5.0

### Minor Changes

- 311e7fc: `src/app/` imports features only, and a file of a `shared/` folder that a single feature uses moves into it. On fastify, the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`, a service builds its queries from the database it gets, the route tests mount their feature on `test-utils/createTestServer.ts`, `ErrorSchema` moves into `src/features/todo-list/TodoListSchemas.ts` and `readEnv.ts` to the root of `src/shared/`. On react-native, the frame of the page and the themed stack come from `src/features/page-shell/`. On package, `todosFile.ts` reads and writes the JSON itself, since it was the only user of `src/shared/jsonFile.ts`.

## 0.4.0

### Minor Changes

- 5853e3b: `npm run check` runs knip a second time with `--production`, on `src/` without its tests, so a file or an export of `src/` that only a test uses is reported. A helper shared by tests goes in `test-utils/`, at the root, imported through `@test-utils/` (`#test-utils/` on fastify and package), and `@brutalway/dependency-cruiser-config` 0.8.0 rejects an import of it from production code. On vite, next and react-native, dependency-cruiser reads `tsconfig.test.json` to resolve that alias. On next, `check-tree` runs with `--root-entries`, so `src/proxy.ts` and the other files Next.js reads at the root of `src/` stay there. template-next moves to `@brutalway/oxlint-config-next` 0.1.2, which accepts `src/instrumentation-client.ts`.

## 0.3.1

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.3.0

### Minor Changes

- 8ec0f81: `AGENTS.md` tells the agent what to do when a brutalway check rejects valid code, misses a case, crashes or prints an unclear message: no `oxlint-disable` or rule turned off, it tells the user and offers an issue or a pull request on brutalway, with a draft, and opens nothing before the user agrees. `docs/guides/work-with-an-agent.md` says so too.

## 0.2.0

### Minor Changes

- 00cf6cb: The docs are split by what they are for. The README keeps the introduction, getting started and a list of links. `docs/guides/` holds the tasks, `docs/reference/` the commands, the layout and `verifications.md` (moved from `docs/`), plus the endpoints on template-fastify, and `docs/concepts/architecture.md` moved from `docs/`.

### Patch Changes

- a0b6976: `npm run deps` runs dependency-cruiser with `--output-type err-long`, so each import that breaks a layer rule comes with the comment of the rule, which says what to change.
- 310cccc: The code is formatted at 100 columns with `@brutalway/prettier-config` 0.3.0, and the functions that grew past 25 lines are split again: on fastify, each route of `todoListRoutes.ts` is registered by a function of its own.

## 0.1.0

### Minor Changes

- f3d0392: New template for a standalone npm package. The example is the todo list kept in a JSON file: the `"."` export offers `addTodo`, `listTodos` and `completeTodo`, and the `todo` bin calls them (`todo add|list|done`, `--file`). Each entry point is a file at the root of `src/`, checked by `@brutalway/dependency-cruiser-config/library` and `check-tree --root-entries`, tsdown builds `dist/` with its types, and `@brutalway/alint-config/library.yml` pins the devDependencies only. Versions come from changesets, and `.github/workflows/release.yml` publishes them to npm with trusted publishing and provenance.
