export type DocSource = {
  key: string;
  label: string;
  repo: string;
  files: string[];
  folder: string;
};

export type DocEntry = {
  sourceKey: string;
  path: string;
  title: string;
};

export type DocGroup = {
  key: string;
  label: string;
  entries: DocEntry[];
};

export type DocsRoute = {
  source: DocSource;
  path: string;
};

export type LoadState<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error'; message: string };
