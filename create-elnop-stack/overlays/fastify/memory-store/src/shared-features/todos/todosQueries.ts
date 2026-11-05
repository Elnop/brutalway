import type { Todo, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

export function createTodosQueries(): TodosQueries {
  const todos = new Map<number, Todo>();
  let lastId = 0;

  function all(): Todo[] {
    return [...todos.values()].map((todo) => ({ ...todo }));
  }

  return {
    list: all,
    listByCompleted: (completed) => all().filter((todo) => todo.completed === completed),
    find: (id) => {
      const todo = todos.get(id);
      return todo === undefined ? null : { ...todo };
    },
    insert: ({ title }) => {
      lastId += 1;
      const todo = { id: lastId, title, completed: false };
      todos.set(todo.id, todo);
      return { ...todo };
    },
    update: (id, { title, completed }) => {
      const todo = todos.get(id);
      if (todo === undefined) return null;
      const updated = { id, title: title ?? todo.title, completed: completed ?? todo.completed };
      todos.set(id, updated);
      return { ...updated };
    },
    remove: (id) => {
      const todo = todos.get(id);
      if (todo === undefined) return null;
      todos.delete(id);
      return todo;
    },
    removeCompleted: () => {
      const completed = all().filter((todo) => todo.completed);
      for (const todo of completed) todos.delete(todo.id);
      return completed.length;
    },
    count: () => {
      const list = all();
      return { total: list.length, completed: list.filter((todo) => todo.completed).length };
    },
  };
}
