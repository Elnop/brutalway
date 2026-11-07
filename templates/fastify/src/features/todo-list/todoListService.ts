import type { TodoDraft, TodoFilter, TodoPatch, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

export function createTodoListService({ todos }: { todos: TodosQueries }) {
  return {
    list: (filter: TodoFilter) => (filter === 'all' ? todos.list() : todos.listByCompleted(filter === 'completed')),
    create: (draft: TodoDraft) => todos.insert(draft),
    update: (id: number, patch: TodoPatch) => todos.update(id, patch),
    remove: (id: number) => todos.remove(id),
    clearCompleted: () => ({ deleted: todos.removeCompleted() }),
  };
}
