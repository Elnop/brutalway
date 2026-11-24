# Layout

```
src/
  app/              composes the features
  features/         one folder per feature, never imported by another feature
  shared/           one folder per shared feature, the code several features use
test/
  unit/             the unit and component tests, at the path of their source
  e2e/              the Playwright specs
  support/          the helpers several tests share
```

Each layer only imports the layers below it. A feature and a shared feature never have the same name.

The messages are data, so they live outside `src/`, in `locales/` at the root of the project. `src/features/i18n/createI18n.ts` imports them through the `@locales/*` alias.

`src/shared/` holds one folder per shared feature, named after its concept, and no file at its root. Each file of a shared feature has two consumers at least, features or entry points, or is imported by a file of its shared feature that has them. The files of a shared feature import each other into one group: two groups that never import each other make two shared features. A shared feature never imports another shared feature.

A feature or a shared feature that grows holds sub-features in `features/<y>/` and the shared features they have in common in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

In the example, `src/shared/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.

`test/unit/` mirrors `src/`: a test sits at the path of its source, `x.ts` or `X.tsx` being tested by `x.test.ts` or `X.test.tsx`. A source needs no test, but a test needs its source at that path, so moving a source means moving its test: `npx check-tree src --fix` does it.

## Words

A feature is a folder of `src/features/`, named after what it does. A sub-feature is a feature inside a feature or a shared feature, in its `features/` folder. A shared feature is a folder of a `shared/`, named after its concept: `src/shared/<x>/` holds code several features use, and the `shared/` of a feature holds code several of its sub-features use. A kind folder (`lib/`, `types/`, `configs/`...) gathers the files of one kind once there are two of them. A consumer of a shared feature is a feature, a sub-feature or another shared feature that imports it. A test is never a consumer, since it lives in `test/`. An entry point is a file a tool loads rather than another file of `src/`: `src/main.tsx`. The [brutalway glossary](https://github.com/Elnop/brutalway/blob/main/docs/reference/glossary.md) defines every term the checks print.
