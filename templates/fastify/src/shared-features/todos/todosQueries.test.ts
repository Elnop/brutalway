import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { openDatabase } from '#src/shared/lib/openDatabase.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

function emptyQueries() {
  return createTodosQueries(openDatabase(':memory:'));
}

describe('todosQueries', () => {
  it('inserts, finds and lists todos in creation order', () => {
    const todos = emptyQueries();
    const first = todos.insert({ title: 'Write the queries' });
    todos.insert({ title: 'Test them' });
    assert.deepEqual(first, { id: 1, title: 'Write the queries', completed: false });
    assert.deepEqual(todos.find(1), first);
    assert.equal(todos.find(99), null);
    assert.deepEqual(
      todos.list().map((todo) => todo.title),
      ['Write the queries', 'Test them'],
    );
  });

  it('updates only the given fields and filters by completion', () => {
    const todos = emptyQueries();
    todos.insert({ title: 'a' });
    todos.insert({ title: 'b' });
    assert.deepEqual(todos.update(2, { completed: true }), { id: 2, title: 'b', completed: true });
    assert.deepEqual(todos.update(2, { title: 'B' }), { id: 2, title: 'B', completed: true });
    assert.equal(todos.update(99, { completed: true }), null);
    assert.deepEqual(
      todos.listByCompleted(true).map((todo) => todo.id),
      [2],
    );
    assert.deepEqual(
      todos.listByCompleted(false).map((todo) => todo.id),
      [1],
    );
  });

  it('counts, removes one todo and removes the completed ones', () => {
    const todos = emptyQueries();
    assert.deepEqual(todos.count(), { total: 0, completed: 0 });
    todos.insert({ title: 'a' });
    todos.insert({ title: 'b' });
    todos.insert({ title: 'c' });
    todos.update(1, { completed: true });
    todos.update(2, { completed: true });
    assert.deepEqual(todos.count(), { total: 3, completed: 2 });
    assert.deepEqual(todos.remove(3), { id: 3, title: 'c', completed: false });
    assert.equal(todos.remove(3), null);
    assert.equal(todos.removeCompleted(), 2);
    assert.deepEqual(todos.count(), { total: 0, completed: 0 });
  });
});
