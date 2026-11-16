import { readTodos } from '#src/shared/todos/todosFile.ts';
import type { Todo } from '#src/shared/todos/TodosTypes.ts';

export function listTodos(file: string): Todo[] {
  return readTodos(file);
}
