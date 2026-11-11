# @brutalway/oxlint-config-next

Oxlint preset for Next.js apps on the App Router. It extends [@brutalway/oxlint-config-react](https://www.npmjs.com/package/@brutalway/oxlint-config-react), [@brutalway/oxlint-config-zustand](https://www.npmjs.com/package/@brutalway/oxlint-config-zustand) and [@brutalway/oxlint-config-vitest](https://www.npmjs.com/package/@brutalway/oxlint-config-vitest), turns on the `nextjs` plugin of oxlint, and adds rules on where client code and server actions go.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-next
```

```ts
import { nextConfig } from '@brutalway/oxlint-config-next';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nextConfig],
});
```

## Usage

When a rule fires:

- `'use client'` in a presenter, a hook or a `shared/` file: put it on the orchestrator that renders the component. Whatever a client component imports runs in the browser too.
- a `'use client'` file importing an `xClient.ts`: call the client from a server component (`page.tsx`, `layout.tsx`) and pass the data down as a prop
- `'use server'` inside a function: move the function into a file of its own, named after what it does, that starts with `'use server'`
- a `'use server'` file with two exports: split it, one action per file

## Rules

- every rule of the `nextjs` plugin of oxlint, as errors: `<img>` instead of `next/image`, `<head>`, sync scripts, Google Fonts without `display`...
- `'use client'` only in an orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`), a provider (`XProvider.tsx`) or an `error.tsx` of `app/`, and never under `shared/` or `presenters/`
- a `'use client'` file imports no `xClient.ts`
- a server action lives in a `.ts` file that starts with `'use server'`, exports one async function and is named after it (`addTodo` in `addTodo.ts`). `'use server'` inside a function body is reported.
- the route files of `app/` (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `default.tsx`...) may `export default`, and may export `generateMetadata`, `metadata`, `revalidate` and the other route segment options next to the component. `not-found.tsx`, `global-error.tsx` and `global-not-found.tsx` keep their kebab-case names, and `route.ts` may export `GET`, `POST`...
- no relative imports: import through the aliases of `tsconfig.json`
- side effect imports allowed for `.css` files only
- `import/default`, `typescript/no-non-null-assertion` and `unicorn/prefer-add-event-listener` off
- the `node` env for `e2e/`, `*.config.ts`, `proxy.ts` and `instrumentation.ts`

## Why

A presenter is a function of its props, whether it runs on the server or in the browser. Keeping `'use client'` on the orchestrators means the client boundary sits where state is read, and a reader finds it from the file name. A server component can call an API client and hand the result down, which saves a request from the browser.
