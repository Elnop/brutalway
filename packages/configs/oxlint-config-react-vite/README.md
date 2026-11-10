# @brutalway/oxlint-config-react-vite

Oxlint preset for React + Vite apps. It extends [@brutalway/oxlint-config-react](https://www.npmjs.com/package/@brutalway/oxlint-config-react), [@brutalway/oxlint-config-zustand](https://www.npmjs.com/package/@brutalway/oxlint-config-zustand) (the store rule only applies to `*Store.ts` files) and [@brutalway/oxlint-config-vitest](https://www.npmjs.com/package/@brutalway/oxlint-config-vitest).

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-react-vite
```

```ts
import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig],
});
```

## Rules

On top of the configs it extends:

- no relative imports: import through the aliases set in `vite.config.ts` and `tsconfig.json`
- side effect imports allowed for `.css` files only
- `import/default` off
- `typescript/no-non-null-assertion` and `unicorn/prefer-add-event-listener` off
- the `node` env for `e2e/` and `*.config.ts` (Vite, Vitest, Playwright configs)

## Why

`import/default` is off since it misreads Vite's `?raw` and `?url` imports.
