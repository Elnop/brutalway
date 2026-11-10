---
'template-vite': minor
'template-fastify': patch
---

No function is longer than 25 lines. On vite, `TodoItem` is split into `TodoItemCheck` and `TodoItemActions`, the list moves from `TodoListLayout` to `TodoItems`, and `TodoInput` and `TodoEditor` share `TitleInput` and `TitleError` from `src/features/todo-list/shared/presenters/`. On fastify, `createTodosQueries` prepares its statements in a function of their own.
