---
'template-next': patch
---

`oxlint.config.ts` extends `@brutalway/oxlint-config-next`: `'use client'` only goes on an orchestrator, a provider or an `error.tsx`, a `'use client'` file imports no `xClient.ts`, and a server action lives in a `.ts` file of its own.
