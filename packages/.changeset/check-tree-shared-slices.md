---
'@brutalway/check-tree': minor
---

`src/shared/` and `src/shared-features/` merge into a single `shared/` split into slices, at any depth. A `shared/` holds one folder per slice and no file, a slice is laid out like a feature, and `shared-features/` is no longer a layer. The consumers rule covers every slice: a file of a slice, or a whole slice, used by a single feature is reported, which the slices of `shared-features/` used to escape. A new rule asks the files of a slice, tests aside, to form one group in the import graph: `src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one slice per group`. `sharedViolations` returns both.

To migrate, rename `shared-features/<x>/` to `shared/<x>/`, move each file of the old `shared/` into a slice named after its concept, and split each slice the way check-tree lists its groups.
