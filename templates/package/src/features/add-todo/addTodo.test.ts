import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { addTodo } from '#src/features/add-todo/addTodo.ts';

function todosFile(): string {
  return join(mkdtempSync(join(tmpdir(), 'add-todo-')), 'todos.json');
}

describe('addTodo', () => {
  it('creates the file, trims the text and gives each todo the next id', () => {
    const file = todosFile();
    assert.deepEqual(addTodo(file, '  Buy milk '), { id: 1, text: 'Buy milk', done: false });
    assert.deepEqual(addTodo(file, 'Write the README'), { id: 2, text: 'Write the README', done: false });
    assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), [
      { id: 1, text: 'Buy milk', done: false },
      { id: 2, text: 'Write the README', done: false },
    ]);
  });

  it('refuses a blank text and leaves the file alone', () => {
    const file = todosFile();
    assert.throws(() => addTodo(file, '   '), { message: 'The text of a todo cannot be blank.' });
    assert.throws(() => readFileSync(file), { code: 'ENOENT' });
  });
});
