# create-brutal

Creates a project from one of the [BRUTAL](https://github.com/Elnop/brutal) templates and lets you drop the parts you do not need. Whatever you pick, the project passes `npm run check` on the first run.

```sh
npm create brutal my-app
```

Node 26 is required, like the templates.

## Stacks and options

| Stack | Template | Options |
|---|---|---|
| `vite` | [template-vite](https://github.com/Elnop/template-vite) | `example`, `zustand`, `component-tests`, `e2e`, `claude-hook`, `ci` |
| `fastify` | [template-fastify](https://github.com/Elnop/template-fastify) | `example`, `swagger`, `database`, `claude-hook`, `ci` |

`example` keeps the todo list. Without it you get the same structure with empty `src/features/` and `src/shared-features/` folders. On vite, `App.tsx` then only shows the project name, and zustand can only be removed together with the example, since the example uses it. On fastify, `buildApp.ts` only creates the server, and the Swagger UI, if kept, is titled with the project name.

On fastify, `database` keeps `node:sqlite` and the `DATABASE_PATH` variable. Without it, the example keeps its todos in a `Map`: `todosQueries.ts` has the same functions, so the services and the routes do not change. Without `swagger`, `@fastify/swagger` and `openapi-types` stay installed, because `fastify-type-provider-zod` needs them.

The CLI also asks whether to run `git init` and `npm install`. Without git, the `prepare` script that installs the pre-commit hook is removed. The next steps tell you how to set it up later.

## Without questions

Every option has a flag, `--<option>` or `--no-<option>`. `--yes` takes the default for every question left:

```sh
npm create brutal my-app -- --stack vite --no-example --no-e2e --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "vite", "git": true, "install": true, "options": { "example": false, "e2e": false } }
```

```sh
npm create brutal my-app -- --preset minimal.json --yes
```

`npm create brutal -- --help` lists the stacks and their options.

## How it works

Each version of the package downloads every template at the commit its submodule points to in this repository (`dist/stackRefs.json`, written at build time), so a given version always produces the same project. The options are described in `src/stacks/viteStack.ts` and `src/stacks/fastifyStack.ts`: files to remove, text to replace in the docs and configs, scripts and dependencies to drop, and files to copy from `overlays/`. A replacement whose text cannot be found stops the CLI with the file name and the missing text, rather than producing a half-edited project.

## Developing

From the root of the repository:

```sh
npm install
node packages/tools/create-brutal/src/cli.ts ../my-app --local
npm run matrix
```

`--local` copies the templates from the submodules in `templates/`, local changes included. `npm run matrix` creates a project for every combination of options (options marked `independent` are switched on and off without being crossed with the others), installs it, then runs `npm run check` and `npm test`. `--e2e` adds `npm run e2e` (use `--jobs 1`, Playwright needs port 4173), `--keep` keeps the projects in `brutal-matrix/` under the system temp folder, outside the repository so that no project picks up its `node_modules`. `--local-packages` makes each project install the `@brutal/*` packages packed from this checkout instead of the versions on npm (run `npm run build` first).
