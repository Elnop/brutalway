# Verifications

Everything below runs locally, in the pre-commit hook and in CI. `npm run check` runs it with `brutal-check` (`@brutalway/check`), which starts every check at the same time, prints each one as it ends with the output of a failed one, then names the checks that failed and those it skipped because their script is missing. Each check is a script of `package.json`, in this order: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets`, `exceptions`, so `npm run tree` runs one alone, and `npx brutal-check --serial` runs them one after the other on a machine short on memory. Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.

## TypeScript

`tsc` runs twice: on the production code (`tsconfig.app.json`) and on tests, e2e and configs (`tsconfig.test.json`). Both extend `@brutalway/tsconfig/react-vite.json`, which turns on `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`. That last one is why `playwright.config.ts` reads `process.env['CI']`.

Before tsc, `npm run typecheck` runs `i18next-cli types`, which writes the types of the messages of `locales/en/` into `node_modules/.cache/i18next/`: an unknown key, or a `{{name}}` the call to `t()` leaves out, is a tsc error.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-react-vite`, which brings the TypeScript base, the React, zustand and Vitest configs, and `@brutalway/oxlint-config-i18next`. Each package README details its rules. The main ones:

- no `eval`, `new Function` or code in a string passed to `setTimeout`
- no comments anywhere, tests included (directives like `oxlint-` and `@ts-expect-error` are allowed). A `@ts-expect-error` says why, and `@ts-ignore` and `@ts-nocheck` are refused
- no relative imports: `@/` in `src/`, `@test-support/` in `test/support/`, `@test-e2e/` in `test/e2e/`. Root config files are the only exception
- no `index.ts`, no `export *`, no `types.ts` without a domain, file names in camelCase or PascalCase
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`. Functions, classes and objects holding functions (like `todosActions`) can live anywhere
- a file with a single export is named after it
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `xPlugin.ts`, `.d.ts`): each module is imported under the name it exports
- `xStore.ts` exports only `xStore` and `xActions`
- a component types its props with a named `XProps` type, callback props are named `onX`, and props that return JSX are named `children` or `renderX`
- no orchestrator (`XContainer`, `XLayout`, `XPage`) in a `shared/`, at any depth: the components that read shared state belong to a feature
- a hook lives in a `useX.ts` that only exports hooks, a `xSelectors.ts` only exports `selectX` functions, and a store is read with a selector (`useStore(xStore, selectX)`), so a component re-renders only when what it selects changes
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`, `curly` only for multi-line blocks
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- no visible text in JSX, in `aria-label`, `placeholder`, `title` or `alt`, nor in a template literal: it goes in `locales/en/` and through `t()`. The message only says "disallow literal string"
- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)

## Styles

stylelint checks the stylesheets with `@brutalway/stylelint-config`, declared under `stylelint` in `package.json`. Outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there: no `#fff`, no `rgb()`, no `white`. The message names the three closest tokens.

## Dependencies

dependency-cruiser checks the direction of imports. The rules come from `@brutalway/dependency-cruiser-config`, and `.dependency-cruiser.cjs` only adds the parser options:

- `src/shared/` imports no feature, a shared feature never imports another shared feature, no feature imports `src/app/`
- `src/app/` imports features only, never `src/shared/`
- a feature never imports another feature
- inside a feature or a shared feature, at every nesting level, a sub-feature (`features/<y>/`) imports neither its siblings nor the root of its parent, and a shared feature of its `shared/` (`shared/<y>/`) imports neither another shared feature, nor a sub-feature, nor the root of its parent. They nest at most ten levels deep
- a presenter reaches no store, no `xClient.ts`, no zustand and no react-query through any chain of imports, so a hook that reads a store is refused there and a hook of local state is fine
- a presenter imports no orchestrator
- an orchestrator imports no `xClient.ts`: it reads server data through a query hook
- `src/app/` imports the orchestrators (`XContainer`, `XLayout`, `XPage`) and the providers of a feature, never one of its presenters
- a store lives at the root or in the `stores/` folder of its level
- no cycles, no import of `test/` or of a devDependency from production code
- a unit test imports from `src/` its own source and `xConfig.ts` or `xTypes.ts` files, nothing else, and follows the layer rules of its source: the test of a feature cannot import another feature

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and kind folders (`components`, `hooks`, `lib`...) holding a single file. It also rejects a folder the layout does not name: `src/` holds `app/`, `features/` and `shared/`, `src/shared/` holds one folder per shared feature, and a feature or a shared feature holds kind folders, `features/` and `shared/`. One file of a kind stays at the root of its folder, two or more go in the kind folder. Inside `components/`, the same goes for `orchestrators/` and `presenters/`. It also keeps `test/unit/` a mirror of `src/`: a test sits at the path of its source, and `npx check-tree src --fix` moves the tests whose source moved. A file of a shared feature that a single feature uses is rejected too, and moves into that feature. So is a shared feature whose files form two groups that never import each other: it splits into two shared features. It also rejects two CSS files outside a `styles/` folder.

## Messages

`npm run messages` runs `i18next-cli status`, which fails when a key the code uses is missing from a language, and `i18next-cli status --unused`, which fails on a key no code uses. `i18next.config.ts` lists the languages and where their files are.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`: the threshold is 0. Move the shared part into a function the two places call.

## Headers

`securityHeaders.ts` holds the HTTP headers of the app: a Content Security Policy that only lets the page load its own scripts, styles, fonts and requests, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.

`vite preview` sends them, so the e2e tests run under them, and `npm run build` writes them into `dist/_headers`, the format of Netlify and Cloudflare Pages. On another host, set the same headers in its config. The dev server sends none, since its hot reload needs inline code.

`test` from `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, so a script or a request from another origin shows up there first: allow it in `securityHeaders.ts`, on the narrowest directive.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested. Fix the link, or point it to the page that replaced it.

## Secrets

`check-secrets` (`@brutalway/check-secrets`) runs [gitleaks](https://github.com/gitleaks/gitleaks) on the files git would commit, so a file `.gitignore` leaves out, like `.env`, is not read. The first run downloads gitleaks 8.30.1 from its GitHub release, checks it against a pinned checksum and keeps it in `node_modules/.cache/check-secrets/`. A key, a token or a password in the code fails the check: remove it and revoke it. If it is public by design, add the fingerprint the message prints to `.gitleaksignore`.

## Exceptions

`check-exceptions` (`@brutalway/check-exceptions`) counts the ways around a check: `oxlint-disable` and `@ts-expect-error` comments, `jscpd:ignore-start` blocks, the entries of `oxlint-suppressions.json`, `.check-tree-known-violations.json`, `.alint-baseline.json` and `.gitleaksignore`, the ignore lists of `knip.json` and `.jscpd.json`. It counts them per rule and fails when a count is higher than at the fork point with the main branch, so these lists only shrink and moving code around is not growth. With no main branch to compare with, it checks nothing. CI clones the whole history (`fetch-depth: 0`) so that it finds the fork point.

## Repository

alint checks that:

- every path in backticks, link and anchor in the README and in `docs/` still exists
- `styles/`, `types/` and `configs/` only hold what their name says
- every dependency in `package.json` is pinned to an exact version

The rules come from `@brutalway/alint-config`, except the path check, which `.alint.yml` declares itself because its prefixes depend on this repository's folders. Paths are resolved from the repository root, so the docs always write full paths like `src/app/App.tsx`.

knip (`knip.json`) rejects exports nobody imports, unused files, unused dependencies and packages used without being declared. `@swc/core` is ignored because dependency-cruiser loads it by name. `npm run check` runs it a second time with `--production`, on the code of `src/` alone: a file or an export of `src/` that only a test uses is reported, since the app never reaches it. Delete it, test it through the code that uses it, or move a test helper to `test/support/`.

## Tests

| Kind | What it tests | Where | Command |
|---|---|---|---|
| Unit | a pure function, a selector | `test/unit/shared/todos/lib/normalizeTitle.test.ts` | `npm run test:unit` |
| Component | a presenter alone, through its props | `test/unit/features/todo-list/components/presenters/TodoInput.test.tsx` | `npm run test:component` |
| E2e | a user flow on the built app | `test/e2e/app.spec.ts` | `npm run e2e` |

The extension picks the kind: `.test.ts` runs in Node, `.test.tsx` in Chromium. Only presenters get component tests, since orchestrators read stores and e2e covers them. Find elements by role and accessible name, wait with retrying assertions, never with a timeout. `vitest.setup.ts` gives the tests the same i18next instance as the app, so a presenter renders its English text.

The specs import `test`, `expect` and `axeViolations` from `@brutalway/playwright-fixtures`: `test` fails any test during which the page throws, `axeViolations` runs axe-core. `test/e2e/openApp.ts` opens the app and waits for its `h1`. `test/e2e/app.spec.ts` checks the first screen: no axe violation, no sideways scroll at 320 px. `test/e2e/todos.spec.ts` covers the example: the same two checks while a task is being renamed, axe again on the error shown for a blank title, the counters while adding, checking, filtering and clearing tasks, and renaming.

A helper that tests share (a fixture, a builder, a fake) goes in `test/support/`, never in `src/`, and the tests import it through `@test-support/`. dependency-cruiser rejects an import of `test/` from production code.

Before keeping a test, break the code it protects and watch it fail.
