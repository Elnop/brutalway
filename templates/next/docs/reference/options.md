# Options

`npm create brutal` creates a project from this template and asks one question per option below. Each answer adds or removes files, dependencies and scripts, and edits the docs to match, so whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app -- --stack next
```

## Create a project without questions

A yes/no option takes `--<option>` or `--no-<option>`, an option with several values takes `--<option> <value>`, and `--yes` takes the default of every question left:

```sh
npm create brutal my-app -- --stack next --styling tailwind --i18n --no-e2e --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "next", "git": true, "install": true, "options": { "styling": "css-modules", "dark-theme": true } }
```

```sh
npm create brutal my-app -- --preset next.json --yes
```

## Every option

| Flag | Values | Default | Cannot be used with |
|---|---|---|---|
| `--[no-]example` | yes, no | yes | `--example` with `--no-zustand` |
| `--[no-]zustand` | yes, no | yes | `--no-zustand` with `--example` |
| `--styling` | `css`, `css-modules`, `tailwind` | `css` | `--styling css` with `--ui shadcn`, `--styling css-modules` with `--ui shadcn` |
| `--ui` | `none`, `shadcn` | `none` | `--ui shadcn` with `--styling css`, `--ui shadcn` with `--styling css-modules` |
| `--[no-]dark-theme` | yes, no | no |  |
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

`example`, `claude-hook` and `ci`, along with `git` and `install`, work the same on every stack and are described in the [create-brutal reference](https://github.com/Elnop/brutalway/tree/main/packages/tools/create-brutal#every-stack). Here, without the example, `src/app/page.tsx` only shows the project name, which is also the title of the page, and only the `app` namespace of the messages remains.

Every next project goes through i18next, whatever its options: the texts are in `src/app/locales/en/` and the components call `t()`. There is no `server-state` option: on Next.js a server component can read the data itself and hand it to the client components, so the example keeps its todos in the browser, in zustand.

## zustand

Without it, the `zustand` dependency is removed. The example needs the store, so `--no-zustand` comes with `--no-example`.

## styling

- `css`: one stylesheet per feature next to `src/app/globals.css`, checked by stylelint through `npm run styles`
- `css-modules`: an `X.module.css` next to each component in place of the feature stylesheets, and the styles of the page in a `page.module.css` next to `src/app/page.tsx`. `happy-css-modules` types them, so `styles.typo` fails `tsc`: it adds the `css-types` script, which `typecheck` and `prepare` run
- `tailwind`: Tailwind v4 classes in the components, through `@tailwindcss/postcss` and a `postcss.config.mjs`, with `tailwindcss` and `prettier-plugin-tailwindcss`. The colors, fonts and shadows are declared under `@theme` in `src/app/globals.css`, with Tailwind's own palette removed. `@brutalway/oxlint-config-tailwind` reports a color outside these tokens, a heading without `font-display` and any `dark:` class. stylelint and the `styles` script are removed

The todo list looks the same with all three.

## ui

With `shadcn`, the Button, Input, Checkbox and Card of [shadcn/ui](https://ui.shadcn.com) are copied into `third-party/shadcn/` as the registry wrote them, with `components.json`, and `src/` imports them through `@third-party/shadcn/`, an alias also declared in `vitest.config.ts`. It needs `--styling tailwind`.

- it adds `radix-ui`, `class-variance-authority`, `lucide-react` and `cn`, and `shadcn`, `@brutalway/oxlint-config-shadcn` and `@brutalway/dependency-cruiser-config` as dev dependencies
- `third-party/` has its own TypeScript project, `tsconfig.third-party.json`, and `typecheck` becomes `tsc -b`, so `src/` keeps every flag
- in `src/`, a raw `<button>`, `<input>`, `<select>` or `<textarea>` and any icon set but `lucide-react` are reported
- Prettier, Oxlint and check-tree skip `third-party/`, and `npx shadcn add <name>` adds the next primitive

## dark-theme

`src/app/globals.css` gives each color token a dark value under `@media (prefers-color-scheme: dark)`, so the classes and stylesheets stay the same. With `e2e`, `darkTheme.spec.ts` in `e2e/` runs axe in dark mode.

## forms

It adds `react-hook-form`, `@hookform/resolvers`, `zod` and `@brutalway/oxlint-config-react-hook-form`, which reports a `useForm` without `zodResolver` and any validation passed to `register` or a `Controller`. With the example, the title fields go through `useForm` and a `TodoDraftSchema`. Without this option, the same fields show the same error through a plain hook.

## i18n

It adds French next to English: a `fr/` folder beside `src/app/locales/en/` and a `language-switch` feature with English and Français buttons. The language is saved in a `language` cookie. On the server, `requestLanguage.ts` reads it, or the first language of `Accept-Language` the project has, so the page, `<html lang>` and the title come in that language. The switch sets the cookie and calls `router.refresh()`. `i18next-cli status` fails when French misses a key, and with `e2e` and the example, `language.spec.ts` in `e2e/` runs axe in French.

## react-compiler

`next.config.ts` sets `reactCompiler: true`, with `babel-plugin-react-compiler`, and `useMemo`, `useCallback` and `memo` imported from `react` are reported. Vitest runs without it, and the e2e tests run the compiled build.

## analytics

Both values add `analyticsClient.ts` to `src/shared/`, the only place where events leave the app, and `@brutalway/dependency-cruiser-config` keeps analytics SDKs inside it. Every project sends `app_opened` at startup from `instrumentation-client.ts`, at the root of `src/`, and the example also calls `analyticsClient.track('todo_added')`.

- `module`: the client dispatches an `analytics` event on `window`, for whatever tool you plug in
- `posthog`: it adds `posthog-js`, the client sends the events when `NEXT_PUBLIC_POSTHOG_KEY` is set and never during server rendering, and `src/proxy.ts` lets the PostHog hosts through its Content Security Policy

## component-tests

Without it, the `.test.tsx` files, the `component` project of `vitest.config.ts`, the `test:component` script, `@vitest/browser-playwright` and `vitest-browser-react` are removed. The unit tests of `src/**/*.test.ts` stay.

## coverage

`npm test` runs `vitest run --coverage` with `@vitest/coverage-v8` and fails under 90 % coverage of the presenters, pure functions, selectors and stores. `src/app/`, `src/proxy.ts` and the `requestX.ts` files are left out, and `coverage/` is ignored by git and Prettier.

## e2e

Without it, `e2e/`, `playwright.config.ts`, the `e2e` script, `@playwright/test`, `@axe-core/playwright` and `@brutalway/playwright-fixtures` are removed, along with the e2e job of the CI workflow.
