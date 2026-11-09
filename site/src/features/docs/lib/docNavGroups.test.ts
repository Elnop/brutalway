import { describe, expect, it } from 'vitest';
import type { DocNavNode } from '@/features/docs/DocsTypes.ts';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import { docNavGroups } from '@/features/docs/lib/docNavGroups.ts';

const [brutalway, , vite] = DOC_SOURCES;
const checkTree = DOC_SOURCES.find((source) => source.key === 'check-tree');
const paths = ['README.md', 'packages/tools/create-brutal/README.md', 'docs/intent.md', 'docs/roadmap/README.md', 'docs/roadmap/e1-tailwind-css.md', 'docs/roadmap/order.md'];
const entries = paths.map((path) => ({ sourceKey: 'brutalway', path, title: path }));

function outline(nodes: DocNavNode[]): unknown[] {
  return nodes.map((node) => (node.children.length === 0 ? node.title : { [node.title]: outline(node.children) }));
}

describe('docNavGroups', () => {
  it('nests the pages of a folder under its README', () => {
    const [group] = docNavGroups(entries, { source: brutalway, path: 'README.md' }, []);
    expect(group?.label).toBe('brutalway');
    expect(group?.href).toBe('#/docs/brutalway/README.md');
    expect(outline(group?.nodes ?? [])).toStrictEqual([
      'README.md',
      'packages/tools/create-brutal/README.md',
      'docs/intent.md',
      { 'docs/roadmap/README.md': ['docs/roadmap/e1-tailwind-css.md', 'docs/roadmap/order.md'] },
    ]);
  });

  it('puts the sections of the open page under its link, level 3 under level 2, before its subpages', () => {
    const headings = [
      { depth: 2, text: 'Why', slug: 'why' },
      { depth: 3, text: 'Detail', slug: 'detail' },
      { depth: 2, text: 'Steps', slug: 'steps' },
    ];
    const [group] = docNavGroups(entries, { source: brutalway, path: 'docs/roadmap/README.md', section: 'detail' }, headings);
    const roadmap = group?.nodes.at(-1);
    expect(outline(roadmap?.children ?? [])).toStrictEqual([{ Why: ['Detail'] }, 'Steps', 'docs/roadmap/e1-tailwind-css.md', 'docs/roadmap/order.md']);
    expect(roadmap?.current).toBe('page');
    expect(roadmap?.children[0]?.children[0]).toMatchObject({ kind: 'section', href: '#/docs/brutalway/docs/roadmap/README.md#detail', current: 'location' });
    expect(group?.nodes[0]?.current).toBeUndefined();
  });

  it('shows the templates together and nests level 3 sections at the top when a page has no level 2', () => {
    const groups = docNavGroups([{ sourceKey: 'vite', path: 'README.md', title: 'Overview' }], { source: vite, path: 'README.md' }, [{ depth: 3, text: 'Only', slug: 'only' }]);
    expect(groups.map((group) => group.key)).toStrictEqual(['all', 'vite', 'fastify', 'package']);
    expect(outline(groups[1]?.nodes ?? [])).toStrictEqual([{ Overview: ['Only'] }]);
  });

  it('groups the packages by the categories of the package index, and only opens the package being read', () => {
    expect(checkTree).toBeDefined();
    if (checkTree === undefined) return;
    const categories = [
      { title: 'Configs', slug: 'configs', depth: 2, packages: [], children: [{ title: 'Oxlint', slug: 'oxlint', depth: 3, packages: ['configs/oxlint-config-react'], children: [] }] },
      { title: 'Checks', slug: 'checks', depth: 2, packages: ['tools/check-tree/', 'tools/unknown'], children: [] },
    ];
    const packageEntries = ['oxlint-config-react', 'check-tree'].flatMap((key) => [
      { sourceKey: key, path: 'README.md', title: 'Overview' },
      { sourceKey: key, path: 'CHANGELOG.md', title: 'Changelog' },
    ]);
    const groups = docNavGroups(packageEntries, { source: checkTree, path: 'README.md' }, [{ depth: 2, text: 'Usage', slug: 'usage' }], categories);
    expect(groups.map((group) => [group.label, group.href])).toStrictEqual([
      ['packages', '#/packages/packages/README.md'],
      ['Configs', '#/packages/packages/README.md#configs'],
      ['Checks', '#/packages/packages/README.md#checks'],
    ]);
    expect(outline(groups[1]?.nodes ?? [])).toStrictEqual([{ Oxlint: ['react'] }]);
    expect(outline(groups[2]?.nodes ?? [])).toStrictEqual([{ 'check-tree': ['Usage', 'Changelog'] }]);
    expect(groups[2]?.nodes[0]).toMatchObject({ kind: 'page', current: 'page', children: [{ kind: 'section' }, { kind: 'detail', href: '#/packages/check-tree/CHANGELOG.md' }] });
  });

  it('keeps one group per source in the packages section until the index is read', () => {
    expect(checkTree).toBeDefined();
    if (checkTree === undefined) return;
    expect(docNavGroups([], { source: checkTree, path: 'README.md' }, []).length).toBeGreaterThan(20);
  });
});
