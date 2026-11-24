---
'create-brutal': minor
---

A `--[no-]unit-tests` option, yes by default, on the five stacks. Without it, the project gets no `test/unit/` or `test/support/`, no test runner and no `test` script: Vitest and its config on vite and next, Jest and its config on react-native, the `node:test` lint config on fastify and package. The test step leaves the CI workflow, and the test lines leave `AGENTS.md` and the docs. `--component-tests` and `--coverage` need it, and `--e2e` stays independent. check-tree still checks `test/unit/`, so a test added later goes at the path of its source.

The `tsconfig.third-party.json` of next with shadcn/ui no longer loads the types of `vite/client`, which only resolved while Vitest brought vite in.
