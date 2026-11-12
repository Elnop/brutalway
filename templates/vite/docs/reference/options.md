# Options

`npm create brutal` creates a project from this template and asks one question per option below. Each answer adds or removes files, dependencies and scripts, and edits the docs to match, so whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app -- --stack vite
```

## Create a project without questions

A yes/no option takes `--<option>` or `--no-<option>`, an option with several values takes `--<option> <value>`, and `--yes` takes the default of every question left:

```sh
npm create brutal my-app -- --stack vite --styling tailwind --ui shadcn --no-e2e --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "vite", "git": true, "install": true, "options": { "styling": "tailwind", "i18n": true } }
```

```sh
npm create brutal my-app -- --preset vite.json --yes
```

## Every option

| Flag | Values | Default | Cannot be used with |
|---|---|---|---|
| `--[no-]example` | yes, no | yes | `--example` with `--no-zustand` |
| `--[no-]zustand` | yes, no | yes | `--no-zustand` with `--example` |
| `--styling` | `css`, `css-modules`, `tailwind` | `css` | `--styling css` with `--ui shadcn`, `--styling css-modules` with `--ui shadcn` |
| `--ui` | `none`, `shadcn` | `none` | `--ui shadcn` with `--styling css`, `--ui shadcn` with `--styling css-modules` |
| `--[no-]dark-theme` | yes, no | no |  |
| `--[no-]server-state` | yes, no | no |  |
| `--[no-]forms` | yes, no | no |  |
| `--[no-]i18n` | yes, no | no |  |
| `--[no-]react-compiler` | yes, no | no |  |
| `--analytics` | `none`, `module`, `posthog` | `none` |  |
| `--[no-]component-tests` | yes, no | yes | `--no-component-tests` with `--coverage` |
| `--[no-]coverage` | yes, no | no | `--coverage` with `--no-component-tests` |
| `--[no-]e2e` | yes, no | yes |  |
| `--[no-]claude-hook` | yes, no | yes |  |
| `--[no-]ci` | yes, no | yes |  |

A combination from the last column stops the CLI before anything is written, with a message naming both flags.

`example`, `claude-hook` and `ci`, along with `git` and `install`, work the same on every stack and are described in the [create-brutal reference](https://github.com/Elnop/brutalway/tree/main/packages/tools/create-brutal#every-stack). Here, without the example, `src/app/App.tsx` only shows the project name, which is also the title of the page, and only the `app` namespace of the messages remains.

Every vite project goes through i18next, whatever its options: the texts are in `src/app/locales/en/` and the components call `t()`.

## zustand

Without it, the `zustand` dependency is removed. The example needs the store, so `--no-zustand` comes with `--no-example`.

## styling

- `css`: one stylesheet per feature next to `src/app/globals.css`, checked by stylelint through `npm run styles`
- `css-modules`: an `X.module.css` next to each component in place of the feature stylesheets. `happy-css-modules` types them, so `styles.typo` fails `tsc`: it adds the `css-types` script, which `typecheck` and `prepare` run. `src/app/globals.css` keeps the tokens, the reset and the shared `button` classes
- `tailwind`: Tailwind v4 classes in the components, with `tailwindcss`, `@tailwindcss/vite` and `prettier-plugin-tailwindcss`. The colors, fonts and shadows are declared under `@theme` in `src/app/globals.css`, with Tailwind's own palette removed, and the feature stylesheets go. `@brutalway/oxlint-config-tailwind` reports a color outside these tokens, a heading without `font-display` and any `dark:` class. stylelint and the `styles` script are removed

The todo list looks the same with all three.

## ui

With `shadcn`, the Button, Input, Checkbox and Card of [shadcn/ui](https://ui.shadcn.com) are copied into `third-party/shadcn/` as the registry wrote them, with `components.json`, and `src/` imports them through `@third-party/shadcn/`. It needs `--styling tailwind`.

- it adds `radix-ui`, `class-variance-authority`, `lucide-react` and `cn`, and `shadcn`, `@brutalway/oxlint-config-shadcn` and `@brutalway/dependency-cruiser-config` as dev dependencies
- `third-party/` has its own TypeScript project, `tsconfig.third-party.json`, and `typecheck` becomes `tsc -b`, so `src/` keeps every flag
- in `src/`, a raw `<button>`, `<input>`, `<select>` or `<textarea>` and any icon set but `lucide-react` are reported
- Prettier, Oxlint and check-tree skip `third-party/`, and `npx shadcn add <name>` adds the next primitive

## dark-theme

`src/app/globals.css` gives each color token a dark value under `@media (prefers-color-scheme: dark)`, so the classes and stylesheets stay the same. With `e2e`, `darkTheme.spec.ts` in `e2e/` runs axe in dark mode.

## server-state

It adds `@tanstack/react-query`, the `QueryClientProvider` in `src/main.tsx`, the cache profiles of `QueryConfig.ts` in `src/shared/` and `@brutalway/oxlint-config-tanstack-query`.

With the example, the todos are read and written through the routes of template-fastify. A client parses each response with Zod (added as a dependency), the API filters the list and gives the counters, and the zustand store only keeps the filter, so `src/shared-features/todos/todosSelectors.ts` goes. `devApi.ts` and `devApiRoutes.ts` at the root answer `/api` from an in-memory list in `npm run dev` and `vite preview`, and `API_URL=http://localhost:3000` proxies it to the API instead.

## forms

It adds `react-hook-form`, `@hookform/resolvers`, `zod` and `@brutalway/oxlint-config-react-hook-form`, which reports a `useForm` without `zodResolver` and any validation passed to `register` or a `Controller`. With the example, the title fields go through `useForm` and a `TodoDraftSchema`. Without this option, the same fields show the same error through a plain hook.

## i18n

It adds French next to English: a `fr/` folder beside `src/app/locales/en/`, a `language-switch` feature with English and Français buttons in the header, and the choice saved in `localStorage`. `<html lang>` and the page title follow it, and `i18next-cli status` fails when French misses a key. With `e2e` and the example, `language.spec.ts` in `e2e/` runs axe in French.

## react-compiler

`vite.config.ts` runs the React Compiler through Babel, with `babel-plugin-react-compiler`, `@babel/core` and `@rolldown/plugin-babel`, and `useMemo`, `useCallback` and `memo` imported from `react` are reported. Vitest runs without it, and the e2e tests run the compiled build.

## analytics

Both values add `analyticsClient.ts` to `src/shared/`, the only place where events leave the app, and `@brutalway/dependency-cruiser-config` keeps analytics SDKs inside it. The example calls `analyticsClient.track('todo_added')`.

- `module`: the client dispatches an `analytics` event on `window`, for whatever tool you plug in
- `posthog`: it adds `posthog-js`, the client sends the events when `VITE_POSTHOG_KEY` is set, and `securityHeaders.ts` lets the PostHog hosts through

## component-tests

Without it, the `.test.tsx` files, the `component` project of `vitest.config.ts`, the `test:component` script, `@vitest/browser-playwright` and `vitest-browser-react` are removed. The unit tests of `src/**/*.test.ts` stay.

## coverage

`npm test` runs `vitest run --coverage` with `@vitest/coverage-v8` and fails under 90 % coverage of the presenters, pure functions, selectors and stores. `src/main.tsx` and `src/app/` are left out, and `coverage/` is ignored by git and Prettier.

## e2e

Without it, `e2e/`, `playwright.config.ts`, the `e2e` script, `@playwright/test`, `@axe-core/playwright` and `@brutalway/playwright-fixtures` are removed, along with the e2e job of the CI workflow.
