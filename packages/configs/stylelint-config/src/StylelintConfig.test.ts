import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const FIXTURES = fileURLToPath(new URL('../fixtures', import.meta.url));
const STYLELINT_BIN = join(
  createRequire(import.meta.url).resolve('stylelint/package.json'),
  '..',
  'bin',
  'stylelint.mjs',
);

type Warning = { line: number; rule: string; text: string };
type FileResult = { source: string; warnings: Warning[] };

function lintFixtures(): string[] {
  const run = spawnSync(process.execPath, [STYLELINT_BIN, 'src/**/*.css', '--formatter', 'json'], {
    cwd: FIXTURES,
    encoding: 'utf8',
  });
  const results: FileResult[] = JSON.parse(run.stderr.trim() === '' ? run.stdout : run.stderr);
  return results
    .flatMap(({ source, warnings }) =>
      warnings.map(({ line, text }) => `${source.slice(FIXTURES.length + 1)}:${line} ${text}`),
    )
    .toSorted((left, right) => left.localeCompare(right, 'en', { numeric: true }));
}

describe('stylelintConfig', () => {
  it('keeps colors on tokens and CSS Modules on their component', () => {
    assert.deepEqual(lintFixtures(), [
      'src/cards/Badge.module.css:1 Badge.tsx does not import Badge.module.css. Import it as styles, or delete the stylesheet. (brutalway/no-unused-class)',
      'src/cards/Card.module.css:4 #fffdf4 is not a color token. Use a var() of a color declared in src/app/globals.css, closest: var(--paper), var(--yellow), var(--blue). (brutalway/color-tokens)',
      'src/cards/Card.module.css:9 black is not a color token. Use a var() of a color declared in src/app/globals.css, closest: var(--ink), var(--paper), var(--yellow). (brutalway/color-tokens)',
      'src/cards/Card.module.css:12 .unused is not used by Card.tsx. Use styles.unused in the component, or delete the rule. (brutalway/no-unused-class)',
      'src/cards/Card.module.css:13 rgb(0 0 255) is not a color token. Use a var() of a color declared in src/app/globals.css, closest: var(--blue), var(--ink), var(--paper). (brutalway/color-tokens)',
      'src/cards/Card.module.css:16 .kebab-name is not used by Card.tsx. Use styles.kebab-name in the component, or delete the rule. (brutalway/no-unused-class)',
      'src/cards/Card.module.css:16 Write the classes of a CSS Module in camelCase, so the component reads them as styles.name (selector-class-pattern)',
      'src/cards/Lone.module.css:1 Lone.module.css has no Lone.tsx next to it. Name the stylesheet after the component that imports it, or delete it if the component is gone. (brutalway/module-next-to-component)',
      'src/cards/plain.css:2 tomato is not a color token. Use a var() of a color declared in src/app/globals.css, closest: var(--ink), var(--paper), var(--yellow). (brutalway/color-tokens)',
    ]);
  });
});
