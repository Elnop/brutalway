[![brutalway: every convention is a check](.github/assets/banner.png)](https://brutalway.elnop.dev/)

# brutalway

Project templates where the conventions are enforced by deterministic checks. When several people or AI agents write in the same codebase, a convention that is only written down drifts within days. Here each one is a lint rule, an import rule or a tree rule, and `npm run check` fails with a message that says what to change.

Every template builds the same todo list, so the stacks can be compared side by side. The front ends share one neo-brutalist look (thick black borders, flat pastel colors, hard shadows), and so does the Swagger UI of the API.

| Template | Stack | Status |
|---|---|---|
| [template-vite](templates/vite) | Vite, React, zustand, Vitest, Playwright | ready |
| [template-fastify](templates/fastify) | Fastify, Zod, node:sqlite, node:test, Swagger UI | ready |
| [template-package](templates/package) | a standalone npm package: tsdown, node:test, changesets | ready |
| template-next | Next.js | planned |
| template-react-native | React Native | planned |

[docs/concepts/intent.md](docs/concepts/intent.md) explains why the conventions are checked by tools and the six axioms behind them, which spell BRUTAL. [docs/concepts/inspirations.md](docs/concepts/inspirations.md) lists the architecture principles the templates borrow from, with what they take and what they leave out.

## The common rules

The code is split into layers that only import downwards, every file is named after what it exports and placed by kind, and there is one way to write each construct. [docs/reference/rules.md](docs/reference/rules.md) lists each rule, the tool that checks it and the message it prints.

## Packages

The rules and every shared config are published from `packages/` as `@brutalway/*`. The rule plugins run in both oxlint and ESLint, and each package has its own README. [packages/README.md](packages/README.md) lists them with what each one checks.

## Claude Code plugin

`plugins/brutal-checks` runs `@brutalway/agent-hook` after each `Edit` or `Write`, in any project that has `@brutalway/agent-hook` installed, without editing the project's `.claude/settings.json`. In other projects it does nothing.

```
/plugin install brutal-checks --marketplace Elnop/brutalway
```

## Using a template

```sh
npm create brutal my-app
```

The CLI asks for a stack, then for the parts to keep (the example app, e2e tests, the Claude Code hook, CI...) and, on vite, for plain CSS or Tailwind. Every combination passes `npm run check`. [create-brutal](packages/tools/create-brutal/README.md) lists the options and the flags to run it without questions.

The templates live in `templates/`, and the CLI downloads them from there. To work on this repository, see [CONTRIBUTING.md](CONTRIBUTING.md).
