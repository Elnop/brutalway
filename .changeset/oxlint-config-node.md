---
'@brutalway/oxlint-config-node': minor
'@brutalway/oxlint-config-fastify': patch
---

New package `@brutalway/oxlint-config-node`: the TypeScript base plus the `#src/` alias instead of relative imports and `fetch` only in `xClient.ts` files. `@brutalway/oxlint-config-fastify` now extends it instead of repeating those rules.
