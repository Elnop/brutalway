# Commands

| Command | What it does |
|---|---|
| `npm run build` | tsdown: `dist/` with one JavaScript file and its types per entry point |
| `npm run check` | `brutal-check`: every check of [Verifications](verifications.md) at the same time, then the list of those that failed |
| `npm test` | `node:test`: each feature, then each entry point end to end |
| `npm run format` | Prettier in write mode |
| `npm run release` | `changeset publish`, run by the release workflow |

`npm pack` and `npm publish` build first, through the `prepack` script.
