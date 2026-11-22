# Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run check` | `brutal-check`: every check of [Verifications](verifications.md), in order, then the list of those that failed |
| `npm test` | Vitest: unit tests in Node, component tests in headless Chromium |
| `npm run e2e` | runs `next build`, then Playwright against `next start` |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build` in one job and `e2e` in another.
