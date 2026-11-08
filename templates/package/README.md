# template-package

A starter for a standalone npm package written in TypeScript, where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them imports one feature from another, imports an entry point from the code or leaves a file in the wrong folder, `npm run check` fails and says what to do.

The example is the todo list that every template of the series builds, kept in a JSON file. The package exports `addTodo`, `listTodos` and `completeTodo`, and installs a `todo` command that calls them. Delete it and keep the structure.

Part of [brutalway](https://github.com/Elnop/brutalway), which also publishes the `@brutalway/*` packages holding the rules and configs: this repository only holds what is specific to it.

## Getting started

Node 26 is required (`.nvmrc`, and `.npmrc` refuses other versions). Node runs the TypeScript directly for the tests, and tsdown builds `dist/` for npm.

```sh
nvm use
npm install
node src/todo.ts add Buy milk
node src/todo.ts list
```

`npm install` also points git to `.githooks/`, so every commit runs `npm run check` first.

## The example

```ts
import { addTodo, completeTodo, listTodos } from 'template-package';

const todo = addTodo('todos.json', 'Buy milk');
completeTodo('todos.json', todo.id);
listTodos('todos.json');
```

Each function takes the path of the JSON file first. A blank text, an unknown id or a file that does not hold a list of todos throws an error that says why. The package has no runtime dependency: `node:fs` reads and writes the file.

The `todo` command calls the same functions:

```sh
todo add Buy milk           # Added 1 [ ] Buy milk
todo done 1                 # Completed 1 [x] Buy milk
todo list                   # 1 [x] Buy milk
todo list --file work.json  # No todos.
```

It keeps the todos in `todos.json` in the current folder, or in the file given by `--file`, and parses its arguments with `node:util`. On an error, it prints the reason and exits with 1.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | tsdown: `dist/` with one JavaScript file and its types per entry point |
| `npm run check` | Prettier, `tsc`, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, alint, knip |
| `npm test` | `node:test`: each feature, then each entry point end to end |
| `npm run format` | Prettier in write mode |
| `npm run release` | `changeset publish`, run by the release workflow |

`npm pack` and `npm publish` build first, through the `prepack` script.

## Layout

```
src/
  todo.ts           bin: the todo command
  todos.ts          the "." export
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain
```

Each entry point is a file at the root of `src/`, listed in `bin` or `exports` of `package.json` and in `tsdown.config.ts`. Nothing but a test imports it: an entry point composes the features the way the `app` layer does in an app, and there is no `app` folder.

Each layer only imports the layers below it. `src/shared-features/todos/` holds the `Todo` type and `todosFile.ts`, the only file that reads and writes the todos. `src/features/add-todo/`, `src/features/list-todos/` and `src/features/complete-todo/` all use it without knowing each other, and `src/shared/jsonFile.ts` reads and writes any JSON file. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.

[docs/verifications.md](docs/verifications.md) lists every rule and the tool that enforces it.

[docs/architecture.md](docs/architecture.md) lists the architecture patterns this template borrows from, with what it takes and what it leaves out.

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.

## Working with an agent

`.claude/settings.json` runs `@brutalway/agent-hook` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree (with `--root-entries`) when a file is created. Errors go back to the agent, which fixes them before moving on.

## Starting your own package

1. Delete `src/features/`, `src/shared-features/todos/` and `src/shared/`, then empty the entry points at the root of `src/` and their tests.
2. Rename the entry points after your package, in `src/`, `package.json` and `tsdown.config.ts`, and write the end-to-end test of each one.
3. Add a feature per thing the package does, and a shared feature when two of them need the same code.
4. Run `npm run check` often. It tells you where each file goes as the package grows.

## Publishing

Versions are recorded with [changesets](https://github.com/changesets/changesets). With each change worth a release, run `npx changeset`, pick the bump and describe the change: it writes a file in `.changeset/` that goes in the same commit.

`.github/workflows/release.yml` runs on every push to `main`, after `npm run check` and `npm test`. While `.changeset/` holds changes, it opens a "Version Packages" pull request that bumps the version and writes `CHANGELOG.md`. Once that pull request is merged, it runs `npm run release`, which publishes the new version to npm and pushes its `v<version>` tag and GitHub release.

The workflow uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers): GitHub Actions proves its identity to npm, so no `NPM_TOKEN` secret is stored, and each version gets its provenance statement. npmjs.com only lets you add a trusted publisher to a package that exists, so publish the first version by hand with `npm publish`, then in the package settings on npmjs.com add a trusted publisher for this repository and the `release.yml` workflow. In the repository settings on GitHub, under Actions, allow GitHub Actions to create pull requests.
