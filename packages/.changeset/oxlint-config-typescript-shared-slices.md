---
'@brutalway/oxlint-config-typescript': minor
---

The file-name blocklist follows the single `shared/` of `@brutalway/dependency-cruiser-config` and `@brutalway/check-tree`: no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`. A project still on `shared-features/` loses that check until it moves to `shared/`.
