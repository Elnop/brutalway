---
'@brutalway/check-tree': patch
---

The message for a file of a shared feature with a single consumer says to move it with the tests that import it: dependency-cruiser checks their imports, so a test left behind breaks a `no-cross-sub-*` rule right after the move.
