import { readTodos } from '#src/shared-features/todos/todosFile.ts';
import type { Todo } from '#src/shared-features/todos/TodosTypes.ts';

export function listTodos(file: string): Todo[] {
  return readTodos(file);
}
