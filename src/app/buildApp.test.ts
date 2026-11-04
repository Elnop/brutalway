import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildApp } from '#src/app/buildApp.ts';

describe('buildApp', () => {
  it('serves the OpenAPI document and the Swagger UI', async () => {
    const app = await buildApp({ databasePath: ':memory:', logLevel: 'silent' });
    const spec = await app.inject({ method: 'GET', url: '/docs/json' });
    assert.deepEqual(Object.keys(spec.json<{ paths: Record<string, unknown> }>().paths).toSorted(), ['/stats', '/todos', '/todos/completed', '/todos/{id}']);
    const ui = await app.inject({ method: 'GET', url: '/docs/' });
    assert.equal(ui.statusCode, 200);
    assert.match(ui.body, /Todos API/u);
    await app.close();
  });
});
