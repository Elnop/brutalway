# create-brutal

Creates a project from one of the [brutalway](https://github.com/Elnop/brutalway) templates and lets you drop the parts you do not need. Whatever you pick, the project passes `npm run check` on the first run.

## Install

```sh
npm create brutal my-app
```

Node 26 is required, like the templates.

Besides the stack and its options, the CLI asks whether to run `git init` and `npm install`. Without git, the `prepare` script that installs the pre-commit hook is removed. The next steps tell you how to set it up later.

## Usage

### Create a project without questions

A yes/no option has the flags `--<option>` and `--no-<option>`, an option with several values takes `--<option> <value>`. `--yes` takes the default for every question left:

```sh
npm create brutal my-app -- --stack vite --styling tailwind --no-e2e --yes
```

### Reuse the same answers

A preset file holds the same answers, and flags override it:

```json
{ "stack": "vite", "git": true, "install": true, "options": { "styling": "tailwind", "e2e": false } }
```

```sh
npm create brutal my-app -- --preset minimal.json --yes
```

### List the stacks and their options

```sh
npm create brutal -- --help
```

It lists the stacks, their options, the values of each option and its default.

## Reference

A combination that cannot work stops the CLI before anything is written, with a message naming both options: `--no-zustand cannot be used with --example`.

### Every stack

| Option | Default | What it keeps |
|---|---|---|
| `example` | yes | the todo list |
| `claude-hook` | yes | the Claude Code hook that lints each edited file |
| `ci` | yes | the GitHub Actions workflow that runs the checks |

Without `example`, the structure stays with empty `src/features/` and `src/shared-features/` folders.

- vite: `App.tsx` only shows the project name, and only the `app` namespace of the messages remains
- next: `src/app/page.tsx` only shows the project name, which is also the title of the page, and only the `app` namespace remains
- react-native: `src/app/screens/index.tsx` only shows the project name, and `src/shared/theme/` keeps the theme and the `Button`
- fastify: `buildApp.ts` only creates the server, and the Swagger UI, if kept, is titled with the project name
- package: the `"."` export is `src/greet.ts`, a single `greet` function to replace, since the lint rules refuse an empty module

### Vite

[template-vite](https://github.com/Elnop/brutalway/tree/main/templates/vite). Every vite project goes through i18next, whatever its options: the texts are in `src/app/locales/en/` and the components call `t()`.

| Option | Values | Default | What you get |
|---|---|---|---|
| `zustand` | yes, no | yes | a zustand store, removed only together with `example` |
| `styling` | `css`, `css-modules`, `tailwind` | `css` | how the components are styled |
| `ui` | `none`, `shadcn` | `none` | the shadcn/ui primitives, with `tailwind` only |
| `dark-theme` | yes, no | no | a dark value for each color token, following the system |
| `server-state` | yes, no | no | the todos read and written through TanStack Query |
| `forms` | yes, no | no | react-hook-form with Zod on the title fields |
| `i18n` | yes, no | no | French and a language switch |
| `react-compiler` | yes, no | no | memoization at build time instead of `useMemo` and `useCallback` |
| `analytics` | `none`, `module`, `posthog` | `none` | one module through which every event leaves the app |
| `component-tests` | yes, no | yes | Vitest tests of the presenters in Chromium |
| `coverage` | yes, no | no | `npm test` fails under 90 % coverage of presenters, pure functions, selectors and stores |
| `e2e` | yes, no | yes | Playwright tests on the built app |

#### styling

- `css`: one stylesheet per feature next to `src/app/globals.css`, checked by stylelint
- `css-modules`: an `X.module.css` next to each component, typed by `happy-css-modules` so `styles.typo` fails `tsc`. `src/app/globals.css` keeps the tokens, the reset and the shared `button` classes
- `tailwind`: Tailwind v4 classes in the components, and the colors, fonts and shadows declared under `@theme` in `src/app/globals.css`, with Tailwind's own palette removed. `@brutalway/oxlint-config-tailwind` reports a color outside these tokens, a heading without `font-display` and any `dark:` class. Prettier sorts the classes

The todo list looks the same with all three.

#### ui

With `shadcn`, the Button, Input, Checkbox and Card of [shadcn/ui](https://ui.shadcn.com) are copied into `third-party/shadcn/` as the registry wrote them, and `src/` imports them through `@third-party/shadcn/`. `npx shadcn add <name>` adds the next one.

- `third-party/` has its own TypeScript project, `tsconfig.third-party.json`, with the two flags shadcn's code breaks turned off. `typecheck` becomes `tsc -b`, so `src/` keeps every flag
- Prettier, Oxlint and check-tree skip `third-party/`, knip takes its files as entries, and alint refuses any folder there but `shadcn/`
- in `src/`, `@brutalway/oxlint-config-shadcn` reports a raw `<button>`, `<input>`, `<select>` or `<textarea>` and any icon set but `lucide-react`
- `@brutalway/dependency-cruiser-config/shadcn` keeps `radix-ui` and `class-variance-authority` inside `third-party/`, which imports nothing from `src/`
- the look comes from `src/app/globals.css`: shadcn's colors mapped onto the series' ones under `@theme inline`, thick borders, square corners, hard shadows and one rule on `[data-slot='button']`

#### server-state

The example talks to the routes of template-fastify. `todosClient.ts` parses each response with Zod, the API filters the list and `GET /stats` gives the counters, so the zustand store only keeps the filter.

- without `API_URL`, `devApi.ts` answers `/api` from an in-memory list in `npm run dev` and `vite preview`, one list per browser
- with `API_URL=http://localhost:3000`, it proxies `/api` to the API
- without the example, you get the `QueryClientProvider`, the cache profiles of `src/shared/QueryConfig.ts` and `@brutalway/oxlint-config-tanstack-query`

#### forms

The title fields go through `react-hook-form` with `zodResolver(TodoDraftSchema)`. `@brutalway/oxlint-config-react-hook-form` reports a `useForm` without that resolver and any validation passed to `register` or a `Controller`. With `server-state`, `TodoDraftSchema` joins the API schemas.

Without it, the components are the same: both versions read their field through `useTitleForm.ts` and show "The title is blank" under the field.

#### i18n

The messages of `src/app/locales/fr/` sit next to the English ones, and English and Français buttons in the header switch between them. The choice is saved in `localStorage`, and `<html lang>` and the page title follow it. `i18next-cli status` fails when French misses a key, and with `e2e`, `e2e/language.spec.ts` runs axe in French.

#### dark-theme

`src/app/globals.css` gives each color token a dark value under `@media (prefers-color-scheme: dark)`, so the classes and stylesheets stay the same. The e2e tests also run axe in dark mode.

#### react-compiler

`vite.config.ts` runs the React Compiler through Babel, and `useMemo`, `useCallback` and `memo` imported from `react` are reported. Vitest runs without it, since its memo caches add branches the tests would have to reach. The e2e tests run the compiled build.

#### analytics

Both values write `src/shared/analyticsClient.ts`, the only place where events leave the app, and the example calls `analyticsClient.track('todo_added')`. dependency-cruiser keeps analytics SDKs inside that file.

- `module`: the client dispatches an `analytics` event on `window`, for whatever tool you plug in
- `posthog`: the client sends the events to PostHog when `VITE_POSTHOG_KEY` is set, and `securityHeaders.ts` lets the PostHog hosts through

### Next.js

[template-next](https://github.com/Elnop/brutalway/tree/main/templates/next). The same todo list on the App Router: the route files of `src/app/` are server components, and the orchestrators that read the zustand store start with `'use client'`. It takes the options of the vite stack, with the same values and defaults, except `server-state`.

| Option | Difference with vite |
|---|---|
| `styling` | `tailwind` goes through `@tailwindcss/postcss` and `postcss.config.mjs`. With `css-modules`, the styles of the page are in `src/app/page.module.css` |
| `ui` | the same vendored files and `components.json`, and the alias `@third-party/` is also declared in `vitest.config.ts` |
| `i18n` | the language is saved in a `language` cookie instead of `localStorage`. `src/features/language-switch/lib/requestLanguage.ts` reads it on the server, or the first language of `Accept-Language` the project has, so the page, `<html lang>` and the title come in that language from the server. The switch sets the cookie and calls `router.refresh()` |
| `react-compiler` | `reactCompiler: true` in `next.config.ts`, with `babel-plugin-react-compiler` |
| `analytics` | with `posthog`, the key is `NEXT_PUBLIC_POSTHOG_KEY`, nothing is sent during server rendering, and `src/proxy.ts` lets the PostHog hosts through its Content Security Policy |
| `coverage` | `src/proxy.ts` is left out instead of `src/main.tsx` |

`server-state` is not offered: on Next.js a server component can read the data itself and hand it to the client components, so TanStack Query in the browser is not the default way any more. The example keeps its todos in the browser, in zustand, like on vite.

### React Native

[template-react-native](https://github.com/Elnop/brutalway/tree/main/templates/react-native). The same todo list on Expo and Expo Router, for iOS, Android and the web build. `app.json` takes the name of the project, and the identifier of the app on the stores becomes `com.example.<name>`, without its dashes: change it before the first build.

| Option | Difference with vite |
|---|---|
| `dark-theme` | `src/shared/theme/ThemeConfig.ts` holds a light and a dark set of colors and picks one through `Appearance` when the app starts, and `app.json` follows the system with `expo-system-ui` |
| `server-state` | the client calls `EXPO_PUBLIC_API_URL`, or `http://localhost:3000`, where template-fastify answers: there is no dev server to mock the API from, as Vite does |
| `forms` | the field goes through `useController`, since React Native has no `<form>` and no `register` |
| `i18n` | the language is saved in AsyncStorage, the first one comes from the device through `expo-localization`, and the switch sits under the title |
| `react-compiler` | `experiments.reactCompiler` in `app.json`, with `babel-plugin-react-compiler` |
| `analytics` | `module` emits an event on `DeviceEventEmitter`. `posthog` sends through `posthog-react-native` when `EXPO_PUBLIC_POSTHOG_KEY` is set |
| `component-tests` | React Native Testing Library on Jest, in Node |
| `coverage` | the thresholds sit under `jest` in `package.json` |

`expo-go`, off by default, runs the app in Expo Go instead of a development build: it drops `expo-dev-client`, `eas.json` and `scripts/phone.ts`, and `npm start` prints the QR code to scan. Expo Go cannot load a native library outside the Expo SDK, so a project that needs one moves to a development build.

Tailwind, CSS Modules, shadcn/ui and the security headers are not offered: React Native has no CSS, the styles come from the theme object, and an app sends no HTTP headers of its own. There are no e2e tests either, since they need a simulator.

### Fastify

[template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify)

| Option | Default | What it keeps |
|---|---|---|
| `swagger` | yes | a Swagger UI on `/docs` |
| `database` | yes | `node:sqlite` and the `DATABASE_PATH` variable |

Without `database`, the example keeps its todos in a `Map`. `todosQueries.ts` has the same functions, so the services and the routes do not change. Without `swagger`, `@fastify/swagger` and `openapi-types` stay installed, because `fastify-type-provider-zod` needs them.

### Package

[template-package](https://github.com/Elnop/brutalway/tree/main/templates/package). The project starts at version 0.1.0 and is not `private`, so it can be published.

| Option | Default | What it keeps |
|---|---|---|
| `bin` | yes | a command next to the export |
| `release` | yes | publishing to npm with changesets and a GitHub workflow |

- `bin` keeps the `todo` command, or, without the example, a `src/cli.ts` that prints the project name under a command of the same name. Without it, `package.json` has no `bin` and only the export is built and tested
- `release` keeps `@changesets/cli`, `.changeset/`, the `release` script and `.github/workflows/release.yml`, which opens the release pull request and publishes each merged version to npm through trusted publishing, with provenance

## How it works

Each version of the package downloads the templates from `templates/` in this repository, at the last commit that changed each one when the package was built (`dist/stackRefs.json`). A given version always produces the same project.

Each stack is described in `src/features/stacks/lib/viteStack.ts`, `src/features/stacks/lib/fastifyStack.ts` or `src/features/stacks/lib/packageStack.ts`. An option lists what it changes:

- files to remove, and files to copy from `overlays/`
- text to replace, or to insert `after` or `before` an anchor, in the docs and configs
- scripts and dependencies to drop or add

A replacement or an anchor that cannot be found stops the CLI with the file name and the missing text, so a project is never left half edited.

An option is yes/no with a `default` of `true` or `false`, or a choice between `values`. An option that defaults to `false` only adds things: an overlay, dependencies, doc lines. An option or a value can declare `requires` (other options are forced to these values) and `conflicts` (other options cannot take them). The CLI skips a question whose answer is already decided and only offers the values that still work.

The project gets no `version` in `package.json`, unless the stack sets `projectVersion`, as `package` does.

## Developing

From the root of the repository:

```sh
npm run bootstrap
npm run build
node packages/tools/create-brutal/src/cli.ts ../my-app --local
npm run matrix
```

`--local` copies the templates from `templates/` in this checkout, local changes included.

`npm run matrix` creates a set of projects covering every pair of option values that can happen together, installs each one and runs `npm run check` and `npm test`. Options marked `independent` are switched on and off without being crossed with the others. The run ends with the number of projects and the time it took, also written to the GitHub job summary.

| Flag | Effect |
|---|---|
| `--all` | every valid combination instead of the pairs |
| `--only react-compiler=true,example=true` | fixes these values and covers the pairs of the other options |
| `--e2e` | adds `npm run e2e`. Use it with `--jobs 1`, Playwright needs port 4173 |
| `--keep` | keeps the projects in `brutal-matrix/` under the system temp folder |
| `--local-packages` | installs the `@brutalway/*` packages packed from this checkout. Run `npm run build` first |

With `ui` set to `shadcn`, each project first adds `dialog` and `sonner` with the shadcn CLI, so a tool that starts reading `third-party/` fails the run.

`node packages/tools/create-brutal/scripts/vendorShadcn.ts` writes the files of `overlays/vite/shadcn/third-party/shadcn/` again with the shadcn CLI, at the version and with the primitives set in `packages/tools/create-brutal/src/features/stacks/configs/shadcnConfig.ts`.
