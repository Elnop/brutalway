import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';
import { createServer } from '#src/shared/lib/createServer.ts';
import { openDatabase } from '#src/shared/lib/openDatabase.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

describe('todo stats routes', () => {
  it('counts total, completed and remaining todos', async () => {
    const todos = createTodosQueries(openDatabase(':memory:'));
    const app = createServer({ logLevel: 'silent' });
    await app.register(todoStatsRoutes(createTodoStatsService({ todos })));
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
