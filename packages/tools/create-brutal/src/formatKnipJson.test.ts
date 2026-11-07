import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { formatKnipJson } from './formatKnipJson.ts';

test('a knip config that fits keeps its arrays on one line, as Prettier does', () => {
  const template = readFileSync(new URL('../../../../templates/vite/knip.json', import.meta.url), 'utf8');
  assert.equal(formatKnipJson(template), template);
});

test('an array longer than 200 columns gets one entry per line', () => {
  const names = Array.from({ length: 12 }, (_, index) => `@scope/package-number-${index}`);
  const formatted = formatKnipJson(JSON.stringify({ ignoreDependencies: names }));
  assert.equal(formatted, `{\n  "ignoreDependencies": [\n${names.map((name, index) => `    "${name}"${index === names.length - 1 ? '' : ','}`).join('\n')}\n  ]\n}\n`);
});
