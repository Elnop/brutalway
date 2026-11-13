# Options

`npm create brutal` creates a project from this template and asks one question per option below. Each answer adds or removes files, dependencies and scripts, and edits the docs to match, so whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-api -- --stack fastify
```

## Create a project without questions

A yes/no option takes `--<option>` or `--no-<option>`, and `--yes` takes the default of every question left:

```sh
npm create brutal my-api -- --stack fastify --no-database --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "fastify", "git": true, "install": true, "options": { "swagger": false } }
```

```sh
npm create brutal my-api -- --preset fastify.json --yes
```

## Every option

| Flag | Values | Default | Cannot be used with |
|---|---|---|---|
| `--[no-]example` | yes, no | yes |  |
| `--[no-]swagger` | yes, no | yes |  |
| `--[no-]database` | yes, no | yes |  |
| `--[no-]claude-hook` | yes, no | yes |  |
| `--[no-]ci` | yes, no | yes |  |

Every combination works.

`example`, `claude-hook` and `ci`, along with `git` and `install`, work the same on every stack and are described in the [create-brutal reference](https://github.com/Elnop/brutalway/tree/main/packages/tools/create-brutal#every-stack). Here, without the example, `src/app/buildApp.ts` only creates the server, and the two features of the example, `test-utils/` and `docs/reference/endpoints.md` are removed. The Swagger UI, if kept, is titled with the project name.

## swagger

Without it, there is no Swagger UI on `/docs`: `src/features/http-server/swaggerTheme.css` and `@fastify/swagger-ui` are removed. `@fastify/swagger` and `openapi-types` stay installed, because `fastify-type-provider-zod` needs them.

## database

Without it, `src/features/database/` and the `DATABASE_PATH` variable are removed, and nothing uses `node:sqlite`. The example keeps its todos in a `Map` at the top of `src/shared-features/todos/todosQueries.ts`, which has the same functions: both services call `createTodosQueries()` and see the same todos, and the routes do not change.
