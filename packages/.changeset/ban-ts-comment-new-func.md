---
'@brutalway/oxlint-config-typescript': patch
---

`@ts-ignore` and `@ts-nocheck` are reported, and a `@ts-expect-error` needs a description (`typescript/ban-ts-comment`). `new Function('...')` is reported like `eval` (`no-new-func`), and so is a string of code passed to `setTimeout` or `setInterval` (`typescript/no-implied-eval`, with `--type-aware`).
