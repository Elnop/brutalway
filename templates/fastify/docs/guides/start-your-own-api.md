# Starting your own API

1. Delete `src/features/todo-list/`, `src/features/todo-stats/`, `src/shared/todos/` and their entries in `FEATURES`, in `src/app/AppConfig.ts`, with their imports.
2. Add a shared feature in `src/shared/` with its schemas, types and queries, then a feature with its routes and service, and add one entry to `FEATURES` in `src/app/AppConfig.ts`, which `src/app/buildApp.ts` registers in order.
3. Run `npm run check` often. It tells you where each file goes as the API grows.
