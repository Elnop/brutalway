import type { DocNavGroup, DocNavNode } from '@/features/docs/DocsTypes.ts';

type DocsNavProps = {
  groups: DocNavGroup[];
};

type DocsNavListProps = {
  nodes: DocNavNode[];
};

const ITEM_CLASSES = { page: undefined, detail: 'docs-nav-section', section: 'docs-nav-section', category: 'docs-nav-category' };

function DocsNavList({ nodes }: DocsNavListProps) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.href} className={ITEM_CLASSES[node.kind]}>
          <a href={node.href} aria-current={node.current}>
            {node.title}
          </a>
          {node.children.length > 0 && <DocsNavList nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

export function DocsNav({ groups }: DocsNavProps) {
  return (
    <nav aria-label="Documentation" className="docs-nav">
      {groups.map((group) => (
        <div key={group.key} className="docs-nav-group">
          <a href={group.href} aria-current={group.current} className={group.isTitle ? 'docs-nav-label docs-nav-title' : 'docs-nav-label'}>
            {group.label}
          </a>
          {group.nodes.length > 0 && <DocsNavList nodes={group.nodes} />}
        </div>
      ))}
    </nav>
  );
}
