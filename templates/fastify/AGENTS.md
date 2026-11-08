# Working on this project

A Fastify + TypeScript API where every convention is checked by a tool. `README.md` explains the layout and the endpoints, `docs/architecture.md` the patterns it follows and `docs/verifications.md` each rule with the tool that enforces it.

## Before calling a change done

Run `npm run check`: Prettier, tsc, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, alint and knip. Each message says what to change. Then run `npm test`.

## Conventions worth knowing first

- `src/app/` wires everything, `src/features/` holds one folder per feature, `src/shared-features/` the business code several features use, `src/shared/` the code with no domain. Each layer only imports the layers below it, and a feature never imports another feature.
- A request goes `xRoutes.ts` to `xService.ts` to `xQueries.ts`: a route never runs a query, and only an `xQueries.ts` touches the storage.
- Services get their dependencies as parameters, and `src/app/buildApp.ts` is the one place that creates and passes them.
- Requests and responses are Zod schemas in an `xSchemas.ts`, and the environment is read once, at startup.
- No comments, no relative imports (`#src/` instead), no `index.ts`.
