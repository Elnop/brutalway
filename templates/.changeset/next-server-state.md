---
'template-next': minor
---

`npm create brutal` gives template-next a `server-state` option, for an app that reads and writes its data through an API with TanStack Query. It adds a `QueryProvider` to `src/app/layout.tsx` and extends `noServerFunctionsConfig` of `@brutalway/oxlint-config-next` 0.4.0, which rejects every `'use server'` and every `'use cache'`. With the example, the todos come from a catch-all route handler under `src/app/api/` that keeps them in memory, one list per browser. `@brutalway/dependency-cruiser-config` 0.12.0 no longer counts an `XProvider.tsx` as a presenter.
