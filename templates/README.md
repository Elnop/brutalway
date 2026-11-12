# Templates

Each template is a starter repository where the conventions are checked by tools. They all build the same todo list, so you can compare the stacks side by side, and they share the [common rules](../docs/reference/rules.md) of brutalway.

| Template | Stack | Status |
|---|---|---|
| [template-vite](vite) | Vite, React, zustand, Vitest, Playwright | ready |
| [template-fastify](fastify) | Fastify, Zod, node:sqlite, node:test, Swagger UI | ready |
| [template-package](package) | a standalone npm package: tsdown, node:test, changesets | ready |
| [template-next](next) | Next.js App Router, React, zustand, Vitest, Playwright | ready |
| [template-react-native](react-native) | Expo, Expo Router, React Native, zustand, Jest | ready |

To start a project from one of them:

```sh
npm create brutal my-app
```

The CLI asks for the stack, then lets you drop the parts you do not need. `--stack <stack>` picks it up front. The options page of each template lists what you can turn on or off, with the flags to answer without questions: [vite](vite/docs/reference/options.md), [next](next/docs/reference/options.md), [react-native](react-native/docs/reference/options.md), [fastify](fastify/docs/reference/options.md), [package](package/docs/reference/options.md). The flags shared by every stack are in the [create-brutal README](../packages/tools/create-brutal/README.md).
