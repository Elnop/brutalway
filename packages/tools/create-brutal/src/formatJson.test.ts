import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { formatJson } from './formatJson.ts';

test('the JSON configs of the vite template are already formatted the way Prettier does', () => {
  for (const file of ['knip.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.test.json']) {
    const template = readFileSync(new URL(`../../../../templates/vite/${file}`, import.meta.url), 'utf8');
    assert.equal(formatJson(template, file), template, file);
  }
});

test('an array longer than 200 columns gets one entry per line', () => {
  const names = Array.from({ length: 12 }, (_, index) => `@scope/package-number-${index}`);
  const formatted = formatJson(JSON.stringify({ ignoreDependencies: names }), 'knip.json');
  assert.equal(formatted, `{\n  "ignoreDependencies": [\n${names.map((name, index) => `    "${name}"${index === names.length - 1 ? '' : ','}`).join('\n')}\n  ]\n}\n`);
});

test('an array that fits again goes back on one line, with objects written inline', () => {
  const formatted = formatJson('{"include":[\n"src",\n"e2e"\n],"references":[{"path":"./a.json"},{"path":"./b.json"}],"exclude":[]}', 'tsconfig.json');
  assert.equal(formatted, '{\n  "include": ["src", "e2e"],\n  "references": [{ "path": "./a.json" }, { "path": "./b.json" }],\n  "exclude": []\n}\n');
});
