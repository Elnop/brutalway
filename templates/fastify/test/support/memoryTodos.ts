import { DatabaseSync } from 'node:sqlite';
import { createTodoListService } from '#src/features/todo-list/todoListService.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';
import { createTodosQueries } from '#src/shared/todos/todosQueries.ts';

export function memoryTodos() {
  const database = new DatabaseSync(':memory:');
  return {
    todos: createTodosQueries(database),
    todoListService: createTodoListService(database),
    todoStatsService: createTodoStatsService(database),
  };
}
