import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const TSC = join(import.meta.dirname, '..', '..', '..', 'node_modules', '.bin', 'tsc');

type Files = Record<string, string>;

function project(config: string, files: Files, overrides: Record<string, unknown> = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'tsconfig-'));
  writeFileSync(join(root, 'tsconfig.json'), JSON.stringify({ extends: join(import.meta.dirname, config), compilerOptions: { types: [], ...overrides }, include: ['*.ts'] }));
  for (const [path, content] of Object.entries(files)) {
    writeFileSync(join(root, path), content);
  }
  return root;
}

function compile(config: string, source: string | Files, overrides: Record<string, unknown> = {}) {
  const root = project(config, typeof source === 'string' ? { 'main.ts': source } : source, overrides);
  const result = spawnSync(TSC, ['-p', root], { encoding: 'utf8' });
  return { status: result.status, output: result.stdout, root };
}

function resolvedOptions(config: string): Record<string, unknown> {
  const root = mkdtempSync(join(tmpdir(), 'tsconfig-'));
  writeFileSync(join(root, 'tsconfig.json'), JSON.stringify({ extends: join(import.meta.dirname, config), include: ['*.ts'] }));
  writeFileSync(join(root, 'main.ts'), 'export {};\n');
  const result = spawnSync(TSC, ['--showConfig', '-p', root], { encoding: 'utf8' });
  const shown: { compilerOptions: Record<string, unknown> } = JSON.parse(result.stdout);
  return shown.compilerOptions;
}

const OPTIONAL_UNDEFINED = 'type Point = { x?: number };\nexport const point: Point = { x: undefined };\n';
const INDEX_ACCESS = 'export function read(record: Record<string, number>) {\n  return record.total;\n}\n';
const UNUSED_PARAMETER = 'export function f(unused: number) {\n  return 1;\n}\n';

const STRICTNESS_CASES = [
  { flag: 'strict', off: { noImplicitAny: false }, code: 'TS7006', source: 'export function f(value) {\n  return value;\n}\n' },
  { flag: 'noUnusedLocals', code: 'TS6133', source: 'function unused() {}\nexport {};\n' },
  { flag: 'noUnusedParameters', code: 'TS6133', source: UNUSED_PARAMETER },
  { flag: 'noImplicitReturns', code: 'TS7030', source: 'export function f(value: number) {\n  if (value > 0) {\n    return 1;\n  }\n}\n' },
  {
    flag: 'noFallthroughCasesInSwitch',
    code: 'TS7029',
    source: 'export function f(value: number) {\n  let label = 0;\n  switch (value) {\n    case 1:\n      label = 1;\n    case 2:\n      label = 2;\n  }\n  return label;\n}\n',
  },
  { flag: 'noImplicitOverride', code: 'TS4114', source: 'class Base {\n  run() {}\n}\nexport class Child extends Base {\n  run() {}\n}\n' },
  { flag: 'noPropertyAccessFromIndexSignature', code: 'TS4111', source: INDEX_ACCESS },
  { flag: 'exactOptionalPropertyTypes', code: 'TS2375', source: OPTIONAL_UNDEFINED },
  { flag: 'erasableSyntaxOnly', code: 'TS1294', source: 'export enum Color {\n  Red,\n}\n' },
];

const BASE_FLAGS = {
  strict: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  noImplicitOverride: true,
  noPropertyAccessFromIndexSignature: true,
  exactOptionalPropertyTypes: true,
  noEmit: true,
  allowImportingTsExtensions: true,
  erasableSyntaxOnly: true,
  verbatimModuleSyntax: true,
};

describe('@brutalway/tsconfig', () => {
  it('compiles clean code with the base config', () => {
    assert.equal(compile('base.json', 'export const answer: number = 42;\n').status, 0);
  });

  for (const { flag, off, code, source } of STRICTNESS_CASES) {
    it(`reports ${code} with ${flag} on, and nothing once ${flag} is turned off`, () => {
      assert.match(compile('base.json', source).output, new RegExp(code, 'u'));
      assert.equal(compile('base.json', source, off ?? { [flag]: false }).status, 0);
    });
  }

  it('imports a .ts file by its extension and requires import type for a type under verbatimModuleSyntax', () => {
    const types = 'export type Point = { x: number };\n';
    assert.equal(compile('base.json', { 'types.ts': types, 'main.ts': "import type { Point } from './types.ts';\nexport const origin: Point = { x: 0 };\n" }).status, 0);
    assert.match(compile('base.json', { 'types.ts': types, 'main.ts': "import { Point } from './types.ts';\nexport const origin: Point = { x: 0 };\n" }).output, /TS1484/u);
  });

  it('emits no file', () => {
    const { status, root } = compile('base.json', 'export const answer = 42;\n');
    assert.equal(status, 0);
    assert.equal(existsSync(join(root, 'main.js')), false);
  });

  it('sets the flags listed in the README and target ES2022 in base.json', () => {
    assert.deepEqual(resolvedOptions('base.json'), { ...BASE_FLAGS, target: 'es2022', skipLibCheck: true, isolatedModules: true, preserveConstEnums: true });
  });

  it('adds target and lib ES2024, nodenext and the Node types in node.json', () => {
    const options = resolvedOptions('node.json');
    assert.deepEqual(
      { target: options['target'], lib: options['lib'], module: options['module'], moduleResolution: options['moduleResolution'], types: options['types'] },
      { target: 'es2024', lib: ['es2024'], module: 'nodenext', moduleResolution: 'nodenext', types: ['node'] },
    );
    const recent = 'export const sorted = [3, 1, 2].toSorted();\nexport const grouped = Object.groupBy([1, 2], (value) => (value > 1 ? "big" : "small"));\n';
    assert.equal(compile('node.json', { 'package.json': JSON.stringify({ type: 'module' }), 'main.ts': recent }).status, 0);
    assert.match(compile('base.json', recent).output, /TS2550/u);
  });

  it('adds the DOM libs, bundler resolution, react-jsx and the vite/client types in react-vite.json', () => {
    const options = resolvedOptions('react-vite.json');
    assert.deepEqual(
      { lib: options['lib'], module: options['module'], moduleResolution: options['moduleResolution'], jsx: options['jsx'], types: options['types'] },
      { lib: ['es2022', 'dom', 'dom.iterable'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', types: ['vite/client'] },
    );
  });

  it('keeps the base flags in the Node and React + Vite variants', () => {
    for (const config of ['node.json', 'react-vite.json']) {
      assert.match(compile(config, OPTIONAL_UNDEFINED).output, /TS2375/u, config);
      assert.deepEqual(Object.fromEntries(Object.keys(BASE_FLAGS).map((flag) => [flag, resolvedOptions(config)[flag]])), BASE_FLAGS, config);
    }
  });

  it('lifts only exactOptionalPropertyTypes and noPropertyAccessFromIndexSignature in the third-party variant', () => {
    assert.equal(compile('react-vite-third-party.json', OPTIONAL_UNDEFINED).status, 0);
    assert.equal(compile('react-vite-third-party.json', INDEX_ACCESS).status, 0);
    assert.match(compile('react-vite-third-party.json', UNUSED_PARAMETER).output, /TS6133/u);
    const { exactOptionalPropertyTypes, noPropertyAccessFromIndexSignature, ...thirdParty } = resolvedOptions('react-vite-third-party.json');
    assert.deepEqual({ exactOptionalPropertyTypes, noPropertyAccessFromIndexSignature }, { exactOptionalPropertyTypes: false, noPropertyAccessFromIndexSignature: false });
    const { exactOptionalPropertyTypes: _exact, noPropertyAccessFromIndexSignature: _index, ...reactVite } = resolvedOptions('react-vite.json');
    assert.deepEqual(thirdParty, reactVite);
  });
});
