# template-next

## 0.1.2

### Patch Changes

- 51ebbed: `@brutalway/oxlint-config-next` 0.1.1, which lets a `'use client'` file import `analyticsClient.ts`.

## 0.1.1

### Patch Changes

- d8ea465: `oxlint.config.ts` extends `@brutalway/oxlint-config-next`: `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, a `'use client'` file imports no `xClient.ts`, and a server action lives in a `.ts` file of its own.

## 0.1.0

### Minor Changes

- 7ccf13a: First version of template-next: the todo list of template-vite on the Next.js App Router. The route files of `src/app/` are server components that lay out the features, the orchestrators that read the zustand store start with `'use client'`, and `src/proxy.ts` sends a Content Security Policy with a nonce per request. `npm run check`, Vitest and Playwright run as on template-vite.
