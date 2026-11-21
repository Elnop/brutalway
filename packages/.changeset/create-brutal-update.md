---
'create-brutal': minor
---

A project records the version that made it, its stack, its name and every answer in `.brutalway.json`, and `npx create-brutal@latest update` merges what changed in the template since then: it generates the project at both versions with the same answers and cherry-picks the difference into the working tree, so the project keeps its own changes and conflicts show up as in any git merge. `package.json` is merged key by key. `--to` picks the target version, `--set` changes an answer, `--from` and `--stack` attach a project made before 0.16.0, and `check` exits with 1 when a newer version changes the project.

Without the database option, the fastify architecture doc no longer mentions the database that `src/app/buildApp.ts` opens.
