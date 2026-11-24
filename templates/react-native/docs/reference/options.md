# Options

`npm create brutal` creates a project from this template and asks one question per option below. Each answer adds or removes files, dependencies and scripts, and edits the docs to match, so whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app -- --stack react-native
```

`app.json` takes the name of the project, and the identifier of the app on the stores becomes `com.example.<name>`, without its dashes: change it before the first build.

## Create a project without questions

A yes/no option takes `--<option>` or `--no-<option>`, and `--yes` takes the default of every question left:

```sh
npm create brutal my-app -- --stack react-native --expo-go --dark-theme --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "react-native", "git": true, "install": true, "options": { "server-state": true, "i18n": "en-fr" } }
```

```sh
npm create brutal my-app -- --preset react-native.json --yes
```

## Every option

| Flag | Values | Default | Cannot be used with |
|---|---|---|---|
| `--[no-]example` | yes, no | yes | `--example` with `--no-zustand` |
| `--[no-]zustand` | yes, no | yes | `--no-zustand` with `--example` |
| `--[no-]dark-theme` | yes, no | no |  |
| `--[no-]server-state` | yes, no | no |  |
| `--[no-]forms` | yes, no | no |  |
| `--i18n` | `none`, `en`, `en-fr` | `en` |  |
| `--[no-]react-compiler` | yes, no | no |  |
| `--analytics` | `none`, `module`, `posthog` | `none` |  |
| `--[no-]unit-tests` | yes, no | yes | `--no-unit-tests` with `--component-tests` |
| `--[no-]component-tests` | yes, no | yes | `--component-tests` with `--no-unit-tests`, `--no-component-tests` with `--coverage` |
| `--[no-]coverage` | yes, no | no | `--coverage` with `--no-component-tests` |
| `--[no-]expo-go` | yes, no | no |  |
| `--[no-]claude-hook` | yes, no | yes |  |
| `--[no-]ci` | yes, no | yes |  |
| `--package-manager` | `npm`, `pnpm` | `npm` |  |

A combination from the last column stops the CLI before anything is written, with a message naming both flags.

`example`, `claude-hook` and `ci`, along with `git` and `install`, work the same on every stack and are described in the [create-brutal reference](https://github.com/Elnop/brutalway/tree/main/packages/tools/create-brutal#every-stack). Here, without the example, `src/app/index.tsx` only shows the project name, the theme moves next to the page frame in `src/features/page-layout/`, or stays in `src/shared/theme/` with the `Button` going into the language switch when `i18n` is `en-fr`, and `expo-crypto` is removed, along with `@react-native-async-storage/async-storage` unless `i18n` is `en-fr`.

Tailwind, CSS Modules, shadcn/ui and the security headers are not offered: React Native has no CSS, the styles come from the theme object, and an app sends no HTTP headers of its own. There are no e2e tests either, since they need a simulator.

## zustand

Without it, the `zustand` dependency is removed. The example needs the store, so `--no-zustand` comes with `--no-example`.

## dark-theme

`src/shared/theme/ThemeConfig.ts` holds a light and a dark set of colors and picks one through `Appearance` when the app starts. `app.json` follows the system, with `expo-system-ui` added.

## server-state

It adds `@tanstack/react-query`, a `QueryProvider` in a `query-client` feature, which creates the query client and wraps the routes in `src/app/_layout.tsx`, the cache profiles of `QueryConfig.ts` next to it, and `@brutalway/oxlint-config-tanstack-query`.

With the example, the todos are read and written through the routes of template-fastify, at `EXPO_PUBLIC_API_URL` or `http://localhost:3000`: there is no dev server to mock the API from, as Vite does. A client parses each response with Zod (added as a dependency), the API filters the list and gives the counters, and the zustand store only keeps the filter of the list, so it moves into `src/features/todo-list/` and `src/shared/todos/lib/todosSelectors.ts` goes. `expo-crypto` is removed, and `@react-native-async-storage/async-storage` too unless `i18n` is `en-fr`.

## forms

It adds `react-hook-form`, `@hookform/resolvers`, `zod` and `@brutalway/oxlint-config-react-hook-form`, which reports a `useForm` without `zodResolver` and any validation passed to `useController`. With the example, the title field goes through `useController`, since React Native has no `<form>` and no `register`, and a `TodoDraftSchema`.

## i18n

`en`, the default, goes through i18next in English only: the texts are in `locales/en/` and the components call `t()`, so adding a language later means adding its folder.

`none` leaves i18next out, for an app that will only ever speak one language: the components hold their English text, to replace with the language of the app, and there is no `locales/`, no `npm run messages` and no lint rule against text written in JSX.

`en-fr` adds French next to English: a `fr/` folder beside `locales/en/` and a `language-switch` feature under the title. The first language comes from the device through `expo-localization`, added as a dependency, and the choice is saved in AsyncStorage. `i18next-cli status` fails when French misses a key.

## react-compiler

`app.json` turns on `experiments.reactCompiler`, with `babel-plugin-react-compiler`, and `useMemo`, `useCallback` and `memo` imported from `react` are reported.

## analytics

Both values add `analyticsTracker.ts` to an `analytics` shared feature in `src/shared/`, the only place where events leave the app, and the root layout sends `app_opened` at startup through the `useAppOpened` hook of an `analytics` feature. The example also calls `analyticsTracker.track('todo_added')`. Without it, the hook is the only user of `analyticsTracker.ts`, which then moves next to it.

- `module`: the client emits an event on `DeviceEventEmitter`, for whatever tool you plug in
- `posthog`: it adds `posthog-react-native` and the Expo modules it needs (`expo-application`, `expo-device`, `expo-file-system`, `expo-localization`), and the client sends the events when `EXPO_PUBLIC_POSTHOG_KEY` is set

## unit-tests

Without it, `test/`, `jest.setup.ts`, Jest and its config in `package.json`, and the `test` and `test:watch` scripts are removed, along with the test step of the CI workflow. `--component-tests` and `--coverage` need it. check-tree still checks `test/unit/`, so a test added later goes at the path of its source.

## component-tests

Without it, the `.test.tsx` files, `test/unit/shared/theme/Button.test.tsx` included, and `@testing-library/react-native` are removed. Jest keeps the unit tests.

## coverage

`npm test` runs `jest --coverage` and fails under 90 % coverage of the presenters, pure functions, selectors and stores. The thresholds sit under `jest` in `package.json`, and `coverage/` is ignored by git and Prettier.

## expo-go

The app runs in Expo Go instead of a development build: `expo-dev-client`, `eas.json`, `scripts/phone.ts` and the `start:go` and `phone` scripts are removed, `android` and `ios` become `expo start --android` and `expo start --ios`, and `npm start` prints the QR code to scan. Expo Go cannot load a native library outside the Expo SDK, so a project that needs one moves to a development build.

## package-manager

`pnpm` writes the project for pnpm: a `packageManager` field in `package.json`, a `pnpm-workspace.yaml` that holds the build scripts allowed to run, the overrides and `saveExact`, and `nodeLinker: hoisted`, which Expo and Metro need,, and every command of the hook, the CI workflow, the scripts and the docs written with `pnpm`. `pnpm-lock.yaml` replaces `package-lock.json`, and `.npmrc` goes. create-brutal runs `pnpm install` when it installs, so pnpm has to be installed first: `npm install --global pnpm`.
