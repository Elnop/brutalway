---
'@brutalway/oxlint-config-next': patch
---

A `'use client'` file may import `analyticsClient.ts`, since events happen in the browser. Any other `xClient.ts` is still reported.
