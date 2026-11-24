import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTestServer } from '#test-support/createTestServer.ts';
import { memoryTodos } from '#test-support/memoryTodos.ts';

describe('todo stats routes', () => {
  it('counts total, completed and remaining todos', async () => {
    const { todos, todoStatsService } = memoryTodos();
    const app = createTestServer();
    await app.register(todoStatsRoutes(todoStatsService));
    assert.deepEqual((await app.inject({ method: 'GET', url: '/stats' })).json(), {
      total: 0,
      completed: 0,
      remaining: 0,
    });
    for (const title of ['a', 'b', 'c']) todos.insert({ title });
    todos.update(1, { completed: true });
    assert.deepEqual((await app.inject({ method: 'GET', url: '/stats' })).json(), {
      total: 3,
      completed: 1,
      remaining: 2,
    });
    await app.close();
  });
});
