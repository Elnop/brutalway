# @brutalway/oxlint-config-next

## 0.1.2

### Patch Changes

- 632ccfd: `instrumentation-client.ts` keeps its kebab-case name, the one Next.js looks for, like `not-found.tsx`.

## 0.1.1

### Patch Changes

- b7aacf7: A `'use client'` file may import `analyticsClient.ts`, since events happen in the browser. Any other `xClient.ts` is still reported.

## 0.1.0

### Minor Changes

- 1ced794: First version of `@brutalway/oxlint-config-next`, the oxlint preset for the Next.js App Router. It extends the React, zustand and Vitest configs and turns on every rule of the `nextjs` plugin of oxlint. `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, never under `shared/` or `presenters/`, and a `'use client'` file imports no `xClient.ts`. A server action lives in a `.ts` file of its own that starts with `'use server'` and exports one async function. The route files of `app/` may export a default and the route segment options.
