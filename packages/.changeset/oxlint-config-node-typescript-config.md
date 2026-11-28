---
'@brutalway/oxlint-config-node': patch
---

Depends on `@brutalway/oxlint-config-typescript` ^0.10.0. A project that adds the `line-width` config of that package next to this one needs both on the same version: with two copies, oxlint fails with "Plugin name 'sonarjs' is already registered". Update this package with the others, nothing else to do.
