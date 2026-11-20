---
'template-package': patch
'template-fastify': patch
'template-vite': patch
'template-next': patch
'template-react-native': patch
---

Moves to `@brutalway/check-tree` 0.10.1. On react-native, a platform variant such as `alert.web.ts` gets the consumers of `alert.ts`, so a file of a slice that only the variant imports is no longer reported as used by a single feature.
