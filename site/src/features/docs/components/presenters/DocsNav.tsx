import type { DocNavGroup, DocNavNode } from '@/features/docs/DocsTypes.ts';

type DocsNavProps = {
  groups: DocNavGroup[];
};

type DocsNavListProps = {
  nodes: DocNavNode[];
};

function DocsNavList({ nodes }: DocsNavListProps) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.href} className={node.kind === 'section' ? 'docs-nav-section' : undefined}>
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
          <a href={group.href} className="docs-nav-label">
            {group.label}
          </a>
          <DocsNavList nodes={group.nodes} />
        </div>
      ))}
    </nav>
  );
}
