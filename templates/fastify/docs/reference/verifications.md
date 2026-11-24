# Verifications

Everything below runs locally, in the pre-commit hook and in CI. `npm run check` runs it with `brutal-check` (`@brutalway/check`), which starts every check at the same time, prints each one as it ends with the output of a failed one, then names the checks that failed and those it skipped because their script is missing. Each check is a script of `package.json`, in this order: `format:check`, `typecheck`, `lint`, `styles`, `deps`, `tree`, `duplicates`, `docs`, `messages`, `repo`, `unused`, `secrets`, `exceptions`, so `npm run tree` runs one alone, and `npx brutal-check --serial` runs them one after the other on a machine short on memory.

## TypeScript

`tsconfig.json` extends `@brutalway/tsconfig/node.json`: `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`, with ES2024 as target and `erasableSyntaxOnly`, so Node can run every file without a build. That is also why `src/shared/todos/todosQueries.ts` reads `row['id']`.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-fastify` (which brings the TypeScript base) and `@brutalway/oxlint-config-node-test`. Each package README details its rules. The main ones:

- no comments (a `@ts-expect-error` says why, `@ts-ignore` and `@ts-nocheck` are refused), no `eval` or `new Function`, no relative imports (use `#src/`, and `#test-support/` in `test/support/`), no `index.ts`, no `export *`
- `process.env` is read only in a file whose name ends with `Env.ts`: here `src/shared/env/readEnv.ts`
- no `app.decorate`: dependencies are factory parameters
- an `async` handler returns its value and never calls `reply.send()`
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`, Zod schemas in an `XSchemas.ts` that exports nothing else
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `xPlugin.ts`, `.d.ts`): each module is imported under the name it exports
- no `xRoutes.ts` in a `shared/`, at any depth
- `fetch` is called only in an `xClient.ts` file (or a test)
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- in tests, `describe` and `it` from `node:test` (never `test`), and `node:assert/strict`

## Dependencies

dependency-cruiser extends `@brutalway/dependency-cruiser-config/server`:

- `src/shared/` imports no feature, a shared feature never imports another shared feature, no feature imports `src/app/`
- `src/app/` imports features only, never `src/shared/`
- a feature never imports another feature
- inside a feature or a shared feature, at every nesting level, a sub-feature (`features/<y>/`) imports neither its siblings nor the root of its parent, and a shared feature of its `shared/` (`shared/<y>/`) imports neither another shared feature, nor a sub-feature, nor the root of its parent. They nest at most ten levels deep
- a route never imports queries, queries are only imported by a service, a worker, other queries or a test
- the database driver (`node:sqlite`, `pg`…) is only imported by queries, `src/features/database/` and the tests
- an `xWorker.ts` is only imported by `src/app/`, which starts and stops it with the server, so it lives in a feature
- HTTP libraries (`undici`, `node:https`…) are only imported by an `xClient.ts`
- no cycles, no import of `test/`, no devDependency in production code
- a unit test imports from `src/` its own source and `xConfig.ts` or `xTypes.ts` files, nothing else, and follows the layer rules of its source

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and kind folders holding a single file. It also rejects a folder the layout does not name: `src/` holds `app/`, `features/` and `shared/`, `src/shared/` holds one folder per shared feature, and a feature or a shared feature holds kind folders, `features/` and `shared/`. One file of a kind stays at the root of its folder, two or more go in the kind's folder: `routes/`, `services/`, `queries/`, `schemas/`, `clients/`, `workers/`, `types/`, `configs/` or `lib/`. A file of a shared feature that a single feature uses is rejected too, and moves into that feature. It also keeps `test/unit/` a mirror of `src/`: a test sits at the path of its source, and `npx check-tree src --fix` moves the tests whose source moved. So is a shared feature whose files form two groups that never import each other: it splits into two shared features. That is why the server factory lives in `src/features/http-server/`.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`: the threshold is 0. Move the shared part into a function the two places call.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested. Fix the link, or point it to the page that replaced it.

## Secrets

`check-secrets` (`@brutalway/check-secrets`) runs [gitleaks](https://github.com/gitleaks/gitleaks) on the files git would commit, so a file `.gitignore` leaves out, like `.env`, is not read. The first run downloads gitleaks 8.30.1 from its GitHub release, checks it against a pinned checksum and keeps it in `node_modules/.cache/check-secrets/`. A key, a token or a password in the code fails the check: remove it and revoke it. If it is public by design, add the fingerprint the message prints to `.gitleaksignore`.

## Exceptions

`check-exceptions` (`@brutalway/check-exceptions`) counts the ways around a check: `oxlint-disable` and `@ts-expect-error` comments, `jscpd:ignore-start` blocks, the entries of `oxlint-suppressions.json`, `.check-tree-known-violations.json`, `.alint-baseline.json` and `.gitleaksignore`, the ignore lists of `knip.json` and `.jscpd.json`. It counts them per rule and fails when a count is higher than at the fork point with the main branch, so these lists only shrink and moving code around is not growth. With no main branch to compare with, it checks nothing. CI clones the whole history (`fetch-depth: 0`) so that it finds the fork point.

## Repository

alint extends `@brutalway/alint-config`: every path in backticks, link and anchor of the README and `docs/` exists, kind folders only hold their kind, and every dependency is pinned to an exact version. knip rejects unused exports, files and dependencies. `npm run check` runs knip a second time with `--production`, on the code of `src/` alone: a file or an export of `src/` that only a test uses is reported, since the server never reaches it. Delete it, test it through the code that uses it, or move a test helper to `test/support/`.

## Tests

| Kind | What it tests | Example |
|---|---|---|
| Queries | the SQL, on a `:memory:` database | `test/unit/shared/todos/todosQueries.test.ts` |
| Routes | one feature mounted alone on `createTestServer()`, its service on a `:memory:` database from `memoryTodos()`, both in `test/support/`, called with `inject()` | `test/unit/features/todo-list/todoListRoutes.test.ts` |
| App | the full wiring and the OpenAPI document | `test/unit/app/buildApp.test.ts` |
| Env | defaults, conversion, refusal of invalid values | `test/unit/shared/env/readEnv.test.ts` |

A test sits in `test/unit/` at the path of its source, and imports from `src/` that source alone, plus `xConfig.ts` and `xTypes.ts` files: what else it needs, like a service for a route, comes from `test/support/`. `inject()` sends fake requests to Fastify without opening a port.

A helper that tests share (a fixture, a seeding function, a fake) goes in `test/support/`, never in `src/`, and the tests import it through `#test-support/`. dependency-cruiser rejects an import of `test/` from production code.

Before keeping a test, break the code it protects and watch it fail.
