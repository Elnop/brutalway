---
'create-brutal': minor
---

The projects run their checks with `brutal-check` from `@brutalway/check`: `npm run check` is `brutal-check`, and each check is a script of its own (`format:check`, `repo`, `unused`, `secrets`, `exceptions` join the others). A project whose `check` line had its own checks keeps it on `update`: set it to `brutal-check` followed by them.
