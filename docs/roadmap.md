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
| 3 | E5, E6 | shadcn/ui needs Tailwind, i18n touches every string of the example |
| 4 | E7, E8 | smaller options, each independent from the rest |

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

Wizcard gives each component a `.module.css` next to it. A component with a stylesheet gets its own folder, one without stays a flat file. That is close to brutalway's "one file stays at the root, two or more move into a folder" rule, so it fits without new concepts.

**E2-S1. CSS Modules as a styling value.** As someone creating a project, I want `--styling css-modules`, so that styles are scoped to their component without a utility framework.
- The example uses `TodoItem.module.css` and friends, `globals.css` only keeps the tokens and the reset.
- Typed class names (`vite-css-modules` or a generated `.d.ts`), an unknown class is a tsc error.

**E2-S2. A stylesheet sits next to its component.** As someone working on the project, I want check-tree to tell me when `X.module.css` has no `X.tsx` beside it, so that no stylesheet is left behind after a rename.
- New check-tree rule, plus knip catching a class that no component uses.

## E3. Server state with TanStack Query

Source: bedrock (`.agents/rules/state.md`, `lib/query/keys.ts`, `lib/query/stale-times.ts`, semgrep rules `no-inline-query-key`, `no-magic-stale-time`, `no-fetch-in-use-effect`).

bedrock splits state by what it is: data from an API goes through TanStack Query, UI state goes into zustand, and a store must never hold server data. Query keys come from a `xKeys` factory, cache windows come from named profiles. The series already has an API with the same todo list (template-fastify), so the example can talk to it.

**E3-S1. TanStack Query as an option.** As someone creating a project, I want `--server-state`, so that the app reads and writes its data through an API.
- The example reads and writes todos through `@tanstack/react-query` against the routes of template-fastify. A mock (MSW) answers in tests and in `npm run dev` when no API runs.
- zustand keeps the filter only. With the option off, the example stays as it is today.

**E3-S2. Query keys from a factory.** As someone working on the project, I want an error when I write a query key inline, so that an invalidation never misses its query.
- Keys live in `xKeys.ts`, which only exports `xKeys`. Rule in a new `@brutalway/oxlint-config-tanstack-query`: `queryKey` and `invalidateQueries` only take a call or a member of an `xKeys` object.

**E3-S3. Named cache windows.** As someone working on the project, I want `staleTime` and `gcTime` to come from named profiles, so that the cache can be tuned from one file.
- `QueryConfig.ts` holds the profiles, a number literal for `staleTime` is reported.

**E3-S4. No fetch in an effect, no server data in a store.** As someone working on the project, I want an error when I call `fetch` in `useEffect` or put API types in a zustand store, so that each kind of state stays with its tool.
- Lint rule on `fetch` inside `useEffect`. dependency-cruiser rule: a store file imports no `xApi.ts` and no query hook.
- Requests live in `xApi.ts` files, queries and mutations in `hooks/`, and only orchestrators call them (presenters already import no store, the same rule extends to query hooks).

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

bedrock vendors the whole shadcn library, then forbids raw `<button>`, `<input>`, `<select>` and hand-made cards in its own code. A script fails when the list of components in the docs drifts from the files. Vendored components break almost every brutalway rule (several exports per file, kebab-case names, comments), so they need a folder of their own that the rules skip.

**E5-S1. shadcn/ui as an option.** As someone creating a project, I want `--ui shadcn`, so that I start with accessible primitives styled with the series' tokens.
- Requires `--styling tailwind` (E0-S3). Only the primitives the example uses are vendored (Button, Input, Checkbox, Card), restyled with the neo-brutalist tokens.
- `components.json` points to `src/shared/ui/`. That folder is excluded from oxlint, check-tree and knip, and dependency-cruiser checks that it imports nothing above `shared/`.
- The README explains how to add one with `npx shadcn add`.

**E5-S2. Primitives first.** As someone working on the project, I want an error when I write a raw `<button>` or `<input>` outside `src/shared/ui/`, so that every control behaves the same way.
- Lint rule with the list of tags and the primitive to use for each.

**E5-S3. The docs list what is vendored.** As someone (or an agent) arriving on the project, I want a table of the available primitives, so that I use one instead of writing it again.
- `docs/ui.md` lists each file of `src/shared/ui/`. A check fails when a file is missing from the table or a row has no file.

**E5-S4. One icon library.** As someone working on the project, I want a single icon set, so that icons look alike.
- One library picked by the template, imports of the others reported outside `src/shared/ui/`.

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
