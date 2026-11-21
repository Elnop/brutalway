---
'@brutalway/eslint-plugin-file-named-after-export': patch
---

A platform variant keeps the name of its base: `useMediaSession.web.ts` exporting `useMediaSession` is no longer reported. The `platforms` option lists the suffixes to strip, `web`, `ios`, `android` and `native` by default.
