# Layout

```
src/
  app/              composes the features
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain, used everywhere
```

Each layer only imports the layers below it. No slice name appears in two layers.

A feature or a shared feature that grows holds sub-features in `features/<y>/`, the business code several of them share in `shared-features/<y>/` and the code with no domain in `shared/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there, and in `src/shared/`, which holds kind folders only (`lib/`, `types/`, `configs/`...).

In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.
