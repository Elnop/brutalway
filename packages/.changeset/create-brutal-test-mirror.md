---
'create-brutal': minor
---

The projects keep their tests in `test/`: `test/unit/` at the path of their source, `test/e2e/` for the Playwright specs and `test/support/` for the helpers, where `test-utils/` was. They get check-tree 0.15.0, dependency-cruiser-config 0.14.0 and agent-hook 0.5.0. An option that removes or moves a file of `src/` removes or moves its test in `test/unit/` with it, and the folders left empty in `test/` are deleted.
