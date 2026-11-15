---
'@brutalway/oxlint-config-next': patch
---

`file-named-after-export` is off for `instrumentation.ts` and `instrumentation-client.ts`. Next.js imposes the file name and the export name, so `src/instrumentation.ts` exporting only `register` was rejected with no way to comply.
