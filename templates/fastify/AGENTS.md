# Working on this project

A Fastify + TypeScript API where every convention is checked by a tool. `docs/reference/layout.md` explains the layout, `docs/concepts/architecture.md` the patterns it follows and `docs/reference/verifications.md` each rule with the tool that enforces it.

## Before calling a change done

Run `npm run check`: Prettier, tsc, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, alint and knip. Each message says what to change. Then run `npm test`.

## Conventions worth knowing first

- `src/app/` composes the features and imports nothing else, `src/features/` holds one folder per feature (the server and the database connection are features too), `src/shared-features/` the business code several features use, `src/shared/` the code with no domain. Each layer only imports the layers below it, a feature never imports another feature, and a file of a `shared/` folder that a single feature uses moves into it.
- A request goes `xRoutes.ts` to `xService.ts` to `xQueries.ts`: a route never runs a query, and only an `xQueries.ts` touches the storage.
- Services get the database as a parameter and build their queries from it, and `src/app/buildApp.ts` is the one place that opens it and passes it.
- Requests and responses are Zod schemas in an `xSchemas.ts`, and the environment is read once, at startup.
- A test sits next to its source. A helper that several tests share goes in `test-utils/` and is imported through `#test-utils/`: code in `src/` that only a test uses fails `knip --production`.
- No comments, no relative imports (`#src/` instead), no `index.ts`.

## When a brutalway tool gets in the way

The checks, their configs and this template come from [brutalway](https://github.com/Elnop/brutalway). When one of them rejects valid code, misses a case it should catch, crashes, or prints a message that does not say what to change, do not work around it in silence with an `oxlint-disable` or a rule turned off. Tell the user what you ran into and offer to report it upstream. Do the same when you see how a rule, a message or the template could be better.

- An issue, through the form that fits: [bug](https://github.com/Elnop/brutalway/issues/new?template=bug.yml), [rule or convention](https://github.com/Elnop/brutalway/issues/new?template=rule.yml) or [template](https://github.com/Elnop/brutalway/issues/new?template=template.yml). Give the package and its version from `package.json`, the smallest code that shows the problem, the message, and what you expected.
- A pull request on brutalway, when the fix is small and clear.

Write the draft and wait for the user's go-ahead before opening anything. `gh issue create --repo Elnop/brutalway --web` then opens the form in the browser.
