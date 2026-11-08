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

`TodoInput.tsx` and `TodoEditor.tsx` exist once per styling value, so the form logic stays out of them, as the data does in E3. Both read their field through `src/features/todo-list/shared/useTitleForm.ts`, which returns the props of the input, the error and the submit handler. The default project implements it with `useState` and `normalizeTitle`, `--forms` with `react-hook-form` and `zodResolver`, and the markup is the same in both. That changes the default project too: the submit button stays enabled, and submitting a blank title shows "The title is blank" under the field (`role="alert"`, `aria-invalid`, `aria-describedby`) instead of a disabled button with no explanation.

The schema is `TodoDraftSchema` in `src/shared-features/todos/TodosSchemas.ts`, written like the one of template-fastify: trimmed, inner spaces merged, 1 to 200 characters. With `--server-state` it joins the schemas of the API in the same file, and `todosClient.create` takes the type inferred from it, so the form and the request describe the same thing once.

As built: the schema reuses `normalizeTitle` in its `transform`, so trimming and merging spaces is written once for the store, the default form and the schema. Toggling a task with `--server-state` patches the cache a few microtasks after the click, so the e2e test clicks the checkbox and waits for `toBeChecked()` instead of calling `check()`, which reads the state at once. After the edits, the CLI rewrites `knip.json` the way Prettier would, since several options add names to `ignoreDependencies` and the line can pass 200 columns.

**E4-S1. Forms as an option.** As someone creating a project, I want `--forms`, so that forms come with validation and typed values.
- `src/features/todo-list/shared/useTitleForm.ts` uses `react-hook-form` with `zodResolver(TodoDraftSchema)`. `TodoInput.tsx` and `TodoEditor.tsx` do not change between the default project and `--forms`, in any styling value.
- `TodoDraftSchema` sits in `src/shared-features/todos/TodosSchemas.ts`. With `--server-state`, it joins the API schemas there and `todosClient.create` takes its inferred type.
- In every project, a blank title shows "The title is blank" under the field, announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`), and axe in the e2e test stays clean.

**E4-S2. Every form has a schema.** As someone working on the project, I want an error when a form validates anywhere but in its Zod schema, so that the form type always matches what is validated.
- New package `@brutalway/oxlint-config-react-hook-form`, added with `--forms`.
- `useForm` without `resolver: zodResolver(...)` is reported.
- Validation outside the schema is reported: options passed to `register` (`register('title', { required: true })`) and the `rules` prop of a `Controller`.

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

The folder is `third-party/`, Chromium's name for it: it says what it holds, and the dash in `@third-party/*` costs nothing in an import. The spike (E5-S0) ran shadcn 4.23.0 with `@third-party/*`: it writes into `third-party/shadcn/` without complaint.

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

Styling goes through tokens first, and the spike showed they do most of the work. Under `@theme`, `--default-border-width: 3px` turns every bare `border` class of the vendored files into a thick border, `--radius-*: initial` makes every `rounded-md` square, and `--shadow-xs` and `--shadow-sm` become hard shadows. What no token reaches, a Button with no border class at all, is written once per primitive with its `data-slot` attribute (`[data-slot='button'] { ... }`), which every shadcn primitive sets, in `@layer base`: there it fills a property no utility sets, and a class the app passes to the primitive still wins. It loses to an arbitrary value written in the vendored file (the Checkbox's `rounded-[4px]`), so that one is fixed by the class the presenter passes, or by a wrapper. A variant the app needs and shadcn does not have is a component in `src/shared/ui/` that wraps the primitive, written under the usual rules.

shadcn's colors are mapped onto the neo-brutalist ones under `@theme inline` (`--color-primary: var(--color-yellow)`), so a project has two vocabularies, `ink`/`paper`/`yellow` and `primary`/`muted-foreground`, in the same file. Both are tokens: `@brutalway/oxlint-config-tailwind` already reads `@theme inline`, `bg-primary` passes in `src/` and `bg-zinc-500` is still reported. There is no `.dark` block, so the `dark:` classes of the vendored files never apply, which matches E1-S5.

The vendored files the example needs are committed in the overlay (`overlays/vite/shadcn/third-party/shadcn/`), written by a script of the repo that runs a pinned version of the shadcn CLI. The scaffold stays offline, and the matrix tests the files the user gets. The repo's `.prettierignore` gets `**/third-party`, since it does not skip `overlays/` today. The generated project pins `shadcn` in its devDependencies, so `npx shadcn add` runs the same version and E5-S5 has a version to compare the folder against.

As built: the vendored files of the example are written by `packages/tools/create-brutal/scripts/vendorShadcn.ts`, which runs the shadcn CLI in a temporary project with the version and the primitives of `src/stacks/shadcnConfig.ts`. The shadcn CLI refuses to run when the root `tsconfig.json` has no `paths`, so it declares `@third-party/*` too, and lists `tsconfig.third-party.json` next to the other two. The tokens also keep two font weights only (`--font-weight-*: initial`), so the `font-medium` of the Button produces nothing and the `[data-slot='button']` rule makes it bold. `--default-border-width: 3px` applies to the app's own `border` classes as well, which the example does not use. In the example, the filters and the Edit and Cancel buttons are the `secondary` variant, Delete and Clear done are `destructive`, and the Checkbox gets `size-6 rounded-none` from `TodoItem.tsx`. The matrix adds `dialog` and `sonner` after the scaffold: `sonner` fails `exactOptionalPropertyTypes`, so it shows that the separate TypeScript project works.

The boundaries of E5-S4 are a third entry point, `@brutalway/dependency-cruiser-config/shadcn`, which extends the layers, so a project without shadcn can still import `radix-ui` from `src/`. E5-S5 is a `--vendored third-party` flag of `@brutalway/agent-hook`: the `PostToolUse` hook skips those files, and the same command as a `PreToolUse` hook refuses the edit. Comparing `third-party/shadcn/` with the registry in CI is not done. E5-S6 and E5-S8 share `@brutalway/oxlint-config-shadcn`: `<input type="checkbox">` points to `Checkbox`, `<input type="radio">` to `RadioGroup`, and `<input type="hidden">` is left alone. Since `shadcn add` runs `npm install`, the matrix runs it with the same `package.json` pointing to the local tarballs as its own install, so a package version not published yet does not stop it.

### Stories

**E5-S0. Spike.** Done on a project made with `--styling tailwind` and Button, Input, Checkbox and Card added by shadcn 4.23.0, styles measured in Chromium.
- The shadcn CLI writes into `third-party/shadcn/` through `@third-party/*`.
- `cn` is now a package of its own, published by shadcn (it replaces `clsx` and `tailwind-merge`), so there is no `utils.ts` to vendor. The CLI installs `cn` and `radix-ui` and still misses `class-variance-authority` and `lucide-react`.
- Tokens and `[data-slot]` rules in `@layer base` give the neo-brutalist look, with the limit above.
- tsc passes on these four files with the app's flags, knip reports their unused exports (`buttonVariants`, `CardFooter`...) until they are entries. E5-S2 stays for components like `calendar` and `sonner`.

**E5-S1. shadcn/ui as an option.** As someone creating a project, I want `--ui shadcn`, so that I start with accessible primitives styled like the rest of the series.
- `ui` is a choice option (`none`, `shadcn`), `none` by default. The value `shadcn` declares `requires: { styling: 'tailwind' }`, which `optionRules.ts` already handles.
- Only the primitives the example uses are vendored (Button, Input, Checkbox, Card). A `shadcn-example` overlay replaces the presenters of `tailwind-example`: the filters are Buttons with `aria-pressed`, the check mark is lucide's `CheckIcon` inside the shadcn Checkbox. `useTitleForm` stays the only form code, with or without `--forms`: no shadcn `Form` or `Field`.
- The shadcn Checkbox is a `button` with `role="checkbox"` and `onCheckedChange`: `TodoItem.test.tsx` and the e2e test still find it by role and still pass with `toBeChecked()`.
- The CLI writes `components.json` with every alias on `@third-party/shadcn`, adds the `@third-party/*` alias to the tsconfigs and to Vite, and pins the packages the vendored files import, since the shadcn CLI misses some.
- The README explains how to add one with `npx shadcn add <name>`, and that a primitive with an animation (`dialog`, `dropdown-menu`...) needs `tw-animate-css` and its `@import` in `src/app/globals.css`, which the shadcn CLI does not write since the project owns that file.

**E5-S2. A TypeScript project for vendored code.** As someone working on the project, I want vendored files checked with shadcn's flags and my code with all of brutalway's, so that adding a component never makes `npm run check` fail on code I did not write.
- `tsconfig.third-party.json`, the references and the `tsc -b` script as above. An error in `src/` is still reported, an error in `third-party/` only if it fails with the relaxed flags.
- The `.tsbuildinfo` and declarations stay under `node_modules/.cache`, nothing new to gitignore.
- `@brutalway/tsconfig` ships `react-vite-third-party.json` with the two flags off, so the relaxed set is defined once.

**E5-S3. The other tools leave `third-party/` alone.** As someone working on the project, I want Prettier and knip set up as above, so that `--overwrite` gives the registry's file byte for byte and `npm run check` stays green.
- The matrix (E0-S4) runs with a component added after the scaffold, to catch a tool that starts reading `third-party/`.
- alint: a rule that `third-party/` only holds folders listed in a config file (`components.json` for shadcn), so nobody drops hand-written code there to escape the rules.

**E5-S4. Boundaries of the vendored folder.** As someone working on the project, I want `third-party/` to import nothing from `src/`, and the packages behind shadcn to be imported only from `third-party/`, so that swapping a primitive happens in one place.
- Rules in `@brutalway/dependency-cruiser-config`: `third-party-not-to-src`, and `third-party-packages-only-from-third-party` for `radix-ui` and `class-variance-authority`. Both tried on the test project: an import of `radix-ui` from `src/shared/lib/` and an import of `src/` from `third-party/shadcn/` are both reported.
- `cn` stays allowed in `src/`: it merges Tailwind classes, the app needs it for its own conditional classes, and swapping a primitive does not touch it.
- Code in `src/` may import `@third-party/shadcn/` from any layer, since `third-party/` imports nothing from the app.

**E5-S5. No hand edits.** As someone working on the project, I want an edit to a vendored file to be refused with what to do instead, so that the folder always matches the registry.
- `@brutalway/agent-hook` stops on a file under `third-party/`, with the message: run `npx shadcn add <name> --overwrite`, restyle in `src/app/globals.css` through tokens or `data-slot`, or wrap the primitive in `src/shared/ui/`. The hook lints after the edit today, so refusing it before means a `PreToolUse` entry next to the current one.
- Without that, the hook would fail on these files for a different reason: `oxlint <ignored file>` exits with 1 and "No files found to lint". The hook passes `--no-error-on-unmatched-pattern` or skips ignored files.
- Look into a CI check that compares `third-party/shadcn/` with the registry at the version of `shadcn` pinned in `package.json`.

**E5-S6. Primitives first.** As someone working on the project, I want an error when I write a raw `<button>` or `<input>` in `src/`, so that every control behaves the same way.
- New package `@brutalway/oxlint-config-shadcn`, added with `--ui shadcn`, as E3 and E4 add theirs.
- `button`, `input`, `textarea` and `select` are reported, the message names the primitive to import, and gives `npx shadcn add <name>` when it is not vendored yet.

**E5-S8. One icon library.** As someone working on the project, I want a single icon set, so that icons look alike.
- The one set in `components.json` (`lucide` by default), allowed in `src/`. Imports of `react-icons`, `@heroicons/*`, `@radix-ui/react-icons`, `@tabler/icons-react` and the other sets are reported by `@brutalway/oxlint-config-shadcn`.

**E5-S7, later. The docs list what is vendored.** A `docs/ui.md` table of each file of `third-party/shadcn/` and each component of `src/shared/ui/`, with a check that fails when a file and a row drift apart. No tool does that yet: it waits for a small generic one (a table in a `.md` against a glob), which E9 could use too.

Order: S0, then S1 with S2 and S3 (the option does not pass `npm run check` without them), then S4, then S6 with S8, then S5.

## E6. Translations

Source: Wizcard (`messages/en.json`, `messages/fr.json`, `eslint-plugin-i18next` with `no-literal-string` in `jsx-text-only` mode, turned on folder by folder).

Wizcard migrated to two languages one domain at a time, turning the rule on for each folder once it was done. For a new project the rule is on from the start.

The presenters exist once per styling value, so an option that rewrites their text would need four more sets of them. Every project goes through i18next instead: the default one with English only, and `--i18n` adds French and a language switch. The presenters call `t()` in every project and do not change with the option.

Messages are i18next's standard JSON, one file per language and namespace, which is what `i18next-cli`, the i18n Ally editor extension and translation platforms (Locize, Crowdin) read without setup: `src/app/locales/en/todoList.json`. There is one namespace per slice (`app`, `todoList`, `todoStats`), and `src/app/createI18n.ts` imports the files statically, so there is no HTTP backend, no Suspense and nothing new for the e2e tests. Features never import them: they call `useTranslation('todoList')`, so `features-not-to-app` still holds.

The checks come from two tools, both tried on the presenters of `--ui shadcn`:

- `eslint-plugin-i18next` runs as an Oxlint JS plugin. In `jsx-only` mode with `aria-label`, `placeholder`, `title` and `alt` listed and `should-validate-template` on, it reports the seven strings of `TodoInput.tsx` and `TodoItem.tsx`, `` aria-label={`Edit ${todo.title}`} `` included. Its message is generic ("disallow literal string") and cannot be changed, so the README of the config says what to do.
- `i18next-cli` (the official CLI) checks the message files: `types` generates the types of the keys from the JSON, so an unknown key is a tsc error, `status` fails when a key is missing in a language, and `status --unused` when no code uses a key. Its own `lint` found only four of the seven strings (no `placeholder`, no template), so it is not used for that.

The titles of `STARTER_TODOS` are data (with `--server-state` they come from the API) and stay as they are. `countLabel` gives way to i18next plurals (`_one`, `_other`), which French needs too. The message of `TodoDraftSchema` becomes a key, and `useTitleForm` returns the error already translated, so the presenters still get a string.

**E6-S0. Spike.** Done on a project made with the example, `--server-state` and `--forms` (plain CSS), with i18next 27.0.1, react-i18next 18.0.0, i18next-cli 1.87.0 and eslint-plugin-i18next 6.1.5. `npm run check`, the unit, component and e2e tests pass.
- Keys are typed: an unknown key and a missing `{{title}}` are both tsc errors. With the strict interpolation checks of i18next 27, `t()` refuses a union of keys when some of them take variables, so a value turned into a key has to be narrowed to the keys it can be.
- `i18next-cli types` writes a `.d.ts` with comments, an `export default interface` and double quotes, which Prettier and Oxlint refuse. It goes into `node_modules/.cache/i18next/` instead, like the types of CSS Modules in E2, listed in the `include` of both tsconfigs and written by `typecheck` before tsc.
- An exported `i18next` instance breaks the rule on exported constants, and importing a file for its side effect breaks `no-unassigned-import`. `src/app/createI18n.ts` exports `createI18n(language)`, `main.tsx` wraps the app in an `I18nextProvider`, and `initAsync: false` makes the init synchronous since the resources are imported. Component tests get the same instance through a Vitest setup file, `setI18n(createI18n())`.
- The message of `TodoDraftSchema` is a key of `TITLE_ERRORS` in `TodosConfig.ts`, and `useTitleForm` maps it with a helper typed `(typeof TITLE_ERRORS)[number] | undefined`, then calls `` t(`errors.${error}`) ``. `i18next-cli status --unused` resolves keys built that way, not keys narrowed by a type guard.
- `TodosConfig.ts` no longer imports `TodoFilter`: with the schema importing `TITLE_ERRORS`, that made a cycle through `TodosTypes.ts`. `TODO_FILTERS` becomes `['all', 'active', 'completed'] as const`, and the labels move to `filters.all`, `filters.active`, `filters.completed`.
- Without `countLabel.ts`, `src/shared/lib/` holds a single file, so check-tree moves `normalizeTitle.ts` to `src/shared/`, and alint then catches the path left in `docs/verifications.md`.
- knip reports `i18next.config.ts` as unused until it is an entry. It joins the root configs in the lint script and in `tsconfig.test.json`, with `vitest.setup.ts`.
- French plurals work as CLDR says: 0 takes the singular (`0 tâche restante`).
- The bundle grows by 17.6 kB gzipped (384 kB to 439 kB minified) for i18next, react-i18next and two languages.

**E6-S4. i18next in every project.** As someone creating a project, I want every visible string to go through i18next from the first commit, so that adding a language later means adding files, not rewriting components.
- `i18next` and `react-i18next` in every vite project, `createI18n()` in `src/app/createI18n.ts` and an `I18nextProvider` in `main.tsx`, `en` only by default. Each slice has its namespace in `src/app/locales/en/`.
- The presenters of every styling value call `t()`, and `vitest.setup.ts` gives component tests the same instance.
- Without the example, only `app` remains, with the title of the page.

**E6-S2. No visible literal.** As someone working on the project, I want an error when JSX holds visible text, so that no string is left untranslated.
- New package `@brutalway/oxlint-config-i18next`, in every vite project: `i18next/no-literal-string` in `jsx-only` mode, with `aria-label`, `placeholder`, `title` and `alt`, `should-validate-template` on, and an allowlist for symbols and numbers.

**E6-S3. Same keys in every language.** As someone working on the project, I want a check that fails when a key is missing in one language or unused, so that the message files do not drift.
- `i18next.config.ts` at the root. `typecheck` (and `prepare`, for a fresh clone) runs `i18next-cli types` into `node_modules/.cache/i18next/` before tsc, and `npm run check` runs `i18next-cli status` and `i18next-cli status --unused`.

**E6-S1. i18n as an option.** As someone creating a project, I want `--i18n`, so that the example comes in two languages with a switch.
- Adds `src/app/locales/fr/`, and `status` then checks that French is complete.
- Two buttons, EN and FR, with `aria-pressed` in the header (a `Button` with `--ui shadcn`). The first language comes from `navigator.languages`, the choice is kept in `localStorage`, and `<html lang>` and the `<title>` follow it.
- An e2e test switches to French and runs axe.

Order: S0, then S4 with S2 and S3 (the presenters change once, with the checks that keep them that way), then S1.

As built (S1): `src/features/language-switch/` holds the switch, `LanguagesConfig.ts` and `languageStorage.ts` (named `languagePreference.ts` until E7-S1 kept the browser storage in `xStorage.ts` files). With `createI18n.ts` already in `src/app/`, a second helper there made check-tree ask for a `lib/` folder, and a feature is where both the header and `main.tsx` can reach them. The switch exists once per styling value, like the presenters, and calls `changeLanguage` through a function that hands its promise to `reportError`, since `no-misused-promises` refuses a promise in `onClick`. The titles of the starter tasks stay in English.

As built (S2 to S4): the presenters of the four styling values and the three skeletons went through the same replacements, since their text is the same and only the markup differs. The skeleton overlay brings its own `createI18n.ts` and an `app.json` whose title is the project name. `eslint-plugin-i18next` gets its exclusions as strings, since a `RegExp` does not survive the Oxlint config: a string without any letter of the Latin, Greek, Cyrillic, Hebrew, Arabic, Japanese, Chinese or Korean scripts is left alone, so `·`, `%` and `×` pass. With `forms`, `TITLE_ERRORS` is added to `TodosConfig.ts` and `longTitle` to `todoList.json`, since the default project never shows that error and `status --unused` would report it.


## E7. More checks on React code

Source: bedrock's ESLint plugin and `.jscpd.json`, Wizcard's `sonarjs` setup.

These are rules, not options, except the coverage gate: they go into the shared Oxlint configs and apply to every project. Each one was checked against the example first, on a project with `css-modules`, `server-state`, `forms`, `i18n` and component tests.

What exists already: Oxlint has `react/no-array-index-key`, `Math.random()` during render is reported by `react/purity`, and `as unknown as` is reported by `typescript/no-unsafe-type-assertion`, which the TypeScript base already turns on. `no-restricted-globals` is native too.

`eslint-plugin-sonarjs` does not load as an Oxlint JS plugin: it ships its own TypeScript 6, but `ts-api-utils`, hoisted to the root of `node_modules`, finds the project's TypeScript 7, which has no JavaScript API, and crashes on `TypeFlags.Intrinsic`. The file of `cognitive-complexity` (`eslint-plugin-sonarjs/cjs/S3776/rule.js`) loads on its own, and a plugin of a few lines that only exports it runs as an Oxlint JS plugin with the same score (22 on the test function, nothing above 15 in the example). That keeps Sonar's own algorithm. The path is internal to the package, so the version is pinned exactly and a fixture test fails if the file moves.

jscpd with bedrock's settings (8 lines, 120 tokens, tests left out) finds no clone in the example. Vitest covers 56 % of its lines, since orchestrators, hooks and clients are covered by the e2e tests, as `docs/verifications.md` says. `TodoFilters.tsx` and `TodoStats.tsx` have no component test.

**E7-S1. Rules taken from bedrock.** As someone working on the project, I want the following mistakes reported, so that a review does not have to catch them.
- `react/no-array-index-key`, in `@brutalway/oxlint-config-react`.
- `localStorage` and `sessionStorage` only in an `xStorage.ts` file (`no-restricted-globals` with an override). `languagePreference.ts` from E6 becomes `languageStorage.ts`.
- No `useX.tsx`: a hook file is `.ts`, its JSX goes into a component.
- No formatting in a presenter: `Intl`, `toLocaleString`, `toLocaleDateString`, `toFixed`, `sort`, `filter` and `reduce` are reported in a component that is not an orchestrator. `map` stays allowed for rendering. The work moves to the orchestrator or a hook.
- An orchestrator (`XContainer`, `XLayout`, `XPage`) calls at least one hook, or it is a presenter with the wrong name.
- A component takes at most 6 props (`TodoItem` takes 4).

**E7-S2. No duplicated code.** As a maintainer, I want jscpd in `npm run check` with a threshold of 0 (bedrock's setting: 8 lines, 120 tokens, tests excluded), so that copy and paste is caught when it happens.
- In every vite and fastify project, no option: the example passes already.

**E7-S3. Coverage gate.** As a maintainer, I want `npm test` to fail under a coverage threshold, so that the tests keep up with the code.
- Option `--coverage`, off by default, which needs component tests. `@vitest/coverage-v8` with a 90 % threshold on what Vitest is meant to test: presenters, pure functions, selectors and stores. Orchestrators, hooks, clients and `src/app/` are left out, the e2e tests cover them.
- `TodoFilters.tsx` and `TodoStats.tsx` get their component tests.

**E7-S4. Cognitive complexity.** As someone working on the project, I want a function that is too hard to follow to be reported, so that it gets split.
- `sonarjs/cognitive-complexity` at 15 (Sonar's default) in `@brutalway/oxlint-config-typescript`, for vite and fastify, through the plugin above and an exact version of `eslint-plugin-sonarjs`.

Order: S4 and S1 (the configs), then S2, then S3.

As built: the S1 rules are `no-restricted-syntax` selectors in two more plugin instances of `@brutalway/oxlint-config-react` (`component-roles`, `hook-files`), next to the native `react/no-array-index-key` and `no-restricted-globals`. The 7th prop of an `XProps` type is reported (`:nth-child(7)`), and an orchestrator without a hook call through `:has()`. Turning on cognitive complexity in the repository reported `resolveAnswers.ts` at 18, which now hands each answer to `givenAnswer` or `pickedAnswer`. The 90 % threshold first failed on branches (84 %): `TodoEditor.tsx`, a done `TodoItem.tsx` and `setFilter` had no test, and now do. `no-literal-string` is off in `*.test.tsx`, where a test passes literal props. A project without the example and with `coverage` has nearly nothing to measure and passes.

## E8. Smaller options

The order follows how much each story touches: S3 goes into every project, S1 and S2 are options, S4 assembles what the others leave.

**E8-S3. Security headers.** Source: Wizcard (`next.config.ts`: CSP in report-only, HSTS, `X-Frame-Options`, `Permissions-Policy`). As someone deploying the app, I want strict headers from the start, so that I loosen them on purpose rather than write them from nothing.
- In every vite project, no option, and the CSP is enforced rather than report-only: the build of Vite has no inline script or style and the fonts are served from the app, so `default-src 'self'` holds. React sets the `style` prop through the DOM, which a CSP does not block.
- The headers are written once, in `securityHeaders.ts` at the root: a Vite plugin sends them from `vite preview` and writes them into `dist/_headers` at build time, the format of Netlify and Cloudflare Pages. The dev server sends none, since its HMR client needs inline code.
- `@brutalway/playwright-fixtures` fails a test when the browser reports a CSP violation, as it does for a page error.
- As built: the fixture listens to the console errors Chromium writes for a violation. The longer `include` of `tsconfig.test.json` no longer fits on one line, so Prettier spreads it, and an option that removes entries makes it fit again: the CLI now formats every `tsconfig*.json` after its edits, as it did for `knip.json`.

**E8-S1. React Compiler.** Source: Wizcard (`babel-plugin-react-compiler` installed). As someone creating a project, I want `--react-compiler`, so that I do not write `useMemo` and `useCallback` by hand.
- `@vitejs/plugin-react` 6 offers two ways: a Rust port (`compiler: true`), marked experimental in its README, and the official Babel plugin. The option takes the Babel one: `babel-plugin-react-compiler` 1.0 through `@rolldown/plugin-babel` and `reactCompilerPreset()` in `vite.config.ts`.
- With the option, importing `useMemo`, `useCallback` or `memo` from `react` is reported, with a message saying the compiler does it.
- As built: `babel-plugin-react-compiler` depends on `@babel/types` 7, so `@babel/core` is 7.29 rather than 8. Under Vitest the compiler first made `--coverage` fail on branches (46 % to 79 %), counting the checks of its memo caches, so `vite.config.ts` only adds it when `VITEST` is not set: the e2e tests still run the compiled build. The rule of `no-restricted-imports` is written the way Prettier spreads it, since it no longer fits on one line.

**E8-S2. Product analytics.** Source: Wizcard (PostHog, client and server). As someone creating a project, I want `--analytics`, so that events are sent from one module.
- A choice option: `none` (the default), `module` and `posthog`. With `module`, `src/shared/analyticsClient.ts` exports `track(name, properties)` and `subscribe(listener)`, with no dependency: the project plugs its own tool into it. With `posthog`, the same functions are written with `posthog-js`, the key is read from `import.meta.env`, and nothing is sent without it, in the e2e tests either. External loading is turned off, and the CSP lets the PostHog host through `connect-src`.
- The example tracks `todo_added`. A dependency-cruiser rule keeps `posthog-js` and the other analytics SDKs inside `analyticsClient.ts`.
- As built: the file exports an `analyticsClient` object, so it is named after its export, follows the `xClient.ts` convention of the modules that talk to a service (presenters cannot import it, coverage leaves it out), and the example calls it from `TodoListLayout.tsx`, the same line in every styling value. Without a tool, `module` dispatches an `analytics` event on `window` rather than doing nothing, so the events can be seen and listened to. Without the example nothing calls the client, so it is a knip entry.

**E8-S4. Instructions for agents.** Source: bedrock (`AGENTS.md`, `.agents/rules/*.md`), Wizcard (`CLAUDE.md`, `.clinerules`, `.windsurfrules`). As someone working with an agent other than Claude Code, I want an `AGENTS.md` that matches the options I picked, so that the agent knows which tool to use for what before it writes code.
- `AGENTS.md` in both templates, short: the commands, what `npm run check` runs, and pointers to `docs/verifications.md` and `docs/architecture.md`. Each option adds or removes its own lines, like it does in the README. `CLAUDE.md` imports it with `@AGENTS.md`.
- The lint messages stay as they are: they already say what to change.
- As built: `AGENTS.md` lists five conventions in the default vite project and up to six more with options, and alint checks its paths, so a renamed file cannot leave it pointing nowhere.

## E9. Docs that stay readable

A Markdown file grows one section at a time until nobody reads it to the end. `mdsplit` splits a file along its headings but checks nothing and leaves internal links broken. markdownlint and remark-lint only limit line length, not file length.

The tool is `@brutalway/check-doc-length`, with the command `check-doc-length`, named like `check-tree` after what it checks: `tldr` is already the name of a well-known CLI (tldr-pages). It reads Markdown with `mdast-util-from-markdown`, the parser of remark, which gives the headings, the links and their positions, then cuts the source text at those positions, so the content is copied byte for byte, front matter and code blocks included. Anchors are computed with `github-slugger`, the way GitHub does.

`docs/roadmap.md` is about 370 lines, above the 300 lines allowed by default, so the tool's first real use is to split it.

**E9-S1. Check and split long docs.** As someone maintaining the docs of a project, I want a check that fails when a Markdown file gets too long, and a command that splits it into folders along its headings, so that a long doc gets split before it becomes a wall of text. Tracked in [#49](https://github.com/Elnop/brutalway/issues/49).
- `check-doc-length` lists the Markdown files above the threshold and exits non-zero. `check-doc-length split <file>` prints the tree it would write, and writes it with `--write`.
- Settings under `docLength` in `package.json`, overridable on the command line: `maxLines` (300), the heading depth that becomes a file (2) and the one that becomes a folder, included and ignored globs, and the file naming (slug of the heading, with an optional `01-` order prefix).
- Each folder gets an index with the text before the first heading and links to its children. It is named `README.md` by default, since GitHub shows that file when a folder is opened, and the name is configurable.
- A split file starts with its own heading moved up to `#`. Links between sections, and links from the other Markdown files of the project to an anchor that moved, are rewritten to the new path.
- In `npm run check` of the repository and of both templates.

**E9-S2. The site follows split docs.** As someone reading the docs on brutalway.elnop.dev, I want the files of a split doc to show up, so that splitting a doc does not hide it.
- The site lists `docs/` through the GitHub contents API, which does not go into subfolders: it walks them too.
- `docs/roadmap.md` is split with the tool, and the links of `README.md` and of the issues' bodies that point to it are updated.
