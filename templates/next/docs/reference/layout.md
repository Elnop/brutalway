# Layout

```
src/
  app/              the App Router folder: route files that compose the features
  features/         one folder per feature, never imported by another feature
  shared/           one folder per shared feature, the code several features use
```

Each layer only imports the layers below it. A feature and a shared feature never have the same name.

`src/app/` is both the top layer and the folder Next.js reads routes from. Its route files (`layout.tsx`, `page.tsx`, and later `loading.tsx` or `error.tsx`) are the orchestrators of the app: they are server components and only lay out the features. `src/app/` holds only what Next.js reads, plus `globals.css`, which `layout.tsx` imports: the i18n setup is the `src/features/i18n/` feature, and the messages are data, in `locales/` at the root of the project, imported through the `@locales/*` alias. `src/proxy.ts` sits at the root of `src/`, where Next.js looks for it.

`src/shared/` holds one folder per shared feature, named after its concept, and no file at its root. Each file of a shared feature has two consumers at least, features or entry points, or is imported by a file of its shared feature that has them. The files of a shared feature, tests aside, import each other into one group: two groups that never import each other make two shared features. A shared feature never imports another shared feature.

A feature or a shared feature that grows holds sub-features in `features/<y>/` and the shared features they have in common in `shared/<y>/`, next to its kind folders. Each of them can do the same, down to ten levels. check-tree rejects any other folder name there.

In the example, `src/shared/todos/` holds the tasks and the current filter, used by both `src/features/todo-list/` (add, check, rename, delete, filter) and `src/features/todo-stats/` (counters, clear done). Renaming a task is a sub-feature: `src/features/todo-list/features/todo-editor/`.

Components are orchestrators (`XContainer`, `XLayout`, `XPage`), which read stores, or presenters (everything else), which only get props.

One file of a kind stays at the root of its folder. From two on, they move into `components/`, `hooks/`, `types/`, `configs/`, `stores/` or `lib/`.

## Words

A feature is a folder of `src/features/`, named after what it does. A sub-feature is a feature inside a feature or a shared feature, in its `features/` folder. A shared feature is a folder of a `shared/`, named after its concept: `src/shared/<x>/` holds code several features use, and the `shared/` of a feature holds code several of its sub-features use. A kind folder (`lib/`, `types/`, `configs/`...) gathers the files of one kind once there are two of them. A consumer of a shared feature is a feature, a sub-feature or another shared feature that imports it, tests aside. An entry point is a file a tool loads rather than another file of `src/`: the route files of `src/app/` and the files Next.js looks for at the root of `src/`. The [brutalway glossary](https://github.com/Elnop/brutalway/blob/main/docs/reference/glossary.md) defines every term the checks print.
