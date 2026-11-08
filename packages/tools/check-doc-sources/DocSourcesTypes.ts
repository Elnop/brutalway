export type DocSourcesSettings = {
  include: string[];
  ignore: string[];
  ignoreSources: string[];
};

export type MarkdownFile = {
  path: string;
  content: string;
};

export type Citation = {
  doc: string;
  file: string;
  line: number;
};
