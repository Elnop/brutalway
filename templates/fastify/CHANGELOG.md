# template-fastify

## 0.4.1

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.4.0

### Minor Changes

- 8ec0f81: `AGENTS.md` tells the agent what to do when a brutalway check rejects valid code, misses a case, crashes or prints an unclear message: no `oxlint-disable` or rule turned off, it tells the user and offers an issue or a pull request on brutalway, with a draft, and opens nothing before the user agrees. `docs/guides/work-with-an-agent.md` says so too.

## 0.3.0

### Minor Changes

- 00cf6cb: The docs are split by what they are for. The README keeps the introduction, getting started and a list of links. `docs/guides/` holds the tasks, `docs/reference/` the commands, the layout and `verifications.md` (moved from `docs/`), plus the endpoints on template-fastify, and `docs/concepts/architecture.md` moved from `docs/`.

### Patch Changes

- a0b6976: `npm run deps` runs dependency-cruiser with `--output-type err-long`, so each import that breaks a layer rule comes with the comment of the rule, which says what to change.
- c438506: No function is longer than 25 lines. On vite, `TodoItem` is split into `TodoItemCheck` and `TodoItemActions`, the list moves from `TodoListLayout` to `TodoItems`, and `TodoInput` and `TodoEditor` share `TitleInput` and `TitleError` from `src/features/todo-list/shared/presenters/`. On fastify, `createTodosQueries` prepares its statements in a function of their own.
- 310cccc: The code is formatted at 100 columns with `@brutalway/prettier-config` 0.3.0, and the functions that grew past 25 lines are split again: on fastify, each route of `todoListRoutes.ts` is registered by a function of its own.

## 0.2.1

### Patch Changes

- 7a815dc: The Swagger UI theme uses the pastel colors of the series: yellow `#ffe98f`, pink `#ffb8e6` and blue `#b3c5ff`, with dark text on the blue method badge.

## 0.2.0

### Minor Changes

- a0fbb5d: `AGENTS.md` sums up for a coding agent what `npm run check` runs and the conventions worth knowing before writing code, with pointers to `README.md` and `docs/`. `CLAUDE.md` imports it with `@AGENTS.md`, and alint checks its paths like those of the README.
- 1e8e26f: `npm run check` runs `check-doc-length` (`@brutalway/check-doc-length`): a Markdown file of the project longer than 300 lines fails it, and `npx check-doc-length split <file>` shows how to cut it into a folder along its `##` headings.
- 1654ce3: `npm run check` runs `check-doc-links` (`@brutalway/check-doc-links`): a link of a Markdown file to a page that is gone fails it, other errors only warn, and nothing is requested when the machine is offline.
- 9c29d82: `npm run check` runs `check-doc-sources` (`@brutalway/check-doc-sources`): when a file you changed is cited by a Markdown file that did not change, it prints a warning naming the doc and the line, without failing.
- f1b60f3: `npm run check` runs jscpd (`.jscpd.json`): a block of 8 lines or 120 tokens that appears twice in `src/`, tests left out, fails it.

### Patch Changes

- Use the @brutalway packages of this release. `check-doc-links` keeps its default skipped links when `docLinks.skip` is set, `check-doc-sources` no longer crashes on a link with a malformed `%`, the agent hook says which check could not start, and `file-named-after-export` also reports a named default export.

## 0.1.0

### Minor Changes

- First versioned release. Fastify and TypeScript run by Node without a build step, with the todo list API as the example (Zod schemas, `node:sqlite`, a themed Swagger UI on `/docs`), `node:test` tests, and the `@brutalway/*` checks run by `npm run check`, the pre-commit hook and CI.
