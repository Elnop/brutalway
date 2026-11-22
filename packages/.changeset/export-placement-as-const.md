---
'@brutalway/oxlint-config-typescript': patch
---

export-placement looks through `as const` and `satisfies`: `export const queryKeys = { ... } as const` holding functions is a factory, not a constant. An object of plain values is still reported, with or without them.
