---
'@brutalway/oxlint-config-typescript': patch
---

`interface` is accepted inside `declare module '…'`, the only way TypeScript merges a declaration into a package's types (`FastifyRequest`, i18next's `CustomTypeOptions`). `declare namespace` is still reported.
