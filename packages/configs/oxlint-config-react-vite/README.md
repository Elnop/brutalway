# @brutal/oxlint-config-react-vite

Oxlint preset for React + Vite apps. It extends [@brutal/oxlint-config-react](https://www.npmjs.com/package/@brutal/oxlint-config-react) [@brutal/oxlint-config-zustand](https://www.npmjs.com/package/@brutal/oxlint-config-zustand) (the store rule only applies to `*Store.ts` files) and [@brutal/oxlint-config-vitest](https://www.npmjs.com/package/@brutal/oxlint-config-vitest), and adds:

- no relative imports: import through the aliases set in `vite.config.ts` and `tsconfig.json`
- side effect imports allowed for `.css` files only
- `import/default` off, since it misreads Vite's `?raw` and `?url` imports
- `typescript/no-non-null-assertion` and `unicorn/prefer-add-event-listener` off
- the `node` env for `e2e/` and `*.config.ts` (Vite, Vitest, Playwright configs)

```sh
npm install --save-dev oxlint @brutal/oxlint-config-react-vite
```

```ts
import { reactViteConfig } from '@brutal/oxlint-config-react-vite';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig],
});
```
