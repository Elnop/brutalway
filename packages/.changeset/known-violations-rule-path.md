---
'@brutalway/check-tree': minor
---

`.check-tree-known-violations.json` lists `{ "rule", "path", "count" }` objects instead of the printed messages. An entry stays known while its rule fires on the same path with a count no higher than the one written, so adding a file to a shared feature already listed, or fixing one of its groups, no longer turns it into a new violation. The old format is refused: run `check-tree src --write-known-violations` to rewrite the file.
