---
'template-vite': patch
---

`TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts`, and the presenters type their callbacks with `Todo['id']`, so the data can come from somewhere else without touching the components.
