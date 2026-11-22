# @brutalway/check

`brutal-check` runs every check of a brutalway project, in a fixed order, and says at the end which ones failed. A project's `check` script is `brutal-check`, so a release of brutalway that adds a check changes this package and a devDependency, two changes that `create-brutal update` merges without a conflict, instead of the `check` line the project may have edited.

## Install

```sh
npm install --save-dev @brutalway/check
```

## Usage

```json
"check": "brutal-check"
```

A check of your own goes after it:

```json
"check": "brutal-check && npm run lint:sql"
```

It runs each step the project has, keeps going after a failure, and exits with 1 when at least one failed:

```
brutal-check: typecheck
...
brutal-check: skipped styles (no "styles" script)
brutal-check: lint, knip failed
```

## Steps

In this order. A script step runs `npm run <script>` when `package.json` has that script, so its arguments stay in the project. A tool step runs the tool when its package is in `dependencies` or `devDependencies`.

| Step | Runs | When |
| --- | --- | --- |
| prettier | `prettier --check .` | `prettier` is installed |
| typecheck | `npm run typecheck` | the script exists |
| lint | `npm run lint` | the script exists |
| styles | `npm run styles` | the script exists |
| deps | `npm run deps` | the script exists |
| tree | `npm run tree` | the script exists |
| duplicates | `npm run duplicates` | the script exists |
| docs | `npm run docs` | the script exists |
| messages | `npm run messages` | the script exists |
| alint | `alint check` | `@asamarts/alint` is installed |
| knip | `knip` | `knip` is installed |
| knip --production | `knip --production` | `knip` is installed |
| check-secrets | `check-secrets` | `@brutalway/check-secrets` is installed |
| check-exceptions | `check-exceptions` | `@brutalway/check-exceptions` is installed |

The last line before the result lists the skipped steps and why, so a script removed by mistake shows up.

## Why

A template writes its checks once, in one script, and adds one at almost every release. The `check` line is also the line a project changes to add its own checks, so the two collide on every update. With `brutal-check`, the list lives in a versioned package, and the project keeps its `check` line.
