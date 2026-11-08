export type DocLinksSettings = {
  include: string[];
  ignore: string[];
  skip: string[];
};

export type MarkdownFile = {
  path: string;
  content: string;
};

export type ExternalLink = {
  doc: string;
  url: string;
  line: number;
};

export type LinkVerdict = 'alive' | 'dead' | 'unsure';

export type LinkResult = {
  verdict: LinkVerdict;
  reason: string;
};

export type ProjectContext = {
  gitRoot: string;
  repository: string | undefined;
  packages: Set<string>;
};
