import { readTodos, writeTodos } from '#src/shared-features/todos/todosFile.ts';
import type { Todo } from '#src/shared-features/todos/TodosTypes.ts';

export function completeTodo(file: string, id: number): Todo {
  const todos = readTodos(file);
  const todo = todos.find((candidate) => candidate.id === id);
  if (todo === undefined) throw new Error(`No todo has the id ${id}.`);
  const completed = { ...todo, done: true };
  writeTodos(
    file,
    todos.map((candidate) => (candidate.id === id ? completed : candidate)),
  );
  return completed;
}
