import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { test } from 'node:test';

const PLAYWRIGHT = join(import.meta.dirname, '..', '..', '..', 'node_modules', '.bin', 'playwright');

function runSpec(spec: string) {
  const result = spawnSync(PLAYWRIGHT, ['test', '--config', join(import.meta.dirname, 'fixtures', 'playwright.config.ts'), spec], { cwd: import.meta.dirname, encoding: 'utf8' });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

test('a test fails when the page throws', () => {
  const { status, output } = runSpec('throws.spec.ts');
  assert.equal(status, 1);
  assert.match(output, /the page threw while the test ran/u);
  assert.match(output, /boom/u);
});

test('a test fails when the page breaks its Content Security Policy', () => {
  const { status, output } = runSpec('csp.spec.ts');
  assert.equal(status, 1);
  assert.match(output, /the page broke its Content Security Policy while the test ran/u);
  assert.match(output, /script-src 'none'/u);
});

test('axeViolations names each violated rule and its nodes', () => {
  const { status, output } = runSpec('axe.spec.ts');
  assert.equal(status, 0, output);
});
