import Markdown, { defaultUrlTransform } from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { DocSource, LoadState } from '@/features/docs/DocsTypes.ts';
import { docSourceUrl, repositoryPath } from '@/features/docs/lib/docsUrls.ts';
import { resolveDocUrl } from '@/features/docs/lib/resolveDocUrl.ts';
import { SiteLink } from '@/shared/presenters/SiteLink.tsx';

const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => <SiteLink {...props} />,
};

type DocsArticleProps = {
  content: LoadState<string>;
  source: DocSource;
  path: string;
  knownPaths: string[];
};

type DocsMarkdownProps = {
  markdown: string;
  source: DocSource;
  path: string;
  knownPaths: string[];
};

function DocsMarkdown({ markdown, source, path, knownPaths }: DocsMarkdownProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={markdownComponents}
      urlTransform={(url, attribute) => defaultUrlTransform(resolveDocUrl({ url, attribute, source, docPath: path, knownPaths }))}
    >
      {markdown}
    </Markdown>
  );
}

export function DocsArticle({ content, source, path, knownPaths }: DocsArticleProps) {
  const sourceUrl = docSourceUrl(source, path);
  const sourceLabel = path === source.roadmap ? `${source.repo} issues` : `${source.repo}/${repositoryPath(source, path)}`;
  return (
    <article className="docs-article">
      {content.status === 'loading' && <p className="docs-status">Loading {path}…</p>}
      {content.status === 'error' && (
        <p className="docs-status">
          {content.message} <SiteLink href={sourceUrl}>Read it on GitHub</SiteLink>.
        </p>
      )}
      {content.status === 'ready' && <DocsMarkdown markdown={content.value} source={source} path={path} knownPaths={knownPaths} />}
      <p className="docs-source">
        <SiteLink href={sourceUrl}>{sourceLabel} on GitHub</SiteLink>
      </p>
    </article>
  );
}
