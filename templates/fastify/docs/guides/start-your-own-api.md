# Starting your own API

1. Delete `src/features/todo-list/`, `src/features/todo-stats/`, `src/shared-features/todos/` and the lines of `src/app/buildApp.ts` that wire them.
2. Add a shared feature with its schemas, types and queries, then a feature with its routes and service, and register it in `src/app/buildApp.ts`.
3. Run `npm run check` often. It tells you where each file goes as the API grows.
