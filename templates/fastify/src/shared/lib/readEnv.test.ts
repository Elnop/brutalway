import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readEnv } from '#src/shared/lib/readEnv.ts';

describe('readEnv', () => {
  it('fills the defaults', () => {
    assert.deepEqual(readEnv({}), {
      host: '127.0.0.1',
      port: 3000,
      databasePath: 'todos.db',
      logLevel: 'info',
    });
  });

  it('reads and converts the variables', () => {
    assert.deepEqual(
      readEnv({ HOST: '0.0.0.0', PORT: '8080', DATABASE_PATH: ':memory:', LOG_LEVEL: 'silent' }),
      {
        host: '0.0.0.0',
        port: 8080,
        databasePath: ':memory:',
        logLevel: 'silent',
      },
    );
  });

  it('refuses an invalid configuration', () => {
    assert.throws(() => readEnv({ PORT: 'eighty' }), /PORT/u);
    assert.throws(() => readEnv({ LOG_LEVEL: 'loud' }), /LOG_LEVEL/u);
  });
});
