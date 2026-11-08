import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const PLAYWRIGHT = join(import.meta.dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'playwright');
const FIXTURES = join(import.meta.dirname, '..', 'fixtures');

function runSpec(spec: string) {
  const result = spawnSync(PLAYWRIGHT, ['test', '--config', join(FIXTURES, 'playwright.config.ts'), spec], { cwd: FIXTURES, encoding: 'utf8', env: { ...process.env, CI: '1' } });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

describe('playwrightFixtures', () => {
  it('fails a test when the page throws', () => {
    const { status, output } = runSpec('throws.spec.ts');
    assert.equal(status, 1, output);
    assert.match(output, /the page threw while the test ran/u);
    assert.match(output, /boom/u);
    assert.match(output, /1 failed/u);
  });

  it('fails a test when the page breaks its Content Security Policy', () => {
    const { status, output } = runSpec('csp.spec.ts');
    assert.equal(status, 1, output);
    assert.match(output, /the page broke its Content Security Policy while the test ran/u);
    assert.match(output, /script-src 'none'/u);
    assert.match(output, /1 failed/u);
  });

  it('lets a quiet page pass and names each axe violation with its nodes', () => {
    const { status, output } = runSpec('axe.spec.ts');
    assert.equal(status, 0, output);
    assert.match(output, /2 passed/u);
  });
});
