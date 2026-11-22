---
'@brutalway/oxlint-config-typescript': patch
---

export-placement accepts an exported object that holds a function at any depth, such as a query key factory made of nested objects, instead of only at its first level. An object of plain values, nested or not, still belongs in an `XConfig.ts`.
