# @brutalway/check-tree

Checks the folders of a source tree, which a linter does not see: only the folders the layout names, no empty folder, no category folder with a single child, files of one kind grouped in that kind's folder once there are two of them, and no file in a `shared/` folder that a single feature uses.

## Install

```sh
npm install --save-dev @brutalway/check-tree dependency-cruiser
npx check-tree src
```

check-tree runs from the folder that holds the dependency-cruiser config (`.dependency-cruiser.cjs` and the like) and reads it to resolve the imports, with the same tsconfig and aliases.

## Usage

### Use your own category folders

```sh
npx check-tree src --categories components,hooks,utils
```

These are the kind folders the layout accepts, and the grouping rule only applies to the kinds listed in the table below that are also in this list.

### Keep the entry points of a published package

A published package keeps its entry points at the root of `src/`, one file per bin or export, whatever their kind. `--root-entries` leaves the files at the root of the checked folder where they are, and checks everything below as usual:

```sh
npx check-tree src --root-entries
```

### Run the check from code

```ts
import { treeViolations } from '@brutalway/check-tree/treeViolations';

const violations = treeViolations('src');
```

It takes the category folders as second argument and `{ rootEntries: true }` as third, like `--categories` and `--root-entries`. The check on `shared/` reads the imports, so it has its own export:

```ts
import { sharedViolations } from '@brutalway/check-tree/sharedViolations';

const violations = await sharedViolations('src');
```

## Reference

### Rules

- a folder has a name the layout gives it:
  - `src/` holds `app/`, `features/`, `shared-features/` and `shared/`, next to its entry files, and `app/` is not checked
  - `src/shared/` holds kind folders only (`lib/`, `types/`, `configs/`...), since it has no domain
  - a feature (`features/<x>/`) or a shared feature (`shared-features/<x>/`), at any depth, holds kind folders, `features/` for its sub-features, `shared-features/` for the business code they share and `shared/` for the code with no domain
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

- a file of a `shared/` folder is used by at least two consumers. For `src/shared/`, a consumer is a feature or a shared feature, a sub-feature counting as the feature it sits in. For the `shared/` of a feature or a shared feature, a consumer is one of its sub-features, one of its sub shared features, or its own files outside them. A file imported by another file of the same `shared/` gets the consumers of that file. Tests do not count, and a file of `src/shared/` used only by `app/` or by the entry files of `src/` passes. A file with a single consumer gets `src/shared/lib/format.ts is only used by src/features/cart: move it into src/features/cart`.

So a feature with two components puts them in `components/`, and a `components/` folder with two presenters puts them in `presenters/`. The `components/` rule does not apply inside `components/`, `orchestrators/` or `presenters/`.

Test files (`*.test.ts`, `*.test.tsx`) are not counted.

### Output

It prints one line per problem and exits with code 1 if it found any.

### Options

| Option                | Default                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| folder                | `src`                                                                                                                                                                    |
| `--categories <list>` | `components`, `orchestrators`, `presenters`, `hooks`, `styles`, `types`, `configs`, `stores`, `routes`, `services`, `queries`, `keys`, `schemas`, `clients`, `workers`, `lib` |
| `--root-entries`      | off                                                                                                                                                                      |
