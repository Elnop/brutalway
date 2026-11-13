# Starting your own app

1. Delete `src/features/todo-list/`, `src/features/todo-stats/`, `src/shared-features/todos/`, the `todoList` and `todoStats` namespaces (their JSON in `src/app/locales/en/` and their lines in `src/app/createI18n.ts`) and `src/shared/normalizeTitle.ts` with its test. Keep `src/shared-features/theme/ThemeConfig.ts` and `src/shared-features/theme/Button.tsx` if the look suits you.
2. Write your first feature in `src/features/<name>/` and render it from `src/app/screens/index.tsx`. A new screen is a new file of `src/app/screens/`, see [the Expo Router docs](https://docs.expo.dev/router/basics/core-concepts/).
3. Run `npm run check` often. The structure rules only make sense once there are a few files, so expect it to push you toward folders as the app grows.

Before the first build, check `name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package` in `app.json`: the stores know an app by its identifier, and it cannot change once the app is published.
