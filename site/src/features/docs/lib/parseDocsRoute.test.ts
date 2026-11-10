import { describe, expect, it } from 'vitest';
import { parseDocsRoute } from '@/features/docs/lib/parseDocsRoute.ts';

describe('parseDocsRoute', () => {
  it('opens the first file of the first source by default', () => {
    expect(parseDocsRoute('#/docs')).toMatchObject({
      source: { key: 'brutalway' },
      path: 'README.md',
    });
    expect(parseDocsRoute('#/docs/')).toMatchObject({
      source: { key: 'brutalway' },
      path: 'README.md',
    });
  });

  it('reads the source and the path', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/concepts/intent.md')).toMatchObject({
      source: { key: 'brutalway' },
      path: 'docs/concepts/intent.md',
    });
  });

  it('opens the template index by default', () => {
    expect(parseDocsRoute('#/templates')).toMatchObject({
      source: { key: 'all' },
      path: 'README.md',
    });
  });

  it('opens a template page, its docs and its changelog', () => {
    expect(parseDocsRoute('#/templates/fastify')).toMatchObject({
      source: { key: 'fastify' },
      path: 'README.md',
    });
    expect(parseDocsRoute('#/templates/package')).toMatchObject({
      source: { key: 'package' },
      path: 'README.md',
    });
    expect(parseDocsRoute('#/templates/vite/CHANGELOG.md')).toMatchObject({
      source: { key: 'vite' },
      path: 'CHANGELOG.md',
    });
  });

  it('opens the package index by default, then each package README and changelog', () => {
    expect(parseDocsRoute('#/packages')).toMatchObject({
      source: { key: 'packages', directory: 'packages' },
      path: 'README.md',
    });
    expect(parseDocsRoute('#/packages/check-tree')).toMatchObject({
      source: {
        key: 'check-tree',
        label: '@brutalway/check-tree',
        directory: 'packages/tools/check-tree',
      },
      path: 'README.md',
    });
    expect(parseDocsRoute('#/packages/create-brutal/CHANGELOG.md')).toMatchObject({
      source: { key: 'create-brutal', label: 'create-brutal' },
      path: 'CHANGELOG.md',
    });
    expect(parseDocsRoute('#/packages/lint-utils')).toHaveProperty(
      'source.changelog',
      'CHANGELOG.md',
    );
  });

  it('opens the new path of a page that moved, with its section', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/intent.md#bounded')).toMatchObject({
      source: { key: 'brutalway' },
      path: 'docs/concepts/intent.md',
      section: 'bounded',
    });
    expect(parseDocsRoute('#/docs/brutalway/docs/inspirations.md')).toMatchObject({
      path: 'docs/concepts/inspirations.md',
    });
    expect(parseDocsRoute('#/templates/vite/docs/verifications.md')).toMatchObject({
      source: { key: 'vite' },
      path: 'docs/reference/verifications.md',
    });
    expect(parseDocsRoute('#/templates/fastify/docs/architecture.md')).toMatchObject({
      source: { key: 'fastify' },
      path: 'docs/concepts/architecture.md',
    });
  });

  it('keeps each source in its own section', () => {
    expect(parseDocsRoute('#/docs/vite')).toBeUndefined();
    expect(parseDocsRoute('#/templates/brutalway')).toBeUndefined();
  });

  it('reads the section after the page', () => {
    expect(parseDocsRoute('#/docs/brutalway/docs/concepts/intent.md#bounded')).toStrictEqual({
      source: expect.objectContaining({ key: 'brutalway' }),
      path: 'docs/concepts/intent.md',
      section: 'bounded',
    });
    expect(parseDocsRoute('#/docs/brutalway/docs/concepts/intent.md')).not.toHaveProperty(
      'section',
    );
    expect(parseDocsRoute('#/templates/vite#install')).toMatchObject({
      source: { key: 'vite' },
      path: 'README.md',
      section: 'install',
    });
  });

  it('rejects an unknown source', () => {
    expect(parseDocsRoute('#/docs/unknown/readme.md')).toBeUndefined();
  });
});
