---
'@brutalway/oxlint-config-typescript': minor
'@brutalway/oxlint-config-react': minor
'@brutalway/oxlint-config-next': minor
'@brutalway/oxlint-config-react-vite': minor
---

The end-to-end tests move from `e2e/` to `test/e2e/`, next to `test/unit/` and `test/support/`. The overrides that relax the naming, placement, length and component rules for them, and the `node` env of next and react-vite, now apply to `test/e2e/**` and no longer to `e2e/**`. Move the folder with `git mv e2e test/e2e` and point `testDir` of `playwright.config.ts` at it.
