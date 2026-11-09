import { describe, expect, it } from 'vitest';
import { parseDocsRoute } from '@/features/docs/lib/parseDocsRoute.ts';

describe('parseDocsRoute', () => {
  it('opens the first file of the first source by default', () => {
    expect(parseDocsRoute('#/docs')).toMatchObject({ source: { key: 'brutalway' }, path: 'README.md' });
    expect(parseDocsRoute('#/docs/')).toMatchObject({ source: { key: 'brutalway' }, path: 'README.md' });
  });

  it('reads the source and the path', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/intent.md')).toMatchObject({ source: { key: 'brutalway' }, path: 'docs/intent.md' });
  });

  it('opens the template index by default', () => {
    expect(parseDocsRoute('#/templates')).toMatchObject({ source: { key: 'all' }, path: 'README.md' });
  });

  it('opens a template page, its docs and its changelog', () => {
    expect(parseDocsRoute('#/templates/fastify')).toMatchObject({ source: { key: 'fastify' }, path: 'README.md' });
    expect(parseDocsRoute('#/templates/package')).toMatchObject({ source: { key: 'package' }, path: 'README.md' });
    expect(parseDocsRoute('#/templates/vite/CHANGELOG.md')).toMatchObject({ source: { key: 'vite' }, path: 'CHANGELOG.md' });
  });

  it('keeps each source in its own section', () => {
    expect(parseDocsRoute('#/docs/vite')).toBeUndefined();
    expect(parseDocsRoute('#/templates/brutalway')).toBeUndefined();
  });

  it('reads the section after the page', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/intent.md#why-it-exists')).toStrictEqual({ source: expect.objectContaining({ key: 'brutalway' }), path: 'docs/intent.md', section: 'why-it-exists' });
    expect(parseDocsRoute('#/docs/brutalway/docs/intent.md')).not.toHaveProperty('section');
    expect(parseDocsRoute('#/templates/vite#install')).toMatchObject({ source: { key: 'vite' }, path: 'README.md', section: 'install' });
  });

  it('rejects an unknown source', () => {
    expect(parseDocsRoute('#/docs/unknown/readme.md')).toBeUndefined();
  });
});
