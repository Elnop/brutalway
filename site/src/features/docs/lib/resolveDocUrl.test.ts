import { describe, expect, it } from 'vitest';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import { resolveDocUrl } from '@/features/docs/lib/resolveDocUrl.ts';

const [source, templates, template] = DOC_SOURCES;
const knownPaths = ['README.md', 'docs/intent.md', 'docs/inspirations.md'];

describe('resolveDocUrl', () => {
  it('keeps absolute urls', () => {
    expect(
      resolveDocUrl({
        url: 'https://example.com/a',
        attribute: 'href',
        source,
        docPath: 'docs/intent.md',
        knownPaths,
      }),
    ).toBe('https://example.com/a');
    expect(
      resolveDocUrl({
        url: 'mailto:a@b.c',
        attribute: 'href',
        source,
        docPath: 'docs/intent.md',
        knownPaths,
      }),
    ).toBe('mailto:a@b.c');
  });

  it('turns a link to a known doc into a docs route, relative to the current file', () => {
    expect(
      resolveDocUrl({
        url: 'inspirations.md',
        attribute: 'href',
        source,
        docPath: 'docs/intent.md',
        knownPaths,
      }),
    ).toBe('#/docs/brutalway/docs/inspirations.md');
    expect(
      resolveDocUrl({
        url: 'docs/intent.md',
        attribute: 'href',
        source,
        docPath: 'README.md',
        knownPaths,
      }),
    ).toBe('#/docs/brutalway/docs/intent.md');
    expect(
      resolveDocUrl({
        url: '../README.md#anchor',
        attribute: 'href',
        source,
        docPath: 'docs/intent.md',
        knownPaths,
      }),
    ).toBe('#/docs/brutalway/README.md#anchor');
  });

  it('links a template doc to its page', () => {
    expect(
      resolveDocUrl({
        url: 'CHANGELOG.md',
        attribute: 'href',
        source: template,
        docPath: 'README.md',
        knownPaths: ['README.md', 'CHANGELOG.md'],
      }),
    ).toBe('#/templates/vite/CHANGELOG.md');
  });

  it('links a page of another source to its page on the site', () => {
    expect(
      resolveDocUrl({
        url: 'vite',
        attribute: 'href',
        source: templates,
        docPath: 'README.md',
        knownPaths: ['README.md'],
      }),
    ).toBe('#/templates/vite/README.md');
    expect(
      resolveDocUrl({
        url: 'fastify/CHANGELOG.md',
        attribute: 'href',
        source: templates,
        docPath: 'README.md',
        knownPaths: ['README.md'],
      }),
    ).toBe('#/templates/fastify/CHANGELOG.md');
    expect(
      resolveDocUrl({
        url: 'templates/vite/',
        attribute: 'href',
        source,
        docPath: 'README.md',
        knownPaths,
      }),
    ).toBe('#/templates/vite/README.md');
    expect(
      resolveDocUrl({
        url: '../README.md',
        attribute: 'href',
        source: templates,
        docPath: 'README.md',
        knownPaths: ['README.md'],
      }),
    ).toBe('#/docs/brutalway/README.md');
  });

  it('sends a template link to its folder in the repository', () => {
    expect(
      resolveDocUrl({
        url: 'src/main.tsx',
        attribute: 'href',
        source: template,
        docPath: 'docs/architecture.md',
        knownPaths: [],
      }),
    ).toBe('https://github.com/Elnop/brutalway/blob/main/templates/vite/docs/src/main.tsx');
    expect(
      resolveDocUrl({
        url: 'shot.png',
        attribute: 'src',
        source: template,
        docPath: 'README.md',
        knownPaths: [],
      }),
    ).toBe('https://raw.githubusercontent.com/Elnop/brutalway/main/templates/vite/shot.png');
  });

  it('turns a link to a package folder into its page on the site', () => {
    const [packages] = DOC_SOURCES.filter((candidate) => candidate.key === 'packages');
    expect(packages).toBeDefined();
    if (packages === undefined) return;
    expect(
      resolveDocUrl({
        url: 'tools/check-tree',
        attribute: 'href',
        source: packages,
        docPath: 'README.md',
        knownPaths: ['README.md'],
      }),
    ).toBe('#/packages/check-tree/README.md');
    expect(
      resolveDocUrl({
        url: 'packages/README.md',
        attribute: 'href',
        source,
        docPath: 'README.md',
        knownPaths,
      }),
    ).toBe('#/packages/packages/README.md');
    expect(
      resolveDocUrl({
        url: '../README.md#the-common-rules',
        attribute: 'href',
        source: packages,
        docPath: 'README.md',
        knownPaths: ['README.md'],
      }),
    ).toBe('#/docs/brutalway/README.md#the-common-rules');
  });

  it('sends other relative links to GitHub', () => {
    expect(
      resolveDocUrl({
        url: 'create-brutal/src/cli.ts',
        attribute: 'href',
        source,
        docPath: 'README.md',
        knownPaths,
      }),
    ).toBe('https://github.com/Elnop/brutalway/blob/main/create-brutal/src/cli.ts');
    expect(
      resolveDocUrl({
        url: '#the-common-rules',
        attribute: 'href',
        source,
        docPath: 'README.md',
        knownPaths,
      }),
    ).toBe('#/docs/brutalway/README.md#the-common-rules');
  });

  it('loads relative images from the raw files', () => {
    expect(
      resolveDocUrl({
        url: 'images/wall.png',
        attribute: 'src',
        source,
        docPath: 'docs/intent.md',
        knownPaths,
      }),
    ).toBe('https://raw.githubusercontent.com/Elnop/brutalway/main/docs/images/wall.png');
  });
});
