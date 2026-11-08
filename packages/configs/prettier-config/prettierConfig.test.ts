import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT_NODE_MODULES = join(import.meta.dirname, '..', '..', '..', 'node_modules');
const PRETTIER = join(ROOT_NODE_MODULES, '.bin', 'prettier');

function project(config: string, files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'prettier-config-'));
  symlinkSync(ROOT_NODE_MODULES, join(root, 'node_modules'));
  const all: Record<string, string> = { 'package.json': JSON.stringify({ name: 'fixture', prettier: config }), ...files };
  for (const [path, content] of Object.entries(all)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function format(root: string, file: string): string {
  const result = spawnSync(PRETTIER, [file], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

const LONG_CALL = `register(${['firstArgumentName', 'secondArgumentName', 'thirdArgumentName', 'fourthArgumentName', 'fifthArgumentName', 'sixthArgumentName'].join(', ')});\n`;
const TOO_LONG_CALL = `register(${Array.from({ length: 12 }, (_, index) => `argumentNumber${index}`).join(', ')});\n`;

const THEME = '@import "tailwindcss";\n@theme {\n  --color-ink: #111111;\n}\n';
const CARD = 'export const Card = () => <div className="p-4 bg-ink flex" />;\n';

describe('@brutalway/prettier-config', () => {
  it('writes single quotes and keeps a line up to 200 columns', () => {
    const root = project('@brutalway/prettier-config', { 'main.ts': `const greeting = "hello";\n${LONG_CALL}` });
    assert.ok(LONG_CALL.length > 80);
    assert.equal(format(root, 'main.ts'), `const greeting = 'hello';\n${LONG_CALL}`);
  });

  it('breaks a line over 200 columns and puts a trailing comma after the last argument', () => {
    const root = project('@brutalway/prettier-config', { 'main.ts': TOO_LONG_CALL });
    const expected = `register(\n${Array.from({ length: 12 }, (_, index) => `  argumentNumber${index},\n`).join('')});\n`;
    assert.ok(TOO_LONG_CALL.length > 200);
    assert.equal(format(root, 'main.ts'), expected);
  });

  it('leaves Tailwind classes in their order without the tailwind variant', () => {
    const root = project('@brutalway/prettier-config', { 'src/app/globals.css': THEME, 'Card.tsx': CARD });
    assert.equal(format(root, 'Card.tsx'), CARD);
  });

  it('sorts Tailwind classes with the tailwind variant, custom tokens from src/app/globals.css included', () => {
    const root = project('@brutalway/prettier-config/tailwind', { 'src/app/globals.css': THEME, 'Card.tsx': CARD });
    assert.equal(format(root, 'Card.tsx'), 'export const Card = () => <div className="flex bg-ink p-4" />;\n');
  });

  it('keeps the classes the theme does not know in front', () => {
    const root = project('@brutalway/prettier-config/tailwind', { 'src/app/globals.css': '@import "tailwindcss";\n', 'Card.tsx': CARD });
    assert.equal(format(root, 'Card.tsx'), 'export const Card = () => <div className="bg-ink flex p-4" />;\n');
  });
});
