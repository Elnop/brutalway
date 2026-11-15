---
'@brutalway/check-tree': patch
---

The check on `shared/` gives its paths from the parent of the checked folder, like the folder checks. `check-tree packages/ws/src` used to print `src/features/stock/lib holds a single child` next to `packages/ws/src/shared/seul.ts is only used by packages/ws/src/features/panier`, and `./src/` with a trailing slash was not matched at all.
