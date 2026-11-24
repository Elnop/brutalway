---
'template-fastify': minor
'template-next': minor
'template-package': minor
'template-react-native': minor
'template-vite': minor
---

The tests move out of `src/` into `test/`: `test/unit/` holds the unit and component tests at the path of their source, `test/e2e/` the Playwright specs of vite and next, and `test/support/` the helpers they share, where `test-utils/` was. The aliases follow: `@test-support/` and `@test-e2e/` on the front-end stacks, `#test-support/*` on fastify and package. check-tree 0.15.0 keeps `test/unit/` a mirror of `src/`, and `npx check-tree src --fix` moves the tests whose source moved. dependency-cruiser-config 0.14.0 adds `unit-test-own-source`: a unit test imports from `src/` its own source and `xConfig.ts` or `xTypes.ts` files only, so the `I18nProvider` tests read their expected title from `locales/`, and the fastify route tests get their service from `test/support/memoryTodos.ts`. `tsconfig.app.json`, `.jscpd.json` and `knip.json` no longer leave the tests out of `src/`.
