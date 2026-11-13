import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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
  const content: unknown = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
  if (!Array.isArray(content) || !content.every(isTodo)) {
    throw new Error(`${file} does not hold a list of todos.`);
  }
  return content;
}

export function writeTodos(file: string, todos: Todo[]): void {
  writeFileSync(file, `${JSON.stringify(todos, null, 2)}\n`);
}
