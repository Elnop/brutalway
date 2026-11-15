# Layout

```
src/
  app/              the app layer: the routes, the i18n setup and the messages
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain, used everywhere
```

Each layer only imports the layers below it. No slice name appears in two layers.

`src/app/` is the top layer, and the folder Expo Router reads its routes from by default: `_layout.tsx` loads the fonts and wraps every screen in the i18n provider, `index.tsx` is the first screen. They are the orchestrators of the app and only lay out the features: they import nothing but features, so the frame of the page and the themed stack come from `src/features/page-shell/`. Expo Router turns every file of `src/app/` into a route, so it holds nothing else: the i18n setup is the `src/features/i18n/` feature, and the messages are data, in `locales/` at the root of the project, imported through the `@locales/*` alias.

A feature or a shared feature that grows holds sub-features in `features/<y>/`, the business code several of them share in `shared-features/<y>/` and the code with no domain in `shared/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there, and in `src/shared/`, which holds kind folders only (`lib/`, `types/`, `configs/`...).

In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

`src/shared-features/theme/` holds the theme (`ThemeConfig.ts`) and the `Button` every feature uses.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.
