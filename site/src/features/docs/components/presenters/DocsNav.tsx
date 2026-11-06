import type { DocGroup } from '@/features/docs/DocsTypes.ts';
import { docHref } from '@/features/docs/lib/docsUrls.ts';

type DocsNavProps = {
  groups: DocGroup[];
  currentHref: string;
};

export function DocsNav({ groups, currentHref }: DocsNavProps) {
  return (
    <nav aria-label="Documentation" className="docs-nav">
      {groups.map((group) => (
        <div key={group.key} className="docs-nav-group">
          <p className="docs-nav-label">{group.label}</p>
          <ul>
            {group.entries.map((entry) => {
              const href = docHref(entry.sourceKey, entry.path);
              return (
                <li key={href}>
                  <a href={href} aria-current={href === currentHref ? 'page' : undefined}>
                    {entry.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
