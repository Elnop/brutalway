# Layout

```
src/
  todo.ts           bin: the todo command
  todos.ts          the "." export
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain
```

Each entry point is a file at the root of `src/`, listed in `bin` or `exports` of `package.json` and in `tsdown.config.ts`. Nothing but a test imports it: an entry point composes the features the way the `app` layer does in an app, and there is no `app` folder.

Each layer only imports the layers below it. `src/shared-features/todos/` holds the `Todo` type and `todosFile.ts`, the only file that reads and writes the todos. `src/features/add-todo/`, `src/features/list-todos/` and `src/features/complete-todo/` all use it without knowing each other, and `src/shared/jsonFile.ts` reads and writes any JSON file. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.
