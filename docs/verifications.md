# Verifications

Everything below runs locally, in the pre-commit hook and in CI.

## TypeScript

`tsconfig.json` extends `@brutalway/tsconfig/node.json`: `strict` plus `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`, with ES2024 as target and `erasableSyntaxOnly`, so Node can run every file without a build. That is also why `src/shared-features/todos/todosQueries.ts` reads `row['id']`.

## Lint

`oxlint.config.ts` extends `@brutalway/oxlint-config-fastify` (which brings the TypeScript base) and `@brutalway/oxlint-config-node-test`. Each package README details its rules. The main ones:

- no comments, no relative imports (use `#src/`), no `index.ts`, no `export *`
- `process.env` is read only in a file whose name ends with `Env.ts`: here `src/shared/lib/readEnv.ts`
- no `app.decorate`: dependencies are factory parameters
- an `async` handler returns its value and never calls `reply.send()`
- an exported type lives in an `XTypes.ts`, an exported constant in an `XConfig.ts`, Zod schemas in an `XSchemas.ts` that exports nothing else
- no `xRoutes.ts` under `shared-features/`
- `fetch` is called only in an `xClient.ts` file (or a test)
- one way to write each thing: function declarations, `type` over `interface`, `for...of` over `forEach`
- in tests, `describe` and `it` from `node:test` (never `test`), and `node:assert/strict`

## Dependencies

dependency-cruiser extends `@brutalway/dependency-cruiser-config/server`:

- `src/shared/` imports neither `src/shared-features/` nor features, `src/shared-features/` imports no feature, no feature imports `src/app/`
- a feature never imports another feature, a shared feature never imports another shared feature
- a sub-feature (`features/<x>/features/<y>/`) imports neither its siblings nor its feature root, only its feature `shared/`, at every nesting level, and features nest at most ten levels deep
- a route never imports queries, queries are only imported by a service, a worker, other queries, `src/app/` or a test
- the database driver (`node:sqlite`, `pg`…) is only imported by queries and `src/shared/`
- an `xWorker.ts` is only imported by `src/app/`, which starts and stops it with the server
- HTTP libraries (`undici`, `node:https`…) are only imported by an `xClient.ts`
- no cycles, no import of a test file, no devDependency in production code

## Tree

`check-tree` (`@brutalway/check-tree`) rejects empty folders and category folders holding a single file. One file of a kind stays at the root of its folder, two or more go in the kind's folder: `routes/`, `services/`, `queries/`, `schemas/`, `clients/`, `workers/`, `types/`, `configs/` or `lib/`. That is why `src/shared/lib/` exists: it holds three plain modules.

## Repository

alint extends `@brutalway/alint-config`: every path in backticks, link and anchor of the README and `docs/` exists, category folders only hold their kind, and every dependency is pinned to an exact version. knip rejects unused exports, files and dependencies.

## Tests

| Kind | What it tests | Example |
|---|---|---|
| Queries | the SQL, on a `:memory:` database | `src/shared-features/todos/todosQueries.test.ts` |
| Routes | one feature mounted alone on `createServer()`, called with `inject()` | `src/features/todo-list/todoListRoutes.test.ts` |
| App | the full wiring and the OpenAPI document | `src/app/buildApp.test.ts` |
| Env | defaults, conversion, refusal of invalid values | `src/shared/lib/readEnv.test.ts` |

A test sits next to its source. `inject()` sends fake requests to Fastify without opening a port. Before keeping a test, break the code it protects and watch it fail.
