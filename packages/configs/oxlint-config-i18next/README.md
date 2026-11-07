# @brutalway/oxlint-config-i18next

Oxlint config for a React app translated with [i18next](https://www.i18next.com): every string the user reads goes through `t()`. It runs `no-literal-string` from [eslint-plugin-i18next](https://github.com/edvardchen/eslint-plugin-i18next) as an Oxlint JS plugin.

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-i18next
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, i18nextConfig],
});
```

## `i18next/no-literal-string`

Reported, in JSX only:

- text between tags: `<p>Hello</p>`
- the attributes a user reads or hears: `aria-label`, `aria-description`, `placeholder`, `title` and `alt`
- template literals in JSX: `` aria-label={`Remove ${name}`} ``

Test files (`*.test.tsx`) are left alone, since they pass literal props to the components they render. A string without any letter is left alone (`{count} · 42%`, `×`, an emoji), and so is an all-caps word like `OK`.

The message of the plugin only says "disallow literal string". The fix is always the same: add the text to the JSON of the namespace in English, `src/app/locales/en/<namespace>.json`, then render `t('key')`, or `t('key', { name })` for a string with a value in it, which the JSON writes `Remove {{name}}`.
