import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { completeTodo } from '#src/features/complete-todo/completeTodo.ts';

function todosFile(): string {
  const file = join(mkdtempSync(join(tmpdir(), 'complete-todo-')), 'todos.json');
  writeFileSync(
    file,
    JSON.stringify([
      { id: 1, text: 'Buy milk', done: false },
      { id: 2, text: 'Write the README', done: false },
    ]),
  );
  return file;
}

describe('completeTodo', () => {
  it('marks the todo done and keeps the others as they are', () => {
    const file = todosFile();
    assert.deepEqual(completeTodo(file, 2), { id: 2, text: 'Write the README', done: true });
    assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), [
      { id: 1, text: 'Buy milk', done: false },
      { id: 2, text: 'Write the README', done: true },
    ]);
  });

  it('refuses an id that no todo has', () => {
    assert.throws(() => completeTodo(todosFile(), 3), { message: 'No todo has the id 3.' });
  });
});
