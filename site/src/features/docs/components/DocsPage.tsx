import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocGroup, DocsRoute } from '@/features/docs/DocsTypes.ts';
import { DocsArticle } from '@/features/docs/components/presenters/DocsArticle.tsx';
import { DocsNav } from '@/features/docs/components/presenters/DocsNav.tsx';
import { docHref } from '@/features/docs/lib/docsUrls.ts';
import { parseDocsRoute } from '@/features/docs/lib/parseDocsRoute.ts';
import { useDocContent, useDocList } from '@/features/docs/useDocs.ts';
import '@/features/docs/docs.css';

type DocsPageProps = {
  hash: string;
};

type DocsViewProps = {
  route: DocsRoute;
};

function DocsView({ route }: DocsViewProps) {
  const entries = useDocList();
  const content = useDocContent(route.source.repo, route.path);
  const groups: DocGroup[] = DOC_SOURCES.map((source) => ({ key: source.key, label: source.label, entries: entries.filter((entry) => entry.sourceKey === source.key) }));
  const knownPaths = entries.filter((entry) => entry.sourceKey === route.source.key).map((entry) => entry.path);
  return (
    <div className="docs container">
      <DocsNav groups={groups} currentHref={docHref(route.source.key, route.path)} />
      <DocsArticle content={content} source={route.source} path={route.path} knownPaths={knownPaths} />
    </div>
  );
}

export function DocsPage({ hash }: DocsPageProps) {
  const route = parseDocsRoute(hash);
  if (route === undefined) {
    return (
      <div className="docs container">
        <p className="docs-status">
          This page does not exist. <a href="#/docs">Back to the docs</a>.
        </p>
      </div>
    );
  }
  return <DocsView route={route} />;
}
