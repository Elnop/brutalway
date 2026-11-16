# Layout

```
src/
  server.ts         reads the env, builds the app, listens
  app/              composes the features: server, database, routes
  features/         one folder per feature, never imported by another feature
  shared/           one folder per slice, the code several features use
```

Each layer only imports the layers below it, and `src/app/` imports features only: the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`. `src/shared/todos/` holds the schemas, the types and `todosQueries.ts`, the only file that runs SQL on the todos table. `src/features/todo-list/` and `src/features/todo-stats/` both use it without knowing each other.

`src/shared/` holds one folder per slice, named after its concept, and no file at its root. Each file of a slice has two consumers at least, features or entry points, or is imported by a file of its slice that has them. The files of a slice, tests aside, import each other into one group: two groups that never import each other make two slices. A slice never imports another slice.

A feature or a slice that grows holds sub-features in `features/<y>/` and the slices they share in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

Inside a feature, a request goes `xRoutes.ts` → `xService.ts` → `xQueries.ts`: a route never runs a query. Services get their dependencies as parameters (`createTodoListService(database)`) and build their queries from them, and `src/app/buildApp.ts` is the one place that opens the database and passes it. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.
