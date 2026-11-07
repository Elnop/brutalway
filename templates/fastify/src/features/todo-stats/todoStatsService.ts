import type { TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

export function createTodoStatsService({ todos }: { todos: TodosQueries }) {
  return {
    stats: () => {
      const { total, completed } = todos.count();
      return { total, completed, remaining: total - completed };
    },
  };
}
