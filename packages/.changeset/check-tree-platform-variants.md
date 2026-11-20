---
'@brutalway/check-tree': minor
---

A platform variant (`X.web.ts`, `X.ios.tsx`, `X.android.ts`, `X.native.ts`) goes with `X.ts`, whether that file exists or not: it has the kind of `X.ts`, counts as one file with it in the grouping and single-child rules, and sits in its group in the import graph of a slice. `--platforms`, and the `platforms` option of `treeViolations` and `sharedViolations`, replace the list of platforms.
