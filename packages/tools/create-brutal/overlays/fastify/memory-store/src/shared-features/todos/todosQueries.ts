import type { Todo, TodoPatch, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

const TODOS = new Map<number, Todo>();

function copyOrNull(todo: Todo | undefined): Todo | null {
  return todo === undefined ? null : { ...todo };
}

function all(): Todo[] {
  return [...TODOS.values()].map((todo) => ({ ...todo }));
}

function updateTodo(id: number, { title, completed }: TodoPatch): Todo | null {
  const todo = TODOS.get(id);
  if (todo === undefined) return null;
  const updated = { id, title: title ?? todo.title, completed: completed ?? todo.completed };
  TODOS.set(id, updated);
  return { ...updated };
}

function removeTodos(todos: Todo[]): Todo[] {
  for (const todo of todos) TODOS.delete(todo.id);
  return todos;
}

export function createTodosQueries(): TodosQueries {
  return {
    list: all,
    listByCompleted: (completed) => all().filter((todo) => todo.completed === completed),
    find: (id) => copyOrNull(TODOS.get(id)),
    insert: ({ title }) => {
      const todo = { id: Math.max(0, ...TODOS.keys()) + 1, title, completed: false };
      TODOS.set(todo.id, todo);
      return { ...todo };
    },
    update: updateTodo,
    remove: (id) => copyOrNull(removeTodos(all().filter((todo) => todo.id === id))[0]),
    removeCompleted: () => removeTodos(all().filter((todo) => todo.completed)).length,
    count: () => ({ total: TODOS.size, completed: all().filter((todo) => todo.completed).length }),
  };
}
