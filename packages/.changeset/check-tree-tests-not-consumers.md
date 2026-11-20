---
'@brutalway/check-tree': minor
---

A test is never a consumer of a file of `shared/`, wherever it sits. `src/shared/dates/format.ts`, imported by `src/features/cart/Cart.tsx` and by `src/features/orders/ordersSelectors.test.ts`, now gets `src/shared/dates/format.ts is only used by src/features/cart: move it into src/features/cart`. Once the file moves, the test of `orders` fails `no-cross-feature`: it tests code `orders` does not use. A file that only tests import still passes check-tree, and `knip --production` reports it.
