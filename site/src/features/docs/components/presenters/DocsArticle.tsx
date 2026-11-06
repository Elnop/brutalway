import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { DocSource, LoadState } from '@/features/docs/DocsTypes.ts';
import { githubFileUrl } from '@/features/docs/lib/docsUrls.ts';
import { resolveDocUrl } from '@/features/docs/lib/resolveDocUrl.ts';

type DocsArticleProps = {
  content: LoadState<string>;
  source: DocSource;
  path: string;
  knownPaths: string[];
};

export function DocsArticle({ content, source, path, knownPaths }: DocsArticleProps) {
  const sourceUrl = githubFileUrl(source.repo, path);
  return (
    <article className="docs-article">
      {content.status === 'loading' && <p className="docs-status">Loading {path}…</p>}
      {content.status === 'error' && (
        <p className="docs-status">
          {content.message} <a href={sourceUrl}>Read it on GitHub</a>.
        </p>
      )}
      {content.status === 'ready' && (
        <Markdown remarkPlugins={[remarkGfm]} urlTransform={(url, attribute) => defaultUrlTransform(resolveDocUrl({ url, attribute, source, docPath: path, knownPaths }))}>
          {content.value}
        </Markdown>
      )}
      <p className="docs-source">
        <a href={sourceUrl}>
          {source.repo}/{path} on GitHub
        </a>
      </p>
    </article>
  );
}
