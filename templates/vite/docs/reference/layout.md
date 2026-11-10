# Layout

```
src/
  app/              composes the features
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain, used everywhere
```

Each layer only imports the layers below it. A feature can hold sub-features in `features/<x>/features/<y>/` and a `shared/` folder for what its sub-features have in common, and a sub-feature can do the same, down to ten levels. In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`. No slice name appears in two layers.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props. One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.
