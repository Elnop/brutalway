import type { createTodoListService } from '#src/features/todo-list/todoListService.ts';

export type TodoListService = ReturnType<typeof createTodoListService>;
