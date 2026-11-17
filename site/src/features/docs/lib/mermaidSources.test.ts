import { describe, expect, it } from 'vitest';
import { mermaidSources } from '@/features/docs/lib/mermaidSources.ts';

describe('mermaidSources', () => {
  it('returns the source of each mermaid block and skips the other code blocks', () => {
    const markdown = [
      '# Title',
      '```mermaid',
      'flowchart TB',
      '  a --> b',
      '```',
      '```sh',
      'npm run check',
      '```',
      '```mermaid',
      'flowchart LR',
      '```',
    ].join('\n');
    expect(mermaidSources(markdown)).toStrictEqual(['flowchart TB\n  a --> b', 'flowchart LR']);
  });
});
