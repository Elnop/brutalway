import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const TSC = join(import.meta.dirname, '..', '..', '..', 'node_modules', '.bin', 'tsc');

function compile(config: string, source: string) {
  const project = mkdtempSync(join(tmpdir(), 'tsconfig-'));
  writeFileSync(join(project, 'tsconfig.json'), JSON.stringify({ extends: join(import.meta.dirname, config), compilerOptions: { types: [] }, include: ['*.ts'] }));
  writeFileSync(join(project, 'main.ts'), source);
  const result = spawnSync(TSC, ['-p', project], { encoding: 'utf8' });
  return { status: result.status, output: result.stdout };
}

test('the base config compiles clean code', () => {
  assert.equal(compile('base.json', 'export const answer: number = 42;\n').status, 0);
});

test('the base config turns on the extra strictness flags', () => {
  const optional = compile('base.json', 'type Point = { x?: number };\nexport const point: Point = { x: undefined };\n');
  assert.match(optional.output, /TS2375/u);
  const indexed = compile('base.json', 'export function read(record: Record<string, number>) {\n  return record.total;\n}\n');
  assert.match(indexed.output, /TS4111/u);
  const unused = compile('base.json', 'export function f(unused: number) {\n  return 1;\n}\n');
  assert.match(unused.output, /TS6133/u);
});

test('the Node and React + Vite variants extend the base', () => {
  for (const config of ['node.json', 'react-vite.json']) {
    assert.match(compile(config, 'type Point = { x?: number };\nexport const point: Point = { x: undefined };\n').output, /TS2375/u, config);
  }
});
