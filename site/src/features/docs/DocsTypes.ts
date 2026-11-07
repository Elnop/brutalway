export type DocSource = {
  key: string;
  label: string;
  route: string;
  repo: string;
  directory: string;
  files: string[];
  folder: string;
  changelog?: string;
};

export type DocEntry = {
  sourceKey: string;
  path: string;
  title: string;
};

export type DocGroup = {
  source: DocSource;
  entries: DocEntry[];
};

export type DocsRoute = {
  source: DocSource;
  path: string;
};

export type LoadState<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error'; message: string };
