---
'template-vite': minor
'template-next': minor
'template-react-native': minor
'template-fastify': minor
'template-package': minor
---

The checks catch up with the single `src/shared/` split into slices. `@brutalway/dependency-cruiser-config` 0.11.0 follows the imports of a presenter: it is refused when it reaches a store, a client, zustand or react-query through any chain of imports, and when it imports an orchestrator, while a hook of local state stays fine. The oxlint config of each template (`oxlint-config-react-vite` 0.5.0, `-next` 0.3.0, `-react-native` 0.3.0, `-fastify` 0.3.0, `-node` 0.3.0) rejects an orchestrator or an `xRoutes.ts` in a `shared/` at any depth, and an `export default` outside the files a tool or the framework loads by their default export.
