# Use the checks in an existing project

The `@brutalway/*` packages work without a template. This guide adds them to a TypeScript project one at a time, from the least to the most demanding, so you can stop at any step. Each package README has the full options.

Run the new check after each step and fix what it reports before adding the next one. On a large codebase, the first runs print a lot.

## 1. Lint

Pick the config of your stack: [`oxlint-config-typescript`](../../packages/configs/oxlint-config-typescript) for any TypeScript code, [`oxlint-config-react-vite`](../../packages/configs/oxlint-config-react-vite) for a React front end, [`oxlint-config-fastify`](../../packages/configs/oxlint-config-fastify) for an API. The others are listed in the [packages index](../../packages/README.md#oxlint).

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-typescript
```

`oxlint.config.ts`:

```ts
import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig],
});
```

```sh
npx oxlint --type-aware
```

## 2. Tree

[`check-tree`](../../packages/tools/check-tree) needs no config. It rejects empty folders, category folders holding a single file and folders the layout of `src/` does not name, so a project laid out another way gets one message per such folder. It also rejects a file of a slice of `shared/` that a single feature uses. A test never counts as a consumer there, and a file that only tests import is the job of `knip --production`.

```sh
npm install --save-dev @brutalway/check-tree
npx check-tree src
```

Its options go in the `"check-tree"` key of `package.json`, so `npm run check` and the agent hook read the same ones. `categories` replaces the list of category folder names with yours. On a React Native or Expo app, a platform variant such as `useScreenTitle.web.ts` goes with `useScreenTitle.ts`: it has its kind and counts as one file with it, so the variants stay next to their base. `platforms` replaces the platforms check-tree knows, `web`, `ios`, `android` and `native`.

```json
{
  "check-tree": {
    "categories": ["components", "hooks", "utils"],
    "platforms": ["web", "ios", "android", "native"]
  }
}
```

## 3. Layers

[`dependency-cruiser-config`](../../packages/configs/dependency-cruiser-config) expects `src/` to be split into `app/`, `features/` and `shared/`, with one folder per slice in `shared/`. If your project is laid out another way, this is the step that asks the most work: move the code first, then turn the check on.

```sh
npm install --save-dev @brutalway/dependency-cruiser-config dependency-cruiser @swc/core
```

`.dependency-cruiser.cjs` for a front end:

```js
module.exports = {
  extends: '@brutalway/dependency-cruiser-config/layers',
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    parser: 'swc',
    tsPreCompilationDeps: false,
    enhancedResolveOptions: { extensions: ['.ts', '.tsx', '.js'] },
  },
};
```

An API extends `@brutalway/dependency-cruiser-config/server` instead, a library `@brutalway/dependency-cruiser-config/library`.

```sh
npx depcruise --output-type err-long src
```

`--output-type err-long` prints, under each error, the comment of the rule, which says what to change.

## 4. Repository

[`alint-config`](../../packages/configs/alint-config) checks the pinned versions, the content of category folders and the paths cited in the docs.

```sh
npm install --save-dev @brutalway/alint-config @asamarts/alint
```

`.alint.yml`:

```yaml
version: 1
extends:
  - ./node_modules/@brutalway/alint-config/base.yml
rules:
  - id: doc-paths-resolve
    kind: markdown_paths_resolve
    paths: ['README.md', 'docs/**/*.md']
    prefixes: ['src/', 'docs/']
    level: error
```

```sh
npx alint check
```

## 5. Exceptions

On a large codebase, fixing every violation before turning a rule on means one huge pull request, and the rule never gets turned on. Each checker lets you write the exceptions down in a committed file instead, so they show up in review and new code gets the rule from day one. Keep them few and delete them as you fix the code.

Oxlint: a directive on the line above, with the rule name. The `no-comments` rule lets these comments through.

```ts
// oxlint-disable-next-line max-lines-per-function
```

check-tree: `npx check-tree src --write-known-violations` writes the current violations to `.check-tree-known-violations.json`, a JSON array of the printed messages. check-tree skips them, and fails on a new violation and on an entry that no longer happens.

dependency-cruiser: `npx depcruise --baseline src` writes `.dependency-cruiser-known-violations.json`, and `--ignore-known` skips what it lists:

```sh
npx depcruise --output-type err-long --ignore-known src
```

knip: `ignoreFiles` and `ignoreDependencies` in `knip.json`, and `ignoreIssues` to skip one kind of issue in some files.

```json
{ "ignoreIssues": { "src/legacy/**": ["exports", "types"] } }
```

jscpd: the `ignore` list of `.jscpd.json`, made of globs.

```json
{ "ignore": ["**/*.test.ts", "src/legacy/**"] }
```

## 6. One command

Put everything behind `npm run check` in `package.json`, so that a person, an agent and CI run the same thing:

```json
"check": "tsc --noEmit && oxlint --type-aware && depcruise --output-type err-long src && check-tree src && alint check"
```

Then [work with Claude Code](claude-code.md) to get the same messages while the agent writes.
