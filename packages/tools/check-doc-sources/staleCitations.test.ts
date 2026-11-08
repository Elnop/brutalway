import assert from 'node:assert/strict';
import { test } from 'node:test';
import { staleCitations } from './staleCitations.ts';

test('only a changed file whose doc did not change is reported', () => {
  const cited = [
    { doc: 'docs/architecture.md', file: 'src/app/App.tsx', line: 3 },
    { doc: 'README.md', file: 'src/app/App.tsx', line: 8 },
    { doc: 'README.md', file: 'src/main.tsx', line: 9 },
  ];
  assert.deepEqual(staleCitations(cited, new Set(['src/app/App.tsx', 'README.md']), []), [{ doc: 'docs/architecture.md', file: 'src/app/App.tsx', line: 3 }]);
});

test('a changed file matching ignoreSources is not reported', () => {
  const cited = [{ doc: 'README.md', file: 'packages/tool/package.json', line: 2 }];
  assert.deepEqual(staleCitations(cited, new Set(['packages/tool/package.json']), ['**/package.json']), []);
});
