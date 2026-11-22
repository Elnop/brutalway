---
'template-fastify': patch
'template-next': patch
'template-package': patch
'template-react-native': patch
'template-vite': patch
---

The templates use check-tree 0.14.0 (`--shrink-known-violations`), check-exceptions 0.2.0 (counts `oxlint-suppressions.json` and `.alint-baseline.json`) and alint-config 0.2.4 (the `exact-dependency-versions` message quotes the range).
