import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';
import { createTestServer } from '#test-utils/createTestServer.ts';

describe('todo stats routes', () => {
  it('counts total, completed and remaining todos', async () => {
    const database = new DatabaseSync(':memory:');
    const todos = createTodosQueries(database);
    const app = createTestServer();
    await app.register(todoStatsRoutes(createTodoStatsService(database)));
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
