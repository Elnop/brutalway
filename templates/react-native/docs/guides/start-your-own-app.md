# Starting your own app

1. Delete `src/features/`, `src/shared-features/todos/`, the `todoList` and `todoStats` namespaces (their JSON in `src/app/locales/en/` and their lines in `src/app/createI18n.ts`) and `src/shared/normalizeTitle.ts` with its test. Keep `src/shared/ThemeConfig.ts` and `src/shared/Button.tsx` if the look suits you.
2. Write your first feature in `src/features/<name>/` and render it from `src/app/screens/index.tsx`. A new screen is a new file of `src/app/screens/`, see [the Expo Router docs](https://docs.expo.dev/router/basics/core-concepts/).
3. Change `name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package` in `app.json`, before the first build: the stores know an app by its identifier.
4. Run `npm run check` often. The structure rules only make sense once there are a few files, so expect it to push you toward folders as the app grows.
