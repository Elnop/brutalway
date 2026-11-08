import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { formatJson } from '#src/features/scaffolding/lib/formatJson.ts';
import { LOCAL_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';

describe('formatJson', () => {
  it('leaves the JSON configs of the vite template as they are, already formatted the way Prettier does', () => {
    for (const file of ['knip.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.test.json']) {
      const template = readFileSync(join(LOCAL_ROOT, 'templates', 'vite', file), 'utf8');
      assert.equal(formatJson(template, file), template, file);
    }
  });

  it('puts one entry per line in an array longer than 200 columns', () => {
    const names = Array.from({ length: 12 }, (_, index) => `@scope/package-number-${index}`);
    const formatted = formatJson(JSON.stringify({ ignoreDependencies: names }), 'knip.json');
    assert.equal(formatted, `{\n  "ignoreDependencies": [\n${names.map((name, index) => `    "${name}"${index === names.length - 1 ? '' : ','}`).join('\n')}\n  ]\n}\n`);
  });

  it('puts an array that fits back on one line, with objects written inline', () => {
    const formatted = formatJson('{"include":[\n"src",\n"e2e"\n],"references":[{"path":"./a.json"},{"path":"./b.json"}],"exclude":[]}', 'tsconfig.json');
    assert.equal(formatted, '{\n  "include": ["src", "e2e"],\n  "references": [{ "path": "./a.json" }, { "path": "./b.json" }],\n  "exclude": []\n}\n');
  });
});
