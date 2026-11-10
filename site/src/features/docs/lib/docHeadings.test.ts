import { describe, expect, it } from 'vitest';
import { docHeadings, docMainTitle } from '@/features/docs/lib/docHeadings.ts';

describe('docHeadings', () => {
  it('lists the level 2 to 4 headings with the anchors GitHub gives them', () => {
    const markdown = [
      '# Title',
      '## Why it exists',
      'text',
      '### The `--yes` flag',
      '#### The styling option',
      '##### Too deep',
      '## Why it exists',
      '```md',
      '## not a heading',
      '```',
    ].join('\n');
    expect(docHeadings(markdown)).toStrictEqual([
      { depth: 2, text: 'Why it exists', slug: 'why-it-exists' },
      { depth: 3, text: 'The --yes flag', slug: 'the---yes-flag' },
      { depth: 4, text: 'The styling option', slug: 'the-styling-option' },
      { depth: 2, text: 'Why it exists', slug: 'why-it-exists-1' },
    ]);
  });

  it('reads the text of links and emphasis in a heading', () => {
    expect(docHeadings('## See [the roadmap](roadmap/README.md) **now**')).toStrictEqual([
      { depth: 2, text: 'See the roadmap now', slug: 'see-the-roadmap-now' },
    ]);
  });

  it('reads the level 1 heading as the title of the page, outside code blocks', () => {
    expect(
      docMainTitle(
        ['```md', '# not a title', '```', '# Work with `Claude Code`', '## Install'].join('\n'),
      ),
    ).toBe('Work with Claude Code');
    expect(docMainTitle('## Only sections')).toBeUndefined();
  });
});
