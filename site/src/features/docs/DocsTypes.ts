export type DocSource = {
  key: string;
  label: string;
  route: string;
  repo: string;
  directory: string;
  files: string[];
  folder?: string;
  changelog?: string;
  order?: string[];
  moved?: Record<string, string>;
  roadmap?: string;
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
  kind: 'page' | 'detail' | 'section' | 'category';
  title: string;
  href: string;
  current: 'page' | 'location' | undefined;
  children: DocNavNode[];
};

export type DocNavGroup = {
  key: string;
  label: string;
  href: string;
  isTitle: boolean;
  current: DocNavNode['current'];
  nodes: DocNavNode[];
};

export type LoadState<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error'; message: string };

export type PackageCategory = {
  title: string;
  slug: string;
  depth: number;
  packages: string[];
  children: PackageCategory[];
};

export type RoadmapIssue = {
  number: number;
  title: string;
  url: string;
  closed: boolean;
  completed: boolean;
  labels: string[];
  parent: number | undefined;
};
