# create-brutal

## 0.7.1

### Patch Changes

- Projects start from the templates with their lockfiles on the @brutalway packages of the last release, so `npm ci` works in a new project before its first `npm install`.

## 0.7.0

### Minor Changes

- a0fbb5d: Each vite option writes its own lines of `AGENTS.md`, as it does in the README: the styling value, shadcn/ui, server state, forms, French, the React Compiler and analytics each add or replace a convention, and a project without e2e drops `npm run e2e`.
- 854b682: New `analytics` option on vite: `none` by default, `module` or `posthog`. Both write `src/shared/analyticsClient.ts`, the only place events leave the app (`analyticsClient.track('todo_added')`, which the example calls when a task is added). With `module` it dispatches an `analytics` event on `window` for any tool to plug in. With `posthog` it sends to PostHog when `VITE_POSTHOG_KEY` is set, and nothing otherwise, with autocapture and remote scripts off and the PostHog hosts allowed in `connect-src`.
  
  `@brutalway/dependency-cruiser-config` adds `analytics-in-client`: `posthog-js`, `@segment/analytics-next`, `mixpanel-browser`, `@amplitude/analytics-browser`, `react-ga4` and `@vercel/analytics` are only imported from an `analyticsClient.ts`.
- afbf814: New `css-modules` value for the `styling` option on vite: each component of the example gets its own `X.module.css` next to it, and `happy-css-modules` writes the types of the class names so `styles.typo` fails `tsc`. Projects in plain CSS or CSS Modules now run stylelint with `@brutalway/stylelint-config`, a new package with three rules: `color-tokens` (a color is a `var()` of a custom property declared in `src/app/globals.css`, with the closest tokens in the message), `module-next-to-component` and `no-unused-class`. In a `.module.css`, classes are camelCase. check-tree leaves `X.module.css` next to its component instead of asking to move it into `styles/`, and the agent hook runs stylelint on each edited stylesheet.
- a36a8fb: New `forms` option on vite, off by default: the title fields of the example go through `react-hook-form` with `zodResolver(TodoDraftSchema)`. `@brutalway/oxlint-config-react-hook-form` is a new package with `zod-resolver` (every `useForm` takes `resolver: zodResolver(...)`) and `validation-in-schema` (no validation passed to `register`, `useController` or a `Controller`). With `server-state`, `TodoDraftSchema` joins the API schemas and `todosClient.create` takes its inferred type. The CLI now writes `knip.json` the way Prettier formats it, so a long `ignoreDependencies` list no longer fails `prettier --check`.
- a916a80: New `i18n` option on vite, off by default: the project comes in English and French, with English and Français buttons in the header (a `Button` with `--ui shadcn`). `src/features/language-switch/` holds the switch, the list of languages and `languageStorage.ts`, which starts from the language saved in `localStorage`, or else the first language of the browser the project has, and keeps `<html lang>` and the title of the page in line. `i18next-cli status` then checks that French has every key, and with e2e, `e2e/language.spec.ts` switches to French, runs axe and reloads.
- 583202b: Every vite project now goes through i18next, whatever its options: the presenters of each styling value call `t()`, and a project without the example keeps an `app` namespace with its title. With `forms`, the messages of `TodoDraftSchema` are keys listed in `TITLE_ERRORS`, translated by `useTitleForm`.
  
  `@brutalway/oxlint-config-i18next` is a new package that runs `no-literal-string` from `eslint-plugin-i18next` as an Oxlint JS plugin: visible text in JSX, in `aria-label`, `aria-description`, `placeholder`, `title` and `alt`, and in template literals is reported, while a string without letters (`42%`, `×`) is not.
- 66a62bf: New `package` stack, from template-package: a standalone npm package with the todo list as its `"."` export and a `todo` bin. Its options are `example` (without it, `src/greet.ts` as the export and, with `bin`, a `src/cli.ts` named after the project), `bin`, `release` (changesets, a `release` script and a workflow publishing to npm with trusted publishing and provenance), `claude-hook` and `ci`. The project starts at version 0.1.0, without `private`, through the new `projectVersion` field of a stack.
- f1b60f3: `@brutalway/oxlint-config-typescript` reports a function whose cognitive complexity is above 15 with Sonar's own rule, `sonarjs/cognitive-complexity`. The whole `eslint-plugin-sonarjs` does not load under Oxlint with TypeScript 7, so a small plugin loads the file of that rule alone, from an exact version of the package.
  
  `@brutalway/oxlint-config-react` adds rules taken from bedrock: no array index as a `key`, `localStorage` and `sessionStorage` only in an `xStorage.ts` file, no `useX.tsx` hook file, no formatting (`toFixed`, `Intl`, `sort`, `filter`, `reduce`...) in a presenter, an orchestrator that calls at least one hook, and at most 6 props per component.
  
  `@brutalway/oxlint-config-i18next` leaves test files alone, since they pass literal props to what they render.
  
  New `coverage` option on vite, off by default, which needs component tests: `npm test` runs `vitest run --coverage` and fails under 90 % of presenters, pure functions, selectors and stores. With `i18n`, `LanguageSwitch.tsx` gets its component test, and `languagePreference.ts` becomes `languageStorage.ts`.
- fde3a22: New `react-compiler` option on vite, off by default: `vite.config.ts` runs `babel-plugin-react-compiler` 1.0 through `@rolldown/plugin-babel` and `reactCompilerPreset()`, outside Vitest, and `oxlint.config.ts` reports `useMemo`, `useCallback` and `memo` imported from `react`.
- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.
  
  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.
- b7940fa: New `ui` option on vite, `none` by default. `--ui shadcn` (with `--styling tailwind`) copies the Button, Input, Checkbox and Card of shadcn/ui into `third-party/shadcn/`, outside `src/`, and the example uses them. `components.json` points every alias of the shadcn CLI to `@third-party/shadcn`, so `npx shadcn add <name>` writes there too. The vendored files are checked by a TypeScript project of their own, `tsconfig.third-party.json`, referenced by the app and built with `tsc -b`. Prettier, Oxlint and check-tree skip the folder, knip takes its files as entries, and alint refuses any folder in `third-party/` but `shadcn/`. The tokens of `src/app/globals.css` give the primitives the look of the series without touching their files.
  
  `@brutalway/tsconfig` ships `react-vite-third-party.json`: `react-vite.json` without `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`, for code copied from a registry.
  
  `@brutalway/dependency-cruiser-config/shadcn` extends the layers with `third-party-not-to-src` and `third-party-packages-only-from-third-party`: vendored code imports nothing from the app, and `radix-ui` and `class-variance-authority` are only imported from `third-party/`. Projects made with `--ui shadcn` use it and run `depcruise src third-party`.
  
  `@brutalway/oxlint-config-shadcn` is a new package with `primitives-first` (no raw `<button>`, `<input>`, `<select>` or `<textarea>`, the message names the primitive and the `npx shadcn add` command) and `one-icon-library` (icons only from `lucide-react`). Projects made with `--ui shadcn` extend it.
  
  `@brutalway/agent-hook` takes `--vendored <folder>`: the `PostToolUse` hook runs no check on a file there, and the same command as a `PreToolUse` hook refuses the edit with what to do instead (`npx shadcn add <name> --overwrite`, the tokens or a `data-slot` rule in `src/app/globals.css`, a wrapper in `src/`). Projects made with `--ui shadcn` and the Claude Code hook get both.

### Patch Changes

- 9f58866: `test` from `@brutalway/playwright-fixtures` also fails when the browser reports a violation of the page's Content Security Policy. The CLI formats every `tsconfig*.json` of the project the way Prettier does after its edits, as it already did for `knip.json`, since an option can make a list fit on one line again.
- ae69c73: With `react-compiler`, the example without `server-state` no longer wraps its visible todos in `useMemo`, which the option reports. `npm run matrix -- --only a=b,c=d` fixes some values in every project and covers the pairs of the other options: pairs alone never built that combination.

## 0.6.0

### Minor Changes

- 6b54a39: Options can have several values (`--styling tailwind`, `"styling": "tailwind"` in a preset), default to off and add files, dependencies and doc lines, and declare `conflicts` next to `requires`. A combination that cannot work stops the CLI before anything is written. `--help` lists the values and the default of each option.
- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.

## 0.5.1

### Patch Changes

- c4b03ab: Generated projects leave out the release setup of the templates: `.changeset/`, `CHANGELOG.md`, `.github/workflows/release.yml`, `@changesets/cli` and the `version` field.
- eefe611: The templates are downloaded from `templates/` in the brutalway repository. The template-vite and template-fastify repositories are no longer updated.

## 0.5.0

### Minor Changes

- Generated projects use the `@brutalway/*` packages instead of `@elnop/*`, and their docs point to BRUTAL way.
