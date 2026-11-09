import { useMemo } from 'react';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';
import { DocsArticle } from '@/features/docs/components/presenters/DocsArticle.tsx';
import { DocsNav } from '@/features/docs/components/presenters/DocsNav.tsx';
import { PACKAGES_INDEX } from '@/features/docs/DocsConfig.ts';
import { useDocContent, useDocList, usePackageCategories } from '@/features/docs/hooks/useDocs.ts';
import { useScrollToSection } from '@/features/docs/hooks/useScrollToSection.ts';
import { docHeadings } from '@/features/docs/lib/docHeadings.ts';
import { docNavGroups } from '@/features/docs/lib/docNavGroups.ts';
import { parseDocsRoute } from '@/features/docs/lib/parseDocsRoute.ts';
import { useHash } from '@/shared/hooks/useHash.ts';
import '@/features/docs/docs.css';

type DocsViewProps = {
  route: DocsRoute;
};

function DocsView({ route }: DocsViewProps) {
  const entries = useDocList();
  const content = useDocContent(route.source, route.path);
  const markdown = content.status === 'ready' ? content.value : undefined;
  const headings = useMemo(() => (markdown === undefined ? [] : docHeadings(markdown)), [markdown]);
  useScrollToSection(route.section, markdown !== undefined);
  const categories = usePackageCategories(route.source.route === PACKAGES_INDEX.route);
  const groups = docNavGroups(entries, route, headings, categories);
  const knownPaths = entries.filter((entry) => entry.sourceKey === route.source.key).map((entry) => entry.path);
  return (
    <div className="docs">
      <DocsNav groups={groups} />
      <DocsArticle content={content} source={route.source} path={route.path} knownPaths={knownPaths} />
    </div>
  );
}

export function DocsPage() {
  const route = parseDocsRoute(useHash());
  if (route === undefined) {
    return (
      <div className="docs">
        <p className="docs-status">
          This page does not exist. <a href="#/docs">Back to the docs</a>.
        </p>
      </div>
    );
  }
  return <DocsView key={`${route.source.key}/${route.path}`} route={route} />;
}
