# template-package

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
