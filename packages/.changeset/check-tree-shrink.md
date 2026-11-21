---
'@brutalway/check-tree': minor
---

`--shrink-known-violations` deletes the entries of `.check-tree-known-violations.json` that no longer happen and lowers the counts that went down, without adding new violations. check-tree now also fails on an entry whose count is higher than the current one: run `npx check-tree src --shrink-known-violations` once after the bump.
