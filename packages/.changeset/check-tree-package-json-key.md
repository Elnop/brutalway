---
'@brutalway/check-tree': minor
---

check-tree reads its options from the `"check-tree"` key of the `package.json` in the current folder: `categories`, `rootEntries` and `platforms`. A flag wins over its key. `npm run check` and the agent hook then check the tree with the same options without repeating them in two commands.
