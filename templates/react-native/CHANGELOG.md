# template-react-native

## 0.3.0

### Minor Changes

- 311e7fc: `src/app/` imports features only, and a file of a `shared/` folder that a single feature uses moves into it. On fastify, the server and its Swagger UI live in `src/features/http-server/`, the connection in `src/features/database/`, a service builds its queries from the database it gets, the route tests mount their feature on `test-utils/createTestServer.ts`, `ErrorSchema` moves into `src/features/todo-list/TodoListSchemas.ts` and `readEnv.ts` to the root of `src/shared/`. On react-native, the frame of the page and the themed stack come from `src/features/page-shell/`. On package, `todosFile.ts` reads and writes the JSON itself, since it was the only user of `src/shared/jsonFile.ts`.

## 0.2.0

### Minor Changes

- 5853e3b: `npm run check` runs knip a second time with `--production`, on `src/` without its tests, so a file or an export of `src/` that only a test uses is reported. A helper shared by tests goes in `test-utils/`, at the root, imported through `@test-utils/` (`#test-utils/` on fastify and package), and `@brutalway/dependency-cruiser-config` 0.8.0 rejects an import of it from production code. On vite, next and react-native, dependency-cruiser reads `tsconfig.test.json` to resolve that alias. On next, `check-tree` runs with `--root-entries`, so `src/proxy.ts` and the other files Next.js reads at the root of `src/` stay there. template-next moves to `@brutalway/oxlint-config-next` 0.1.2, which accepts `src/instrumentation-client.ts`.

## 0.1.2

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.1.1

### Patch Changes

- d8ea465: `oxlint.config.ts` extends `@brutalway/oxlint-config-react-native`: a color, a size, a spacing, a font or a shadow in a `StyleSheet.create` comes from `THEME`, a `style` prop takes no object written inline, and the rules of `eslint-plugin-react-native` run. `accessibilityLabel` and `accessibilityHint` go through `t()`.

## 0.1.0

### Minor Changes

- a83ae11: First version of template-react-native: the todo list of the other templates on Expo, with Expo Router, for iOS, Android and the web build. It runs in a development build (`npm run android`, `npm run ios`, and `npm run phone` for a USB phone that the adb of the SDK does not see, as on WSL2), with Expo Go kept as an option. The routes sit in `src/app/screens/`, the neo-brutalist tokens are a TypeScript theme in `src/shared/theme/ThemeConfig.ts`, and the todos are kept on the device through zustand and AsyncStorage. `npm run check` runs as on the web templates, without stylelint, and the tests run on Jest with React Native Testing Library.
