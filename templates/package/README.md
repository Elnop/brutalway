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

## Documentation

- [Starting your own package](docs/guides/start-your-own-package.md): replace the example with your own code
- [Publishing](docs/guides/publish.md): changesets, the release workflow and npm trusted publishing
- [Working with an agent](docs/guides/work-with-an-agent.md): the Claude Code hook that sends the errors back to the agent
- [Commands](docs/reference/commands.md): the npm scripts
- [Layout](docs/reference/layout.md): the entry points, the layers and where each file goes
- [Verifications](docs/reference/verifications.md): every rule and the tool that enforces it
- [Architecture](docs/concepts/architecture.md): the patterns this template borrows from, with what it takes and what it leaves out

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.
