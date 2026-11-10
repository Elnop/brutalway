# @brutalway/oxlint-config-i18next

Oxlint config for a React app translated with [i18next](https://www.i18next.com): every string the user reads goes through `t()`. It runs `no-literal-string` from [eslint-plugin-i18next](https://github.com/edvardchen/eslint-plugin-i18next) as an Oxlint JS plugin.

## Install

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

## Usage

The message of the plugin only says "disallow literal string". The fix is always the same:

1. Add the text to the JSON of the namespace in English, `src/app/locales/en/<namespace>.json`.
2. Render `t('key')`, or `t('key', { name })` for a string with a value in it, which the JSON writes `Remove {{name}}`.

## Rules

### `i18next/no-literal-string`

Reported, in JSX only:

- text between tags: `<p>Hello</p>`
- the attributes a user reads or hears: `aria-label`, `aria-description`, `placeholder`, `title` and `alt`
- template literals in JSX: `` aria-label={`Remove ${name}`} ``

Test files (`*.test.tsx`) are left alone, since they pass literal props to the components they render. A string without any letter is left alone (`{count} · 42%`, `×`, an emoji), and so is an all-caps word like `OK`.

On a native tag, `<div aria-description="Pet details" />` comes out as `i18next-attributes(no-restricted-syntax)`. On a component (`<Card aria-description="..." />`), the plugin reports it.

## Why

On a native tag, the plugin only checks its own list of attributes (`aria-label`, `placeholder`, `title`, `alt` and `value`), so the config reports `aria-description` there with its own `no-restricted-syntax` selector.
