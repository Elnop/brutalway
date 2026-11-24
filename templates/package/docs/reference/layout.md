# Layout

```
src/
  todo.ts           bin: the todo command
  todos.ts          the "." export
  features/         one folder per feature, never imported by another feature
  shared/           one folder per shared feature, the code several features use
test/
  unit/             the tests, at the path of their source
  support/          the helpers several tests share
```

Each entry point is a file at the root of `src/`, listed in `bin` or `exports` of `package.json` and in `tsdown.config.ts`. Nothing but a test imports it: an entry point composes the features the way the `app` layer does in an app, and there is no `app` folder.

Each layer only imports the layers below it. `src/shared/todos/` holds the `Todo` type and `todosFile.ts`, the only file that reads and writes the todos. `src/features/add-todo/`, `src/features/list-todos/` and `src/features/complete-todo/` all use it without knowing each other. Imports go through the `#src/` alias declared in the `imports` field of `package.json`.

`src/shared/` holds one folder per shared feature, named after its concept, and no file at its root. Each file of a shared feature has two consumers at least, features or entry points, or is imported by a file of its shared feature that has them. The files of a shared feature import each other into one group: two groups that never import each other make two shared features. A shared feature never imports another shared feature.

A feature or a shared feature that grows holds sub-features in `features/<y>/` and the shared features they have in common in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

`test/unit/` mirrors `src/`: the test of `src/shared/todos/todosFile.ts` is `test/unit/shared/todos/todosFile.test.ts`. A source needs no test, but a test needs its source at that path, so moving a source means moving its test: `npx check-tree src --fix` does it.

## Words

A feature is a folder of `src/features/`, named after what it does. A sub-feature is a feature inside a feature or a shared feature, in its `features/` folder. A shared feature is a folder of a `shared/`, named after its concept: `src/shared/<x>/` holds code several features use, and the `shared/` of a feature holds code several of its sub-features use. A kind folder (`lib/`, `types/`, `configs/`...) gathers the files of one kind once there are two of them. A consumer of a shared feature is a feature, a sub-feature or another shared feature that imports it. A test is never a consumer, since it lives in `test/`. An entry point is a file a tool loads rather than another file of `src/`: every file at the root of `src/`, a bin or an export. The [brutalway glossary](https://github.com/Elnop/brutalway/blob/main/docs/reference/glossary.md) defines every term the checks print.
