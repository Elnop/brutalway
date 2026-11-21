# @brutalway/check-exceptions

`check-exceptions` fails when a list of exceptions grew since the commit your branch started from. The violations a project had when a rule arrived get written down once, and after that a change may remove entries but not add any.

## Install

```sh
npm install --save-dev @brutalway/check-exceptions
```

## Usage

```sh
check-exceptions
```

Run it in `npm run check`, next to the checkers whose lists it reads. It compares the files as they are now, committed or not, with the fork point: the commit where `HEAD` left `origin/main` (or `origin/HEAD`, `origin/master`, `main`, `master`, the first that exists). On `main` itself, that is the last pushed commit.

```sh
check-exceptions --base origin/develop
```

compares with the fork point from another branch. In CI, the clone needs that branch and its history: with `actions/checkout`, set `fetch-depth: 0`.

When it fails, it prints one line per rule that grew:

```
oxlint-disable no-console: 3 exceptions now, 2 at the fork point 1bc47e5: fix the code instead of adding an exception
check-tree shared-feature-groups: 10 exceptions now, 9 at the fork point 1bc47e5: fix the code instead of adding an exception
```

### A new rule

A rule that did not exist at the fork point starts at 0. To turn on a rule that the code breaks in places, write the number of violations it found under `newRules` in `package.json`, in the change that adds the rule:

```json
"check-exceptions": { "newRules": { "check-tree single-consumer": 12 } }
```

`newRules` only counts for a rule absent at the fork point. Delete the entry in the next change.

## Reference

### What it counts

| Source | Count |
| --- | --- |
| `oxlint-suppressions.json` | per rule, the sum of the `count` of each file |
| `.alint-baseline.json` | per rule, the sum of the `count` of each entry |
| `.check-tree-known-violations.json` | per rule, the sum of the `count` of each entry, 1 for an entry without one |
| `.dependency-cruiser-known-violations.json` | per rule, one per violation |
| `knip.json` | the size of `ignore`, `ignoreFiles`, `ignoreDependencies`, `ignoreBinaries`, `ignoreMembers`, `ignoreUnresolved`, `ignoreWorkspaces` and `ignoreIssues` |
| `.jscpd.json` | the size of `ignore` |
| `.gitleaksignore` | one per fingerprint |
| code files git tracks or does not ignore | per rule, each `oxlint-disable`, `eslint-disable` or `stylelint-disable` comment, in any of its forms, `@ts-expect-error`, `@ts-ignore`, `@ts-nocheck`, `jscpd:ignore-start` and `gitleaks:allow` |

The counts are per rule over the whole project, not per file. Moving a file, or a violation of check-tree from one folder to another, changes no count.

The lists are read from the folder it runs in, so in a monorepo it runs in each package.

### Output

Exit code 1 when a count grew, 0 otherwise. Without a commit or without a branch to compare with, it says it has nothing to compare with and exits with 0. A `--base` that is not a commit stops it with exit code 1.

## Why

`oxlint --suppress-all`, `check-tree --write-known-violations`, `depcruise --baseline`, `alint baseline --accept-new` and the others rewrite their list with every violation of the moment, new ones included. An agent that hits a rule can regenerate the baseline, and every check goes green. Nothing looks at how these files change, so the lists grow and the rules stop mattering.
