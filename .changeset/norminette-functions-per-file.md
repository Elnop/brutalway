---
'@brutalway/oxlint-config-typescript': minor
'create-brutal': minor
'@brutalway/check-doc-length': patch
'@brutalway/check-doc-sources': patch
'@brutalway/agent-hook': patch
'@brutalway/oxlint-config-tailwind': patch
---

A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.
