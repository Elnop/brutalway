import { describe, expect, it } from 'vitest';
import { docTitle } from '@/features/docs/lib/docTitle.ts';

describe('docTitle', () => {
  it('names a doc after its file', () => {
    expect(docTitle('docs/intent.md')).toBe('Intent');
    expect(docTitle('docs/fitness-functions.md')).toBe('Fitness functions');
  });

  it('names a readme after its folder', () => {
    expect(docTitle('create-brutal/README.md')).toBe('Create brutal');
    expect(docTitle('readme.md')).toBe('Overview');
  });

  it('writes an upper case file name in sentence case', () => {
    expect(docTitle('CHANGELOG.md')).toBe('Changelog');
  });
});
