---
'@brutalway/oxlint-config-typescript': patch
---

`no-console` is off in `logger.ts` and `xLogger.ts`, so a project can write the one logger the rest of its code goes through without a suppression.
