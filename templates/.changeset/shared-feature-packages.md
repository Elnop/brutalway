---
'template-package': patch
'template-fastify': patch
'template-vite': patch
'template-next': patch
'template-react-native': patch
---

Moves to `@brutalway/check-tree` 0.12.0, `@brutalway/dependency-cruiser-config` 0.12.1, `@brutalway/alint-config` 0.2.3 and, on vite, next and react-native, `@brutalway/oxlint-config-react` 0.5.1. Their messages say "shared feature" for a folder of a `shared/`, like the docs, and check-tree no longer counts a test as a consumer of a shared file.
