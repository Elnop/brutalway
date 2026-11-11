# Layout

```
src/
  app/              the app layer: the routes, the i18n setup and the messages
  features/         one folder per feature, never imported by another feature
  shared-features/  business code shared by several features
  shared/           code with no domain, used everywhere
```

Each layer only imports the layers below it. No slice name appears in two layers.

`src/app/` is the top layer. Its routes sit in `src/app/screens/`, the folder `app.json` gives Expo Router: `_layout.tsx` loads the fonts and wraps every screen in the i18n provider, `index.tsx` is the first screen. They are the orchestrators of the app and only lay out the features. Expo Router turns every file of that folder into a route, so `src/app/I18nProvider.tsx`, `src/app/createI18n.ts` and the messages sit one level up, next to it.

A feature can hold sub-features in `features/<x>/features/<y>/`, and a `shared/` folder for what its sub-features have in common. A sub-feature can do the same, down to ten levels.

In the example, `src/shared-features/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

`src/shared/` holds the theme (`src/shared/theme/ThemeConfig.ts`) and the `Button` every feature uses.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.
