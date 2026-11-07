import { describe, expect, it } from 'vitest';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import { resolveDocUrl } from '@/features/docs/lib/resolveDocUrl.ts';

const source = DOC_SOURCES[0];
const knownPaths = ['readme.md', 'docs/intent.md', 'docs/inspirations.md'];

describe('resolveDocUrl', () => {
  it('keeps absolute urls', () => {
    expect(resolveDocUrl({ url: 'https://example.com/a', attribute: 'href', source, docPath: 'docs/intent.md', knownPaths })).toBe('https://example.com/a');
    expect(resolveDocUrl({ url: 'mailto:a@b.c', attribute: 'href', source, docPath: 'docs/intent.md', knownPaths })).toBe('mailto:a@b.c');
  });

  it('turns a link to a known doc into a docs route, relative to the current file', () => {
    expect(resolveDocUrl({ url: 'inspirations.md', attribute: 'href', source, docPath: 'docs/intent.md', knownPaths })).toBe('#/docs/brutalway/docs/inspirations.md');
    expect(resolveDocUrl({ url: 'docs/intent.md', attribute: 'href', source, docPath: 'readme.md', knownPaths })).toBe('#/docs/brutalway/docs/intent.md');
    expect(resolveDocUrl({ url: '../readme.md#anchor', attribute: 'href', source, docPath: 'docs/intent.md', knownPaths })).toBe('#/docs/brutalway/readme.md');
  });

  it('links a template doc to its page', () => {
    const template = DOC_SOURCES[1];
    expect(resolveDocUrl({ url: 'CHANGELOG.md', attribute: 'href', source: template, docPath: 'README.md', knownPaths: ['README.md', 'CHANGELOG.md'] })).toBe('#/templates/vite/CHANGELOG.md');
  });

  it('sends a template link to its folder in the repository', () => {
    const template = DOC_SOURCES[1];
    expect(resolveDocUrl({ url: 'src/main.tsx', attribute: 'href', source: template, docPath: 'docs/architecture.md', knownPaths: [] })).toBe(
      'https://github.com/Elnop/brutalway/blob/main/templates/vite/docs/src/main.tsx',
    );
    expect(resolveDocUrl({ url: 'shot.png', attribute: 'src', source: template, docPath: 'README.md', knownPaths: [] })).toBe(
      'https://raw.githubusercontent.com/Elnop/brutalway/main/templates/vite/shot.png',
    );
  });

  it('sends other relative links to GitHub', () => {
    expect(resolveDocUrl({ url: 'create-brutal/src/cli.ts', attribute: 'href', source, docPath: 'readme.md', knownPaths })).toBe(
      'https://github.com/Elnop/brutalway/blob/main/create-brutal/src/cli.ts',
    );
    expect(resolveDocUrl({ url: '#the-common-rules', attribute: 'href', source, docPath: 'readme.md', knownPaths })).toBe('https://github.com/Elnop/brutalway/blob/main/readme.md#the-common-rules');
  });

  it('loads relative images from the raw files', () => {
    expect(resolveDocUrl({ url: 'images/wall.png', attribute: 'src', source, docPath: 'docs/intent.md', knownPaths })).toBe(
      'https://raw.githubusercontent.com/Elnop/brutalway/main/docs/images/wall.png',
    );
  });
});
