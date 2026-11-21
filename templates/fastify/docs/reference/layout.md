# Layout

```
src/
  server.ts         reads the env, builds the app, listens
  app/              composes the features: server, database, routes
  features/         one folder per feature, never imported by another feature
  shared/           one folder per shared feature, the code several features use
```

Each layer only imports the layers below it, and `src/app/` imports features only: the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`. `src/shared/todos/` holds the schemas, the types and `todosQueries.ts`, the only file that runs SQL on the todos table. `src/features/todo-list/` and `src/features/todo-stats/` both use it without knowing each other.

`src/shared/` holds one folder per shared feature, named after its concept, and no file at its root. Each file of a shared feature has two consumers at least, features or entry points, or is imported by a file of its shared feature that has them. The files of a shared feature, tests aside, import each other into one group: two groups that never import each other make two shared features. A shared feature never imports another shared feature.

A feature or a shared feature that grows holds sub-features in `features/<y>/` and the shared features they have in common in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

Inside a feature, a request goes `xRoutes.ts` → `xService.ts` → `xQueries.ts`: a route never runs a query. Services get their dependencies as parameters (`createTodoListService(database)`) and build their queries from them, and `src/app/buildApp.ts` is the one place that opens the database and passes it. `src/app/buildApp.ts` registers the features listed in `FEATURES`, in `src/app/AppConfig.ts`, one entry each and in that order. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.

## Words

A feature is a folder of `src/features/`, named after what it does. A sub-feature is a feature inside a feature or a shared feature, in its `features/` folder. A shared feature is a folder of a `shared/`, named after its concept: `src/shared/<x>/` holds code several features use, and the `shared/` of a feature holds code several of its sub-features use. A kind folder (`lib/`, `types/`, `configs/`...) gathers the files of one kind once there are two of them. A consumer of a shared feature is a feature, a sub-feature or another shared feature that imports it, tests aside. An entry point is a file a tool loads rather than another file of `src/`: `src/server.ts`. The [brutalway glossary](https://github.com/Elnop/brutalway/blob/main/docs/reference/glossary.md) defines every term the checks print.
