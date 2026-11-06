import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

const ALINT = join(import.meta.dirname, '..', '..', '..', 'node_modules', '@asamarts', 'alint', 'bin-platform', 'alint');

function repository(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'alint-'));
  spawnSync('git', ['init', '-q'], { cwd: root });
  mkdirSync(join(root, 'node_modules', '@brutalway', 'alint-config'), { recursive: true });
  copyFileSync(join(import.meta.dirname, 'base.yml'), join(root, 'node_modules', '@brutalway', 'alint-config', 'base.yml'));
  const all: Record<string, string> = { '.alint.yml': 'version: 1\nextends:\n  - ./node_modules/@brutalway/alint-config/base.yml\n', ...files };
  for (const [path, content] of Object.entries(all)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function failingRules(root: string): string[] {
  const result = spawnSync(ALINT, ['check', '-f', 'json'], { cwd: root, encoding: 'utf8' });
  const report: { results: { id: string; passed: boolean }[] } = JSON.parse(result.stdout);
  return report.results
    .filter((rule) => !rule.passed)
    .map((rule) => rule.id)
    .toSorted();
}

test('a tidy repository passes every rule', () => {
  const root = repository({
    'package.json': JSON.stringify({ dependencies: { react: '19.3.1' }, devDependencies: { vite: '8.3.5' } }),
    'web/package.json': JSON.stringify({ dependencies: { zustand: '5.0.16' } }),
    'README.md': '# App\n\nSee [the checks](docs/checks.md#tree).\n',
    'docs/checks.md': '# Checks\n\n## Tree\n',
    'src/styles/app.css': '',
    'src/types/CartTypes.ts': '',
    'src/configs/CartConfig.ts': '',
    'src/configs/CartConfig.test.ts': '',
  });
  assert.deepEqual(failingRules(root), []);
});

test('each rule reports its violation', () => {
  const root = repository({
    'package.json': JSON.stringify({ dependencies: { react: '^19.3.1' } }),
    'web/package.json': JSON.stringify({ devDependencies: { vite: 'latest' } }),
    'README.md': '# App\n\nSee [the checks](docs/missing.md) and [the tree](docs/checks.md#nowhere).\n',
    'docs/checks.md': '# Checks\n',
    'src/styles/helper.ts': '',
    'src/types/types.ts': '',
    'src/configs/Logo.tsx': '',
  });
  assert.deepEqual(failingRules(root), ['configs-only-config-files', 'doc-fragments-resolve', 'doc-links-resolve', 'exact-dependency-versions', 'styles-only-css', 'types-only-types-files']);
});
