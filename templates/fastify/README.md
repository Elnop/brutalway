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

## Documentation

- [Starting your own API](docs/guides/start-your-own-api.md): replace the todo list API with your own routes
- [Working with an agent](docs/guides/work-with-an-agent.md): the Claude Code hook that sends the errors back to the agent
- [Commands](docs/reference/commands.md): the npm scripts
- [Endpoints](docs/reference/endpoints.md): the routes of the example and the OpenAPI document
- [Layout](docs/reference/layout.md): the layers, the path of a request and where each file goes
- [Verifications](docs/reference/verifications.md): every rule and the tool that enforces it
- [Architecture](docs/concepts/architecture.md): the patterns this template borrows from, with what it takes and what it leaves out

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.
