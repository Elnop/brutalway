# @brutalway/check-tree

Checks the folders of a source tree, which a linter does not see: only the folders the layout names, no empty folder, no category folder with a single child, files of one kind grouped in that kind's folder once there are two of them, no file in a slice of `shared/` that a single feature uses, and no slice whose files never import each other.

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

### Use your own category folders

`categories` lists the kind folders the layout accepts, and the grouping rule only applies to the kinds listed in the table below that are also in this list.

### Keep the entry points of a published package

A published package keeps its entry points at the root of `src/`, one file per bin or export, whatever their kind. `"rootEntries": true` leaves the files at the root of the checked folder where they are, and checks everything below as usual.

### Use your own platforms

A platform variant (`X.web.ts`, `X.ios.tsx`) is the file that Metro and Expo pick in place of `X.ts` for one platform. check-tree knows `web`, `ios`, `android` and `native`, and `platforms` replaces that list.

### Keep the violations of an existing tree

On a codebase that did not follow the layout, the first run prints a lot. Write the current violations to `.check-tree-known-violations.json` and commit it:

```sh
npx check-tree src --write-known-violations
```

check-tree then skips the violations listed in that file, which it reads from the current folder. It still fails on a violation that is not in the list, and on an entry that no longer happens, which you delete from the file. The file is a JSON array of the messages check-tree prints:

```json
["src/features/player/hooks holds a single child: move it up one level and delete the folder"]
```

A message that names a count, like `holds 3 groups of files`, changes when the count changes: run `--write-known-violations` again and check the diff.

### Run the check from code

```ts
import { treeViolations } from '@brutalway/check-tree/treeViolations';

const violations = treeViolations('src');
```

It takes the category folders as second argument and `{ rootEntries: true, platforms: ['web'] }` as third, like `--categories`, `--root-entries` and `--platforms`. The checks on the slices of `shared/` read the imports, so they have their own export, which takes the platforms as second argument:

```ts
import { sharedViolations } from '@brutalway/check-tree/sharedViolations';

const violations = await sharedViolations('src');
```

## Reference

### Rules

- a folder has a name the layout gives it:
  - `src/` holds `app/`, `features/` and `shared/`, next to its entry files. `app/` belongs to the router, so its folders are not checked and its files stay where they are, whatever their kind
  - a `shared/`, at any depth, holds one folder per slice, named after its concept (`shared/todos/`, `shared/errors/`), and no file
  - a feature (`features/<x>/`) or a slice (`shared/<x>/`), at any depth, holds kind folders, `features/` for its sub-features and `shared/` for the slices they share
  - a kind folder holds kind folders only, like `presenters/` inside `components/`
- no empty folder
- a category folder (`components`, `hooks`, `stores`…) does not hold a single child: move the child up and delete the folder
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

- a file of a slice is used by at least two consumers. For `src/shared/`, a consumer is a feature or another slice, a sub-feature counting as the feature it sits in. For the `shared/` of a feature or a slice, a consumer is one of its sub-features, another of its slices, or its own files outside them. A file imported by another file of the same slice gets the consumers of that file. A test counts for the feature it sits in, since moving the file would make that test import another feature, and a test next to the file in the slice adds no consumer. A file of `src/shared/` used only by `app/` or by the entry files of `src/` passes. A file with a single consumer gets `src/shared/dates/format.ts is only used by src/features/cart: move it into src/features/cart`, which also catches a whole slice used by one feature.
- the files of a slice, tests aside, form one group in the import graph, whatever the direction of the imports. Since two slices never import each other, the folder then only names a boundary the graph already draws. A `shared/utils/` holding `errorMessage.ts`, `isRecord.ts` and `packageRoot.ts`, which do not import each other, gets `src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one slice per group`. A slice of a single file is fine.

The first of these two rules says why a file is shared, the second why files sit together. Each one lets through what the other catches: in the `shared/utils/` above, each file has two consumers.

So a feature with two components puts them in `components/`, and a `components/` folder with two presenters puts them in `presenters/`. The `components/` rule does not apply inside `components/`, `orchestrators/` or `presenters/`.

Test files (`*.test.ts`, `*.test.tsx`) are not counted.

The files of a folder named `X.<platform>.<ext>`, like `useScreenTitle.web.ts` and `useScreenTitle.native.ts`, go with `X.<ext>`, whether that file exists or not. The bundler picks them by name and nothing imports them, so the variants and their base count as one file: they have the kind of `X.<ext>` (`AvatarPhoto.web.tsx` is a presenter), a `lib/` holding only `alert.ts` and `alert.web.ts` holds a single child, and they belong to one group in the import graph of a slice. check-tree does not compare their exports: TypeScript checks the base only, unless `moduleSuffixes` in the tsconfig points it at a variant.

### Output

It prints one line per problem and exits with code 1 if it found any. The violations listed in `.check-tree-known-violations.json` are left out.

### Options

| Flag                       | Key in `"check-tree"` | Default                                                                                                                                                                  |
| -------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| folder                     |                       | `src`                                                                                                                                                                    |
| `--categories <list>`      | `categories`          | `components`, `orchestrators`, `presenters`, `hooks`, `styles`, `types`, `configs`, `stores`, `routes`, `services`, `queries`, `keys`, `schemas`, `clients`, `workers`, `lib` |
| `--platforms <list>`       | `platforms`           | `web`, `ios`, `android`, `native`                                                                                                                                        |
| `--root-entries`           | `rootEntries`         | off                                                                                                                                                                      |
| `--write-known-violations` |                       | off                                                                                                                                                                      |

A flag wins over its key. A key that is not one of these, or a value of the wrong type, stops check-tree with a message.
