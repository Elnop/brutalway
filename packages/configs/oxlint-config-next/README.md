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

## An app that reads its data through an API

When every read and write goes through route handlers or another API, called from the client with TanStack Query, extend `noServerFunctionsConfig` after `nextConfig`:

```ts
import { nextConfig } from '@brutalway/oxlint-config-next';
import { noServerFunctionsConfig } from '@brutalway/oxlint-config-next/no-server-functions';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nextConfig, noServerFunctionsConfig],
});
```

It reports every `'use server'` and every `'use cache'` (`'use cache: remote'` and `'use cache: private'` included), at the top of a file or in a function. A server action would be a second way to the data, outside the API, and `'use cache'` a second cache on top of TanStack Query's. The rules on server actions below have nothing left to check, so it replaces them. template-next turns it on with its `server-state` option.

## Usage

When a rule fires:

- `'use client'` in a presenter, a hook or a `shared/` file: put it on the orchestrator that renders the component. Whatever a client component imports runs in the browser too.
- a `'use client'` file importing an `xClient.ts`: call the client from a server component (`page.tsx`, `layout.tsx`) and pass the data down as a prop
- `'use server'` inside a function: move the function into a file of its own, named after what it does, that starts with `'use server'`
- a `'use server'` file with two exports: split it, one action per file

## Rules

- every rule of the `nextjs` plugin of oxlint, as errors: `<img>` instead of `next/image`, `<head>`, sync scripts, Google Fonts without `display`...
- `'use client'` only in an orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`), a provider (`XProvider.tsx`) or a file of `src/app/`, where Next.js decides (it asks for it on `error.tsx` and `global-error.tsx`), and never under `shared/` or `presenters/`
- a `'use client'` file imports no `xClient.ts`, except `analyticsClient.ts`, since events happen in the browser
- a server action lives in a `.ts` file that starts with `'use server'`, exports one async function and is named after it (`addTodo` in `addTodo.ts`). `'use server'` inside a function body is reported.
- the files Next.js names, everything under `src/app/` and the files at the root of `src/` (`proxy.ts`, `instrumentation.ts`, `instrumentation-client.ts`, `mdx-components.tsx`), are left out of the rules on file names, exports and props: Next.js picks the file name, the default or named exports (`GET`, `generateMetadata`, `size`, `register`, `useMDXComponents`...) and the props (`params`, `error`, `reset`). The other rules still apply to them.
- no relative imports: import through the aliases of `tsconfig.json`
- side effect imports allowed for `.css` files only
- `import/default`, `typescript/no-non-null-assertion` and `unicorn/prefer-add-event-listener` off
- the `node` env for `test/e2e/`, `*.config.ts`, `proxy.ts` and `instrumentation.ts`

## Why

A presenter is a function of its props, whether it runs on the server or in the browser. Keeping `'use client'` on the orchestrators means the client boundary sits where state is read, and a reader finds it from the file name. A server component can call an API client and hand the result down, which saves a request from the browser.

The rules on names say how we name our own files: one export, named like the file, constants in an `XConfig.ts`. Next.js names the files of `src/app/` and of the root of `src/` itself, so those rules have nothing to say there. Leaving the whole folder out, instead of listing the files Next.js knows, means a new convention in a Next.js release needs no change here. The application code lives in `features/` and `shared/`, where the rules apply.
