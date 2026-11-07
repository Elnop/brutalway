# Roadmap: more options for template-vite

Today `npm create brutal` offers six yes/no options on the vite stack, and each one removes something from a template that already holds everything. This roadmap adds options that bring something in: a styling system, server state, forms, UI primitives, translations. Each option follows the Atomic axiom: it is an overlay that can be added or left out, every combination passes `npm run check`, and the conventions it brings are checked by a tool, with an error that says what to change.

Most of the ideas come from two repositories by JCluzet:

- [bedrock](https://github.com/JCluzet/bedrock), a Next.js 16 + Tailwind v4 starter built on the same idea as brutalway (one `pnpm check` gate, 34 custom ESLint rules, semgrep, ast-grep, jscpd, knip, dependency-cruiser). Its `.agents/rules/` folder documents each rule, and every lint message points to the matching section.
- [Wizcard](https://github.com/JCluzet/Wizcard), a Next.js app in production (Supabase, next-intl, PostHog, CSS Modules), which shows how these conventions hold up on a real codebase of about 800 files.

Both are Next.js projects. What is specific to Next (server components, `next/link`, route groups, `withEvlog` on route handlers) is left out or rewritten for a Vite single page app. ePong, the other React project in the list, is a 2023 Create React App with four UI kits installed at once, so nothing is taken from it.

## Order

| Phase | Epics | Why this order |
|---|---|---|
| 0 | E0 | the CLI only knows yes/no options that remove files, every epic below needs more than that |
| 1 | E1, E2 | Tailwind is the option people ask for first, and E2 needs no new option |
| 2 | E3, E4 | server state and forms change the example the most |
| 3 | E5, E6 | shadcn/ui needs Tailwind and a TypeScript project of its own, i18n touches every string of the example |
| 4 | E7, E8 | smaller options, each independent from the rest |
| any | E9 | tools for the docs, independent from the options |

## E0. Options that add things and options with several values

The `Answers` type is `Record<string, boolean>` and every option defaults to `true`. A styling option has three values (plain CSS, CSS Modules, Tailwind) and a translation option should default to off.

**E0-S1. Choice options.** As someone creating a project, I want to pick one value out of several for an option, so that I can choose my styling system in one question.
- `StackOption` accepts a list of values, the prompt shows a select, the flag is `--styling tailwind`, a preset file takes `"styling": "tailwind"`.
- `when` in a `StackChange` can match a value.
- `--help` lists the values of each option.

**E0-S2. Opt-in options.** As someone creating a project, I want options that are off by default and add files when switched on, so that the default project stays as small as it is today.
- An option can default to `false`. Its overlay adds files, dependencies and doc lines instead of removing them.
- The doc edits of an added option are written as insertions next to an anchor that already exists, and a missing anchor stops the CLI like a missing replacement does today.

**E0-S3. Conflicts between options.** As someone creating a project, I want the CLI to refuse a combination that cannot work and tell me why, so that I do not get a project that fails its first check.
- An option can declare `conflicts` next to `requires`. `--ui shadcn --styling css` fails before anything is written, with a message naming both options.

**E0-S4. A matrix that stays affordable.** As a maintainer, I want `npm run matrix` to stay under the CI time budget when the number of options doubles, so that every combination is still tested where it matters.
- Choice values are crossed with each other, the other options are tested on and off against the default of the rest (pairwise, or the existing `independent` flag).
- The CI run reports how many projects it built and how long it took.

## E1. Tailwind CSS

Source: bedrock (`styles/globals.css`, `.agents/rules/theme.md`, rules `no-raw-tailwind-colors`, `no-raw-color-literals`, `no-heading-without-display-font`, `no-code-without-mono-font`).

bedrock defines every color, font and radius as a token in one CSS file with Tailwind v4's `@theme`, then forbids any color that is not a token: no `bg-white`, no `text-zinc-500`, no `bg-[#0f0f0f]`, no hex in a `style` prop. This is the part worth taking. The neo-brutalist look of the series becomes a set of tokens (`--color-ink`, `--color-paper`, `--shadow-hard`...), so a project made with Tailwind looks the same as one made with plain CSS.

**E1-S1. Tailwind as a styling value.** As someone creating a project, I want `--styling tailwind`, so that I write styles as classes in the components.
- Tailwind v4 with `@tailwindcss/vite`, no `tailwind.config.js`, tokens in `src/app/globals.css` under `@theme`.
- The example's `.css` files are gone, the todo list renders the same, and the e2e screenshots (if any) match.
- check-tree's rule that puts stylesheets in `styles/` still passes with a single `globals.css`.

**E1-S2. Only tokens.** As someone working on the project, I want a lint error when I write a color that is not a token, so that the palette stays in one file.
- New package `@brutalway/oxlint-config-tailwind`: no built-in palette class, no arbitrary color value, no color literal in `style`, `fill` or `stroke`.
- The message names the token file and the closest tokens.

**E1-S3. Font roles.** As someone working on the project, I want headings and code to use the right font class, so that typography stays consistent without a review.
- `h1` to `h3` need `font-display`, `code` and `pre` need `font-mono`, the body inherits `font-sans`.

**E1-S4. Sorted classes.** As someone reviewing a diff, I want the classes always in the same order, so that a diff only shows real changes.
- `prettier-plugin-tailwindcss` added to `@brutalway/prettier-config` or to a variant of it, `prettier --check` fails on unsorted classes.

**E1-S5. Dark mode, or not.** As someone creating a project, I want to know whether `dark:` is allowed, so that I do not ship half a theme.
- Default: light only, `dark:` reported by the lint (bedrock does the same). A later `--theme dark` option adds the dark tokens and lifts the rule.

## E2. CSS Modules

Source: Wizcard (`docs/feature-modules.md`, `src/components/*/`).

Wizcard gives each component a `.module.css`. Here the stylesheet sits in the same folder as its component and takes its name: `TodoItem.module.css` next to `TodoItem.tsx`. check-tree moves the `.css` files of a folder into `styles/` as soon as there are two of them, so `.module.css` files leave that group: they follow their component, not their kind.

The first plan was [css-modules-kit](https://github.com/mizdra/css-modules-kit): its `cmk` command types the class names and its stylelint plugin has the two rules of E2-S2. Both need the JavaScript API of TypeScript, which TypeScript 7 no longer ships, and the plugin crashes on `ts.server`. So `happy-css-modules`, which only needs PostCSS, writes one `.d.ts` per stylesheet into `node_modules/.cache/css-modules`, and a second entry in `paths` (`"@/*": ["./src/*", "./node_modules/.cache/css-modules/src/*"]`) lets tsc find them through the `@/` alias (`rootDirs` does not apply to aliased imports). The rules of E2-S2 are written in `@brutalway/stylelint-config`, which brings stylelint into the series, and with it a check E1 could not give to plain CSS: colors written in a stylesheet (E2-S3).

**E2-S1. CSS Modules as a styling value.** As someone creating a project, I want `--styling css-modules`, so that styles are scoped to their component without a utility framework.
- The example uses `TodoItem.module.css` and friends, each next to its component. `globals.css` keeps the tokens, the reset and the shared `button` and `visually-hidden` classes, as the Tailwind version keeps a `button` utility.
- Classes are written in camelCase (`.todoItem`, enforced by `selector-class-pattern` on `.module.css` files) and read as `styles.todoItem`, so the name is the same in both files.
- `npm run css-types` runs before tsc in `typecheck` and in `prepare`, so a fresh clone has the types after `npm install`. The editor sees a new class after `npm run css-types`, or with `npm run css-types -- --watch`.
- check-tree no longer counts `.module.css` files in the `styles/` group.

**E2-S2. A stylesheet sits next to its component.** As someone working on the project, I want an error when `X.module.css` has no `X.tsx` beside it or holds a class no component uses, so that no stylesheet is left behind after a rename.
- New package `@brutalway/stylelint-config` with `brutalway/module-next-to-component` and `brutalway/no-unused-class`. The second one reads `styles.name` and `styles['name']` in `X.tsx`, and reports a component that does not import its stylesheet.
- `stylelint` runs in `npm run check` through `npm run styles`, and the agent hook runs it on an edited `.css` file.

**E2-S3. Only tokens in stylesheets.** As someone working on the project, I want an error when a stylesheet writes a color that is not a token, so that the palette stays in one file whatever the styling value.
- `brutalway/color-tokens`: hex, color functions and named colors are only allowed in `src/app/globals.css`. Anywhere else a color is a `var()` of a custom property declared there.
- Applies to `--styling css` and `--styling css-modules`, the message names the three closest tokens in OKLab, as `@brutalway/oxlint-config-tailwind` does. A Tailwind project has no stylelint: its only stylesheet is `globals.css`, and the colors in its classes are checked by oxlint.

## E3. Server state with TanStack Query

Source: bedrock (`.agents/rules/state.md`, `lib/query/keys.ts`, `lib/query/stale-times.ts`, semgrep rules `no-inline-query-key`, `no-magic-stale-time`, `no-fetch-in-use-effect`).

bedrock splits state by what it is: data from an API goes through TanStack Query, UI state goes into zustand, and a store must never hold server data. Query keys come from a `xKeys` factory, cache windows come from named profiles. The series already has an API with the same todo list (template-fastify), so the example talks to its routes: `GET /todos?filter=`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`, `DELETE /todos/completed` and `GET /stats`.

Requests live in `xClient.ts` files, the convention template-fastify already uses for HTTP calls (its dependency-cruiser rule `http-in-clients`, check-tree's `clients/` category). The client parses every response with the Zod schemas of `TodosSchemas.ts`, and the types come from `z.infer`, so a response that drifts from the API fails at the boundary instead of deep in a component. E4 reuses the same schemas for the forms. Ids become numbers, as in the API.

The `/stats` query lives in `src/shared-features/todos/` next to the list, under the same factory (`todosKeys.all`, `todosKeys.list(filter)`, `todosKeys.stats()`): a mutation on the list has to refresh the counters, and a shared feature cannot import `src/features/todo-stats/`. Invalidating `todosKeys.all` refreshes both.

Without `API_URL`, a Vite plugin answers `/api` with an in-memory list, in `npm run dev` and in the `vite preview` the e2e tests run against. Each browser gets its own list through a cookie, so the e2e tests stay isolated without a reset step. With `API_URL`, the same place in `vite.config.ts` proxies `/api` to template-fastify instead, which has no CORS. The mock only lives in the config: the app has no idea it can be mocked, and the e2e tests run the production build. MSW was the first idea, but its service worker file in `public/`, its start-up code in `main.tsx` and the special build it needs for e2e buy nothing here: presenters get everything through props, so no component test makes a request.

As built: the styled components are shared by every styling value, so the data stays out of them. `TodoListLayout.tsx` reads the list through `src/features/todo-list/useTodoList.ts` in every project, and the option only swaps that hook and `TodoStatsContainer.tsx`. Toggling a task patches the cached lists right away (`onMutate`) and refetches once the server answers, otherwise the checkbox snaps back until the refetch. `API_URL` is read from the environment of the command (`API_URL=http://localhost:3000 npm run dev`), not from a `.env` file.

**E3-S1. TanStack Query as an option.** As someone creating a project, I want `--server-state`, so that the app reads and writes its data through an API.
- The example reads and writes todos through `@tanstack/react-query` against the routes of template-fastify: the list is filtered by the API (`?filter=`), the counters come from `GET /stats`, and each mutation invalidates `todosKeys.all`.
- `src/shared-features/todos/todosClient.ts` holds the requests and parses each response with the Zod schemas of `TodosSchemas.ts`. Types come from `z.infer`, ids are numbers.
- Without `API_URL`, a Vite plugin in `apiMock.ts` answers `/api` in `npm run dev` and `vite preview`, with one in-memory list per browser (cookie). With `API_URL`, `vite.config.ts` proxies `/api` to the API instead. Nothing in `src/` knows about the mock.
- zustand keeps the filter only. With the option off, the example stays as it is today. Without the example, the option only brings the `QueryClientProvider`, `QueryConfig.ts` and the rules.

**E3-S2. Query keys from a factory.** As someone working on the project, I want an error when I write a query key inline, so that an invalidation never misses its query.
- Keys live in `xKeys.ts`, which only exports `xKeys`. check-tree learns `xKeys.ts` as a named file with a `keys/` category.
- Rule in a new `@brutalway/oxlint-config-tanstack-query`: `queryKey` and `invalidateQueries` only take a call or a member of an `xKeys` object.
- To check: whether `@tanstack/eslint-plugin-query` runs as an oxlint JS plugin. If it does, take `exhaustive-deps` and `stable-query-client` from it instead of writing them.

**E3-S3. Named cache windows.** As someone working on the project, I want `staleTime` and `gcTime` to come from named profiles, so that the cache can be tuned from one file.
- `QueryConfig.ts` holds the profiles. A number literal for `staleTime` or `gcTime` is reported, in `useQuery`, `queryOptions` and the `QueryClient` defaults.

**E3-S4. No fetch in an effect, no server data in a store.** As someone working on the project, I want an error when I call `fetch` in `useEffect` or put API data in a zustand store, so that each kind of state stays with its tool.
- `fetch` inside a `useEffect` callback is reported by `@brutalway/oxlint-config-react`, since it holds for any React project, with or without TanStack Query.
- `fetch` outside an `xClient.ts` is reported, as template-fastify does with `http-in-clients`.
- dependency-cruiser: a store imports no `xClient.ts` and no query hook. Presenters already import no store, the same rule extends to query hooks, so only orchestrators call them.

## E4. Forms with react-hook-form and Zod

Source: bedrock (rule `forms-must-use-zod`, `.agents/rules/state.md`).

**E4-S1. Forms as an option.** As someone creating a project, I want `--forms`, so that forms come with validation and typed values.
- The todo input and the editor use `react-hook-form` with `zodResolver`, the schema sits in `TodosSchemas.ts` (the `xSchemas.ts` convention already used on fastify).
- Errors are shown by the presenter and announced to screen readers, axe in the e2e test stays clean.

**E4-S2. Every form has a schema.** As someone working on the project, I want an error when `useForm` has no Zod resolver, so that the form type always matches what is validated.
- Lint rule `useForm` without `resolver: zodResolver(...)`.
- With E3, the API types and the form types come from the same schema when they describe the same thing.

## E5. UI primitives with shadcn/ui

Source: bedrock (`components.json`, `components/ui/`, `.agents/rules/ui-components.md`, rules `no-raw-jsx-primitives`, `no-faux-card-containers`, `no-lucide-react-imports`, the inventory guardrail).

bedrock vendors the whole shadcn library, then forbids raw `<button>`, `<input>`, `<select>` and hand-made cards in its own code. A script fails when the list of components in the docs drifts from the files.

shadcn files are vendored code: they come from a registry, and `npx shadcn add <name> --overwrite` must be able to replace them at any time. They follow shadcn's conventions, which break most brutalway rules. bedrock puts them in `components/ui/` and lists that folder as an exception in each tool. That does not work here: `src/shared/ui/` also holds components written for the app, which must keep every rule. So the vendored files leave `src/` altogether, and `src/` gets no exception at all.

### What breaks, measured

Tried on a project made with `npm create brutal` (vite, every option on), Tailwind v4 added, then `button input checkbox card dialog select sonner tabs dropdown-menu form calendar sidebar` added with the shadcn CLI:

| Tool | What fails on the vendored files |
|---|---|
| Prettier | every file (double quotes, no semicolons) |
| tsc | `calendar.tsx` (`noPropertyAccessFromIndexSignature`, 9 errors), `sonner.tsx` (`exactOptionalPropertyTypes`) |
| oxlint | 48 errors: `file-named-after-export`, `consistent-type-specifier-style`, `func-style`, `only-export-components`, `no-unsafe-type-assertion`, `filename-case`... |
| knip | components not used yet reported as unused files, `buttonVariants` as an unused export, plus `zod`, `@hookform/resolvers` and `date-fns`, which the CLI installs but no file imports |
| check-tree | `hooks/` holds only `use-mobile.ts` |
| dependency-cruiser | nothing once the dependencies are installed (the CLI installed `cn` but forgot `class-variance-authority` and `lucide-react`) |
| alint | nothing |

`exclude` is not enough for tsc: a file imported by the app is checked with the app's flags even when excluded.

### The method

The vendored files go to `third-party/shadcn/`, at the root of the project next to `src/` and `e2e/`, imported through a `@third-party/*` alias. Every alias of `components.json` (components, ui, utils, lib, hooks) points to `@third-party/shadcn`, and the shadcn CLI writes there without complaint, imports between its files included (`@third-party/shadcn/button`). `third-party/` only ever holds code copied from a registry, so a later registry (another shadcn namespace, for instance) gets its own `third-party/<name>/`.

The name of the folder is not settled yet: `third-party/` (Chromium's convention, explicit) or `external/` (shorter, and the alias `@external/` has no dash). This page uses `third-party/` until then. The test ran with a folder called `vendor/` and a `@vendor/*` alias, so the shadcn CLI has to be tried again with the chosen alias, `@third-party/*` in particular.

`src/` stays fully governed, `src/shared/ui/` included. The scripts already target `src` (`oxlint src e2e`, `depcruise src`, `check-tree src`), so they never see `third-party/`. What remains to set up:

| Tool | Setup |
|---|---|
| tsc | `tsconfig.third-party.json` is a composite project for `third-party/` with `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature` off, emitting declarations only into `node_modules/.cache/tsc-third-party`. `tsconfig.app.json` and `tsconfig.test.json` reference it, so the app sees the vendored files through their `.d.ts` and keeps every strict flag. `typecheck` becomes `tsc -b tsconfig.app.json tsconfig.test.json`. |
| Vite | the `@third-party/` alias next to `@/` |
| Prettier | `third-party` and `components.json` in `.prettierignore`, so an `--overwrite` produces no formatting diff |
| knip | `third-party/**/*.{ts,tsx}` as an entry: a component not used yet is not reported, and the packages it imports still count as used. A package the shadcn CLI installs without any file importing it is still reported. |
| oxlint | `third-party` in `ignorePatterns`, only for the agent hook, which passes the edited file by path |
| dependency-cruiser | `depcruise src third-party`, with the two rules of E5-S4 |
| check-tree, alint | nothing |

Tailwind v4 finds the classes in `third-party/` by itself. On the test project, with a `Panel.tsx` in `src/shared/ui/` that wraps the shadcn `Card` and a hand-written `Badge.tsx` next to it, `npm run check` and `vite build` pass, and check-tree still applies to `src/shared/ui/`: with two components there, it asked to move them into `components/`.

Styling goes through tokens: shadcn's variables (`--primary`, `--border`, `--radius`...) are defined in `src/app/globals.css` from the neo-brutalist tokens, and what tokens cannot do (thick borders, hard shadows) is written once per primitive with its `data-slot` attribute (`[data-slot='button'] { ... }`). Every shadcn primitive sets one, so the look changes without editing a vendored file. A variant the app needs and shadcn does not have is a component in `src/shared/ui/` that wraps the primitive, written under the usual rules.

### Stories

**E5-S1. shadcn/ui as an option.** As someone creating a project, I want `--ui shadcn`, so that I start with accessible primitives styled like the rest of the series.
- Requires `--styling tailwind` (E0-S3). Only the primitives the example uses are vendored (Button, Input, Checkbox, Card), and the example uses them.
- The CLI writes `components.json` with every alias on `@third-party/shadcn`, adds the `@third-party/*` alias to the tsconfigs and to Vite, and pins the packages the vendored files import, since the shadcn CLI misses some.
- The README explains how to add one with `npx shadcn add <name>` and what to do after (E5-S7).

**E5-S2. A TypeScript project for vendored code.** As someone working on the project, I want vendored files checked with shadcn's flags and my code with all of brutalway's, so that adding a component never makes `npm run check` fail on code I did not write.
- `tsconfig.third-party.json`, the references and the `tsc -b` script as above. An error in `src/` is still reported, an error in `third-party/` only if it fails with the relaxed flags.
- The `.tsbuildinfo` and declarations stay under `node_modules/.cache`, nothing new to gitignore.
- Check whether `@brutalway/tsconfig` should ship a `react-vite-third-party.json` with the two flags off, so the relaxed set is defined once.

**E5-S3. The other tools leave `third-party/` alone.** As someone working on the project, I want Prettier and knip set up as above, so that `--overwrite` gives the registry's file byte for byte and `npm run check` stays green.
- The matrix (E0-S4) runs with a component added after the scaffold, to catch a tool that starts reading `third-party/`.
- alint: a rule that `third-party/` only holds folders listed in a config file (`components.json` for shadcn), so nobody drops hand-written code there to escape the rules.

**E5-S4. Boundaries of the vendored folder.** As someone working on the project, I want `third-party/` to import nothing from `src/`, and the packages behind shadcn to be imported only from `third-party/`, so that swapping a primitive happens in one place.
- Rules in `@brutalway/dependency-cruiser-config`: `third-party-not-to-src`, and `third-party-packages-only-from-third-party` for `radix-ui`, `class-variance-authority` and `cn`. Both tried on the test project: an import of `radix-ui` from `src/shared/lib/` and an import of `src/` from `third-party/shadcn/` are both reported.
- Code in `src/` may import `@third-party/shadcn/` from any layer, since `third-party/` imports nothing from the app.

**E5-S5. No hand edits.** As someone working on the project, I want an edit to a vendored file to be refused with what to do instead, so that the folder always matches the registry.
- `@brutalway/agent-hook` stops on a file under `third-party/`, with the message: run `npx shadcn add <name> --overwrite`, restyle in `src/app/globals.css` through tokens or `data-slot`, or wrap the primitive in `src/shared/ui/`.
- Without that, the hook would fail on these files for a different reason: `oxlint <ignored file>` exits with 1 and "No files found to lint". The hook passes `--no-error-on-unmatched-pattern` or skips ignored files.
- Look into a CI check that compares `third-party/shadcn/` with the registry at the pinned shadcn version.

**E5-S6. Primitives first.** As someone working on the project, I want an error when I write a raw `<button>` or `<input>` in `src/`, so that every control behaves the same way.
- Lint rule with the list of tags and the primitive to use for each, active only when `components.json` exists.

**E5-S7. The docs list what is vendored.** As someone (or an agent) arriving on the project, I want a table of the available primitives, so that I use one instead of writing it again.
- `docs/ui.md` lists each file of `third-party/shadcn/` and each component of `src/shared/ui/`. A check fails when a file is missing from the table or a row has no file.

**E5-S8. One icon library.** As someone working on the project, I want a single icon set, so that icons look alike.
- The one set in `components.json` (`lucide` by default), imports of the others reported.

## E6. Translations

Source: Wizcard (`messages/en.json`, `messages/fr.json`, `eslint-plugin-i18next` with `no-literal-string` in `jsx-text-only` mode, turned on folder by folder).

Wizcard migrated to two languages one domain at a time, turning the rule on for each folder once it was done. For a new project the rule is on from the start.

**E6-S1. i18n as an option.** As someone creating a project, I want `--i18n`, so that every visible string goes through a translation from the first commit.
- `react-i18next` (next-intl is tied to Next), `en` and `fr` messages for the example, a language switch in the example.
- Message keys are typed from the default locale: an unknown key is a tsc error.

**E6-S2. No visible literal.** As someone working on the project, I want an error when JSX holds visible text, so that no string is left untranslated.
- `no-literal-string` in `jsx-text-only` mode, with an allowlist for symbols and numbers.

**E6-S3. Same keys in every locale.** As someone working on the project, I want a check that fails when a key exists in one locale and not the other, or when no code uses it, so that the message files do not drift.
- Script run by `npm run check`, the message names the locale and the key.

## E7. More checks on React code

Source: bedrock's ESLint plugin and `.jscpd.json`, Wizcard's `sonarjs` setup.

These are rules, not options: they go into `@brutalway/oxlint-config-react` and apply to every project. Each one is checked against the example first.

**E7-S1. Rules taken from bedrock.** As someone working on the project, I want the following mistakes reported, so that a review does not have to catch them.
- Array index or `Math.random()` as a React `key` (`no-unstable-keys`).
- Formatting dates and numbers or reshaping arrays inside a presenter (`presenter-no-formatting`), the work moves to the orchestrator or a hook.
- An orchestrator that calls no hook and only wraps JSX (`orchestrator-must-orchestrate`).
- JSX in a hook file.
- `localStorage` and `sessionStorage` outside a `xStorage.ts` file.
- `as unknown as` double casts.
- A component with more than N props (bedrock: `max-component-props`), as a warning first.

**E7-S2. No duplicated code.** As a maintainer, I want jscpd in `npm run check` with a threshold of 0 (bedrock's setting: 8 lines, 120 tokens, tests excluded), so that copy and paste is caught when it happens.
- Opt-in option `--no-duplicates`, since a threshold of 0 is strict for some teams.

**E7-S3. Coverage gate.** As a maintainer, I want `npm test` to fail under a coverage threshold, so that the tests keep up with the code.
- `@vitest/coverage-v8`, a threshold on `src/features` and `src/shared-features`. Option, off by default.

**E7-S4. Cognitive complexity.** As someone working on the project, I want a function that is too hard to follow to be reported, so that it gets split.
- Check whether oxlint has an equivalent of `sonarjs/cognitive-complexity` (Wizcard uses 20). If not, record it as a gap.

## E8. Smaller options

**E8-S1. React Compiler.** Source: Wizcard (`babel-plugin-react-compiler` installed). As someone creating a project, I want `--react-compiler`, so that I do not write `useMemo` and `useCallback` by hand.
- Plugin set up in `vite.config.ts`, a lint rule reports manual memoization when the option is on.

**E8-S2. Product analytics.** Source: Wizcard (PostHog, client and server). As someone creating a project, I want `--analytics`, so that events are sent from one module.
- PostHog behind `src/shared/lib/analytics.ts`, a dependency-cruiser rule forbids importing `posthog-js` anywhere else. The key is read from `import.meta.env`, nothing is sent when it is missing.

**E8-S3. Security headers.** Source: Wizcard (`next.config.ts`: CSP in report-only, HSTS, `X-Frame-Options`, `Permissions-Policy`). As someone deploying the app, I want a starting CSP, so that I tighten it rather than write it from nothing.
- Headers for `vite preview` and a `_headers` file for static hosts. The e2e test fails on a CSP violation.

**E8-S4. Instructions for agents.** Source: bedrock (`AGENTS.md`, `.agents/rules/*.md`, each lint message ending with `See .agents/rules/x.md#anchor`), Wizcard (`CLAUDE.md`, `.clinerules`, `.windsurfrules`). As someone working with an agent other than Claude Code, I want an `AGENTS.md` that matches the options I picked, so that the agent knows which tool to use for what before it writes code.
- `AGENTS.md` is assembled by the CLI from one section per option.
- Lint messages of `@brutalway/*` packages end with a link to the rule's README section.

## E9. Docs that stay readable

A Markdown file grows one section at a time until nobody reads it to the end. `mdsplit` splits a file along its headings but checks nothing and leaves internal links broken. markdownlint and remark-lint only limit line length, not file length.

**E9-S1. tldr.** As someone maintaining the docs of a project, I want a warning when a Markdown file gets too long, and a command that splits it into folders along its headings, so that a long doc gets split before it becomes a wall of text. Tracked in [#49](https://github.com/Elnop/brutalway/issues/49), the implementation is still to be brainstormed.
- `@brutalway/tldr` in `packages/tools/tldr`. `check` mode lists the files above a threshold and exits non-zero, `split` mode prints the proposed tree and writes it with `--write`.
- Threshold, heading depths, globs and file naming read from a config file, each folder gets an `index.md`, links to a moved section are rewritten.
