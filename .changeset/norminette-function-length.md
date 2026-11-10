---
'@brutalway/oxlint-config-typescript': minor
'create-brutal': minor
---

A function holds 25 lines at most, blank lines and comments not counted, and nests blocks and callbacks 3 levels deep at most (`max-lines-per-function`, `max-depth`, `max-nested-callbacks`), as in the Norminette of 42. Tests have no length limit. A project whose functions are longer starts failing. In the vite example, `TodoItem` is split into `TodoItemCheck` and `TodoItemActions`, the list moves to `TodoItems`, and `TodoInput` and `TodoEditor` share `TitleInput` and `TitleError` from `src/features/todo-list/shared/presenters/`.
