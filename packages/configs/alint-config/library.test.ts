import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ALINT = join(import.meta.dirname, '..', '..', '..', 'node_modules', '@asamarts', 'alint', 'bin-platform', 'alint');

function libraryRepository(manifest: object): string {
  const root = mkdtempSync(join(tmpdir(), 'alint-library-'));
  spawnSync('git', ['init', '-q'], { cwd: root });
  const config = join(root, 'node_modules', '@brutalway', 'alint-config');
  mkdirSync(config, { recursive: true });
  for (const file of ['base.yml', 'library.yml']) copyFileSync(join(import.meta.dirname, file), join(config, file));
  writeFileSync(join(root, '.alint.yml'), 'version: 1\nextends:\n  - ./node_modules/@brutalway/alint-config/library.yml\n');
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
  writeFileSync(join(root, 'README.md'), '# Library\n\nSee [the docs](docs/missing.md).\n');
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

describe('library.yml', () => {
  it('lets dependencies and peerDependencies keep their ranges and keeps the base rules', () => {
    const root = libraryRepository({ dependencies: { picocolors: '^1.1.0' }, peerDependencies: { oxlint: '^1.91.0' }, devDependencies: { oxlint: '1.91.0' } });
    assert.deepEqual(failingRules(root), ['doc-links-resolve']);
  });

  it('still pins every devDependency', () => {
    const root = libraryRepository({ dependencies: { picocolors: '^1.1.0' }, devDependencies: { oxlint: '^1.91.0' } });
    assert.deepEqual(failingRules(root), ['doc-links-resolve', 'exact-dependency-versions']);
  });
});
