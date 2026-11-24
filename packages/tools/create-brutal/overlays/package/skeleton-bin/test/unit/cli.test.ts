import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'cli.ts');

describe('__PROJECT_NAME__', () => {
  it('prints its name and exits with 0', () => {
    const result = spawnSync(process.execPath, [CLI], { encoding: 'utf8' });
    assert.deepEqual(
      { status: result.status, stdout: result.stdout, stderr: result.stderr },
      { status: 0, stdout: '__PROJECT_NAME__\n', stderr: '' },
    );
  });
});
