---
'template-package': patch
'template-fastify': patch
'template-vite': patch
'template-next': patch
'template-react-native': patch
---

Moves to `@brutalway/check-tree` 0.10.0 and `@brutalway/agent-hook` 0.4.0. check-tree reads its options from the `"check-tree"` key of `package.json`, and the agent hook runs it with no flag, so both check the tree the same way. On react-native, a platform variant such as `useScreenTitle.web.ts` has the kind of `useScreenTitle.ts` and counts as one file with it, and `docs/reference/layout.md` says when to write one instead of `Platform.select`. On next and package, `--root-entries` moves from the `tree` script and `.claude/settings.json` to `"rootEntries": true` in that key.
