# @brutalway/oxlint-config-react

Oxlint config for React with TypeScript. It extends [@brutalway/oxlint-config-typescript](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript) and adds:

- the `react` plugin and the `browser` env
- `react/rules-of-hooks`, `react/exhaustive-deps` and `react/only-export-components`
- a component types its props with a named type called after it: `function Card({ title }: CardProps)`. Untyped props, inline object types and other type names are reported.
- a callback prop of an `xProps` type is named `onX` (`onSelect`, `onChange`), in `.tsx` files and in `xTypes.ts` files
- a hook lives in a `useX.ts` file, and a `useX.ts` file only exports hooks
- no braces around a plain string in JSX: `className="card"`, not `className={'card'}`
- no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) under `shared-features/`: that layer holds business code shared by several features, and the components that read it belong to a feature

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-react
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig],
});
```

For a Vite app, [@brutalway/oxlint-config-react-vite](https://www.npmjs.com/package/@brutalway/oxlint-config-react-vite) adds the Vite specific settings on top.
