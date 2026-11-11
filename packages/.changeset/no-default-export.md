---
'@brutalway/oxlint-config-typescript': minor
---

`export default` is rejected (`import/no-default-export`), so each module is imported under the name it exports. The files a tool loads by their default export are exempt: `*.config.ts`, `*.config.mts`, `plugin.ts`, `xPlugin.ts`, `.d.ts` files and `fixtures/`. A project that exports a default from any other file starts failing.
