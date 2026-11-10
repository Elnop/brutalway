import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildApp } from '#src/app/buildApp.ts';

describe('buildApp', () => {
  it('wires the todo list and the stats on the same todos', async () => {
    const app = await buildApp({ databasePath: ':memory:', logLevel: 'silent' });
    await app.inject({ method: 'POST', url: '/todos', payload: { title: 'Wire the app' } });
    assert.deepEqual((await app.inject({ method: 'GET', url: '/stats' })).json(), {
      total: 1,
      completed: 0,
      remaining: 1,
    });
    await app.close();
  });
});
