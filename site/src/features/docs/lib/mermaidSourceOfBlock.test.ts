import type { ExtraProps } from 'react-markdown';
import { describe, expect, it } from 'vitest';
import { mermaidSourceOfBlock } from '@/features/docs/lib/mermaidSourceOfBlock.ts';

function preBlock(language: string, text: string): ExtraProps['node'] {
  return {
    type: 'element',
    tagName: 'pre',
    properties: {},
    children: [
      {
        type: 'element',
        tagName: 'code',
        properties: { className: [`language-${language}`] },
        children: [{ type: 'text', value: text }],
      },
    ],
  };
}

describe('mermaidSourceOfBlock', () => {
  it('returns the source of a mermaid block without its last line break', () => {
    expect(mermaidSourceOfBlock(preBlock('mermaid', 'flowchart TB\n  a --> b\n'))).toBe(
      'flowchart TB\n  a --> b',
    );
  });

  it('returns undefined for another language', () => {
    expect(mermaidSourceOfBlock(preBlock('sh', 'npm run check\n'))).toBeUndefined();
  });
});
