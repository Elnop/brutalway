# @brutalway/oxlint-config-tailwind

Oxlint config for Tailwind CSS v4 projects that keep their design tokens in one stylesheet. Every color, font and shadow is declared under `@theme` in `src/app/globals.css`, and the rules below keep the components on those tokens.

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-tailwind
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { tailwindConfig } from '@brutalway/oxlint-config-tailwind';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, tailwindConfig],
});
```

## `tailwind/color-tokens`

A color comes from a `--color-*` variable declared under `@theme`. The rule reports:

- a class from Tailwind's palette: `bg-white`, `text-zinc-500`, `hover:border-t-yellow-300/50`
- an arbitrary color: `bg-[#0f0f0f]`, `shadow-[4px_4px_0_#000]`, `[color:rgb(0_0_255)]`
- a color literal in `style`, `fill`, `stroke` or `color`: `style={{ color: '#222' }}`, `fill="#ffd23f"`

It reads the class names in `className` and `class`, including the strings passed to `cn()`, `clsx()`, ternaries and template literals. The message names the stylesheet and the three closest tokens, compared in OKLab:

```
text-zinc-500 is not a color token. Use a color declared under @theme in src/app/globals.css, closest: text-blue, text-yellow, text-ink.
```

The palette colors are read from the `tailwindcss/theme.css` of the project, so the closest tokens are only computed when `tailwindcss` is installed. The stylesheet path is an option, relative to the folder oxlint runs from:

```ts
rules: { 'tailwind/color-tokens': ['error', { stylesheet: 'app/styles.css' }] }
```

`bg-(--color-ink)`, `bg-transparent`, `fill="currentColor"` and `var(--color-ink)` are allowed.

## `tailwind/font-roles`

`h1`, `h2` and `h3` take `font-display`, `code` and `pre` take `font-mono`. The body inherits `font-sans`, which Tailwind applies to `html`. A `className` built only from variables, with no string in it, is not checked.

## `tailwind/no-dark-variant`

A `dark:` class is reported. A dark theme gives each token a dark value in the stylesheet that declares it, under `@media (prefers-color-scheme: dark)`, so the classes stay the same in both themes and a component never picks a color per theme.
