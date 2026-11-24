import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import * as todos from '#src/todos.ts';

describe('the "." export', () => {
  it('exports addTodo, completeTodo and listTodos, which share one file', () => {
    assert.deepEqual(Object.keys(todos).toSorted(), ['addTodo', 'completeTodo', 'listTodos']);
    const file = join(mkdtempSync(join(tmpdir(), 'todos-')), 'todos.json');
    todos.addTodo(file, 'Buy milk');
    todos.addTodo(file, 'Write the README');
    todos.completeTodo(file, 1);
    assert.deepEqual(todos.listTodos(file), [
      { id: 1, text: 'Buy milk', done: true },
      { id: 2, text: 'Write the README', done: false },
    ]);
  });
});
