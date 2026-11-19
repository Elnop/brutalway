---
'@brutalway/check-tree': minor
---

check-tree reads `.check-tree-known-violations.json` from the current folder when it exists, and stops reporting the violations listed there. A violation missing from the list still fails, and so does an entry that no longer happens, so the list can only shrink. `--write-known-violations` writes the current violations to that file.
