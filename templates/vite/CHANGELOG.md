# template-vite

## 0.11.0

### Minor Changes

- 2971031: `npm run check` ends with `check-secrets`, which fails when a file git would commit holds a key, a token or a password, and `check-exceptions`, which fails when a disable comment or an ignore list grew since the fork point with the main branch. The CI workflow clones the whole history so that `check-exceptions` finds that fork point. `docs/reference/verifications.md` describes both, and check-tree moves to 0.13.0.

## 0.10.7

### Patch Changes

- b0d9598: `docs/reference/verifications.md` says that a prop returning JSX is named `children` or `renderX`.

## 0.10.6

### Patch Changes

- 321e350: Moves to `@brutalway/check-tree` 0.12.0, `@brutalway/dependency-cruiser-config` 0.12.1, `@brutalway/alint-config` 0.2.3 and, on vite, next and react-native, `@brutalway/oxlint-config-react` 0.5.1. Their messages say "shared feature" for a folder of a `shared/`, like the docs, and check-tree no longer counts a test as a consumer of a shared file.

## 0.10.5

### Patch Changes

- 97fcb54: The docs and `AGENTS.md` say "shared feature" for a folder of a `shared/`, where they said "slice", and "kind folder" where they also said "category folder". `docs/reference/layout.md` ends with a Words section that defines feature, sub-feature, shared feature, kind folder, consumer and entry point, and links to the glossary of brutalway. On react-native, the layout no longer says that `src/app/` holds the i18n setup and the messages, which live in `src/features/i18n/` and `locales/`.

## 0.10.4

### Patch Changes

- 1e15cfc: Moves to `@brutalway/check-tree` 0.10.1. On react-native, a platform variant such as `alert.web.ts` gets the consumers of `alert.ts`, so a file of a slice that only the variant imports is no longer reported as used by a single feature.

## 0.10.3

### Patch Changes

- eaa23d3: Moves to `@brutalway/check-tree` 0.10.0 and `@brutalway/agent-hook` 0.4.0. check-tree reads its options from the `"check-tree"` key of `package.json`, and the agent hook runs it with no flag, so both check the tree the same way. On react-native, a platform variant such as `useScreenTitle.web.ts` has the kind of `useScreenTitle.ts` and counts as one file with it, and `docs/reference/layout.md` says when to write one instead of `Platform.select`. On next and package, `--root-entries` moves from the `tree` script and `.claude/settings.json` to `"rootEntries": true` in that key.

## 0.10.2

### Patch Changes

- 01e6370: Moves to `@brutalway/check-tree` 0.9.0, which reads `.check-tree-known-violations.json` when it exists. The templates have no violation to list, so nothing else changes.

## 0.10.1

### Patch Changes

- 356f65f: The options page describes the three values of `i18n`: `none`, `en` and `en-fr`.

## 0.10.0

### Minor Changes

- 6f9fb20: The checks catch up with the single `src/shared/` split into slices. `@brutalway/dependency-cruiser-config` 0.11.0 follows the imports of a presenter: it is refused when it reaches a store, a client, zustand or react-query through any chain of imports, and when it imports an orchestrator, while a hook of local state stays fine. The oxlint config of each template (`oxlint-config-react-vite` 0.5.0, `-next` 0.3.0, `-react-native` 0.3.0, `-fastify` 0.3.0, `-node` 0.3.0) rejects an orchestrator or an `xRoutes.ts` in a `shared/` at any depth, and an `export default` outside the files a tool or the framework loads by their default export.

## 0.9.0

### Minor Changes

- 2349b0e: `src/shared-features/` and `src/shared/` merge into one `src/shared/` that holds one folder per slice, as `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0 ask. `src/shared-features/todos/` becomes `src/shared/todos/`, with `normalizeTitle.ts` next to `todosSelectors.ts` in its `lib/`, `readEnv.ts` and `EnvTypes.ts` of template-fastify go into `src/shared/env/`, and the empty `src/shared/` of template-package goes. In `src/features/todo-list/shared/`, `TitleInput`, `TitleError` and `useTitleForm` do not import each other, so each one gets its slice: `title-input/`, `title-error/` and `title-form/`. The docs follow.

## 0.8.0

### Minor Changes

- e115048: The i18n setup is the `src/features/i18n/` feature (`createI18n.ts`, and `I18nProvider.tsx` on next and react-native), and the messages move out of `src/` into `locales/` at the root of the project, imported through the `@locales/*` alias. On next and react-native, `src/app/` now holds only what the router reads, plus `globals.css` on next. React Native drops the `root` option of the `expo-router` plugin, which the Expo docs advise against: the routes move from `src/app/screens/` to `src/app/`, where Expo Router looks by default.

## 0.7.0

### Minor Changes

- 311e7fc: `src/app/` imports features only, and a file of a `shared/` folder that a single feature uses moves into it. On fastify, the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`, a service builds its queries from the database it gets, the route tests mount their feature on `test-utils/createTestServer.ts`, `ErrorSchema` moves into `src/features/todo-list/TodoListSchemas.ts` and `readEnv.ts` to the root of `src/shared/`. On react-native, the frame of the page and the themed stack come from `src/features/page-shell/`. On package, `todosFile.ts` reads and writes the JSON itself, since it was the only user of `src/shared/jsonFile.ts`.

## 0.6.0

### Minor Changes

- 5853e3b: `npm run check` runs knip a second time with `--production`, on `src/` without its tests, so a file or an export of `src/` that only a test uses is reported. A helper shared by tests goes in `test-utils/`, at the root, imported through `@test-utils/` (`#test-utils/` on fastify and package), and `@brutalway/dependency-cruiser-config` 0.8.0 rejects an import of it from production code. On vite, next and react-native, dependency-cruiser reads `tsconfig.test.json` to resolve that alias. On next, `check-tree` runs with `--root-entries`, so `src/proxy.ts` and the other files Next.js reads at the root of `src/` stay there. template-next moves to `@brutalway/oxlint-config-next` 0.1.2, which accepts `src/instrumentation-client.ts`.

## 0.5.1

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.5.0

### Minor Changes

- 8ec0f81: `AGENTS.md` tells the agent what to do when a brutalway check rejects valid code, misses a case, crashes or prints an unclear message: no `oxlint-disable` or rule turned off, it tells the user and offers an issue or a pull request on brutalway, with a draft, and opens nothing before the user agrees. `docs/guides/work-with-an-agent.md` says so too.

## 0.4.0

### Minor Changes

- c438506: No function is longer than 25 lines. On vite, `TodoItem` is split into `TodoItemCheck` and `TodoItemActions`, the list moves from `TodoListLayout` to `TodoItems`, and `TodoInput` and `TodoEditor` share `TitleInput` and `TitleError` from `src/features/todo-list/shared/presenters/`. On fastify, `createTodosQueries` prepares its statements in a function of their own.
- 00cf6cb: The docs are split by what they are for. The README keeps the introduction, getting started and a list of links. `docs/guides/` holds the tasks, `docs/reference/` the commands, the layout and `verifications.md` (moved from `docs/`), plus the endpoints on template-fastify, and `docs/concepts/architecture.md` moved from `docs/`.

### Patch Changes

- a0b6976: `npm run deps` runs dependency-cruiser with `--output-type err-long`, so each import that breaks a layer rule comes with the comment of the rule, which says what to change.
- 11f6d20: `TodoListLayout` reads `useTodoList()` as one `list` object instead of destructuring seven names, so that it declares 5 variables at most.
- 310cccc: The code is formatted at 100 columns with `@brutalway/prettier-config` 0.3.0, and the functions that grew past 25 lines are split again: on fastify, each route of `todoListRoutes.ts` is registered by a function of its own.

## 0.3.0

### Minor Changes

- 7a815dc: template-vite takes the pastel palette: yellow `#ffe98f`, pink `#ffb8e6`, blue `#b3c5ff`, with dark text on them through a new `--on-accent` token. The focus outline uses its own `--focus` token, a strong blue that keeps its contrast on the cream page. A done task shows a dark check mark on yellow, drawn with a mask filled from the tokens instead of a color written in the SVG. template-fastify uses the same pastel colors in the Swagger UI theme, with dark text on the blue method badge.

## 0.2.0

### Minor Changes

- a0fbb5d: `AGENTS.md` sums up for a coding agent what `npm run check` runs and the conventions worth knowing before writing code, with pointers to `README.md` and `docs/`. `CLAUDE.md` imports it with `@AGENTS.md`, and alint checks its paths like those of the README.
- 1e8e26f: `npm run check` runs `check-doc-length` (`@brutalway/check-doc-length`): a Markdown file of the project longer than 300 lines fails it, and `npx check-doc-length split <file>` shows how to cut it into a folder along its `##` headings.
- 1654ce3: `npm run check` runs `check-doc-links` (`@brutalway/check-doc-links`): a link of a Markdown file to a page that is gone fails it, other errors only warn, and nothing is requested when the machine is offline.
- 9c29d82: `npm run check` runs `check-doc-sources` (`@brutalway/check-doc-sources`): when a file you changed is cited by a Markdown file that did not change, it prints a warning naming the doc and the line, without failing.
- f1b60f3: `npm run check` runs jscpd (`.jscpd.json`): a block of 8 lines or 120 tokens that appears twice in `src/`, tests left out, fails it.
- 583202b: Every visible string goes through i18next, in English only. The messages are JSON in `src/app/locales/en/`, one namespace per slice (`app`, `todoList`, `todoStats`), `src/app/createI18n.ts` builds the instance and `src/main.tsx` wraps the app in an `I18nextProvider`. `npm run typecheck` first runs `i18next-cli types` into `node_modules/.cache/i18next/`, so an unknown key or a missing `{{title}}` is a tsc error, and `npm run messages` (in `check`) fails on a missing or unused key. `@brutalway/oxlint-config-i18next` reports visible text in JSX, in `aria-label`, `placeholder`, `title` and `alt`, and in template literals. `vitest.setup.ts` gives the tests the same instance. `countLabel.ts` gives way to i18next plurals, so `normalizeTitle.ts` moves up to `src/shared/`, and `TODO_FILTERS` only lists the filters.
- 9f58866: `securityHeaders.ts` holds the HTTP headers of the app, with an enforced Content Security Policy (`default-src 'self'`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`. A Vite plugin sends them from `vite preview`, so the e2e tests run under them, and writes them into `dist/_headers` at build time for Netlify and Cloudflare Pages.
- afbf814: stylelint checks the stylesheets with `@brutalway/stylelint-config`: outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there, and the message names the closest tokens. `npm run check` runs it through `npm run styles`.
- a36a8fb: A blank title no longer disables the Add and Save buttons: submitting it shows "The title is blank" under the field, with `role="alert"`, `aria-invalid` and `aria-describedby`, and the e2e test runs axe on that state. `TodoInput.tsx` and `TodoEditor.tsx` read their field through `src/features/todo-list/shared/useTitleForm.ts`.

### Patch Changes

- Use the @brutalway packages of this release. `check-doc-links` keeps its default skipped links when `docLinks.skip` is set, `check-doc-sources` no longer crashes on a link with a malformed `%`, the agent hook says which check could not start, and `file-named-after-export` also reports a named default export.
- f1b60f3: `TodoFilters.tsx`, `TodoStats.tsx` and `TodoEditor.tsx` get their component tests, `TodoItem.test.tsx` checks a done task, and `todosStore.test.ts` checks `setFilter`.
- 0b57e92: `TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts`, and the presenters type their callbacks with `Todo['id']`, so the data can come from somewhere else without touching the components.

## 0.1.0

### Minor Changes

- First versioned release. Vite, React and TypeScript, with a neo-brutalist todo list as the example app (zustand store in `src/shared-features/todos/`), Vitest unit and component tests, Playwright e2e, and the `@brutalway/*` checks run by `npm run check`, the pre-commit hook and CI.
