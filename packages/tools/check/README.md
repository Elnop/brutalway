# @brutalway/check

`brutal-check` runs every check of a brutalway project, in a fixed order, and says at the end which ones failed. A project's `check` script is `brutal-check`, so a release of brutalway that adds a check bumps this package and adds a script, two changes that `create-brutal update` merges key by key without a conflict, instead of the `check` line the project may have edited.

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

It runs every one of its scripts that `package.json` defines, all at the same time, and prints a line for each as it ends. The output of a step that failed follows its line, in full, and the output of a step that passed is left out. It exits with 1 when at least one step failed:

```
brutal-check: no script for styles, messages
brutal-check: tree OK (1.2s)
brutal-check: lint FAILED (2.3s)
src/features/cart/CartPanel.tsx:12:3: error ...
brutal-check: lint failed
```

`brutal-check --serial` runs them one after the other, in the order below, for a machine short on memory.

## Steps

| Script | In a brutalway template |
| --- | --- |
| `format:check` | `prettier --check .` |
| `typecheck` | `tsc` |
| `lint` | Oxlint |
| `styles` | stylelint |
| `deps` | dependency-cruiser |
| `tree` | check-tree |
| `duplicates` | jscpd |
| `docs` | check-doc-length, check-doc-sources, check-doc-links |
| `messages` | i18next-cli |
| `repo` | `alint check` |
| `unused` | `knip && knip --production` |
| `secrets` | check-secrets |
| `exceptions` | check-exceptions |

Each step is a script of the project, so its arguments stay in `package.json` and knip sees the tools it calls. A missing script is skipped, and the first line lists them, so a script removed by mistake shows up.

## Why

A template writes its checks once, in one script, and adds one at almost every release. The `check` line is also the line a project changes to add its own checks, so the two collide on every update. With `brutal-check`, the list lives in a versioned package, and the project keeps its `check` line.
