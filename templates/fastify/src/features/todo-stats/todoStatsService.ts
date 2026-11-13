import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

export function createTodoStatsService(database: Parameters<typeof createTodosQueries>[0]) {
  const todos = createTodosQueries(database);
  return {
    stats: () => {
      const { total, completed } = todos.count();
      return { total, completed, remaining: total - completed };
    },
  };
}
