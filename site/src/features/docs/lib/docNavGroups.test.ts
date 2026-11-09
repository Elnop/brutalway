import { describe, expect, it } from 'vitest';
import type { DocNavNode } from '@/features/docs/DocsTypes.ts';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import { docNavGroups } from '@/features/docs/lib/docNavGroups.ts';

const [brutalway, , vite] = DOC_SOURCES;
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
});
