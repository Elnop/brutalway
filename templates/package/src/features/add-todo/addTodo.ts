import { readTodos, writeTodos } from '#src/shared-features/todos/todosFile.ts';
import type { Todo } from '#src/shared-features/todos/TodosTypes.ts';

export function addTodo(file: string, text: string): Todo {
  const trimmed = text.trim();
  if (trimmed === '') throw new Error('The text of a todo cannot be blank.');
  const todos = readTodos(file);
  const todo = {
    id: Math.max(0, ...todos.map((existing) => existing.id)) + 1,
    text: trimmed,
    done: false,
  };
  writeTodos(file, [...todos, todo]);
  return todo;
}
