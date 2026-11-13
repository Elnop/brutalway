# Verifications

Everything below runs locally, in the pre-commit hook and in CI. None of it needs a simulator or a phone.

## TypeScript

`tsc` runs twice: on the production code (`tsconfig.app.json`) and on tests and configs (`tsconfig.test.json`). Both extend `@brutalway/tsconfig/base.json`, which turns on `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`, and add what React Native needs: the `react-native` export condition and the `@/` alias. The root `tsconfig.json` repeats the alias, because Metro, the bundler of Expo, reads it from there, and extends `expo/tsconfig.base`, which Expo CLI would otherwise add itself on each start.

Before tsc, `npm run typecheck` runs `i18next-cli types`, which writes the types of the messages of `src/app/locales/en/` into `node_modules/.cache/i18next/`: an unknown key, or a `{{name}}` the call to `t()` leaves out, is a tsc error.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-react-native`, which brings the React config and its TypeScript base, the zustand config, the `jest` plugin of oxlint with the same test rules as `@brutalway/oxlint-config-vitest` and the style rules below, then the i18next config. Each package README details its rules. The main ones:

- no comments anywhere, tests included (directives like `oxlint-` and `@ts-expect-error` are allowed)
- no relative imports: `@/` in `src/`, `@test-utils/` in `test-utils/`. Root config files and `scripts/` are the only exceptions. `scripts/` runs in Node on your machine, so it may also print to the console and call `fetch`
- no `index.ts` outside `src/app/screens/`, where Expo Router needs `index.tsx` for the first screen, no `export *`, no `types.ts` without a domain, file names in camelCase or PascalCase
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`. Functions, classes and objects holding functions (like `todosActions`) can live anywhere
- a file with a single export is named after it
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `.d.ts`, and the route files of `src/app/screens/`): each module is imported under the name it exports
- `xStore.ts` exports only `xStore` and `xActions`
- a component types its props with a named `XProps` type, and callback props are named `onX`
- no orchestrator (`XContainer`, `XLayout`, `XPage`) under `shared-features/`: the components that read shared state belong to a feature
- a hook lives in a `useX.ts` that only exports hooks, a `xSelectors.ts` only exports `selectX` functions
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`, `curly` only for multi-line blocks
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- no visible text in JSX, in `aria-label`, `accessibilityLabel`, `accessibilityHint`, `placeholder`, `title` or `alt`, nor in a template literal: it goes in `src/app/locales/en/` and through `t()`. The message only says "disallow literal string"
- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, `toBe` for primitives

## Styles

There is no CSS, so stylelint has nothing to check. The colors, sizes and fonts come from `THEME` in `src/shared-features/theme/ThemeConfig.ts`, and the styles of a component sit in a `StyleSheet.create` in its own file. `@brutalway/oxlint-config-react-native` turns this into lint rules:

- no color, size, spacing, font or shadow literal in a `StyleSheet.create`: the value is a token of `THEME`, and a missing token is added there. `0`, percentages, `transparent` and `none` stay literal
- no style object written in JSX: the style goes in the `StyleSheet.create` of the file, and a style that depends on a prop picks one of several styles of the sheet
- no style of the sheet left unused, no array holding a single style, no raw text outside a `<Text>`, and a component made for iOS or Android only kept in a `X.ios.tsx` or `X.android.tsx` file (from `eslint-plugin-react-native`)

`no-unused-styles` only sees a style read as `styles.x`: `styles[tone]` does not count, so `src/shared-features/theme/Button.tsx` picks its style through an explicit map.

## Dependencies

dependency-cruiser checks the direction of imports. The rules come from `@brutalway/dependency-cruiser-config`, and `.dependency-cruiser.cjs` only adds the parser options:

- `src/shared/` imports neither `src/shared-features/` nor features, `src/shared-features/` imports no feature, no feature imports `src/app/`
- a feature never imports another feature, a shared feature never imports another shared feature
- inside a feature or a shared feature, at every nesting level, a sub-feature (`features/<y>/`) imports neither its siblings nor the root of its parent, a sub shared feature (`shared-features/<y>/`) imports neither its siblings nor a sub-feature, and the parent `shared/` imports none of them. They nest at most ten levels deep
- a presenter imports no store and no shared-feature hook
- a store lives at the root or in the `stores/` folder of its level
- no cycles, no import of a test file, of `test-utils/` or of a devDependency from production code

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and category folders (`components`, `hooks`, `lib`...) holding a single file. It also rejects a folder the layout does not name: `src/` holds `app/`, `features/`, `shared-features/` and `shared/`, `src/shared/` holds kind folders only, and a feature or a shared feature holds kind folders, `features/`, `shared-features/` and `shared/`. One file of a kind stays at the root of its folder, two or more go in the category folder. Inside `components/`, the same goes for `orchestrators/` and `presenters/`. Tests do not count: a test sits next to its source.

## Messages

`npm run messages` runs `i18next-cli status`, which fails when a key the code uses is missing from a language, and `i18next-cli status --unused`, which fails on a key no code uses. `i18next.config.ts` lists the languages and where their files are.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`, tests left out: the threshold is 0. Move the shared part into a function the two places call.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested. Fix the link, or point it to the page that replaced it.

## Repository

alint checks that:

- every path in backticks, link and anchor in the README and in `docs/` still exists
- `styles/`, `types/` and `configs/` only hold what their name says
- every dependency in `package.json` is pinned to an exact version

The rules come from `@brutalway/alint-config`, except the path check, which `.alint.yml` declares itself because its prefixes depend on this repository's folders. Paths are resolved from the repository root, so the docs always write full paths like `src/app/screens/index.tsx`.

knip (`knip.json`) rejects exports nobody imports, unused files, unused dependencies and packages used without being declared. `@swc/core` is ignored because dependency-cruiser loads it by name. `app.json` turns off `updates`, since the template does not set up EAS Update: knip would otherwise ask for `expo-updates`. `npm run check` runs it a second time with `--production`, on the code of `src/` alone: a file or an export of `src/` that only a test uses is reported, since the app never reaches it. Delete it, test it through the code that uses it, or move a test helper to `test-utils/`.

## Tests

| Kind | What it tests | Where |
|---|---|---|
| Unit | a pure function, a selector, the store | `src/shared/normalizeTitle.test.ts` next to its source |
| Component | a presenter alone, through its props | `src/features/todo-list/components/presenters/TodoInput.test.tsx` |

`npm test` runs both with Jest and the `jest-expo` preset, which mocks the native side of React Native: Vitest does not run React Native yet. The component tests use [React Native Testing Library](https://oss.callstack.com/react-native-testing-library/), whose `render` and `userEvent` are async. Only presenters get component tests, since orchestrators read stores. Find elements by role and accessible name. The tests import `describe`, `it`, `expect` and `jest` from `@jest/globals` instead of reading globals.

`jest.setup.ts` gives the tests the same i18next instance as the app, so a presenter renders its English text, and swaps AsyncStorage for its in-memory mock.

There are no e2e tests yet: they need a simulator, which CI does not run.

A helper that tests share (a fixture, a builder, a fake) goes in `test-utils/` at the root of the project, never in `src/`, and the tests import it through `@test-utils/`. dependency-cruiser rejects an import of `test-utils/` from production code.

Before keeping a test, break the code it protects and watch it fail.
