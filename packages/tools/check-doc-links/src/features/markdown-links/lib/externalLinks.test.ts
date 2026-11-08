import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { externalLinks } from '#src/features/markdown-links/lib/externalLinks.ts';

describe('externalLinks', () => {
  it('links, images, definitions and autolinks to http and https are found with their line, not relative links or code', () => {
    const content = [
      'See [the docs](https://example.dev/docs) and ![logo](http://example.dev/logo.png).',
      '',
      'https://example.dev/auto and [local](docs/a.md) and `https://example.dev/code`',
      '',
      '[ref]: https://example.dev/ref',
      '',
    ].join('\n');
    assert.deepEqual(
      externalLinks({ path: 'README.md', content }).map((link) => `${link.line} ${link.url}`),
      ['1 https://example.dev/docs', '1 http://example.dev/logo.png', '3 https://example.dev/auto', '5 https://example.dev/ref'],
    );
  });
});
