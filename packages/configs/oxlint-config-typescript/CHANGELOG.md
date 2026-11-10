# @brutalkit/oxlint-config-typescript

## 0.6.0

### Minor Changes

- c438506: A function holds 25 lines at most, blank lines and comments not counted, and nests blocks and callbacks 3 levels deep at most (`max-lines-per-function`, `max-depth`, `max-nested-callbacks`), as in the Norminette of 42. Tests have no length limit. A project whose functions are longer starts failing. In the vite example, `TodoItem` is split into `TodoItemCheck` and `TodoItemActions`, the list moves to `TodoItems`, and `TodoInput` and `TodoEditor` share `TitleInput` and `TitleError` from `src/features/todo-list/shared/presenters/`.
- 13485ca: A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.
- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

## 0.5.0

### Minor Changes

- f1b60f3: `@brutalway/oxlint-config-typescript` reports a function whose cognitive complexity is above 15 with Sonar's own rule, `sonarjs/cognitive-complexity`. The whole `eslint-plugin-sonarjs` does not load under Oxlint with TypeScript 7, so a small plugin loads the file of that rule alone, from an exact version of the package.
  
  `@brutalway/oxlint-config-react` adds rules taken from bedrock: no array index as a `key`, `localStorage` and `sessionStorage` only in an `xStorage.ts` file, no `useX.tsx` hook file, no formatting (`toFixed`, `Intl`, `sort`, `filter`, `reduce`...) in a presenter, an orchestrator that calls at least one hook, and at most 6 props per component.
  
  `@brutalway/oxlint-config-i18next` leaves test files alone, since they pass literal props to what they render.
  
  New `coverage` option on vite, off by default, which needs component tests: `npm test` runs `vitest run --coverage` and fails under 90 % of presenters, pure functions, selectors and stores. With `i18n`, `LanguageSwitch.tsx` gets its component test, and `languagePreference.ts` becomes `languageStorage.ts`.
- 0b57e92: New `server-state` option on vite, off by default: the example reads and writes its todos through TanStack Query against the routes of template-fastify. `todosClient.ts` parses each response with Zod, query keys come from `todosKeys`, cache windows from `src/shared/QueryConfig.ts`, and the zustand store only keeps the filter. `devApi.ts` answers `/api` from an in-memory list in dev and preview, or proxies it to `API_URL`.
  
  `@brutalway/oxlint-config-tanstack-query` is a new package: `query-key-factory` and `named-cache-windows`, plus `exhaustive-deps` and `stable-query-client` from `@tanstack/eslint-plugin-query`. `@brutalway/oxlint-config-react` only accepts `fetch` in an `xClient.ts` and never inside an effect. The `xSchemas.ts` convention moves from the Fastify config to the TypeScript base, so the front gets it too. dependency-cruiser keeps clients, query hooks and `@tanstack/react-query` out of presenters and stores, and check-tree learns `xKeys.ts` and the `keys/` folder.

### Patch Changes

- 5aad351: `interface` is accepted inside `declare module '…'`, the only way TypeScript merges a declaration into a package's types (`FastifyRequest`, i18next's `CustomTypeOptions`). `declare namespace` is still reported.
- Updated dependencies [4ccbc63]
  - @brutalway/eslint-plugin-file-named-after-export@0.2.0

## 0.4.0

### Minor Changes

- abcac8c: The file-name blocklist now lives only in the TypeScript base, which also rejects orchestrators and routes under `shared-features/`. In `@elnop/oxlint-config-react-vite`, the base extended through the zustand config replaced the React config's blocklist, so `XContainer.tsx` files under `shared-features/` went unreported.

## 0.3.1

### Patch Changes

- 548743b: The repository moved to Elnop/elnop-tooling: homepage, bugs and repository URLs follow.
- Updated dependencies [548743b]
  - @elnop/eslint-plugin-file-named-after-export@0.1.2

## 0.3.0

### Minor Changes

- New style rules tried in ft_linear_regression: one way to write type members, accessibility, loops, regexes and matchers, `onX` callback props and `useX.ts` hook files. Each config is typed as `OxlintConfig`, so a project with `exactOptionalPropertyTypes` can extend it. `check-tree` applies the `styles/` rule to components, orchestrators, presenters, hooks, types, configs, stores and lib files: one file stays at the root, two or more go in the kind's folder. `oxlint-config-typescript` refuses `xConfig.tsx` files.

## 0.2.0

### Minor Changes

- Named functions must be declarations, an `if` without braces must fit on one line, `interface` is refused outside `declare global`, and a `switch` over a union must cover every case.
