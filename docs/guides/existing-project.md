# Use the checks in an existing project

The `@brutalway/*` packages work without a template. This guide adds them to a TypeScript project one at a time, so you can stop at any step. Each package README has the full options.

## Keep main green

On a codebase of a few dozen files, run each new check, fix what it reports, then move to the next. On a real one, the first `oxlint --type-aware` or `depcruise` prints hundreds of errors, and fixing them all before turning the check on means a pull request nobody can review while the rest of the team keeps shipping.

Turn each check on with the errors it finds written down instead:

1. Add a `check` script to `package.json` and let it grow with each step. [One command](#6-one-command) shows the full line.
2. For each check: install it, run it, record what it reports ([Exceptions](#2-exceptions) says how for each tool), add it to `check`, and commit the config and the list together. `npm run check` is green, and new code gets the rule from that commit on.
3. Add [`check-exceptions`](../../packages/tools/check-exceptions) to `check` as soon as the first list exists, so that a branch can shrink the lists but never grow them. A check turned on after it starts at 0: write the counts it prints under `newRules` in the same commit, as [Exceptions](#2-exceptions) says.
4. Fix the recorded errors one folder or one feature at a time, each in its own pull request, deleting the entries it fixes with the commands [Exceptions](#2-exceptions) gives.

On a project laid out another way, the first run of check-tree reports most folders of `src/`. Record them all the same: [Move a project to the layout](move-to-the-layout.md) then empties that list one pull request at a time, or one batch for an agent.

## 1. Lint

Pick the config of your stack: [`oxlint-config-typescript`](../../packages/configs/oxlint-config-typescript) for any TypeScript code, [`oxlint-config-react-vite`](../../packages/configs/oxlint-config-react-vite) for a React front end, [`oxlint-config-fastify`](../../packages/configs/oxlint-config-fastify) for an API. The others are listed in the [packages index](../../packages/README.md#oxlint). `--type-aware` needs `oxlint-tsgolint` next to `oxlint`:

```sh
npm install --save-dev oxlint oxlint-tsgolint @brutalway/oxlint-config-typescript
```

`oxlint.config.ts`, with `reactViteConfig` from `@brutalway/oxlint-config-react-vite` on a React front end:

```ts
import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig],
});
```

Oxlint reads a single config: delete the `.oxlintrc.json` that Vite and other starters create.

```sh
npx oxlint --type-aware
```

The React, Next and React Native configs forbid relative imports. Declare an alias such as `@/` for `src/` in `compilerOptions.paths` of the tsconfig and in the resolver of the bundler (`resolve.alias` in `vite.config.ts`), then rewrite the imports, or record the rule as an exception first. Do it before moving files: with aliases, a moved file keeps its own imports.

`npx oxlint --type-aware --fix` fixes the rules that have a fix, which on code written without these rules is a small part of the first run. Some fixes change types: `!!role` becoming `Boolean(role)` loses the narrowing, and an added `cause` breaks a test that compares errors. Commit the fixes on their own, after `tsc` and the tests pass. The same goes for turning arrow functions into declarations by hand: a hoisted function no longer sees the narrowing done before it.

## 2. Exceptions

Oxlint, check-tree, dependency-cruiser and alint write their list with a command. knip and jscpd keep theirs in their config, by hand. Keep the lists short and delete entries as you fix the code.

Oxlint: `npx oxlint --type-aware --suppress-all` writes the current errors to `oxlint-suppressions.json`, with a count per file and rule. Run it after `--fix`, so that what has a fix gets fixed instead of recorded. Oxlint then fails on a new error and on a recorded one that no longer happens, and `npx oxlint --type-aware --prune-suppressions` deletes the fixed ones without adding new ones. The option is missing from `oxlint --help` up to 1.94 at least, but it works.

```sh
npx oxlint --type-aware --suppress-all
npx oxlint --type-aware --prune-suppressions
```

For a single exception in new code, a directive with the rule name goes on the line above. The name in the directive comes from the one oxlint prints: `eslint(max-lines-per-function)` becomes `max-lines-per-function`, `component-props(no-restricted-syntax)` becomes `component-props/no-restricted-syntax`. In JSX, wrap the comment in braces. The `no-comments` rule lets these comments through.

```ts
// oxlint-disable-next-line max-lines-per-function
```

```tsx
{/* oxlint-disable-next-line component-props/no-restricted-syntax */}
```

check-tree: `npx check-tree src --write-known-violations` writes the current violations to `.check-tree-known-violations.json`, one entry per rule and path, with the count of groups or files when the rule has one. check-tree skips them as long as the count does not grow, and fails on a new violation, on an entry that no longer happens and on a count higher than the current one. After a fix, `npx check-tree src --shrink-known-violations` deletes the fixed entries and lowers the counts without adding new ones.

dependency-cruiser: `npx depcruise src --baseline` writes `.dependency-cruiser-known-violations.json`, and `--ignore-known` skips what it lists. After a fix, `--baseline-mode shrink-only` removes the fixed entries without adding new ones. Put `src` before these flags: each one takes an optional file name, and `depcruise --ignore-known src` reads `src` as that file, prints its help and exits with 0 without checking anything.

```sh
npx depcruise src --output-type err-long --ignore-known
npx depcruise src --baseline --baseline-mode shrink-only
```

knip: `ignoreFiles` and `ignoreDependencies` in `knip.json`, and `ignoreIssues` to skip one kind of issue in some files.

```json
{ "ignoreIssues": { "src/legacy/**": ["exports", "types"] } }
```

jscpd: the `ignore` list of `.jscpd.json`, made of globs.

```json
{ "ignore": ["src/legacy/**"] }
```

alint: `npx alint baseline` writes `.alint-baseline.json`, and `baseline: .alint-baseline.json` in `.alint.yml` makes `alint check` skip what it lists. alint only warns about an entry that no longer happens: run `alint check --strict-baseline` so that it fails, like the others. After a fix, `npx alint baseline` again deletes the fixed entries. It refuses to add a new violation unless you pass `--accept-new`. For the pinned versions, the [alint-config README](../../packages/configs/alint-config/README.md#pin-the-dependencies) says how to fix them.

`oxlint --suppress-all`, `check-tree --write-known-violations`, `depcruise --baseline` and `alint baseline --accept-new` rewrite their list with every violation of the moment, new ones included, so running them again makes any check pass. [`check-exceptions`](../../packages/tools/check-exceptions) fails when one of these lists, or the number of disable directives for a rule, grew since the commit the branch started from:

```sh
npm install --save-dev @brutalway/check-exceptions
npx check-exceptions
```

A rule absent from the main branch starts at 0. In the change that turns a rule on, write under `newRules` in `package.json` the count check-exceptions prints for it, with the key it prints: `oxlint-suppressions max-lines-per-function`, `check-tree kind-folder`, `dependency-cruiser no-circular`, `alint styles-only-css`. For `oxlint-suppressions.json` it counts errors. For directives it counts comments: one file-level directive is 1, whatever number of errors it silences.

```json
"check-exceptions": { "newRules": { "oxlint-suppressions max-lines-per-function": 14 } }
```

The entry counts only while the rule is missing from the main branch. Delete it once the change is on the main branch: right after the merge of its pull request, or, when you commit to the main branch directly, in the next commit.

In CI, check out the whole history (`fetch-depth: 0` with `actions/checkout`) so that check-exceptions finds the commit the branch started from.

## 3. Tree and layers

[`check-tree`](../../packages/tools/check-tree) checks the folders, [`dependency-cruiser-config`](../../packages/configs/dependency-cruiser-config) the imports between them. Turn them on together: check-tree accepts a `shared/` whose folders import each other, and only dependency-cruiser reports it.

Both expect `src/` to be split into `app/`, `features/` and `shared/`, with one folder per shared feature in `shared/`.

```sh
npm install --save-dev @brutalway/check-tree @brutalway/dependency-cruiser-config dependency-cruiser @swc/core
```

`.dependency-cruiser.cjs` for a front end, with the tsconfig that covers `src/` (`tsconfig.app.json` on Vite, often `tsconfig.json` elsewhere):

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
npx depcruise src --output-type err-long
```

`--output-type err-long` prints, under each error, the comment of the rule, which says what to change.

check-tree rejects empty folders, kind folders holding a single file and folders the layout of `src/` does not name. It also rejects a file of a shared feature that a single feature uses. A test never counts as a consumer there, and a file that only tests import is the job of `knip --production`. Its options, such as the names of your kind folders or the platforms of a React Native app, go in the `"check-tree"` key of `package.json`: see its [README](../../packages/tools/check-tree/README.md).

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
npx alint check --strict-baseline
```

[knip](https://knip.dev) reports unused files, exports and dependencies, and `knip --production` the code of `src/` that only tests use. [jscpd](https://github.com/kucherenko/jscpd) reports duplicated blocks.

```sh
npm install --save-dev knip jscpd
npx knip && npx knip --production
npx jscpd src
```

## 5. Secrets

[`check-secrets`](../../packages/tools/check-secrets) runs gitleaks on the files git would commit. A secret it finds in an existing project has been in the history since it was committed: revoke it, then remove it. A value that is public by design goes in `.gitleaksignore`.

```sh
npm install --save-dev @brutalway/check-secrets
npx check-secrets
```

## 6. One command

Put everything behind `npm run check` in `package.json`, so that a person, an agent and CI run the same thing. [`@brutalway/check`](../../packages/tools/check) gives the command: `brutal-check` runs one script per check, in a fixed order, keeps going after a failure and names the ones that failed. Each check stays a script of your own, with its arguments. On a Vite project, whose `tsconfig.json` only lists references, `tsc --noEmit` checks nothing: use `tsc -b` there.

```sh
npm install --save-dev @brutalway/check
```

```json
"format:check": "prettier --check .",
"typecheck": "tsc --noEmit",
"lint": "oxlint --type-aware",
"deps": "depcruise src --output-type err-long --ignore-known",
"tree": "check-tree src",
"duplicates": "jscpd src",
"repo": "alint check --strict-baseline",
"unused": "knip && knip --production",
"secrets": "check-secrets",
"exceptions": "check-exceptions",
"check": "brutal-check"
```

A check that brutal-check does not know goes after it: `"check": "brutal-check && npm run lint:sql"`. The [README](../../packages/tools/check/README.md) lists the scripts it runs.

Then [work with Claude Code](claude-code.md) to get the same messages while the agent writes, and read [Upgrade brutalway](upgrade.md) before the next bump of a `@brutalway/*` package.
