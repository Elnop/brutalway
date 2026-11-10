import { readJsonFile, writeJsonFile } from '#src/shared/jsonFile.ts';
import type { Todo } from '#src/shared-features/todos/TodosTypes.ts';

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    Number.isInteger(value.id) &&
    'text' in value &&
    typeof value.text === 'string' &&
    'done' in value &&
    typeof value.done === 'boolean'
  );
}

export function readTodos(file: string): Todo[] {
  const content = readJsonFile(file, []);
  if (!Array.isArray(content) || !content.every(isTodo)) {
    throw new Error(`${file} does not hold a list of todos.`);
  }
  return content;
}

export function writeTodos(file: string, todos: Todo[]): void {
  writeJsonFile(file, todos);
}
