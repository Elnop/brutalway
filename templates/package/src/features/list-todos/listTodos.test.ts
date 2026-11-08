import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { listTodos } from '#src/features/list-todos/listTodos.ts';

function todosFile(): string {
  return join(mkdtempSync(join(tmpdir(), 'list-todos-')), 'todos.json');
}

describe('listTodos', () => {
  it('returns nothing when the file does not exist yet', () => {
    assert.deepEqual(listTodos(todosFile()), []);
  });

  it('returns the todos of the file in their order', () => {
    const file = todosFile();
    const todos = [
      { id: 2, text: 'Write the README', done: true },
      { id: 1, text: 'Buy milk', done: false },
    ];
    writeFileSync(file, JSON.stringify(todos));
    assert.deepEqual(listTodos(file), todos);
  });
});
