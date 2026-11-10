import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { todoListRoutes } from '#src/features/todo-list/todoListRoutes.ts';
import { createTodoListService } from '#src/features/todo-list/todoListService.ts';
import { createServer } from '#src/shared/lib/createServer.ts';
import { openDatabase } from '#src/shared/lib/openDatabase.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

async function emptyApp() {
  const app = createServer({ logLevel: 'silent' });
  await app.register(
    todoListRoutes(createTodoListService({ todos: createTodosQueries(openDatabase(':memory:')) })),
  );
  return app;
}

describe('todo list routes', () => {
  it('creates todos with a normalized title and lists them', async () => {
    const app = await emptyApp();
    const created = await app.inject({
      method: 'POST',
      url: '/todos',
      payload: { title: '  Ship   the template ' },
    });
    assert.equal(created.statusCode, 201);
    assert.deepEqual(created.json(), { id: 1, title: 'Ship the template', completed: false });
    const listed = await app.inject({ method: 'GET', url: '/todos' });
    assert.deepEqual(listed.json(), [{ id: 1, title: 'Ship the template', completed: false }]);
    await app.close();
  });

  it('refuses a blank title and an unknown filter', async () => {
    const app = await emptyApp();
    assert.equal(
      (await app.inject({ method: 'POST', url: '/todos', payload: { title: '   ' } })).statusCode,
      400,
    );
    assert.equal((await app.inject({ method: 'GET', url: '/todos?filter=later' })).statusCode, 400);
    await app.close();
  });

  it('updates, filters, deletes and clears completed todos', async () => {
    const app = await emptyApp();
    for (const title of ['a', 'b', 'c']) {
      await app.inject({ method: 'POST', url: '/todos', payload: { title } });
    }
    const patched = await app.inject({
      method: 'PATCH',
      url: '/todos/2',
      payload: { completed: true },
    });
    assert.deepEqual(patched.json(), { id: 2, title: 'b', completed: true });
    assert.deepEqual(
      (await app.inject({ method: 'GET', url: '/todos?filter=active' }))
        .json<{ id: number }[]>()
        .map((todo) => todo.id),
      [1, 3],
    );
    assert.deepEqual((await app.inject({ method: 'DELETE', url: '/todos/3' })).json(), {
      id: 3,
      title: 'c',
      completed: false,
    });
    assert.deepEqual((await app.inject({ method: 'DELETE', url: '/todos/completed' })).json(), {
      deleted: 1,
    });
    assert.deepEqual(
      (await app.inject({ method: 'GET', url: '/todos' }))
        .json<{ id: number }[]>()
        .map((todo) => todo.id),
      [1],
    );
    await app.close();
  });

  it('answers 404 for an unknown id and 400 for an empty patch', async () => {
    const app = await emptyApp();
    const missing = await app.inject({
      method: 'PATCH',
      url: '/todos/9',
      payload: { completed: true },
    });
    assert.equal(missing.statusCode, 404);
    assert.deepEqual(missing.json(), { message: 'No todo has this id' });
    assert.equal((await app.inject({ method: 'DELETE', url: '/todos/9' })).statusCode, 404);
    assert.equal(
      (await app.inject({ method: 'PATCH', url: '/todos/1', payload: {} })).statusCode,
      400,
    );
    await app.close();
  });
});
