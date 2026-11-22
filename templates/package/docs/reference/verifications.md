# Verifications

Everything below runs locally, in the pre-commit hook and in CI. `npm run check` runs it with `brutal-check` (`@brutalway/check`), which keeps going after a failure, then names the checks that failed and those it skipped because their script is missing. Each check is a script of `package.json`, in this order: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets`, `exceptions`, so `npm run tree` runs one alone.

## TypeScript

`tsconfig.json` extends `@brutalway/tsconfig/node.json`: `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`, with ES2024 as target and `erasableSyntaxOnly`, so Node can run every file of `src/` without a build. tsdown builds `dist/` and its `.d.ts` files from the same sources.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-node` (which brings the TypeScript base) and `@brutalway/oxlint-config-node-test`. Each package README details its rules. The main ones:

- no comments, no relative imports (use `#src/`, and `#test-utils/` in `test-utils/`), no `index.ts`, no `export *`
- a file with a single export is named after it, an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `xPlugin.ts`, `.d.ts`): each module is imported under the name it exports
- `console` only for `console.error`: a command writes to `process.stdout` and `process.stderr`
- `fetch` is called only in an `xClient.ts` file (or a test)
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- in tests, `describe` and `it` from `node:test` (never `test`), and `node:assert/strict`

## Dependencies

dependency-cruiser extends `@brutalway/dependency-cruiser-config/library`:

- a file at the root of `src/` is an entry point, and nothing but a test imports it
- there is no `app` folder under `src/`: the entry points compose the features
- `src/shared/` imports no feature, a shared feature never imports another shared feature
- a feature never imports another feature
- inside a feature or a shared feature, at every nesting level, a sub-feature (`features/<y>/`) imports neither its siblings nor the root of its parent, and a shared feature of its `shared/` (`shared/<y>/`) imports neither another shared feature, nor a sub-feature, nor the root of its parent. They nest at most ten levels deep
- no cycles, no import of a test file or of `test-utils/`, no devDependency in the code of `src/` unless it is also a peerDependency

`.dependency-cruiser.cjs` resolves packages through their `exports` field, so an import of a path a package does not export fails.

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and kind folders holding a single file. It also rejects a folder the layout does not name: `src/` holds `features/` and `shared/` next to the entry points, `src/shared/` holds one folder per shared feature, and a feature or a shared feature holds kind folders, `features/` and `shared/`. One file of a kind stays at the root of its folder, two or more go in the kind's folder: `types/`, `configs/`, `clients/` or `lib/`, among others. `"rootEntries": true`, in the `"check-tree"` key of `package.json`, leaves the files at the root of `src/` where they are, whatever their kind, since each one is an entry point.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`, tests left out: the threshold is 0. Move the shared part into a function the two places call.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested.

## Secrets

`check-secrets` (`@brutalway/check-secrets`) runs [gitleaks](https://github.com/gitleaks/gitleaks) on the files git would commit, so a file `.gitignore` leaves out, like `.env`, is not read. The first run downloads gitleaks 8.30.1 from its GitHub release, checks it against a pinned checksum and keeps it in `node_modules/.cache/check-secrets/`. A key, a token or a password in the code fails the check: remove it and revoke it. If it is public by design, add the fingerprint the message prints to `.gitleaksignore`.

## Exceptions

`check-exceptions` (`@brutalway/check-exceptions`) counts the ways around a check: `oxlint-disable` and `@ts-expect-error` comments, `jscpd:ignore-start` blocks, the entries of `oxlint-suppressions.json`, `.check-tree-known-violations.json`, `.alint-baseline.json` and `.gitleaksignore`, the ignore lists of `knip.json` and `.jscpd.json`. It counts them per rule and fails when a count is higher than at the fork point with the main branch, so these lists only shrink and moving code around is not growth. With no main branch to compare with, it checks nothing. CI clones the whole history (`fetch-depth: 0`) so that it finds the fork point.

## Repository

alint extends `library.yml` of `@brutalway/alint-config`: every path in backticks, link and anchor of the README, `AGENTS.md` and `docs/` exists, kind folders only hold their kind, and every devDependency is pinned to an exact version, while `dependencies` and `peerDependencies` keep their ranges. knip rejects unused exports, files and dependencies, and reads the entry points from `package.json`. `npm run check` runs knip a second time with `--production`, on the code of `src/` alone: a file or an export of `src/` that only a test uses is reported, since no entry point reaches it. Delete it, test it through the code that uses it, or move a test helper to `test-utils/`.

## Tests

| Kind | What it tests | Example |
|---|---|---|
| Feature | one function on a JSON file in a temporary folder | `src/features/add-todo/addTodo.test.ts` |
| Shared feature | reading and writing the file, refusal of a file that is not a list of todos | `src/shared/todos/todosFile.test.ts` |
| Bin | `node src/todo.ts` in a temporary folder: exact output, exit code | `src/todo.test.ts` |
| Export | the names the export offers, called together on one file | `src/todos.test.ts` |

A test sits next to its source.

A helper that tests share (a fixture, a seeding function, a fake) goes in `test-utils/` at the root of the project, never in `src/`, and the tests import it through `#test-utils/`. dependency-cruiser rejects an import of `test-utils/` from production code.

Before keeping a test, break the code it protects and watch it fail.
