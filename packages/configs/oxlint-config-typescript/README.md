# @brutalway/oxlint-config-typescript

Oxlint config for TypeScript projects. The other `@brutalway/oxlint-config-*` packages extend it.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-typescript
```

```ts
import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig],
});
```

Two plugins it loads (`eslint-plugin-check-file`, `eslint-plugin-no-comments`) depend on ESLint 10.14, which pulls `minimatch` 10 (GHSA-g3hv-75wg-m249). npm only reads `overrides` from the root `package.json`, so add this to yours:

```json
"overrides": {
  "eslint-plugin-no-comments": { "minimatch": "^11.0.1" }
}
```

## Usage

### Run the type-aware rules

The `typescript/no-floating-promises` family of rules needs `oxlint --type-aware` and the `oxlint-tsgolint` package. The rules marked "needs `--type-aware`" below only run with it.

### Allow `console` in a CLI

`console` is limited to `console.error`. A CLI turns `no-console` off in an override.

### Keep a narrowing inside a declared function

A declared function is hoisted, so TypeScript drops the narrowing of a captured variable inside it. Move the null check into a helper that returns the narrowed value.

## Rules

It turns on the `correctness` and `suspicious` categories, a set of `typescript/` and `import/` rules, and these conventions:

- no comments, except tool directives (`oxlint-`, `eslint-`, `@ts-expect-error`, triple-slash references, shebang)
- no `index.ts` and no barrel file
- no `types.ts`: name it `xTypes.ts`
- nothing under `shared-features/` that belongs to a feature: no orchestrator component (`XContainer.tsx`, `XLayout.tsx`, `XPage.tsx`) and no `xRoutes.ts`
- no `xConfig.tsx`: a config is plain data in `xConfig.ts`, and its JSX goes in a component. `xContent.tsx` stays allowed for content written in JSX.
- file names in camelCase or PascalCase
- a file with a single export is named after it ([@brutalway/eslint-plugin-file-named-after-export](https://www.npmjs.com/package/@brutalway/eslint-plugin-file-named-after-export))
- named functions are declarations (`function area() {}`), arrow functions stay for callbacks
- an `if` without braces fits on one line (`curly` set to `multi-line`)
- object shapes use `type`, `interface` is only accepted to augment a global such as `Window` inside `declare global`, or a package such as `fastify` inside `declare module 'fastify'`
- a `switch` over a union covers every case (`typescript/switch-exhaustiveness-check`, needs `--type-aware`)
- exported types live in `xTypes.ts` files, exported constants in `xConfig.ts` files. An `xTypes.ts` only exports types, an `xConfig.ts` (or `xContent.ts`) only exports constants. Exported functions, classes, and objects of functions can live anywhere, and so can `export const x = defineX(...)`. An `xSchemas.ts` only exports Zod schemas, which are constants too: it is exempt from that rule and from the file-name rule, and the types inferred from it go in an `xTypes.ts`.
- one way to write each thing: function members of a type as properties (`area: () => number`), no `public` keyword (write `private` and `protected`, leave public implicit), `for...of` instead of `forEach`, `replaceAll` for a global regex, `Number.parseFloat` and `Number.NaN` instead of the globals, `import type { X }` instead of `import { type X }`
- regexes carry the `u` flag, ternaries are not nested, `!!x` and `+x` are written as explicit comparisons or calls, parameters are not reassigned
- `console` only for `console.error`
- class members never reassigned are `readonly`, deprecated APIs are reported, and a `void` expression is only accepted as the body of an arrow (`() => save()`). These three need `--type-aware`.
- a function whose cognitive complexity is above 15 is reported, with Sonar's own rule: `sonarjs/cognitive-complexity`, the S3776 rule of `eslint-plugin-sonarjs`
- a function holds 25 lines at most, blank lines and comments not counted (`max-lines-per-function`), and blocks and callbacks nest 3 levels deep at most (`max-depth`, `max-nested-callbacks`). The limits come from the Norminette of 42, which caps a function at 25 lines. Tests have no length limit, since a `describe` block holds all of its cases

Tests (`*.test.ts`, `*.spec.ts`, `e2e/`) skip the naming and placement rules and the length limit.

## Why

The whole file-name blocklist for `shared-features/` lives in this config, so a preset that extends several configs cannot lose part of it.

The whole `eslint-plugin-sonarjs` plugin does not load under Oxlint with TypeScript 7 (its `ts-api-utils` finds the project's TypeScript, which has no JavaScript API), so `src/cognitiveComplexityPlugin.ts` loads the file of `sonarjs/cognitive-complexity` alone. `eslint-plugin-sonarjs` is pinned to an exact version, since the path is internal to it, and a fixture test fails if it moves.
