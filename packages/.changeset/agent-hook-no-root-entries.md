---
'@brutalway/agent-hook': minor
---

Breaking: `--root-entries` is gone. The hook runs `check-tree <folder>` with no other flag, and check-tree reads `rootEntries`, `platforms` and `categories` from the `"check-tree"` key of `package.json` (check-tree 0.10.0 and up). Move the flag from `.claude/settings.json` to that key, and drop `--root-entries` from the `tree` script as well.
