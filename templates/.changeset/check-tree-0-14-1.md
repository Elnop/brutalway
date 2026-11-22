---
'template-fastify': patch
'template-next': patch
'template-package': patch
'template-react-native': patch
'template-vite': patch
---

The templates use check-tree 0.14.1, whose single-consumer message says to move the file with the tests that import it, and oxlint-config-typescript 0.8.1, which accepts nested key factories and lets `logger.ts` use the console.
