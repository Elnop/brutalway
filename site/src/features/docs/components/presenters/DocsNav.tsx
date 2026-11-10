import type { DocNavGroup, DocNavNode, NavDrawer } from '@/features/docs/DocsTypes.ts';

type DocsNavProps = {
  groups: DocNavGroup[];
  drawer: NavDrawer;
};

type DocsNavGroupsProps = {
  groups: DocNavGroup[];
};

type DocsNavListProps = {
  nodes: DocNavNode[];
};

const ITEM_CLASSES = {
  page: undefined,
  detail: 'docs-nav-section',
  section: 'docs-nav-section',
  category: 'docs-nav-category',
};

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

function DocsNavGroups({ groups }: DocsNavGroupsProps) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.key} className="docs-nav-group">
          <a
            href={group.href}
            aria-current={group.current}
            className={group.isTitle ? 'docs-nav-label docs-nav-title' : 'docs-nav-label'}
          >
            {group.label}
          </a>
          {group.nodes.length > 0 && <DocsNavList nodes={group.nodes} />}
        </div>
      ))}
    </>
  );
}

export function DocsNav({ groups, drawer }: DocsNavProps) {
  return (
    <>
      <button
        type="button"
        className="docs-nav-toggle"
        aria-expanded={drawer.open}
        aria-controls="docs-nav"
        onClick={drawer.toggle}
      >
        {drawer.open ? 'Close' : 'Contents'}
      </button>
      <button
        type="button"
        className="docs-nav-backdrop"
        aria-label="Close the contents"
        tabIndex={-1}
        onClick={drawer.close}
      />
      <nav
        id="docs-nav"
        aria-label="Documentation"
        className={drawer.open ? 'docs-nav is-open' : 'docs-nav'}
      >
        <DocsNavGroups groups={groups} />
      </nav>
    </>
  );
}
