# create-brutal

Creates a project from one of the [brutalway](https://github.com/Elnop/brutalway) templates and lets you drop the parts you do not need. Whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app
```

Node 26 is required, like the templates.

## Stacks and options

| Stack | Template | Options |
|---|---|---|
| `vite` | [template-vite](https://github.com/Elnop/brutalway/tree/main/templates/vite) | `example`, `zustand`, `styling`, `server-state`, `component-tests`, `e2e`, `claude-hook`, `ci` |
| `fastify` | [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) | `example`, `swagger`, `database`, `claude-hook`, `ci` |

`example` keeps the todo list. Without it you get the same structure with empty `src/features/` and `src/shared-features/` folders. On vite, `App.tsx` then only shows the project name, and zustand can only be removed together with the example, since the example uses it. On fastify, `buildApp.ts` only creates the server, and the Swagger UI, if kept, is titled with the project name.

On vite, `styling` takes `css` (the default: one stylesheet per feature next to `src/app/globals.css`, checked by stylelint), `css-modules` or `tailwind`. With `css-modules`, each component of the example has its own `X.module.css` next to it, `src/app/globals.css` keeps the tokens, the reset and the shared `button` classes, and `happy-css-modules` types the class names so `styles.typo` fails `tsc`. With `tailwind`, the feature stylesheets are gone, the components carry Tailwind v4 classes, and `src/app/globals.css` declares the colors, fonts and shadows under `@theme`, with Tailwind's own palette removed. The todo list looks the same. `@brutalway/oxlint-config-tailwind` reports any color that is not one of those tokens, a heading without `font-display` and any `dark:` class, and Prettier sorts the classes through `@brutalway/prettier-config/tailwind`.

On vite, `server-state` is off by default. With it, the example reads and writes its todos through TanStack Query against the routes of template-fastify: `todosClient.ts` parses each response with Zod, the list is filtered by the API and the counters come from `GET /stats`, and the zustand store only keeps the filter. Without `API_URL`, `devApi.ts` answers `/api` from an in-memory list in `npm run dev` and `vite preview`, one list per browser. With `API_URL=http://localhost:3000`, it proxies `/api` to the API. Without the example, the option brings the `QueryClientProvider`, the cache profiles of `src/shared/QueryConfig.ts` and `@brutalway/oxlint-config-tanstack-query`.

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

`--local` copies the templates from `templates/` in this checkout, local changes included. `npm run matrix` creates a set of projects that covers every pair of option values that can happen together, starting from the defaults, with every combination of the choice options when a stack has more than two of them. Options marked `independent` are switched on and off without being crossed with the others. Each project is installed, then runs `npm run check` and `npm test`, and the run ends with the number of projects and the time it took, also written to the GitHub job summary. `--all` builds every valid combination instead. `--e2e` adds `npm run e2e` (use `--jobs 1`, Playwright needs port 4173), `--keep` keeps the projects in `brutal-matrix/` under the system temp folder, outside the repository so that no project picks up its `node_modules`. `--local-packages` makes each project install the `@brutalway/*` packages packed from this checkout instead of the versions on npm (run `npm run build` first).
