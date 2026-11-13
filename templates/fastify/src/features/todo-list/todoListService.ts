import type { TodoDraft, TodoFilter, TodoPatch } from '#src/shared-features/todos/TodosTypes.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

export function createTodoListService(database: Parameters<typeof createTodosQueries>[0]) {
  const todos = createTodosQueries(database);
  return {
    list: (filter: TodoFilter) =>
      filter === 'all' ? todos.list() : todos.listByCompleted(filter === 'completed'),
    create: (draft: TodoDraft) => todos.insert(draft),
    update: (id: number, patch: TodoPatch) => todos.update(id, patch),
    remove: (id: number) => todos.remove(id),
    clearCompleted: () => ({ deleted: todos.removeCompleted() }),
  };
}
