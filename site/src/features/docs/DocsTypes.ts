export type DocSource = {
  key: string;
  label: string;
  route: string;
  repo: string;
  directory: string;
  files: string[];
  folder?: string;
  changelog?: string;
};

export type DocEntry = {
  sourceKey: string;
  path: string;
  title: string;
};

export type DocsRoute = {
  source: DocSource;
  path: string;
  section?: string;
};

export type DocHeading = {
  depth: number;
  text: string;
  slug: string;
};

export type DocNavNode = {
  kind: 'page' | 'section';
  title: string;
  href: string;
  current: 'page' | 'location' | undefined;
  children: DocNavNode[];
};

export type DocNavGroup = {
  key: string;
  label: string;
  href: string;
  nodes: DocNavNode[];
};

export type LoadState<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error'; message: string };
