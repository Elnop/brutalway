# Layout

```
src/
  app/              the app layer: the routes, the i18n setup and the messages
  features/         one folder per feature, never imported by another feature
  shared/           one folder per slice, the code several features use
```

Each layer only imports the layers below it. No slice name appears in two layers.

`src/app/` is the top layer, and the folder Expo Router reads its routes from by default: `_layout.tsx` loads the fonts and wraps every screen in the i18n provider, `index.tsx` is the first screen. They are the orchestrators of the app and only lay out the features: they import nothing but features, so the frame of the page and the themed stack come from `src/features/page-shell/`. Expo Router turns every file of `src/app/` into a route, so it holds nothing else: the i18n setup is the `src/features/i18n/` feature, and the messages are data, in `locales/` at the root of the project, imported through the `@locales/*` alias.

`src/shared/` holds one folder per slice, named after its concept, and no file at its root. Each file of a slice has two consumers at least, features or entry points, or is imported by a file of its slice that has them. The files of a slice, tests aside, import each other into one group: two groups that never import each other make two slices. A slice never imports another slice.

A feature or a slice that grows holds sub-features in `features/<y>/` and the slices they share in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

In the example, `src/shared/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

`src/shared/theme/` holds the theme (`ThemeConfig.ts`) and the `Button` every feature uses.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.

Code that differs on the web goes in a platform variant next to its base: Metro picks `useScreenTitle.web.ts` in place of `useScreenTitle.ts` on the web, and nothing imports the variant. Write a variant when the two versions import different modules, so that the native build never bundles a web-only package, and keep `Platform.select` for a value that changes. A variant (`.web`, `.ios`, `.android`, `.native`) has the kind of its base and counts as one file with it, whether the base exists or not.
