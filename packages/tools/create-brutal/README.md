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

## Update a project

Every project gets a `.brutalway.json` at its root with the version of create-brutal that made it, the stack, the project name and every answer. Do not edit it: create-brutal rewrites it.

```sh
npx create-brutal@latest update
```

`update` generates the project as the recorded version made it and as this version makes it, both with the recorded answers, commits the two in a temporary repository and cherry-picks the second into the project without committing. git does a 3-way merge with the first generation as base: the project's own changes stay, a file the template renamed keeps them, and the lines both sides changed hold conflict markers. `package.json` is merged key by key instead, keeping the project's value when both sides changed a key, and the lockfile is left to `npm install`. It refuses a working tree with changes, and rewrites `.brutalway.json` once the merge is in the working tree. When the version, the stack and the answers are those of `.brutalway.json`, it stops before generating anything and says the project is up to date.

| Flag | Effect |
|---|---|
| `--to <version>` | merges up to that version instead of the one running |
| `--set <option>=<value>` | changes an answer during the update, repeatable |
| `--from <version> --stack <id>` | for a project without `.brutalway.json`: the version and the stack that made it. The command refuses when fewer than half of the files of that version exist in the project |
| `--local` | generates the current version from the templates of this checkout |

`npx create-brutal@latest check` exits with 1 when the latest version would change the project, and with 0 when it is up to date.

A version older than the one running is generated with `npx create-brutal@<version>`, so `update` needs the network for it.

## Reference

The options of each stack, with their values, their defaults, what they add or remove and the flags they cannot be used with, are in the docs of its template:

| Stack | Template | Options |
|---|---|---|
| `vite` | [template-vite](https://github.com/Elnop/brutalway/tree/main/templates/vite) | [options](https://github.com/Elnop/brutalway/blob/main/templates/vite/docs/reference/options.md) |
| `next` | [template-next](https://github.com/Elnop/brutalway/tree/main/templates/next) | [options](https://github.com/Elnop/brutalway/blob/main/templates/next/docs/reference/options.md) |
| `react-native` | [template-react-native](https://github.com/Elnop/brutalway/tree/main/templates/react-native) | [options](https://github.com/Elnop/brutalway/blob/main/templates/react-native/docs/reference/options.md) |
| `fastify` | [template-fastify](https://github.com/Elnop/brutalway/tree/main/templates/fastify) | [options](https://github.com/Elnop/brutalway/blob/main/templates/fastify/docs/reference/options.md) |
| `package` | [template-package](https://github.com/Elnop/brutalway/tree/main/templates/package) | [options](https://github.com/Elnop/brutalway/blob/main/templates/package/docs/reference/options.md) |

A test of this package reads these pages and compares each table with the definition of the stack, so a flag, a value or a default cannot change in one place only.

A combination that cannot work stops the CLI before anything is written, with a message naming both options: `--no-zustand cannot be used with --example`.

### Every stack

| Option | Default | What it keeps |
|---|---|---|
| `example` | yes | the todo list |
| `claude-hook` | yes | the Claude Code hook that lints each edited file |
| `ci` | yes | the GitHub Actions workflow that runs the checks |
| `unit-tests` | yes | the unit tests, their runner and the `test` script |
| `package-manager` | `npm` | npm, or pnpm with `--package-manager pnpm` |

Without `example`, the todo list goes and the layers stay, with the least code the checks accept. The options page of each template says what remains.

Without `claude-hook`, `.claude/`, `docs/guides/work-with-an-agent.md` and `@brutalway/agent-hook` are removed. Without `ci`, the CI workflow is removed, and the commands and verifications docs stop mentioning it. Without `unit-tests`, `test/unit/`, `test/support/`, the test runner and its scripts are removed, and the e2e tests of vite and next stay with `e2e`.

With `--package-manager pnpm`, the project gets a `packageManager` field and a `pnpm-workspace.yaml` that holds the allowed build scripts, the overrides and `saveExact`, plus `nodeLinker: hoisted` on react-native. The hook, the CI workflow, the scripts and the docs call `pnpm`, `pnpm-lock.yaml` replaces `package-lock.json`, and create-brutal installs with pnpm, which has to be installed already.

`git` and `install` are asked on every stack too, and are covered under Install above.

## How it works

Each version of the package downloads the templates from `templates/` in this repository, at the last commit that changed each one when the package was built (`dist/stackRefs.json`). A given version always produces the same project.

Each stack is described in `src/features/stacks/lib/viteStack.ts`, `src/features/stacks/lib/fastifyStack.ts` or `src/features/stacks/lib/packageStack.ts`. An option lists what it changes:

- files to move, files to remove, and files to copy from `overlays/`
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
