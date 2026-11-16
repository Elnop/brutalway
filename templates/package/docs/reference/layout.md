# Layout

```
src/
  todo.ts           bin: the todo command
  todos.ts          the "." export
  features/         one folder per feature, never imported by another feature
  shared/           one folder per slice, the code several features use
```

Each entry point is a file at the root of `src/`, listed in `bin` or `exports` of `package.json` and in `tsdown.config.ts`. Nothing but a test imports it: an entry point composes the features the way the `app` layer does in an app, and there is no `app` folder.

Each layer only imports the layers below it. `src/shared/todos/` holds the `Todo` type and `todosFile.ts`, the only file that reads and writes the todos. `src/features/add-todo/`, `src/features/list-todos/` and `src/features/complete-todo/` all use it without knowing each other. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.

`src/shared/` holds one folder per slice, named after its concept, and no file at its root. Each file of a slice has two consumers at least, features or entry points, or is imported by a file of its slice that has them. The files of a slice, tests aside, import each other into one group: two groups that never import each other make two slices. A slice never imports another slice.

A feature or a slice that grows holds sub-features in `features/<y>/` and the slices they share in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.
