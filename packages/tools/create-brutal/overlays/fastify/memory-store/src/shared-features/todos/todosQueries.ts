import type { Todo, TodoPatch, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

type TodoMap = Map<number, Todo>;

function copyOrNull(todo: Todo | undefined): Todo | null {
  return todo === undefined ? null : { ...todo };
}

function updateTodo(todos: TodoMap, id: number, { title, completed }: TodoPatch): Todo | null {
  const todo = todos.get(id);
  if (todo === undefined) return null;
  const updated = { id, title: title ?? todo.title, completed: completed ?? todo.completed };
  todos.set(id, updated);
  return { ...updated };
}

function removeTodo(todos: TodoMap, id: number): Todo | null {
  const todo = todos.get(id);
  todos.delete(id);
  return copyOrNull(todo);
}

function removeCompletedTodos(todos: TodoMap): number {
  const completed = [...todos.values()].filter((todo) => todo.completed);
  for (const todo of completed) todos.delete(todo.id);
  return completed.length;
}

export function createTodosQueries(): TodosQueries {
  const todos: TodoMap = new Map();
  let lastId = 0;

  function all(): Todo[] {
    return [...todos.values()].map((todo) => ({ ...todo }));
  }

  return {
    list: all,
    listByCompleted: (completed) => all().filter((todo) => todo.completed === completed),
    find: (id) => copyOrNull(todos.get(id)),
    insert: ({ title }) => {
      lastId += 1;
      const todo = { id: lastId, title, completed: false };
      todos.set(todo.id, todo);
      return { ...todo };
    },
    update: (id, patch) => updateTodo(todos, id, patch),
    remove: (id) => removeTodo(todos, id),
    removeCompleted: () => removeCompletedTodos(todos),
    count: () => ({ total: todos.size, completed: all().filter((todo) => todo.completed).length }),
  };
}
