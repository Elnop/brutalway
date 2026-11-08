---
'create-brutal': minor
---

New `package` stack, from template-package: a standalone npm package with the todo list as its `"."` export and a `todo` bin. Its options are `example` (without it, `src/greet.ts` as the export and, with `bin`, a `src/cli.ts` named after the project), `bin`, `release` (changesets, a `release` script and a workflow publishing to npm with trusted publishing and provenance), `claude-hook` and `ci`. The project starts at version 0.1.0, without `private`, through the new `projectVersion` field of a stack.
