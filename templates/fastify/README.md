# template-fastify

A Fastify + TypeScript API starter where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them runs SQL from a route, reads `process.env` in the middle of a service or imports one feature from another, `npm run check` fails and says what to do.

The example is the todo list API that every template of the series builds. Delete it and keep the structure.

Part of [brutalway](https://github.com/Elnop/brutalway), which also publishes the `@brutalway/*` packages holding the rules and configs: this repository only holds what is specific to it.

## Getting started

Node 26 is required (`.nvmrc`, and `.npmrc` refuses other versions). Node runs the TypeScript directly: there is no build step.

```sh
nvm use
npm install
npm run dev
```

The API listens on `http://127.0.0.1:3000`, and the Swagger UI on `/docs`. `npm install` also points git to `.githooks/`, so every commit runs `npm run check` first.

| Variable | Default | |
|---|---|---|
| `HOST` | `127.0.0.1` | |
| `PORT` | `3000` | |
| `DATABASE_PATH` | `todos.db` | a SQLite file, or `:memory:` |
| `LOG_LEVEL` | `info` | `fatal` to `trace`, or `silent` |

`src/shared/lib/readEnv.ts` validates them with Zod at startup: an invalid value stops the server before it listens.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | starts the server and restarts it on each change |
| `npm start` | starts the server |
| `npm run check` | Prettier, `tsc`, Oxlint, dependency-cruiser, check-tree, jscpd, alint, knip |
| `npm test` | `node:test`: queries on an in-memory database, routes through `inject()` |
| `npm run format` | Prettier in write mode |

## Endpoints

| Method | Path | |
|---|---|---|
| `GET` | `/todos?filter=all\|active\|completed` | list |
| `POST` | `/todos` | create from `{ title }` |
| `PATCH` | `/todos/:id` | change `title`, `completed` or both |
| `DELETE` | `/todos/:id` | delete one |
| `DELETE` | `/todos/completed` | delete the completed ones |
| `GET` | `/stats` | total, completed, remaining |

Requests and responses are Zod schemas, which validate the input, serialize the output and produce the OpenAPI document served on `/docs/json`.

## Layout

```
src/
  server.ts         reads the env, builds the app, listens
  app/              wires everything: database, queries, services, routes, Swagger
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain: env, database connection, server factory
```

Each layer only imports the layers below it. `src/shared-features/todos/` holds the schemas, the types and `todosQueries.ts`, the only file that runs SQL on the todos table. `src/features/todo-list/` and `src/features/todo-stats/` both use it without knowing each other.

Inside a feature, a request goes `xRoutes.ts` → `xService.ts` → `xQueries.ts`: a route never runs a query. Services get their dependencies as parameters (`createTodoListService({ todos })`), and `src/app/buildApp.ts` is the one place that creates and passes them. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.

[docs/verifications.md](docs/verifications.md) lists every rule and the tool that enforces it.

[docs/architecture.md](docs/architecture.md) lists the architecture patterns this template borrows from, with what it takes and what it leaves out.

## Working with an agent

`.claude/settings.json` runs `@brutalway/agent-hook` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree when a file is created. Errors go back to the agent, which fixes them before moving on.

## Starting your own API

1. Delete `src/features/`, `src/shared-features/todos/` and the lines of `src/app/buildApp.ts` that wire them.
2. Add a shared feature with its schemas, types and queries, then a feature with its routes and service, and register it in `src/app/buildApp.ts`.
3. Run `npm run check` often. It tells you where each file goes as the API grows.
