import { describe, expect, it } from 'vitest';
import { docTitle } from '@/features/docs/lib/docTitle.ts';

describe('docTitle', () => {
  it('names a doc after its file', () => {
    expect(docTitle('docs/intent.md')).toBe('Intent');
    expect(docTitle('docs/fitness-functions.md')).toBe('Fitness functions');
  });

  it('names a readme after its folder', () => {
    expect(docTitle('create-elnop-stack/README.md')).toBe('Create elnop stack');
    expect(docTitle('readme.md')).toBe('Overview');
  });
});
