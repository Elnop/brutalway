# @brutalway/oxlint-config-next

## 0.5.1

### Patch Changes

- ae7b854: `@brutalway/oxlint-config-typescript` goes from `^0.8.0` to `^0.9.0` and `@brutalway/oxlint-config-react` from `^0.5.0` to `^0.6.0`, so a project that extends react-vite, next or react-native gets the overrides of `test/e2e/**`.
- Updated dependencies [ae7b854]
  - @brutalway/oxlint-config-react@0.6.1
  - @brutalway/oxlint-config-zustand@0.3.2

## 0.5.0

### Minor Changes

- 1371ca6: The end-to-end tests move from `e2e/` to `test/e2e/`, next to `test/unit/` and `test/support/`. The overrides that relax the naming, placement, length and component rules for them, and the `node` env of next and react-vite, now apply to `test/e2e/**` and no longer to `e2e/**`. Move the folder with `git mv e2e test/e2e` and point `testDir` of `playwright.config.ts` at it.

### Patch Changes

- Updated dependencies [1371ca6]
  - @brutalway/oxlint-config-react@0.6.0

## 0.4.0

### Minor Changes

- 42158d4: `@brutalway/oxlint-config-next/no-server-functions` exports `noServerFunctionsConfig`, for an app that reads and writes its data through an API with TanStack Query. Extended after `nextConfig`, it reports every `'use server'` and every `'use cache'`, at the top of a file or in a function, in place of the rules on where a server action goes.

## 0.3.0

### Minor Changes

- f38543b: `@brutalway/oxlint-config-react-vite`, `-next` and `-react-native` move to `@brutalway/oxlint-config-react` `^0.5.0` and `@brutalway/oxlint-config-zustand` `^0.3.0`, and `@brutalway/oxlint-config-fastify` to `@brutalway/oxlint-config-node` `^0.3.0`. They all reach `@brutalway/oxlint-config-typescript` 0.8.0:

  - `export default` is rejected, except in the files a tool loads by their default export and the files the framework names (`src/app/` on next and react-native)
  - no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`

## 0.2.0

### Minor Changes

- 8abe878: The files Next.js names, everything under `src/app/` and the files at the root of `src/`, are left out of the rules on file names, exports and props. This replaces the lists of route files, kebab-case names and route segment exports, which missed the generated images (`icon.tsx`, `opengraph-image.tsx` with `alt`, `size` and `contentType`), `mdx-components.tsx`, the Next.js 16 segment exports (`prefetch`, `instant`) and the `reset` prop of `error.tsx`. `'use client'` is allowed in any file of `src/app/`, where Next.js decides. A fixture holds every file convention of Next.js 16 and must lint clean.

## 0.1.2

### Patch Changes

- 632ccfd: `instrumentation-client.ts` keeps its kebab-case name, the one Next.js looks for, like `not-found.tsx`.

## 0.1.1

### Patch Changes

- b7aacf7: A `'use client'` file may import `analyticsClient.ts`, since events happen in the browser. Any other `xClient.ts` is still reported.

## 0.1.0

### Minor Changes

- 1ced794: First version of `@brutalway/oxlint-config-next`, the oxlint preset for the Next.js App Router. It extends the React, zustand and Vitest configs and turns on every rule of the `nextjs` plugin of oxlint. `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, never under `shared/` or `presenters/`, and a `'use client'` file imports no `xClient.ts`. A server action lives in a `.ts` file of its own that starts with `'use server'` and exports one async function. The route files of `app/` may export a default and the route segment options.
