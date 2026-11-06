import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildApp } from '#src/app/buildApp.ts';

describe('buildApp', () => {
  it('serves the OpenAPI document and the Swagger UI', async () => {
    const app = await buildApp({ databasePath: ':memory:', logLevel: 'silent' });
    const spec = await app.inject({ method: 'GET', url: '/docs/json' });
    assert.equal(spec.json<{ info: { title: string } }>().info.title, '__PROJECT_NAME__');
    const ui = await app.inject({ method: 'GET', url: '/docs/' });
    assert.equal(ui.statusCode, 200);
    await app.close();
  });
});
