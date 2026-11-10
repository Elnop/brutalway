---
'@brutalway/tsconfig': minor
---

`react-vite.json` sets `lib` to ES2024 with the DOM libs, like `node.json`. `toSorted`, `findLast` and `Object.groupBy` now pass `tsc` in a React + Vite project, which matters since the Oxlint configs ask for `toSorted` over `sort`.
