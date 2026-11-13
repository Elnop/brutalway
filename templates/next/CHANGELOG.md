# template-next

## 0.2.0

### Minor Changes

- 5853e3b: `npm run check` runs knip a second time with `--production`, on `src/` without its tests, so a file or an export of `src/` that only a test uses is reported. A helper shared by tests goes in `test-utils/`, at the root, imported through `@test-utils/` (`#test-utils/` on fastify and package), and `@brutalway/dependency-cruiser-config` 0.8.0 rejects an import of it from production code. On vite, next and react-native, dependency-cruiser reads `tsconfig.test.json` to resolve that alias. On next, `check-tree` runs with `--root-entries`, so `src/proxy.ts` and the other files Next.js reads at the root of `src/` stay there. template-next moves to `@brutalway/oxlint-config-next` 0.1.2, which accepts `src/instrumentation-client.ts`.

## 0.1.3

### Patch Changes

- 1e74217: `@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
- 5485d9e: The layout and verifications pages describe the folders check-tree accepts in each layer and the sub shared features, `shared-features/<y>/` inside a feature or a shared feature, with the import rules that keep them apart. In template-react-native the theme and the `Button` move from `src/shared/theme/` to `src/shared-features/theme/`, since `src/shared/` holds kind folders only.
- dbc7821: The README starts with the `npm create brutal` command that creates a project from the template, and `docs/reference/options.md` lists each option: its flag, its values, its default, what it adds or removes and the flags it cannot be used with, with an example without questions.

## 0.1.2

### Patch Changes

- 51ebbed: `@brutalway/oxlint-config-next` 0.1.1, which lets a `'use client'` file import `analyticsClient.ts`.

## 0.1.1

### Patch Changes

- d8ea465: `oxlint.config.ts` extends `@brutalway/oxlint-config-next`: `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, a `'use client'` file imports no `xClient.ts`, and a server action lives in a `.ts` file of its own.

## 0.1.0

### Minor Changes

- 7ccf13a: First version of template-next: the todo list of template-vite on the Next.js App Router. The route files of `src/app/` are server components that lay out the features, the orchestrators that read the zustand store start with `'use client'`, and `src/proxy.ts` sends a Content Security Policy with a nonce per request. `npm run check`, Vitest and Playwright run as on template-vite.
