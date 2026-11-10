# @brutalway/oxlint-config-react

Oxlint config for React with TypeScript. It extends [@brutalway/oxlint-config-typescript](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript) and adds rules for components, hooks and their files.

## Install

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

## Usage

For a Vite app, [@brutalway/oxlint-config-react-vite](https://www.npmjs.com/package/@brutalway/oxlint-config-react-vite) adds the Vite specific settings on top.

When a rule fires:

- `fetch` outside a client or inside an effect: move the call into an `xClient.ts` and read the server data through a query hook that calls the client
- formatting, sorting or filtering in a presenter: do that work in the orchestrator or a hook and pass the result as a prop
- more than 6 props: group the related ones into an object or split the component
- a `useX.tsx` file: move its JSX into a component and rename the hook file to `.ts`

## Rules

- the `react` plugin and the `browser` env
- `react/rules-of-hooks`, `react/exhaustive-deps` and `react/only-export-components`
- a component types its props with a named type called after it: `function Card({ title }: CardProps)`. Untyped props, inline object types and other type names are reported.
- a callback prop of an `xProps` type is named `onX` (`onSelect`, `onChange`), in `.tsx` files and in `xTypes.ts` files
- a hook lives in a `useX.ts` file, and a `useX.ts` file only exports hooks
- `fetch` is only called from an `xClient.ts` file, and never inside `useEffect` or `useLayoutEffect`
- no braces around a plain string in JSX: `className="card"`, not `className={'card'}`
- no orchestrator (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) under `shared-features/`
- an orchestrator calls at least one hook
- a presenter (any other component) does no formatting: no `toLocaleString`, `toLocaleDateString`, `toLocaleTimeString`, `toFixed` or `Intl`, and no `sort`, `toSorted`, `filter` or `reduce`. `map` stays fine for rendering.
- a component takes at most 6 props
- no array index as a `key` (`react/no-array-index-key`)
- a hook file is a `.ts`: a `useX.tsx` is reported
- `localStorage` and `sessionStorage` only appear in an `xStorage.ts` file, which the rest of the code calls

## Why

`shared-features/` holds business code shared by several features, and the components that read it belong to a feature, so orchestrators stay out of it. An orchestrator that only wraps JSX is a presenter with the wrong name.
