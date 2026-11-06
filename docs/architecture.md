# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [the BRUTAL docs](https://github.com/Elnop/brutal/tree/main/docs). This page covers what is specific to an HTTP API.

## Controller, service, repository

The classic layered backend, described by Martin Fowler as [Service Layer](https://martinfowler.com/eaaCatalog/serviceLayer.html) and [Repository](https://martinfowler.com/eaaCatalog/repository.html): the controller handles HTTP, the service holds the business logic, the repository talks to the database.

We take the three roles under the names `xRoutes.ts`, `xService.ts` and `xQueries.ts`. A request goes `src/features/todo-list/todoListRoutes.ts` → `src/features/todo-list/todoListService.ts` → `src/shared-features/todos/todosQueries.ts`, and only queries run SQL.

We leave out classes, base repositories and generic CRUD. Queries are plain functions written in SQL, and the service receives them as an object typed by `TodosQueries`, which is all the abstraction the in-memory version needs.

Enforced by `@elnop/dependency-cruiser-config/server` (a route never imports queries, the database driver is only imported by queries and `src/shared/`) and check-tree (the `routes/`, `services/` and `queries/` kinds).

## Dependencies as parameters

Dependency injection, without the container. A service is built by a factory that takes its dependencies as arguments (`createTodoListService({ todos })`), and `src/app/buildApp.ts` is the one place that creates and passes them.

We leave out Fastify's `decorate`, which hangs dependencies on the app instance and hides where they come from, and DI containers, which resolve them by name at runtime. A test builds the service with whatever it needs and nothing else.

Enforced by `@elnop/oxlint-config-fastify` (no `app.decorate`).

## Parse, don't validate

From [Alexis King](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) (2019): turn untrusted input into a typed value once, at the edge, instead of checking it again wherever it is used.

We take it for every input. Requests and responses are Zod schemas in `XSchemas.ts` files, which validate the body, serialize the response and produce the OpenAPI document. Past the route, the service only sees typed values.

We leave out the stricter version where every domain value gets its own branded type. A `title` is a `string` once the schema has checked it.

Enforced by `@elnop/oxlint-config-fastify` (schemas in an `XSchemas.ts` that exports nothing else).

## Config from the environment

From [The Twelve-Factor App](https://12factor.net/config): configuration that changes between deploys comes from environment variables.

We take it, and add one rule: `process.env` is read in a single file, `src/shared/lib/readEnv.ts`, which validates every variable with Zod at startup. An invalid value stops the server before it listens.

We leave out the rest of the twelve factors, which are about deployment and out of scope for a template.

Enforced by `@elnop/oxlint-config-fastify` (`process.env` only in a file whose name ends with `Env.ts`).
