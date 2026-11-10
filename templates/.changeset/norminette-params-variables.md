---
'template-vite': patch
---

`TodoListLayout` reads `useTodoList()` as one `list` object instead of destructuring seven names, so that it declares 5 variables at most.
