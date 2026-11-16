---
'template-vite': minor
'template-next': minor
'template-react-native': minor
'template-fastify': minor
'template-package': minor
---

`src/shared-features/` and `src/shared/` merge into one `src/shared/` that holds one folder per slice, as `@brutalway/dependency-cruiser-config` 0.10.0 and `@brutalway/check-tree` 0.8.0 ask. `src/shared-features/todos/` becomes `src/shared/todos/`, with `normalizeTitle.ts` next to `todosSelectors.ts` in its `lib/`, `readEnv.ts` and `EnvTypes.ts` of template-fastify go into `src/shared/env/`, and the empty `src/shared/` of template-package goes. In `src/features/todo-list/shared/`, `TitleInput`, `TitleError` and `useTitleForm` do not import each other, so each one gets its slice: `title-input/`, `title-error/` and `title-form/`. The docs follow.
