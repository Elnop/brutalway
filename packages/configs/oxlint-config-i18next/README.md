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

1. Add the text to the JSON of the namespace in English, `locales/en/<namespace>.json`.
2. Render `t('key')`, or `t('key', { name })` for a string with a value in it, which the JSON writes `Remove {{name}}`.

## Rules

### `i18next/no-literal-string`

Reported in JSX:

- text between tags: `<p>Hello</p>`
- the attributes a user reads or hears: `aria-label`, `aria-description`, `aria-placeholder`, `aria-roledescription`, `aria-valuetext`, `placeholder`, `title` and `alt`, and on React Native `accessibilityLabel` and `accessibilityHint`
- the `value` of an `<input type="submit">`, `button` or `reset`: it is the text of the button. The `value` of any other input is data and is left alone
- template literals in JSX: `` aria-label={`Remove ${name}`} ``

### `i18next-attributes/no-restricted-syntax`

Reported outside JSX, with selectors that name the call:

- a literal or a template literal handed to `toast(...)`, `toast.<method>(...)`, `alert(...)`, `confirm(...)`, `prompt(...)`, or `window.` and `globalThis.` followed by `alert`, `confirm` or `prompt`
- a literal or a template literal assigned to `document.title`

On a native tag, `<div aria-description="Pet details" />` and the three other aria attributes come out here too, since the plugin only checks its own list of attributes there. On a component (`<Card aria-description="..." />`), `i18next/no-literal-string` reports them.

### What no rule can tell

A lint rule does not know whether a string is shown. These stay unreported: the message of a Zod schema (`.min(1, 'blankTitle')` holds a key that `t()` translates later, which looks the same as a text), a string given to `setError(...)` or `useState(...)`, a `const title = '...'`, and a `throw new Error('...')`, which is read by a developer. A prop of a component named `label`, `content` or `text` is not reported either: a name list would also report identifiers.

Test files (`*.test.ts` and `*.test.tsx`) are left alone, since they pass literal props to the components they render. A string without any letter is left alone (`{count} · 42%`, `×`, an emoji), and so is an all-caps word like `OK`.

## Why

On a native tag, the plugin only checks its own list of attributes (`aria-label`, `placeholder`, `title`, `alt` and `value`), so the config reports `aria-description` there with its own `no-restricted-syntax` selector.
