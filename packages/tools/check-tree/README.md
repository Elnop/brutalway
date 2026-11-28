# @brutalway/check-tree

Checks the folders of a source tree, which a linter does not see: only the folders the layout names, no empty folder, no kind folder with a single child, files of one kind grouped in that kind's folder once there are two of them, no file in a shared feature that a single feature uses, no shared feature whose files never import each other, and unit tests kept in `test/unit/`, at the path of their source.

## Install

```sh
npm install --save-dev @brutalway/check-tree dependency-cruiser
npx check-tree src
```

check-tree runs from the folder that holds the dependency-cruiser config (`.dependency-cruiser.cjs` and the like) and reads it to resolve the imports, with the same tsconfig and aliases.

## Usage

### Set the options in package.json

check-tree reads its options from the `"check-tree"` key of the `package.json` in the current folder. `npm run check`, the agent hook and a manual run then check the tree the same way:

```json
{
  "check-tree": {
    "categories": ["components", "hooks", "utils"],
    "rootEntries": true,
    "platforms": ["web", "tv"]
  }
}
```

Each key has a flag, `--categories`, `--root-entries` and `--platforms`, which wins over the key for one run.

### Use your own kind folders

`categories` lists the kind folders the layout accepts, and the grouping rule only applies to the kinds listed in the table below that are also in this list.

### Keep the entry points of a published package

A published package keeps its entry points at the root of `src/`, one file per bin or export, whatever their kind. `"rootEntries": true` leaves the files at the root of the checked folder where they are, and checks everything below as usual.

### Use your own platforms

A platform variant (`X.web.ts`, `X.ios.tsx`) is the file that Metro and Expo pick in place of `X.ts` for one platform. check-tree knows `web`, `ios`, `android` and `native`, and `platforms` replaces that list.

### Keep the tests in a mirror of the source tree

The unit tests live in `test/unit/`, next to the checked folder, at the path of their source: the test of `src/shared/todos/lib/normalizeTitle.ts` is `test/unit/shared/todos/lib/normalizeTitle.test.ts`. A test keeps its `.test.ts` or `.test.tsx` suffix, and a source needs no test. `test/` holds two other folders, `e2e/` for the end-to-end tests and `support/` for the helpers the tests share, which check-tree does not look into.

Moving a source leaves its test behind, so check-tree reports a test with no source at its mirrored path. When a single folder of `src/` holds a source of that name, the message gives the `git mv` to run:

```
test/unit/features/a/format.test.ts has no source named format in src/features/a: src/features/b/lib holds one, run git mv test/unit/features/a/format.test.ts test/unit/features/b/lib/format.test.ts
```

`--fix` makes these moves, along with the moves of the tests still under `src/`, prints each one and runs the check again. It never overwrites a file, and it leaves the known violations where they are, so a large project can move its tests one folder at a time:

```sh
npx check-tree src --fix
```

### Keep the violations of an existing tree

On a codebase that did not follow the layout, the first run prints a lot. Write the current violations to `.check-tree-known-violations.json` and commit it:

```sh
npx check-tree src --write-known-violations
```

check-tree then skips the violations listed in that file, which it reads from the current folder. Each entry names the rule and the folder or file it is about, plus a count for the rules that have one:

```json
[
  { "rule": "single-child", "path": "src/features/player/hooks" },
  { "rule": "shared-feature-groups", "path": "src/shared/ui", "count": 9 },
  { "rule": "kind-folder", "path": "src/features/player/hooks", "count": 3 }
]
```

An entry stays known while the same rule fires on the same path with a count no higher than the one written. Adding a file to `src/shared/ui` linked to one of its groups changes the message without making a new violation. A tenth group, or a fourth hook to move into `hooks/`, is reported. check-tree also fails on an entry whose rule no longer fires on its path, and on a count higher than the current one, such as 9 groups written when 8 are left: the list has to follow each fix.

After a fix, `--shrink-known-violations` updates the file: it deletes the entries that no longer happen and lowers the counts that went down, then runs the check. It never adds an entry or raises a count, so a new violation is still reported and the list can only get shorter. A moved folder is a new path: its old entry goes, and its violations are reported until you fix them or add the entry by hand.

```sh
npx check-tree src --shrink-known-violations
```

The rules are `empty-folder`, `single-child`, `not-a-layer`, `not-a-kind-folder`, `kind-folder` (files to move into a kind folder, the path being that folder), `locales-file`, `not-a-language-folder`, `not-a-locale-file`, `shared-root-files`, `single-consumer`, `shared-feature-groups`, `test-in-source`, `orphan-test`, `orphan-test-folder`, `not-a-test` and `not-a-test-folder`. Up to 0.12, the file held the printed messages: check-tree now refuses that format, and `--write-known-violations` rewrites it.

### Run the check from code

```ts
import { treeViolations } from '@brutalway/check-tree/treeViolations';

const violations = treeViolations('src');
```

It takes the kind folders as second argument and `{ rootEntries: true, platforms: ['web'] }` as third, like `--categories`, `--root-entries` and `--platforms`. The checks on the shared features read the imports, so they have their own export, which takes the platforms as second argument:

```ts
import { sharedViolations } from '@brutalway/check-tree/sharedViolations';

const violations = await sharedViolations('src');
```

## Reference

### Rules

- a folder has a name the layout gives it:
  - `src/` holds `app/`, `features/` and `shared/`, next to its entry points. `app/` belongs to the router, so its folders are not checked and its files stay where they are, whatever their kind
  - a `shared/`, at any depth, holds one folder per shared feature, named after its concept (`shared/todos/`, `shared/errors/`), and no file
  - a feature (`features/<x>/`) or a shared feature (`shared/<x>/`), at any depth, holds kind folders, `features/` for its sub-features and `shared/` for the shared features they have in common, and `locales/` for its texts
  - `locales/` holds one folder per language, named like `en` or `fr-CA`, and nothing else; a language folder holds `.json` files only. It is the one folder that keeps a single child, since a project may have a single language. `src/` and the kind folders hold none
  - a kind folder holds kind folders only, like `presenters/` inside `components/`
- no empty folder
- a kind folder (`components`, `hooks`, `stores`…) does not hold a single child: move the child up and delete the folder
- files of one kind stay at the root of their folder while there is one of them, and move into the kind's folder from two on. A folder that has that kind's folder keeps none of them next to it. The kinds are recognized by their name:

| Folder                                 | Files                                                             |
| -------------------------------------- | ----------------------------------------------------------------- |
| `components/`                          | `X.tsx` in PascalCase, except `XContent.tsx`                      |
| `orchestrators/`, inside `components/` | components named `XContainer`, `XLayout` or `XPage`               |
| `presenters/`, inside `components/`    | the other components                                              |
| `hooks/`                               | `useX.ts`, `useX.tsx`                                             |
| `styles/`                              | `.css`, except `X.module.css`, which stays next to `X.tsx`        |
| `types/`                               | `xTypes.ts`                                                       |
| `configs/`                             | `xConfig.ts`                                                      |
| `routes/`                              | `xRoutes.ts`                                                      |
| `services/`                            | `xService.ts`                                                     |
| `queries/`                             | `xQueries.ts`                                                     |
| `keys/`                                | `xKeys.ts`, query key factories                                   |
| `schemas/`                             | `xSchemas.ts`                                                     |
| `clients/`                             | `xClient.ts`                                                      |
| `workers/`                             | `xWorker.ts`                                                      |
| `stores/`                              | `xStore.ts`                                                       |
| `lib/`                                 | any other `.ts` file, except `xContent.ts`, `xEnv.ts` and `.d.ts` |

- a file of a shared feature is used by at least two consumers. For `src/shared/`, a consumer is a feature or another shared feature, a sub-feature counting as the feature it sits in. For the `shared/` of a feature or a shared feature, a consumer is one of its sub-features, another of its shared features, or its own files outside them. A file imported by another file of the same shared feature gets the consumers of that file. The tests live in `test/unit/`, outside the checked folder, so a test is never a consumer: it exists for the code it covers and gives no reason to share it. A file that only tests import has no consumer at all and passes here, `knip --production` reports it. A file of `src/shared/` used only by `app/` or by the entry points of `src/` passes. A file with a single consumer gets `src/shared/dates/format.ts is only used by src/features/cart: move it into src/features/cart, with the tests that import it`, which also catches a whole shared feature used by one feature. The test of the moved file follows it to the new mirrored path, which `--fix` does once the source has moved, and a helper that only tests use is deleted or moves into `test/support/`.
- the files of a shared feature form one group in the import graph, whatever the direction of the imports. Since two shared features never import each other, the folder then only names a boundary the graph already draws. A `shared/utils/` holding `errorMessage.ts`, `isRecord.ts` and `packageRoot.ts`, which do not import each other, gets `src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one shared feature per group`. A shared feature of a single file is fine.

The first of these two rules says why a file is shared, the second why files sit together. Each one lets through what the other catches: in the `shared/utils/` above, each file has two consumers.

So a feature with two components puts them in `components/`, and a `components/` folder with two presenters puts them in `presenters/`. The `components/` rule does not apply inside `components/`, `orchestrators/` or `presenters/`.

- the unit tests sit in `test/unit/`, the folder `test/` next to the checked folder:
  - a `.test.ts` or `.test.tsx` file under the checked folder moves to the same path under `test/unit/` (`test-in-source`)
  - a test of `test/unit/` has a source of the same name at the mirrored path, `X.test.tsx` testing `X.ts`, `X.tsx` or a platform variant of them (`orphan-test`)
  - a folder of `test/unit/` has its counterpart in the checked folder, reported once at the highest missing level (`orphan-test-folder`), and is not empty
  - `test/unit/` holds tests only, `__snapshots__/` folders aside (`not-a-test`)
  - `test/` holds `unit/`, `e2e/` and `support/`, and nothing else (`not-a-test-folder`)

The files of a folder named `X.<platform>.<ext>`, like `useScreenTitle.web.ts` and `useScreenTitle.native.ts`, go with `X.<ext>`, whether that file exists or not. The bundler picks them by name and nothing imports them, so the variants and their base count as one file: they have the kind of `X.<ext>` (`AvatarPhoto.web.tsx` is a presenter), a `lib/` holding only `alert.ts` and `alert.web.ts` holds a single child, and they belong to one group in the import graph of a shared feature. check-tree does not compare their exports: TypeScript checks the base only, unless `moduleSuffixes` in the tsconfig points it at a variant.

### Output

It prints one line per problem and exits with code 1 if it found any. The violations listed in `.check-tree-known-violations.json` are left out.

### Options

| Flag                       | Key in `"check-tree"` | Default                                                                                                                                                                  |
| -------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| folder                     |                       | `src`                                                                                                                                                                    |
| `--categories <list>`      | `categories`          | `components`, `orchestrators`, `presenters`, `hooks`, `styles`, `types`, `configs`, `stores`, `routes`, `services`, `queries`, `keys`, `schemas`, `clients`, `workers`, `lib` |
| `--platforms <list>`       | `platforms`           | `web`, `ios`, `android`, `native`                                                                                                                                        |
| `--root-entries`           | `rootEntries`         | off                                                                                                                                                                      |
| `--fix`                    |                       | off                                                                                                                                                                      |
| `--write-known-violations` |                       | off                                                                                                                                                                      |
| `--shrink-known-violations` |                      | off                                                                                                                                                                      |

A flag wins over its key. A key that is not one of these, or a value of the wrong type, stops check-tree with a message.
