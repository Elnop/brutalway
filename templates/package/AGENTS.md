# Working on this project

A standalone npm package in TypeScript where every convention is checked by a tool. `README.md` explains the layout, the example and how a version is published, `docs/architecture.md` the patterns it follows and `docs/verifications.md` each rule with the tool that enforces it.

## Before calling a change done

Run `npm run check`: Prettier, tsc, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, alint and knip. Each message says what to change. Then run `npm test`.

## Conventions worth knowing first

- Each entry point is a file at the root of `src/`, one per bin or export of `package.json`, also listed in `tsdown.config.ts`. Nothing but a test imports it.
- `src/features/` holds one folder per feature, `src/shared-features/` the business code several features use, `src/shared/` the code with no domain. Each layer only imports the layers below it, and a feature never imports another feature.
- Each entry point has a test that runs it end to end: the bin through `node`, the export through its exported functions.
- A change worth a release comes with a changeset (`npx changeset`).
- `devDependencies` are pinned to exact versions, `dependencies` and `peerDependencies` keep ranges.
- No comments, no relative imports (`#src/` instead), no `index.ts`.
