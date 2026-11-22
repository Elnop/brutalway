# @brutalway/dependency-cruiser-config

[dependency-cruiser](https://github.com/sverweij/dependency-cruiser) rules for an app split into layers under `src/`:

```
src/app/        composes the features, and imports nothing else
src/features/   one folder per feature
src/shared/     the code several features use, one shared feature per concept
```

A shared feature (`shared/todos/`, `shared/errors/`) never imports another one. When shared feature A needs code from shared feature B, the two merge, or the code is copied.

## Install

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

`tsPreCompilationDeps: false` means type-only imports do not count.

Run it with `npx depcruise --output-type err-long src`. The default output only prints the name of the rule, `err-long` adds its comment, which says what to change.

A file under `test-utils/` or `e2e/` counts as a test: the server and library rules let it import what a test may import.

### shadcn/ui

For a project that keeps the shadcn/ui primitives in `third-party/shadcn/`, outside `src/`, as the registry wrote them, extend `@brutalway/dependency-cruiser-config/shadcn`. Run it on both folders, `depcruise --output-type err-long src third-party`.

### Library

For a published package:

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/library',
  options: { parser: 'swc', tsPreCompilationDeps: false },
};
```

A type-only package such as `mdast` (whose types come from `@types/mdast`) does not resolve with `parser: 'swc'`: leave it out with `exclude: { path: '^mdast$' }` in `options`.

### Server

For an API where each shared feature keeps its SQL in an `xQueries.ts` file, its calls to other HTTP APIs in an `xClient.ts` file and its background loops in an `xWorker.ts` file:

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/server',
  options: { parser: 'swc', tsPreCompilationDeps: false },
};
```

## Rules

Each rule has a `comment` that says what to do instead.

### Layers

| Rule                                 | Rejects                                                                                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared-not-to-features`             | a shared feature in `src/shared/` importing `app/` or `features/`                                                                                                                        |
| `no-cross-shared`                    | a shared feature in `src/shared/` importing another shared feature                                                                                                                                |
| `app-only-to-features`               | `src/app/` importing `shared/`: what it needs, like a page layout or the server setup, goes into a feature |
| `app-composes-orchestrators` | `src/app/` importing a presenter of a feature: it imports an `XContainer`, `XLayout`, `XPage` or `XProvider`, and a screen made only of presenters is an `XPage` or an `XLayout` of its feature |
| `features-not-to-app`                | a feature importing `app/`                                                                                                                                                      |
| `no-cross-feature`                   | a feature importing another feature                                                                                                                                             |
| `no-cross-sub-feature` | a sub-feature (`features/<y>/` inside a feature or a shared feature) importing a sibling or the root of its parent instead of a shared feature of the parent `shared/` |
| `no-cross-sub-shared` | a shared feature of the `shared/` of a feature or a shared feature (`shared/<y>/`) importing another shared feature, a sub-feature or the root of its parent |
| `feature-nesting-too-deep` | a feature or a shared feature nested more than 10 levels deep                                                                                                                                       |
| `presenters-are-pure`                | a presenter (any component not named `XContainer`, `XLayout`, `XPage`, `XContent`, `XConfig` or `XProvider`) that reaches a store, an `xClient.ts`, `zustand` or `@tanstack/react-query` through any chain of imports. A presenter that calls `useTodoList`, which reads the store through `useTodos`, is reported. A hook of local state, like a `useCopyToClipboard` built on `useState`, stays allowed |
| `presenters-render-presenters`       | a presenter importing an `XContainer`, `XLayout` or `XPage`: render the orchestrator from the orchestrator above, so a presenter never reaches the store of a child |
| `orchestrators-use-hooks` | an `XContainer`, `XLayout` or `XPage` importing an `xClient.ts`: it reads server data through a query or service hook |
| `stores-hold-no-server-data`         | an `xStore.ts` importing an `xClient.ts`, an `xKeys.ts`, a hook or `@tanstack/react-query`                                                                                      |
| `analytics-in-client`                | `posthog-js`, `posthog-react-native`, `@segment/analytics-next`, `mixpanel-browser`, `@amplitude/analytics-browser`, `react-ga4` or `@vercel/analytics` imported anywhere but an `analyticsClient.ts`   |
| `stores-in-their-folder`             | an `xStore.ts` outside the root or the `stores/` folder of its level                                                                                                            |
| `no-circular`                        | import cycles                                                                                                                                                                   |
| `no-unresolvable`                    | imports that resolve to no file                                                                                                                                                 |
| `no-prod-to-tests`                   | production code importing a test file, a test utility from `test-utils/` or a file from `e2e/`                                                                                  |
| `not-to-dev-dep`                     | code under `src/` importing a devDependency                                                                                                                                     |

Sub-features and shared features nest like the features they live in: each can hold its own `features/` and `shared/`, under a feature or a shared feature, and the same two rules apply at every level, up to 10 levels. Below the first level, the rule names carry the level of the parent feature, like `no-cross-sub-feature-level-2`.

### shadcn/ui

`shadcn` adds these rules to the layers:

| Rule                                         | Rejects                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `third-party-not-to-src`                     | a file under `third-party/` importing `src/`                                                      |
| `third-party-packages-only-from-third-party` | `radix-ui`, `@radix-ui/*` or `class-variance-authority` imported from anywhere but `third-party/` |

Code in `src/` imports the primitives from any layer. `cn` stays allowed in `src/`.

### Library

A package has no `src/app/`: each entry point (a bin, an export of `package.json`) is a file at the root of `src/`, which composes the features the way `src/app/` does in an app. `library` adds these rules to the layers:

| Rule                   | Rejects                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `entries-not-imported` | a file at the root of `src/` imported by anything but a test or `test-utils/` |
| `no-app-folder`        | a file under `src/app/`                                                       |
| `not-to-dev-dep`       | code under `src/` importing a devDependency that is not also a peerDependency |

### Server

`server` adds five rules to the layers:

| Rule                       | Rejects                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `routes-not-to-queries`    | an `xRoutes.ts` importing an `xQueries.ts`: routes call their service                                                 |
| `queries-behind-services`  | an `xQueries.ts` imported by anything but a service, a worker, other queries or a test |
| `database-in-queries`      | `node:sqlite`, `pg`, `postgres`, `mysql2` or `better-sqlite3` imported outside an `xQueries.ts`, `src/features/database/`, which opens the connection, and the tests |
| `workers-started-from-app` | an `xWorker.ts` imported by anything but `src/app/`, which starts and stops it with the server, or a test. Since `src/app/` only imports features, a worker lives in a feature |
| `http-in-clients`          | `node:http`, `node:https`, `undici`, `axios`, `got` or `node-fetch` imported outside an `xClient.ts` and the tests    |

`fetch` is a global, so dependency-cruiser does not see it: `@brutalway/oxlint-config-fastify` keeps it in `xClient.ts` files.

## Why

dependency-cruiser 18 reads TypeScript through the `typescript` package only up to 6.x. With TypeScript 7, `parser: 'swc'` and `@swc/core` are required, or `.ts` files are not seen at all.

dependency-cruiser rules are regular expressions with one capture per level, so each sub-feature level needs its own rule, and `feature-nesting-too-deep` rejects what no rule would check.

The shadcn/ui primitives import nothing from the app, so any layer can import them. `cn` merges Tailwind classes, which the app needs for its own components.

A peer dependency such as `oxlint` is often a devDependency too, so the package can be tested. That is why the library `not-to-dev-dep` lets the code import it.
