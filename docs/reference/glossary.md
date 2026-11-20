# Glossary

The words the docs, the messages of the checks and `AGENTS.md` use for the parts of a project. Each one has a single meaning, and the paths come from the templates.

## Layer

One of the three folders at the top of `src/`: `app/`, `features/` and `shared/`. A layer imports only the layers below it. template-package has no `app/`: the files at the root of `src/` play its part. dependency-cruiser checks the imports, check-tree rejects any other folder at that level.

## Feature

A folder of `src/features/`, named after what it does for the user: `src/features/todo-list/`. It holds everything that thing needs, and deleting the folder deletes the thing. A feature never imports another feature.

## Sub-feature

A feature inside a feature or a shared feature, in its `features/` folder: `src/features/todo-list/features/todo-editor/`. It imports neither its siblings nor the root of its parent.

## Shared feature

A folder of a `shared/`, named after its concept, that holds code several consumers use: `src/shared/todos/` for the features, `src/features/todo-list/shared/title-input/` for the sub-features of `todo-list`. It is laid out like a feature, so it can hold kind folders, sub-features and its own `shared/`. A shared feature never imports another shared feature, each of its files has two consumers at least, and its files form a single group. `shared/` itself holds only shared features, no file.

Up to `@brutalway/check-tree` 0.7, `src/shared-features/` was a layer of its own next to `src/shared/`. Both merged into `shared/` in 0.8.0.

## Kind and kind folder

The kind of a file is what it is, read from its name: a hook (`useTodos.ts`), a store (`todosStore.ts`), types (`TodosTypes.ts`), a component, a pure function. One file of a kind stays at the root of its folder. From two on, they move into the kind folder: `hooks/`, `stores/`, `types/`, `components/`, `lib/`, and so on. The `categories` option of check-tree replaces the list of kind folders.

## Consumer

A folder that imports a file of a shared feature: a feature of `src/features/` for `src/shared/`, or a sub-feature, another shared feature or the files of the parent outside them for a nested `shared/`. A sub-feature counts as the feature it sits in. A test is never a consumer. check-tree moves a file that a single consumer uses into that consumer.

## Group of files

The files of a shared feature, tests aside, linked by their imports in either direction. A shared feature holds a single group: two groups that never import each other are two concepts, and check-tree asks to split them into two shared features. A platform variant is in the group of its base.

## Entry point

A file that a tool loads, not another file of `src/`: the route files of `src/app/`, `src/main.tsx` on vite, `instrumentation.ts` on next, `src/server.ts` on fastify, and every file at the root of `src/` on template-package, where each one is a bin or an export of the package.

## Orchestrator and presenter

An orchestrator is a component named `XContainer`, `XLayout` or `XPage`. It reads stores through hooks and passes what it gets down as props. A presenter is any other component: it gets props and renders them, and reaches no store through any chain of imports. No orchestrator lives in a shared feature.

## Platform variant

On react-native, a file whose name carries a platform before its extension, next to its base: `useScreenTitle.web.ts` beside `useScreenTitle.ts`. Metro picks it on that platform. It has the kind of its base, counts as one file with it, and gets the consumers of its base.

## Slice

A word of [Feature-Sliced Design](https://feature-sliced.design/), used here only when the docs talk about FSD. An FSD slice of the `features` layer is a feature, and an FSD slice of the `shared` layer is a shared feature. See [what we take from FSD](../concepts/inspirations.md#feature-sliced-design).
