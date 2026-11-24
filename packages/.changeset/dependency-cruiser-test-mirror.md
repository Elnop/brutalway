---
'@brutalway/dependency-cruiser-config': minor
---

The tests live in `test/`: `test/unit/` at the path of their source, `test/support/` for the helpers they share and `test/e2e/`. Every file of `test/` counts as a test, and `test-utils/`, `e2e/` and the `.test.ts` files under `src/` no longer do. Move the tests with `npx check-tree src --fix` from @brutalway/check-tree, and run `depcruise src test`.

A new rule, `unit-test-own-source`, keeps a unit test on its own source: from `src/`, it imports the file at its mirrored path, a platform variant of it, and `xConfig.ts` or `xTypes.ts` files, nothing else. A unit test also follows the layer rules of its source, so `test/unit/features/cart/` cannot import another feature. A test that drives several files has to be split, or its setup moved into `test/support/`.
