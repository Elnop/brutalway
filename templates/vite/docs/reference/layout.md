# Layout

```
src/
  app/              composes the features
  features/         one folder per feature, never imported by another feature
  shared/           one folder per slice, the code several features use
```

Each layer only imports the layers below it. No slice name appears in two layers.

The messages are data, so they live outside `src/`, in `locales/` at the root of the project. `src/features/i18n/createI18n.ts` imports them through the `@locales/*` alias.

`src/shared/` holds one folder per slice, named after its concept, and no file at its root. Each file of a slice has two consumers at least, features or entry points, or is imported by a file of its slice that has them. The files of a slice, tests aside, import each other into one group: two groups that never import each other make two slices. A slice never imports another slice.

A feature or a slice that grows holds sub-features in `features/<y>/` and the slices they share in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

In the example, `src/shared/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.
