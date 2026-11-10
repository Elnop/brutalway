# Layout

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
