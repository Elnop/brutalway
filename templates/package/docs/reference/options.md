# Options

`npm create brutal` creates a project from this template and asks one question per option below. Each answer adds or removes files, dependencies and scripts, and edits the docs to match, so whatever you pick, the project passes `npm run check` on the first run. The project starts at version 0.1.0 and is not `private`, so it can be published.

```sh
npm create brutal my-lib -- --stack package
```

## Create a project without questions

A yes/no option takes `--<option>` or `--no-<option>`, and `--yes` takes the default of every question left:

```sh
npm create brutal my-lib -- --stack package --no-example --no-bin --yes
```

A preset file holds the same answers, and flags override it:

```json
{ "stack": "package", "git": true, "install": true, "options": { "release": false } }
```

```sh
npm create brutal my-lib -- --preset lib.json --yes
```

## Every option

| Flag | Values | Default | Cannot be used with |
|---|---|---|---|
| `--[no-]example` | yes, no | yes |  |
| `--[no-]bin` | yes, no | yes |  |
| `--[no-]release` | yes, no | yes |  |
| `--[no-]claude-hook` | yes, no | yes |  |
| `--[no-]ci` | yes, no | yes |  |

Every combination works.

`example`, `claude-hook` and `ci`, along with `git` and `install`, work the same on every stack and are described in the [create-brutal reference](https://github.com/Elnop/brutalway/tree/main/packages/tools/create-brutal#every-stack). Here, without the example, `src/features/`, `src/shared-features/`, `src/shared/` and the `todo` files go, and the `"."` export is a `greet.ts` in `src/`: a single `greet` function to replace, since the lint rules refuse an empty module.

## bin

With it, `package.json` has a `bin` next to the export: the `todo` command of `src/todo.ts`, or, without the example, a `cli.ts` in `src/` that prints the project name under a command of the same name. tsdown builds it with the export.

Without it, `package.json` has no `bin`, `src/todo.ts` and its test are removed, and only the export is built and tested.

## release

With it, the project publishes to npm with changesets: `@changesets/cli`, `.changeset/`, the `release` script, `docs/guides/publish.md` and `.github/workflows/release.yml`, which opens the release pull request and publishes each merged version through trusted publishing, with provenance.

Without it, all of these are removed, and `.github/` too when `ci` is off.
