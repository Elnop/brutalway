# @brutalway/dependency-cruiser-config

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
| `presenters-are-pure` | a presenter (any component not named `XContainer`, `XLayout` or `XPage`) importing a store, a shared-feature hook, an `xClient.ts` or `@tanstack/react-query` |
| `stores-hold-no-server-data` | an `xStore.ts` importing an `xClient.ts`, an `xKeys.ts`, a hook or `@tanstack/react-query` |
| `analytics-in-client` | `posthog-js`, `@segment/analytics-next`, `mixpanel-browser`, `@amplitude/analytics-browser`, `react-ga4` or `@vercel/analytics` imported anywhere but an `analyticsClient.ts` |
| `stores-in-their-folder`             | an `xStore.ts` outside the root or the `stores/` folder of its level                                                  |
| `no-circular`                        | import cycles                                                                                                         |
| `no-unresolvable`                    | imports that resolve to no file                                                                                       |
| `no-prod-to-tests`                   | production code importing a test file                                                                                 |
| `not-to-dev-dep`                     | code under `src/` importing a devDependency                                                                           |

Sub-features nest like the features they live in: a sub-feature can hold its own `features/` and `shared/`, and the same two rules apply at every level, up to 10 levels. Below the first level, the rule names carry the level of the parent feature, like `no-cross-sub-feature-level-2`. dependency-cruiser rules are regular expressions with one capture per level, so each level needs its own rule, and `feature-nesting-too-deep` rejects what no rule would check.

Each rule has a `comment` that says what to do instead.

```sh
npm install --save-dev @brutalway/dependency-cruiser-config dependency-cruiser @swc/core
```

`.dependency-cruiser.cjs`:

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/layers',
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    parser: 'swc',
    tsPreCompilationDeps: false,
    enhancedResolveOptions: { extensions: ['.ts', '.tsx', '.js'] },
  },
};
```

## shadcn/ui

`@brutalway/dependency-cruiser-config/shadcn` extends the layers for a project that keeps the shadcn/ui primitives in `third-party/shadcn/`, outside `src/`, as the registry wrote them:

| Rule                                         | Rejects                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `third-party-not-to-src`                     | a file under `third-party/` importing `src/`                                                    |
| `third-party-packages-only-from-third-party` | `radix-ui`, `@radix-ui/*` or `class-variance-authority` imported from anywhere but `third-party/` |

Code in `src/` imports the primitives from any layer, since they import nothing from the app. `cn` stays allowed in `src/`: it merges Tailwind classes, which the app needs for its own components. Run it on both folders, `depcruise src third-party`.

## Library

`@brutalway/dependency-cruiser-config/library` extends the layers for a published package. A package has no `src/app/`: each entry point (a bin, an export of `package.json`) is a file at the root of `src/`, which composes the features the way `src/app/` does in an app.

| Rule                   | Rejects                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `entries-not-imported` | a file at the root of `src/` imported by anything but a test    |
| `no-app-folder`        | a file under `src/app/`                                         |
| `not-to-dev-dep`       | code under `src/` importing a devDependency that is not also a peerDependency |

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/library',
  options: { parser: 'swc', tsPreCompilationDeps: false },
};
```

A peer dependency such as `oxlint` is often a devDependency too, so the package can be tested: the code may import it.

A type-only package such as `mdast` (whose types come from `@types/mdast`) does not resolve with `parser: 'swc'`: leave it out with `exclude: { path: '^mdast$' }` in `options`.

## Server

`@brutalway/dependency-cruiser-config/server` extends the layers and adds five rules for an API where each shared feature keeps its SQL in an `xQueries.ts` file, its calls to other HTTP APIs in an `xClient.ts` file and its background loops in an `xWorker.ts` file:

| Rule                       | Rejects                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `routes-not-to-queries`    | an `xRoutes.ts` importing an `xQueries.ts`: routes call their service                                                 |
| `queries-behind-services`  | an `xQueries.ts` imported by anything but a service, a worker, other queries, `src/app/` (which wires them) or a test |
| `database-in-queries`      | `node:sqlite`, `pg`, `postgres`, `mysql2` or `better-sqlite3` imported outside an `xQueries.ts` and `src/shared/`     |
| `workers-started-from-app` | an `xWorker.ts` imported by anything but `src/app/`, which starts and stops it with the server, or a test             |
| `http-in-clients`          | `node:http`, `node:https`, `undici`, `axios`, `got` or `node-fetch` imported outside an `xClient.ts` and the tests    |

`fetch` is a global, so dependency-cruiser does not see it: `@brutalway/oxlint-config-fastify` keeps it in `xClient.ts` files.

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/server',
  options: { parser: 'swc', tsPreCompilationDeps: false },
};
```

dependency-cruiser 18 reads TypeScript through the `typescript` package only up to 6.x. With TypeScript 7, `parser: 'swc'` and `@swc/core` are required, or `.ts` files are not seen at all. `tsPreCompilationDeps: false` means type-only imports do not count.
