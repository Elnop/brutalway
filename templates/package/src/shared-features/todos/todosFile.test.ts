import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { readTodos, writeTodos } from '#src/shared-features/todos/todosFile.ts';

function todosFile(): string {
  return join(mkdtempSync(join(tmpdir(), 'todos-file-')), 'todos.json');
}

describe('todosFile', () => {
  it('writes the todos as indented JSON and reads them back', () => {
    const file = todosFile();
    writeTodos(file, [{ id: 1, text: 'Buy milk', done: false }]);
    assert.equal(readFileSync(file, 'utf8'), '[\n  {\n    "id": 1,\n    "text": "Buy milk",\n    "done": false\n  }\n]\n');
    assert.deepEqual(readTodos(file), [{ id: 1, text: 'Buy milk', done: false }]);
  });

  it('refuses a file that does not hold a list of todos', () => {
    const file = todosFile();
    for (const content of ['{}', '[{ "id": 1, "text": "Buy milk" }]', '[{ "id": "1", "text": "Buy milk", "done": false }]']) {
      writeFileSync(file, content);
      assert.throws(() => readTodos(file), { message: `${file} does not hold a list of todos.` });
    }
  });
});
