# Verifications

Everything below runs locally, in the pre-commit hook and in CI.

## TypeScript

`tsconfig.json` extends `@brutalway/tsconfig/node.json`: `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`, with ES2024 as target and `erasableSyntaxOnly`, so Node can run every file without a build. That is also why `src/shared-features/todos/todosQueries.ts` reads `row['id']`.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-fastify` (which brings the TypeScript base) and `@brutalway/oxlint-config-node-test`. Each package README details its rules. The main ones:

- no comments, no relative imports (use `#src/`, and `#test-utils/` in `test-utils/`), no `index.ts`, no `export *`
- `process.env` is read only in a file whose name ends with `Env.ts`: here `src/shared/readEnv.ts`
- no `app.decorate`: dependencies are factory parameters
- an `async` handler returns its value and never calls `reply.send()`
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`, Zod schemas in an `XSchemas.ts` that exports nothing else
- no `export default`, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `xPlugin.ts`, `.d.ts`): each module is imported under the name it exports
- no `xRoutes.ts` under `shared-features/`
- `fetch` is called only in an `xClient.ts` file (or a test)
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`
- a function holds 25 lines at most, blank lines not counted, with blocks and callbacks nested 3 levels deep at most. Tests have no length limit
- a function takes 4 parameters at most, and declares 5 local variables at most, each name of a destructuring counted. Tests have no variable limit
- a file declares 5 top-level functions at most, exported or not: the helpers move into files of their own
- in tests, `describe` and `it` from `node:test` (never `test`), and `node:assert/strict`

## Dependencies

dependency-cruiser extends `@brutalway/dependency-cruiser-config/server`:

- `src/shared/` imports neither `src/shared-features/` nor features, `src/shared-features/` imports no feature, no feature imports `src/app/`
- `src/app/` imports features only, neither `src/shared-features/` nor `src/shared/`
- a feature never imports another feature, a shared feature never imports another shared feature
- inside a feature or a shared feature, at every nesting level, a sub-feature (`features/<y>/`) imports neither its siblings nor the root of its parent, a sub shared feature (`shared-features/<y>/`) imports neither its siblings nor a sub-feature, and the parent `shared/` imports none of them. They nest at most ten levels deep
- a route never imports queries, queries are only imported by a service, a worker, other queries or a test
- the database driver (`node:sqlite`, `pg`…) is only imported by queries, `src/features/database/` and the tests
- an `xWorker.ts` is only imported by `src/app/`, which starts and stops it with the server, so it lives in a feature
- HTTP libraries (`undici`, `node:https`…) are only imported by an `xClient.ts`
- no cycles, no import of a test file or of `test-utils/`, no devDependency in production code

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and category folders holding a single file. It also rejects a folder the layout does not name: `src/` holds `app/`, `features/`, `shared-features/` and `shared/`, `src/shared/` holds kind folders only, and a feature or a shared feature holds kind folders, `features/`, `shared-features/` and `shared/`. One file of a kind stays at the root of its folder, two or more go in the kind's folder: `routes/`, `services/`, `queries/`, `schemas/`, `clients/`, `workers/`, `types/`, `configs/` or `lib/`. A file of a `shared/` folder that a single feature uses is rejected too: it moves into that feature. That is why the server factory lives in `src/features/http-server/`.

## Duplicates

jscpd (`.jscpd.json`) fails on any block of 8 lines or 120 tokens that appears twice in `src/`, tests left out: the threshold is 0. Move the shared part into a function the two places call.

## Docs

`check-doc-length` (`@brutalway/check-doc-length`) fails when a Markdown file of the project is longer than 300 lines. `npx check-doc-length split <file>` shows how a file would be cut into a folder of the same name along its `##` headings, and `--write` does it, rewriting the links that point into it.

`check-doc-sources` (`@brutalway/check-doc-sources`) prints a warning, without failing, when a file you changed is cited by a Markdown file that did not change: a path in backticks, or the target of a relative link. Read the doc again and update it if what it says about the file no longer holds. It compares with the last commit, so the pre-commit hook shows it, and leaves `package.json` and the lockfile out.

`check-doc-links` (`@brutalway/check-doc-links`) requests every `http` and `https` link of the Markdown files and fails on one that is gone: a `404`, a `410` or a domain that does not exist. Other errors, like the `403` many sites send to robots, only print a warning. A link that answered is not requested again for 24 hours, and when the machine is offline nothing is requested. Fix the link, or point it to the page that replaced it.

## Repository

alint extends `@brutalway/alint-config`: every path in backticks, link and anchor of the README and `docs/` exists, category folders only hold their kind, and every dependency is pinned to an exact version. knip rejects unused exports, files and dependencies. `npm run check` runs knip a second time with `--production`, on the code of `src/` alone: a file or an export of `src/` that only a test uses is reported, since the server never reaches it. Delete it, test it through the code that uses it, or move a test helper to `test-utils/`.

## Tests

| Kind | What it tests | Example |
|---|---|---|
| Queries | the SQL, on a `:memory:` database | `src/shared-features/todos/todosQueries.test.ts` |
| Routes | one feature mounted alone on `createTestServer()` from `test-utils/`, called with `inject()` | `src/features/todo-list/todoListRoutes.test.ts` |
| App | the full wiring and the OpenAPI document | `src/app/buildApp.test.ts` |
| Env | defaults, conversion, refusal of invalid values | `src/shared/readEnv.test.ts` |

A test sits next to its source. `inject()` sends fake requests to Fastify without opening a port.

A helper that tests share (a fixture, a seeding function, a fake) goes in `test-utils/` at the root of the project, never in `src/`, and the tests import it through `#test-utils/`. dependency-cruiser rejects an import of `test-utils/` from production code.

Before keeping a test, break the code it protects and watch it fail.
