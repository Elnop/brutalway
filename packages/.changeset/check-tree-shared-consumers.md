---
'@brutalway/check-tree': minor
---

check-tree rejects a file of a `shared/` folder that a single consumer uses. For `src/shared/`, a consumer is a feature or a shared feature. For the `shared/` of a feature, it is one of its sub-features, one of its sub shared features or its own files outside them. A file imported by another file of the same `shared/` gets the consumers of that file, and a test counts for the feature it sits in. To resolve the imports, check-tree reads the dependency-cruiser config of the current folder: `dependency-cruiser` is now a peer dependency, and check-tree stops with a message when the folder has no config. `@brutalway/check-tree/sharedViolations` runs this check from code.
