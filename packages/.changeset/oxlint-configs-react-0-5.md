---
'@brutalway/oxlint-config-react-vite': minor
'@brutalway/oxlint-config-next': minor
'@brutalway/oxlint-config-react-native': minor
'@brutalway/oxlint-config-fastify': minor
---

`@brutalway/oxlint-config-react-vite`, `-next` and `-react-native` move to `@brutalway/oxlint-config-react` `^0.5.0` and `@brutalway/oxlint-config-zustand` `^0.3.0`, and `@brutalway/oxlint-config-fastify` to `@brutalway/oxlint-config-node` `^0.3.0`. They all reach `@brutalway/oxlint-config-typescript` 0.8.0:

- `export default` is rejected, except in the files a tool loads by their default export and the files the framework names (`src/app/` on next and react-native)
- no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts` in a `shared/`, at any depth, instead of under `shared-features/`
