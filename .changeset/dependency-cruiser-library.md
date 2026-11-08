---
'@brutalway/dependency-cruiser-config': minor
---

New `library` config for a published package: the entry points are files at the root of `src/`, nothing but a test imports them, and there is no `src/app/`.
It also lets the code import a peer dependency that is a dev dependency too, as `oxlint` is for a lint config.
