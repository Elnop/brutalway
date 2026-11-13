---
'@brutalway/dependency-cruiser-config': minor
---

`app-only-to-features` rejects an import of `shared-features/` or `shared/` from `src/app/`, which only composes the features. With `server`, a service builds its queries from the database it gets, `src/app/` no longer wires them (`queries-behind-services`), the connection is opened in `src/features/database/` instead of `src/shared/` and a test may open its own (`database-in-queries`), and a worker lives in a feature so that `src/app/` can start it.
