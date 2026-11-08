# Working on this project

A Vite + React + TypeScript app where every convention is checked by a tool. `README.md` explains the layout, `docs/architecture.md` the patterns it follows and `docs/verifications.md` each rule with the tool that enforces it.

## Before calling a change done

Run `npm run check`: Prettier, tsc, Oxlint, stylelint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, i18next-cli, alint and knip. Each message says what to change. Then run `npm test`, and `npm run e2e` when the change shows on screen.

## Conventions worth knowing first

- `src/app/` composes the features, `src/features/` holds one folder per feature, `src/shared-features/` the business code several features use, `src/shared/` the code with no domain. Each layer only imports the layers below it, and a feature never imports another feature.
- A component is either an orchestrator (`XContainer`, `XLayout`, `XPage`) that reads state through hooks, or a presenter that only gets props.
- Every visible string goes through `t()`, with its English text in `src/app/locales/en/`.
- Styles go in one stylesheet per feature, and a color is a `var()` of a token of `src/app/globals.css`.
- No comments, no relative imports (`@/` instead), no `index.ts`.
