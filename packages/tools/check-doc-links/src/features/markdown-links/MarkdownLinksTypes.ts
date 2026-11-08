export type DocLinksSettings = {
  include: string[];
  ignore: string[];
  skip: string[];
};

export type MarkdownFile = {
  path: string;
  content: string;
};
