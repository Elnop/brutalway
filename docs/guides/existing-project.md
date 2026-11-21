# Use the checks in an existing project

The `@brutalway/*` packages work without a template. This guide adds them to a TypeScript project one at a time, from the least to the most demanding, so you can stop at any step. Each package README has the full options.

## Keep main green

On a codebase of a few dozen files, run each new check, fix what it reports, then move to the next. On a real one, the first `oxlint --type-aware` or `depcruise` prints hundreds of errors, and fixing them all before turning the check on means a pull request nobody can review while the rest of the team keeps shipping.

Turn each check on with the errors it finds written down instead:

1. Install the check and run it.
2. Record what it reports in its exception list ([Exceptions](#2-exceptions) says how for each tool) and commit the list with the config. `npm run check` is green again, and new code gets the rule from that commit on.
3. Add [`check-exceptions`](../../packages/tools/check-exceptions) to `npm run check`, so that a branch can shrink these lists but never grow them.
4. Fix the recorded errors one folder or one feature at a time, each in its own pull request, deleting the entries it fixes.

Moving the code into `app/`, `features/` and `shared/` is the longest part. [Move a project to the layout](move-to-the-layout.md) gives the order and the way to cut it into pull requests, or into batches for an agent.

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

`npx oxlint --type-aware --fix` fixes the rules that have a fix, often most of the first run. Some fixes change types: `!!role` becoming `Boolean(role)` loses the narrowing, and an added `cause` breaks a test that compares errors. Commit the fixes on their own, after `tsc` and the tests pass. The same goes for turning arrow functions into declarations by hand: a hoisted function no longer sees the narrowing done before it.

## 2. Exceptions

Each checker lets you write its exceptions down in a committed file, so they show up in review. Keep them few and delete them as you fix the code.

Oxlint: a directive with the rule name, on the line above or at the top of the file for a rule the file breaks in many places. The `no-comments` rule lets these comments through.

```ts
// oxlint-disable-next-line max-lines-per-function
```

```ts
/* oxlint-disable max-lines-per-function */
```

check-tree: `npx check-tree src --write-known-violations` writes the current violations to `.check-tree-known-violations.json`, one entry per rule and path, with the count of groups or files when the rule has one. check-tree skips them as long as the count does not grow, and fails on a new violation and on an entry that no longer happens.

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

Each of these commands rewrites its list with every violation of the moment, new ones included, so regenerating a baseline makes any check pass again. [`check-exceptions`](../../packages/tools/check-exceptions) fails when one of these lists, or the number of disable directives for a rule, grew since the commit the branch started from:

```sh
npm install --save-dev @brutalway/check-exceptions
npx check-exceptions
```

A rule absent from the main branch starts at 0. In the change that turns a rule on, write the number of violations it found under `newRules` in `package.json`. The entry counts only while the rule is missing from the main branch: delete it once the change is merged there, which on a long feature branch means after the final merge:

```json
"check-exceptions": { "newRules": { "oxlint-disable max-lines-per-function": 40 } }
```

In CI, check out the whole history (`fetch-depth: 0` with `actions/checkout`) so that check-exceptions finds the commit the branch started from.

## 3. Tree and layers

[`check-tree`](../../packages/tools/check-tree) checks the folders, [`dependency-cruiser-config`](../../packages/configs/dependency-cruiser-config) the imports between them. Turn them on together: check-tree accepts a `shared/` whose folders import each other, and only dependency-cruiser reports it. A project that moved its code with check-tree alone had 52 pairs of shared features importing each other, and nothing said so.

Both expect `src/` to be split into `app/`, `features/` and `shared/`, with one folder per shared feature in `shared/`. If your project is laid out another way, this is the step that asks the most work: [Move a project to the layout](move-to-the-layout.md).

```sh
npm install --save-dev @brutalway/check-tree @brutalway/dependency-cruiser-config dependency-cruiser @swc/core
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
npx check-tree src
npx depcruise --output-type err-long src
```

`--output-type err-long` prints, under each error, the comment of the rule, which says what to change.

check-tree rejects empty folders, kind folders holding a single file and folders the layout of `src/` does not name. It also rejects a file of a shared feature that a single feature uses. A test never counts as a consumer there, and a file that only tests import is the job of `knip --production`.

Its options go in the `"check-tree"` key of `package.json`, so `npm run check` and the agent hook read the same ones. `categories` replaces the list of kind folder names with yours. On a React Native or Expo app, a platform variant such as `useScreenTitle.web.ts` goes with `useScreenTitle.ts`: it has its kind and counts as one file with it, so the variants stay next to their base. `platforms` replaces the platforms check-tree knows, `web`, `ios`, `android` and `native`.

```json
{
  "check-tree": {
    "categories": ["components", "hooks", "utils"],
    "platforms": ["web", "ios", "android", "native"]
  }
}
```

## 4. Repository

[`alint-config`](../../packages/configs/alint-config) checks the pinned versions, the content of kind folders and the paths cited in the docs.

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

## 5. Secrets

[`check-secrets`](../../packages/tools/check-secrets) runs gitleaks on the files git would commit. A secret it finds in an existing project has been in the history since it was committed: revoke it, then remove it. A value that is public by design goes in `.gitleaksignore`.

```sh
npm install --save-dev @brutalway/check-secrets
npx check-secrets
```

## 6. One command

Put everything behind `npm run check` in `package.json`, so that a person, an agent and CI run the same thing:

```json
"check": "tsc --noEmit && oxlint --type-aware && depcruise --output-type err-long --ignore-known src && check-tree src && alint check && check-secrets && check-exceptions"
```

Then [work with Claude Code](claude-code.md) to get the same messages while the agent writes, and read [Upgrade brutalway](upgrade.md) before the next bump of a `@brutalway/*` package.
