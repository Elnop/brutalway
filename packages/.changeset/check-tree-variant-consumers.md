---
'@brutalway/check-tree': patch
---

A platform variant gets the consumers of its base in the rule on `shared/`. dependency-cruiser resolves `@/shared/theme/lib/alert` to `alert.ts`, so `alert.web.ts` had no importer, and a file that only `alert.web.ts` imported was reported as used by the one feature that imported it elsewhere: `src/shared/theme/alertStore.ts is only used by features/shell`.
