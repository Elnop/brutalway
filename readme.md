# elnop-stacks

Project templates where the conventions are enforced by deterministic checks. When several people or AI agents write in the same codebase, a convention that is only written down drifts within days. Here each one is a lint rule, an import rule or a tree rule, and `npm run check` fails with a message that says what to change.

Every template builds the same todo list, so the stacks can be compared side by side. The front ends share one neo-brutalist look (thick black borders, flat bright colors, hard shadows), and so does the Swagger UI of the API.

| Template | Stack | Status |
|---|---|---|
| [template-vite](https://github.com/Elnop/template-vite) | Vite, React, zustand, Vitest, Playwright | ready |
| [template-fastify](https://github.com/Elnop/template-fastify) | Fastify, Zod, node:sqlite, node:test, Swagger UI | ready |
| template-next | Next.js | planned |
| template-react-native | React Native | planned |

[docs/intent.md](docs/intent.md) explains why the conventions are checked by tools and the six axioms behind them, which spell BRUTAL. [docs/inspirations.md](docs/inspirations.md) lists the architecture principles the templates borrow from, with what they take and what they leave out.

## The common rules

- the code is split into layers (`app`, `features`, `shared-features`, `shared`), each importing only the ones below, and features never import each other
- on the front end, components are orchestrators, which read stores, or presenters, which only get props
- on the API, a route calls its service, and only queries files run SQL
- one way to write each construct, no comments, no relative imports, no barrel files
- files are named after what they export and placed by kind: one file stays at the root of its folder, two or more move into `components/`, `hooks/`, `routes/`, `lib/` and so on
- every dependency is pinned, every path cited in the docs exists, no export goes unused
- a Claude Code hook lints each file the agent edits and sends the errors back to it

The lint configs, plugins and every shared config (TypeScript, Prettier, dependency-cruiser, alint, Playwright fixtures, the agent hook) are published as `@elnop/*` from [Elnop/elnop-tooling](https://github.com/Elnop/elnop-tooling). Each template README lists the tools and how they map to these rules.

## Using a template

```sh
npm create brutal my-app
```

The CLI asks for a stack, then for the parts to keep (the example app, e2e tests, the Claude Code hook, CI...). Every combination passes `npm run check`. [create-brutal](create-brutal/README.md) lists the options and the flags to run it without questions.

Each template is also its own GitHub template repository: open it and click "Use this template". To get them all at once:

```sh
git clone --recurse-submodules https://github.com/Elnop/elnop-stacks.git
```

## Working on this repository

`site/` is the landing page, made from template-vite and deployed to GitHub Pages on each push that changes it. It has its own `package.json` and its own `npm run check`.

The root `package.json` holds the shared tooling and lists the workspaces one by one, since the template submodules have their own `package.json`. `npm run check` runs Prettier, tsc, Oxlint and knip, `npm test` runs the CLI tests, and `npm run matrix` creates a project for every combination of options and checks it. `npm run release` runs the checks and the tests, then publishes create-brutal to npm. The build records the commit of each submodule, so commit the submodule bumps before releasing.
