# Starting your own app

1. Delete `src/features/`, `src/shared-features/todos/`, the `todoList` and `todoStats` namespaces (their JSON in `src/app/locales/en/` and their lines in `src/app/createI18n.ts`), the files in `src/shared/` and `e2e/todos.spec.ts`. `e2e/app.spec.ts` and `e2e/openApp.ts` work on any app whose first screen has an `h1`.
2. Write your first feature in `src/features/<name>/` and render it from `src/app/App.tsx`.
3. Run `npm run check` often. The structure rules only make sense once there are a few files, so expect it to push you toward folders as the app grows.
