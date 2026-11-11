# Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run check` | Prettier, both `tsc` projects, Oxlint, stylelint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, i18next-cli, alint, knip |
| `npm test` | Vitest: unit tests in Node, component tests in headless Chromium |
| `npm run e2e` | runs `next build`, then Playwright against `next start` |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build` in one job and `e2e` in another.
