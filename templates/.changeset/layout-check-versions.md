---
'template-vite': patch
'template-next': patch
'template-react-native': patch
'template-fastify': patch
'template-package': patch
---

`@brutalway/check-tree` 0.6.0 and `@brutalway/dependency-cruiser-config` 0.7.0: `npm run check` rejects a folder the layout does not name, like a concept folder under `src/shared/`, and an import between two sub shared features.
