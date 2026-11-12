---
'@brutalway/dependency-cruiser-config': minor
---

The sub-feature rules of `layers` apply inside a shared feature too, so a sub-feature of `src/shared-features/<x>/features/` can no longer import its siblings or the root of its parent. A feature or a shared feature can hold sub shared features in `shared-features/<y>/`: the new `no-cross-sub-shared-feature` rule keeps one from importing another, a sub-feature or the root of its parent, and `feature-shared-not-to-sub-features` keeps the parent `shared/` from importing them. A sub-feature can import the sub shared features of its parent.
