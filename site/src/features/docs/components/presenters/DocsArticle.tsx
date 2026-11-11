import Markdown, { defaultUrlTransform } from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { DocSource, LoadState } from '@/features/docs/DocsTypes.ts';
import { docSourceUrl } from '@/features/docs/lib/docsUrls.ts';
import { repositoryPath } from '@/features/docs/lib/githubUrls.ts';
import { resolveDocUrl } from '@/features/docs/lib/resolveDocUrl.ts';
import { NEW_ISSUE_URL, NPM_PACKAGE_URL } from '@/shared/configs/LinksConfig.ts';
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
      urlTransform={(url, attribute) =>
        defaultUrlTransform(resolveDocUrl({ url, attribute, source, docPath: path, knownPaths }))
      }
    >
      {markdown}
    </Markdown>
  );
}

function sourceLabelOf(source: DocSource, path: string): string {
  return path === source.roadmap
    ? `${source.repo} issues`
    : `${source.repo}/${repositoryPath(source, path)}`;
}

type DocsArticleFooterProps = {
  source: DocSource;
  path: string;
};

function DocsArticleFooter({ source, path }: DocsArticleFooterProps) {
  return (
    <footer className="docs-article-footer">
      <p className="docs-source">
        <SiteLink href={docSourceUrl(source, path)}>
          {sourceLabelOf(source, path)} on GitHub
        </SiteLink>
        {source.npmPackage !== undefined && (
          <SiteLink href={`${NPM_PACKAGE_URL}${source.npmPackage}`}>
            {source.npmPackage} on npm
          </SiteLink>
        )}
      </p>
      <p className="docs-contribute">
        Something wrong or missing on this page?{' '}
        <SiteLink href={NEW_ISSUE_URL}>Open an issue</SiteLink>, or fix it in a pull request from
        the GitHub page above.
      </p>
    </footer>
  );
}

export function DocsArticle({ content, source, path, knownPaths }: DocsArticleProps) {
  const sourceUrl = docSourceUrl(source, path);
  return (
    <article className="docs-article">
      {content.status === 'loading' && <p className="docs-status">Loading {path}…</p>}
      {content.status === 'error' && (
        <p className="docs-status">
          {content.message} <SiteLink href={sourceUrl}>Read it on GitHub</SiteLink>.
        </p>
      )}
      {content.status === 'ready' && (
        <DocsMarkdown
          markdown={content.value}
          source={source}
          path={path}
          knownPaths={knownPaths}
        />
      )}
      <DocsArticleFooter source={source} path={path} />
    </article>
  );
}
