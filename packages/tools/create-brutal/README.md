# create-brutal

Creates a project from one of the [brutalway](https://github.com/Elnop/brutalway) templates and lets you drop the parts you do not need. Whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app
```

Node 26 is required, like the templates.

## Stacks and options

| Stack | Template | Options |
|---|---|---|
| `vite` | [template-vite](https://github.com/Elnop/brutalway/tree/main/templates/vite) | `example`, `zustand`, `styling`, `ui`, `server-state`, `forms`, `i18n`, `react-compiler`, `component-tests`, `e2e`, `claude-hook`, `ci` |
| `fastify` | [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) | `example`, `swagger`, `database`, `claude-hook`, `ci` |

`example` keeps the todo list. Without it you get the same structure with empty `src/features/` and `src/shared-features/` folders. On vite, `App.tsx` then only shows the project name, and zustand can only be removed together with the example, since the example uses it. On fastify, `buildApp.ts` only creates the server, and the Swagger UI, if kept, is titled with the project name.

Every vite project goes through i18next, whatever its options: the components of each styling value call `t()`, the messages are JSON in `src/app/locales/en/`, and `@brutalway/oxlint-config-i18next` and `i18next-cli` keep it that way. Without the example, only the `app` namespace remains, with the project name as its title.

On vite, `styling` takes `css` (the default: one stylesheet per feature next to `src/app/globals.css`, checked by stylelint), `css-modules` or `tailwind`. With `css-modules`, each component of the example has its own `X.module.css` next to it, `src/app/globals.css` keeps the tokens, the reset and the shared `button` classes, and `happy-css-modules` types the class names so `styles.typo` fails `tsc`. With `tailwind`, the feature stylesheets are gone, the components carry Tailwind v4 classes, and `src/app/globals.css` declares the colors, fonts and shadows under `@theme`, with Tailwind's own palette removed. The todo list looks the same. `@brutalway/oxlint-config-tailwind` reports any color that is not one of those tokens, a heading without `font-display` and any `dark:` class, and Prettier sorts the classes through `@brutalway/prettier-config/tailwind`.

On vite, `ui` takes `none` (the default) or `shadcn`, which needs `--styling tailwind`. With `shadcn`, the Button, Input, Checkbox and Card of [shadcn/ui](https://ui.shadcn.com) are copied into `third-party/shadcn/` as the registry wrote them, `components.json` points every alias of the shadcn CLI there, and the example uses them. `src/` imports them through `@third-party/shadcn/`. The vendored files get a TypeScript project of their own (`tsconfig.third-party.json`, with the two flags shadcn's code breaks turned off), and `typecheck` becomes `tsc -b`, so `src/` keeps every flag. Prettier, Oxlint and check-tree leave `third-party/` alone, knip takes its files as entries, and alint refuses any folder there but `shadcn/`. In `src/`, `@brutalway/oxlint-config-shadcn` reports a raw `<button>`, `<input>`, `<select>` or `<textarea>` and any icon set but `lucide-react`, and `@brutalway/dependency-cruiser-config/shadcn` keeps `radix-ui` and `class-variance-authority` inside `third-party/`, which imports nothing from `src/`. The look comes from tokens in `src/app/globals.css`: shadcn's colors mapped onto the series' ones under `@theme inline`, thick borders, square corners, hard shadows, and one rule on `[data-slot='button']`. `npx shadcn add <name>` adds the next one, with the version of the shadcn CLI pinned in `package.json`.

On vite, `server-state` is off by default. With it, the example reads and writes its todos through TanStack Query against the routes of template-fastify: `todosClient.ts` parses each response with Zod, the list is filtered by the API and the counters come from `GET /stats`, and the zustand store only keeps the filter. Without `API_URL`, `devApi.ts` answers `/api` from an in-memory list in `npm run dev` and `vite preview`, one list per browser. With `API_URL=http://localhost:3000`, it proxies `/api` to the API. Without the example, the option brings the `QueryClientProvider`, the cache profiles of `src/shared/QueryConfig.ts` and `@brutalway/oxlint-config-tanstack-query`.

On vite, `forms` is off by default. With it, the title fields of the example go through `react-hook-form` with `zodResolver(TodoDraftSchema)`, and `@brutalway/oxlint-config-react-hook-form` reports a `useForm` without that resolver and any validation passed to `register` or a `Controller`. The components are the same with or without it: both read their field through `useTitleForm.ts`, and every project shows "The title is blank" under the field instead of disabling the button. With `server-state`, `TodoDraftSchema` joins the API schemas and `todosClient.create` takes its inferred type.

On vite, `i18n` is off by default. With it, the project comes in English and French: the messages of `src/app/locales/fr/` sit next to the English ones, English and Français buttons in the header switch between them, the choice is saved in `localStorage`, and `<html lang>` and the title of the page follow it. `i18next-cli status` then fails when French misses a key, and with e2e, `e2e/language.spec.ts` switches to French and runs axe.

On vite, `react-compiler` is off by default. With it, `vite.config.ts` runs the React Compiler through Babel, so components and hooks are memoized at build time, and `useMemo`, `useCallback` and `memo` imported from `react` are reported. Vitest runs without it: its memo caches add branches the tests would have to reach, while the e2e tests run the compiled build.

On fastify, `database` keeps `node:sqlite` and the `DATABASE_PATH` variable. Without it, the example keeps its todos in a `Map`: `todosQueries.ts` has the same functions, so the services and the routes do not change. Without `swagger`, `@fastify/swagger` and `openapi-types` stay installed, because `fastify-type-provider-zod` needs them.

The CLI also asks whether to run `git init` and `npm install`. Without git, the `prepare` script that installs the pre-commit hook is removed. The next steps tell you how to set it up later.

## Without questions

A yes/no option has the flags `--<option>` and `--no-<option>`, an option with several values takes `--<option> <value>`. `--yes` takes the default for every question left:

```sh
npm create brutal my-app -- --stack vite --styling tailwind --no-e2e --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "vite", "git": true, "install": true, "options": { "styling": "tailwind", "e2e": false } }
```

```sh
npm create brutal my-app -- --preset minimal.json --yes
```

`npm create brutal -- --help` lists the stacks, their options, the values of each option and its default. A combination that cannot work stops the CLI before anything is written, with a message naming both options: `--no-zustand cannot be used with --example`.

## How it works

Each version of the package downloads every template from `templates/` in this repository, at the last commit that changed it when the package was built (`dist/stackRefs.json`), so a given version always produces the same project. The options are described in `src/stacks/viteStack.ts` and `src/stacks/fastifyStack.ts`: files to remove, text to replace or insert in the docs and configs, scripts and dependencies to drop or add, and files to copy from `overlays/`. A replacement whose text cannot be found, or an insertion whose anchor cannot be found, stops the CLI with the file name and the missing text, rather than producing a half-edited project.

An option is either yes/no, with a `default` of `true` or `false`, or a choice between `values`, with one of them as `default`. An option that defaults to `false` adds things when switched on: its change brings an overlay, `addDependencies`, `addDevDependencies` and doc lines inserted `after` or `before` an anchor that already exists. A yes/no option, or one value of a choice, can declare `requires` (the other options are forced to these values) and `conflicts` (the other options cannot take these values). The CLI skips a question whose answer is already decided, and only offers the values that still work.

## Developing

From the root of the repository:

```sh
npm install
node packages/tools/create-brutal/src/cli.ts ../my-app --local
npm run matrix
```

`--local` copies the templates from `templates/` in this checkout, local changes included. `node packages/tools/create-brutal/scripts/vendorShadcn.ts` writes the shadcn files of `overlays/vite/shadcn/third-party/shadcn/` again with the shadcn CLI, at the version and with the list of primitives set in `packages/tools/create-brutal/src/stacks/shadcnConfig.ts`. `npm run matrix` creates a set of projects that covers every pair of option values that can happen together, starting from the defaults, with every combination of the choice options when a stack has more than two of them. Options marked `independent` are switched on and off without being crossed with the others. Each project is installed, then runs `npm run check` and `npm test`, and the run ends with the number of projects and the time it took, also written to the GitHub job summary. `--all` builds every valid combination instead. `--e2e` adds `npm run e2e` (use `--jobs 1`, Playwright needs port 4173), `--keep` keeps the projects in `brutal-matrix/` under the system temp folder, outside the repository so that no project picks up its `node_modules`. With `ui` set to `shadcn`, the project first adds `dialog` and `sonner` with the shadcn CLI, so a tool that starts reading `third-party/` fails the run. `--local-packages` makes each project install the `@brutalway/*` packages packed from this checkout instead of the versions on npm (run `npm run build` first).
