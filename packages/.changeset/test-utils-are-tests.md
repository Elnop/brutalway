---
'@brutalway/dependency-cruiser-config': minor
---

`no-prod-to-tests` also rejects production code importing `test-utils/` or `e2e/`, and the server and library rules treat a file in those folders as a test.
