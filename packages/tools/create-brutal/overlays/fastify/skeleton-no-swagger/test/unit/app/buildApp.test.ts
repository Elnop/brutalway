import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildApp } from '#src/app/buildApp.ts';

describe('buildApp', () => {
  it('answers 404 on a route nobody registered', async () => {
    const app = await buildApp({ databasePath: ':memory:', logLevel: 'silent' });
    assert.equal((await app.inject({ method: 'GET', url: '/' })).statusCode, 404);
    await app.close();
  });
});
