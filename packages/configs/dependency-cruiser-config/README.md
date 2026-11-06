# @brutal/dependency-cruiser-config

[dependency-cruiser](https://github.com/sverweij/dependency-cruiser) rules for an app split into layers under `src/`:

```
src/app/              composes the features
src/features/         one folder per feature
src/shared-features/  business code shared by several features
src/shared/           code with no domain
```

| Rule                                 | Rejects                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `shared-not-to-features`             | `src/shared/` importing `app/`, `features/` or `shared-features/`                                                     |
| `shared-features-not-to-features`    | `src/shared-features/` importing `app/` or `features/`                                                                |
| `features-not-to-app`                | a feature importing `app/`                                                                                            |
| `no-cross-feature`                   | a feature importing another feature                                                                                   |
| `no-cross-shared-feature`            | a shared feature importing another shared feature                                                                     |
| `no-cross-sub-feature`               | a sub-feature (`features/<x>/features/<y>/`) importing a sibling or its feature root instead of the feature `shared/` |
| `feature-shared-not-to-sub-features` | a feature `shared/` importing one of its sub-features                                                                 |
| `feature-nesting-too-deep`           | a feature nested more than 10 levels deep                                                                             |
| `presenters-are-pure`                | a presenter (any component not named `XContainer`, `XLayout` or `XPage`) importing a store or a shared-feature hook   |
| `stores-in-their-folder`             | an `xStore.ts` outside the root or the `stores/` folder of its level                                                  |
| `no-circular`                        | import cycles                                                                                                         |
| `no-unresolvable`                    | imports that resolve to no file                                                                                       |
| `no-prod-to-tests`                   | production code importing a test file                                                                                 |
| `not-to-dev-dep`                     | code under `src/` importing a devDependency                                                                           |

Sub-features nest like the features they live in: a sub-feature can hold its own `features/` and `shared/`, and the same two rules apply at every level, up to 10 levels. Below the first level, the rule names carry the level of the parent feature, like `no-cross-sub-feature-level-2`. dependency-cruiser rules are regular expressions with one capture per level, so each level needs its own rule, and `feature-nesting-too-deep` rejects what no rule would check.

Each rule has a `comment` that says what to do instead.

```sh
npm install --save-dev @brutal/dependency-cruiser-config dependency-cruiser @swc/core
```

`.dependency-cruiser.cjs`:

```js
module.exports = {
  extends: '@brutal/dependency-cruiser-config/layers',
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    parser: 'swc',
    tsPreCompilationDeps: false,
    enhancedResolveOptions: { extensions: ['.ts', '.tsx', '.js'] },
  },
};
```

## Server

`@brutal/dependency-cruiser-config/server` extends the layers and adds five rules for an API where each shared feature keeps its SQL in an `xQueries.ts` file, its calls to other HTTP APIs in an `xClient.ts` file and its background loops in an `xWorker.ts` file:

| Rule                       | Rejects                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `routes-not-to-queries`    | an `xRoutes.ts` importing an `xQueries.ts`: routes call their service                                                 |
| `queries-behind-services`  | an `xQueries.ts` imported by anything but a service, a worker, other queries, `src/app/` (which wires them) or a test |
| `database-in-queries`      | `node:sqlite`, `pg`, `postgres`, `mysql2` or `better-sqlite3` imported outside an `xQueries.ts` and `src/shared/`     |
| `workers-started-from-app` | an `xWorker.ts` imported by anything but `src/app/`, which starts and stops it with the server, or a test             |
| `http-in-clients`          | `node:http`, `node:https`, `undici`, `axios`, `got` or `node-fetch` imported outside an `xClient.ts` and the tests    |

`fetch` is a global, so dependency-cruiser does not see it: `@brutal/oxlint-config-fastify` keeps it in `xClient.ts` files.

```js
module.exports = {
  extends: '@brutal/dependency-cruiser-config/server',
  options: { parser: 'swc', tsPreCompilationDeps: false },
};
```

dependency-cruiser 18 reads TypeScript through the `typescript` package only up to 6.x. With TypeScript 7, `parser: 'swc'` and `@swc/core` are required, or `.ts` files are not seen at all. `tsPreCompilationDeps: false` means type-only imports do not count.
