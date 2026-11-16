---
'@brutalway/oxlint-config-react': minor
'@brutalway/oxlint-config-node': minor
'@brutalway/oxlint-config-zustand': minor
---

`@brutalway/oxlint-config-typescript` goes from `^0.6.0` to `^0.8.0`, which brings two of its rules:

- `export default` is rejected, except in the files a tool loads by their default export (`*.config.ts`, `plugin.ts`, `.d.ts` files, `fixtures/`)
- no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`. This follows the single `shared/` split into slices of `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0
