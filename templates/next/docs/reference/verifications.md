# Verifications

Everything below runs locally, in the pre-commit hook and in CI. Component tests and e2e need headless Chromium: `npx playwright install --only-shell chromium`.

## TypeScript

`tsc` runs twice: on the production code (`tsconfig.app.json`) and on tests, e2e and configs (`tsconfig.test.json`). Both extend `@brutalway/tsconfig/react-vite.json`, which turns on `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`. That last one is why `playwright.config.ts` reads `process.env['CI']`.

`next build` checks the types again with `tsconfig.app.json`, which `next.config.ts` points it to.

Before tsc, `npm run typecheck` runs `i18next-cli types`, which writes the types of the messages of `src/app/locales/en/` into `node_modules/.cache/i18next/`: an unknown key, or a `{{name}}` the call to `t()` leaves out, is a tsc error.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-next`, which brings the React config and its TypeScript base, the zustand and Vitest configs and the rules of Next.js below, then the i18next config. Each package README details its rules. The main ones:

- no comments anywhere, tests included (directives like `oxlint-` and `@ts-expect-error` are allowed)
- no relative imports: `@/` in `src/`, `@e2e/` in `e2e/`. Root config files are the only exception
- no `index.ts`, no `export *`, no `types.ts` without a domain, file names in camelCase or PascalCase
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`. Functions, classes and objects holding functions (like `todosActions`) can live anywhere
- a file with a single export is named after it
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `.d.ts`, and the route files of `src/app/` such as `page.tsx`, `layout.tsx`, `loading.tsx` or `error.tsx`): each module is imported under the name it exports. A route file may also export `generateMetadata`, `metadata` and the route segment options
- `xStore.ts` exports only `xStore` and `xActions`
- a component types its props with a named `XProps` type, and callback props are named `onX`
- no orchestrator (`XContainer`, `XLayout`, `XPage`) under `shared-features/`: the components that read shared state belong to a feature
- a hook lives in a `useX.ts` that only exports hooks, a `xSelectors.ts` only exports `selectX` functions
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`, `curly` only for multi-line blocks
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- no visible text in JSX, in `aria-label`, `placeholder`, `title` or `alt`, nor in a template literal: it goes in `src/app/locales/en/` and through `t()`. The message only says "disallow literal string"
- in tests, `it()` inside a `describe`, `toStrictEqual` over `toEqual`, typed mocks (`vi.fn<() => void>()`)

## Next.js

`@brutalway/oxlint-config-next` adds what only Next.js has:

- every rule of the `nextjs` plugin of oxlint: `next/image` over `<img>`, `next/link` over `<a>` for a page of the app, no `<head>` element, no async client component
- `'use client'` only goes on an orchestrator (`XContainer`, `XLayout`, `XPage`), a provider (`XProvider`) or an `error.tsx`. A presenter, a hook or a file under `shared/` becomes client code through the orchestrator that renders it
- a `'use client'` file imports no `xClient.ts` other than `analyticsClient.ts`: a server component reads the data and passes it down
- a server action lives in a `.ts` file of its own that starts with `'use server'` and exports one async function

## Styles

stylelint checks the stylesheets with `@brutalway/stylelint-config`, declared under `stylelint` in `package.json`. Outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there: no `#fff`, no `rgb()`, no `white`. The message names the three closest tokens.

## Dependencies

dependency-cruiser checks the direction of imports. The rules come from `@brutalway/dependency-cruiser-config`, and `.dependency-cruiser.cjs` only adds the parser options:

- `src/shared/` imports neither `src/shared-features/` nor features, `src/shared-features/` imports no feature, no feature imports `src/app/`
- a feature never imports another feature, a shared feature never imports another shared feature
- a sub-feature imports neither its siblings nor its feature root, only its feature `shared/`, at every nesting level, and features nest at most ten levels deep
- a presenter imports no store and no shared-feature hook
- a store lives at the root or in the `stores/` folder of its level
- no cycles, no import of a test file or a devDependency from production code

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and category folders (`components`, `hooks`, `lib`...) holding a single file. One file of a kind stays at the root of its folder, two or more go in the category folder. Inside `components/`, the same goes for `orchestrators/` and `presenters/`. Tests do not count: a test sits next to its source. It also rejects two CSS files outside a `styles/` folder.

## Messages

`npm run messages` runs `i18next-cli status`, which fails when a key the code uses is missing from a language, and `i18next-cli status --unused`, which fails on a key no code uses. `i18next.config.ts` lists the languages and where their files are.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`, tests left out: the threshold is 0. Move the shared part into a function the two places call.

## Headers

`next.config.ts` sends HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` on every route, and drops `X-Powered-By`.

The Content Security Policy comes from `src/proxy.ts`, since Next.js writes inline scripts into the page: the proxy draws a nonce for each request, and Next.js puts it on its own scripts. Only those scripts, and the ones they load, run. Stylesheets, fonts and requests stay on the app's own origin. `style` attributes are allowed (`style-src-attr 'unsafe-inline'`), since the server writes into the HTML the ones React renders, while a `<style>` element still needs the nonce. A nonce changes on each request, so `src/app/layout.tsx` calls `connection()` and every page renders on request instead of at build time. In dev, the policy also allows `'unsafe-eval'`, which hot reload needs.

`npm run e2e` runs against `next start`, so the tests run under these headers. `test` from `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, so a script or a request from another origin shows up there first: allow it in `src/proxy.ts`, on the narrowest directive.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested. Fix the link, or point it to the page that replaced it.

## Repository

alint checks that:

- every path in backticks, link and anchor in the README and in `docs/` still exists
- `styles/`, `types/` and `configs/` only hold what their name says
- every dependency in `package.json` is pinned to an exact version

The rules come from `@brutalway/alint-config`, except the path check, which `.alint.yml` declares itself because its prefixes depend on this repository's folders. Paths are resolved from the repository root, so the docs always write full paths like `src/app/page.tsx`.

knip (`knip.json`) rejects exports nobody imports, unused files, unused dependencies and packages used without being declared. `@swc/core` is ignored because dependency-cruiser loads it by name.

## Tests

| Kind | What it tests | Where | Command |
|---|---|---|---|
| Unit | a pure function, a selector | `src/shared/normalizeTitle.test.ts` next to its source | `npm run test:unit` |
| Component | a presenter alone, through its props | `src/features/todo-list/components/presenters/TodoInput.test.tsx` | `npm run test:component` |
| E2e | a user flow on the built app | `e2e/app.spec.ts` | `npm run e2e` |

The extension picks the kind: `.test.ts` runs in Node, `.test.tsx` in Chromium. Only presenters get component tests, since orchestrators read stores and e2e covers them. Find elements by role and accessible name, wait with retrying assertions, never with a timeout. `vitest.setup.ts` gives the tests the same i18next instance as the app, so a presenter renders its English text.

The specs import `test`, `expect` and `axeViolations` from `@brutalway/playwright-fixtures`: `test` fails any test during which the page throws, `axeViolations` runs axe-core. `e2e/openApp.ts` opens the app and waits for its `h1`. `e2e/app.spec.ts` checks the first screen: no axe violation, no sideways scroll at 320 px. `e2e/todos.spec.ts` covers the example: the same two checks while a task is being renamed, axe again on the error shown for a blank title, the counters while adding, checking, filtering and clearing tasks, and renaming.

Before keeping a test, break the code it protects and watch it fail.
