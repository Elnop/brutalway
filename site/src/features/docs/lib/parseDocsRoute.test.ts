import { describe, expect, it } from 'vitest';
import { parseDocsRoute } from '@/features/docs/lib/parseDocsRoute.ts';

describe('parseDocsRoute', () => {
  it('opens the first file of the first source by default', () => {
    expect(parseDocsRoute('#/docs')).toMatchObject({ source: { key: 'brutalway' }, path: 'readme.md' });
    expect(parseDocsRoute('#/docs/')).toMatchObject({ source: { key: 'brutalway' }, path: 'readme.md' });
  });

  it('reads the source and the path', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/intent.md')).toMatchObject({ source: { key: 'brutalway' }, path: 'docs/intent.md' });
    expect(parseDocsRoute('#/docs/template-vite')).toMatchObject({ source: { key: 'template-vite' }, path: 'README.md' });
  });

  it('rejects an unknown source', () => {
    expect(parseDocsRoute('#/docs/unknown/readme.md')).toBeUndefined();
  });
});
