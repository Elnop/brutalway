# Templates

Each template is a starter repository where the conventions are checked by tools. They all build the same todo list, so you can compare the stacks side by side, and they share the [common rules](../docs/reference/rules.md) of brutalway.

| Template | Stack | Status |
|---|---|---|
| [template-vite](vite) | Vite, React, zustand, Vitest, Playwright | ready |
| [template-fastify](fastify) | Fastify, Zod, node:sqlite, node:test, Swagger UI | ready |
| [template-package](package) | a standalone npm package: tsdown, node:test, changesets | ready |
| template-next | Next.js | planned |
| template-react-native | React Native | planned |

To start a project from one of them:

```sh
npm create brutal my-app
```

The CLI asks for the stack, then lets you drop the parts you do not need. Every option is listed in the [create-brutal README](../packages/tools/create-brutal/README.md).
