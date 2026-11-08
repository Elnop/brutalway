# E6. Translations

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
