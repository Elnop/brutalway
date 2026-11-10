# Common rules

The rules every template shares, the tool that enforces each one and the message it prints. The rules that belong to one stack are in that template's `docs/verifications.md`: [template-vite](../../templates/vite/docs/verifications.md), [template-fastify](../../templates/fastify/docs/verifications.md), [template-package](../../templates/package/docs/verifications.md).

All of them run in `npm run check`, in the pre-commit hook and in CI. The messages below come from a project created with `npm create brutal`.

## Layers

`src/` has four layers: `app`, `features`, `shared-features`, `shared`. A layer imports only the layers below it. Two features never import each other, nor do two shared features. A sub-feature in `features/<x>/features/<y>/` imports neither its siblings nor its feature root, only the `shared/` folder of its feature.

Checked by dependency-cruiser, with [`@brutalway/dependency-cruiser-config`](../../packages/configs/dependency-cruiser-config).

```
error no-cross-feature: src/features/todo-stats/useTodoProgress.ts → src/features/todo-list/useTodoList.ts
```

What two features have in common moves down to `shared-features/` or `shared/`.

## Roles

On the front end, a component is an orchestrator (`XContainer`, `XLayout`, `XPage`), which reads stores and calls hooks, or a presenter, which only gets props. A presenter imports no store, and does no formatting, sorting or filtering. No orchestrator lives under `shared-features/`.

On the API, a route calls its service, a service calls its queries, and only queries files run SQL.

Checked by dependency-cruiser for the imports and by [`@brutalway/oxlint-config-react`](../../packages/configs/oxlint-config-react) for the components. The API rules are in the `server` config of `@brutalway/dependency-cruiser-config`.

## One way to write each thing

Function declarations, `type` over `interface`, `for...of` over `forEach`, imports through an alias, no comments, no `index.ts`, no `export *`.

Checked by Oxlint, with [`@brutalway/oxlint-config-typescript`](../../packages/configs/oxlint-config-typescript) and the config of each stack.

```
error eslint(no-restricted-imports): '../../shared-features/todos/useTodos.ts' import is restricted from being used by a pattern. help: Relative imports are not allowed: import through an alias (@/ in src/, @e2e/ in e2e/).
error no-comments(disallowComments): Comments are forbidden
```

Directives like `oxlint-` and `@ts-expect-error` are allowed. Anything else a comment would say goes in a name.

## Names and places

A file with a single export is named after it. An exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`, a hook in a `useX.ts`.

Files are placed by kind. One file of a kind stays at the root of its folder. Two or more move into the folder of their kind: `components/`, `hooks/`, `lib/`, `routes/` and so on. No folder is empty, and none holds a single child.

Checked by [`@brutalway/eslint-plugin-file-named-after-export`](../../packages/plugins/eslint-plugin-file-named-after-export) for the names and by [`@brutalway/check-tree`](../../packages/tools/check-tree) for the tree.

```
src/features/todo-stats/hooks holds a single child: move it up one level and delete the folder
src/shared holds 2 lib files (normalizeTitle.ts, percent.ts): move them into lib/
```

## Visible text

On vite, no text the user can read is written in JSX, nor in `aria-label`, `placeholder`, `title` or `alt`. It goes in `src/app/locales/en/` and through `t()`.

Checked by [`@brutalway/oxlint-config-i18next`](../../packages/configs/oxlint-config-i18next), then by `i18next-cli`, which fails on a missing or an unused key.

```
error i18next(no-literal-string): disallow literal string: <p className="todo-stats-chip">{progress}% done</p>
```

## Dependencies, docs and dead code

Every dependency in `package.json` is pinned to an exact version. Every path in backticks, link and anchor of the README and of `docs/` exists. No export, file or dependency goes unused.

Checked by alint, with [`@brutalway/alint-config`](../../packages/configs/alint-config), for the versions and the paths, and by knip for the dead code.

```
Unused files (1)
src/features/todo-stats/useTodoProgress.ts
```

The docs also have their own tools: [`check-doc-length`](../../packages/tools/check-doc-length), [`check-doc-sources`](../../packages/tools/check-doc-sources) and [`check-doc-links`](../../packages/tools/check-doc-links).

## With an AI agent

[`@brutalway/agent-hook`](../../packages/tools/agent-hook) runs Oxlint and stylelint on each file Claude Code edits, alint and check-tree on each file it creates, and sends the errors back to the agent before it moves on. The templates install it with the `claude-hook` option. In any other project where `@brutalway/agent-hook` is installed, the `brutal-checks` Claude Code plugin runs it without editing `.claude/settings.json`.
