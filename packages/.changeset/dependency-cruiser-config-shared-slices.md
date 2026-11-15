---
'@brutalway/dependency-cruiser-config': minor
---

`src/shared/` and `src/shared-features/` merge into a single `src/shared/` split into slices, one folder per concept, at any depth. `no-cross-shared` keeps a slice from importing another one, which replaces `no-cross-shared-feature` and `shared-features-not-to-features`. Inside a feature or a slice, `no-cross-sub-shared` keeps a slice of its `shared/` from importing another slice, a sub-feature or the root of its parent, which replaces `no-cross-sub-shared-feature` and `feature-shared-not-to-sub-features`. `presenters-are-pure` looks for the hooks of `src/shared/<slice>/`, and `stores-in-their-folder` accepts a store at the root or in the `stores/` folder of a slice.

To migrate, rename `src/shared-features/<x>/` to `src/shared/<x>/`, and move each file of the old `src/shared/` into a slice named after its concept (`shared/errors/errorMessage.ts`). A file a single slice uses moves into that slice. Do the same in the `shared/` and `shared-features/` of each feature.
