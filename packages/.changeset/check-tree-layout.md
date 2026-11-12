---
'@brutalway/check-tree': minor
---

check-tree rejects a folder the layout does not name. `src/` holds `app/`, `features/`, `shared-features/` and `shared/` next to its entry files, `src/shared/` holds kind folders only, and a feature or a shared feature, at any depth, holds kind folders, `features/`, `shared-features/` and `shared/`. A kind folder holds kind folders only, and `app/` is not checked. A concept folder like `src/shared/authentication/` now gets `src/shared/authentication is not a kind folder: src/shared/ holds no domain, move its files into lib/, types/, configs/... or into a shared feature`. `--categories` also sets the kind folders the layout accepts.
