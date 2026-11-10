import type { DocSource, RoadmapStatus } from '@/features/docs/DocsTypes.ts';
import { DOCS_ROUTE, PACKAGES_ROUTE, TEMPLATES_ROUTE } from '@/shared/configs/LinksConfig.ts';

export const DOCS_BRANCH = 'main';

export const README_FILE = 'README.md';

const TEMPLATE_DOC_ORDER = [
  'README.md',
  'docs/guides/start-',
  'docs/guides/',
  'docs/reference/',
  'docs/concepts/',
];

const TEMPLATE_MOVED_DOCS = {
  'docs/architecture.md': 'docs/concepts/architecture.md',
  'docs/verifications.md': 'docs/reference/verifications.md',
};

const PUBLISHED_PACKAGES = [
  'configs/oxlint-config-typescript',
  'configs/oxlint-config-react',
  'configs/oxlint-config-tailwind',
  'configs/oxlint-config-react-hook-form',
  'configs/oxlint-config-i18next',
  'configs/oxlint-config-shadcn',
  'configs/oxlint-config-tanstack-query',
  'configs/oxlint-config-zustand',
  'configs/oxlint-config-vitest',
  'configs/oxlint-config-react-vite',
  'configs/oxlint-config-fastify',
  'configs/oxlint-config-node',
  'configs/oxlint-config-node-test',
  'configs/stylelint-config',
  'configs/dependency-cruiser-config',
  'configs/alint-config',
  'configs/tsconfig',
  'configs/prettier-config',
  'plugins/eslint-plugin-file-named-after-export',
  'plugins/eslint-plugin-store-layout',
  'tools/check-tree',
  'tools/check-doc-length',
  'tools/check-doc-sources',
  'tools/check-doc-links',
  'tools/playwright-fixtures',
  'tools/agent-hook',
  'tools/create-brutal',
];

const PRIVATE_PACKAGES = ['utils/lint-utils', 'utils/color-utils'];

function packageSource(folder: string, changelog: boolean): DocSource {
  const key = folder.slice(folder.indexOf('/') + 1);
  const source = {
    key,
    label: key === 'create-brutal' ? key : `@brutalway/${key}`,
    route: PACKAGES_ROUTE,
    repo: 'Elnop/brutalway',
    directory: `packages/${folder}`,
    files: ['README.md'],
  };
  return changelog ? { ...source, changelog: 'CHANGELOG.md' } : source;
}

export const PACKAGES_INDEX: DocSource = {
  key: 'packages',
  label: 'packages',
  route: PACKAGES_ROUTE,
  repo: 'Elnop/brutalway',
  directory: 'packages',
  files: ['README.md'],
};

export const DOC_SOURCES: DocSource[] = [
  {
    key: 'brutalway',
    label: 'brutalway',
    route: DOCS_ROUTE,
    repo: 'Elnop/brutalway',
    directory: '',
    files: ['README.md', 'packages/tools/create-brutal/README.md', 'CONTRIBUTING.md'],
    order: [
      'README.md',
      'docs/getting-started.md',
      'docs/guides/',
      'docs/reference/',
      'packages/tools/create-brutal/README.md',
      'docs/concepts/',
      'CONTRIBUTING.md',
      'roadmap',
    ],
    folder: 'docs',
    moved: {
      'docs/intent.md': 'docs/concepts/intent.md',
      'docs/inspirations.md': 'docs/concepts/inspirations.md',
      'docs/roadmap.md': 'roadmap',
    },
    roadmap: 'roadmap',
  },
  {
    key: 'all',
    label: 'templates',
    route: TEMPLATES_ROUTE,
    repo: 'Elnop/brutalway',
    directory: 'templates',
    files: ['README.md'],
  },
  {
    key: 'vite',
    label: 'template-vite',
    route: TEMPLATES_ROUTE,
    repo: 'Elnop/brutalway',
    directory: 'templates/vite',
    files: ['README.md'],
    folder: 'docs',
    changelog: 'CHANGELOG.md',
    order: TEMPLATE_DOC_ORDER,
    moved: TEMPLATE_MOVED_DOCS,
  },
  {
    key: 'fastify',
    label: 'template-fastify',
    route: TEMPLATES_ROUTE,
    repo: 'Elnop/brutalway',
    directory: 'templates/fastify',
    files: ['README.md'],
    folder: 'docs',
    changelog: 'CHANGELOG.md',
    order: TEMPLATE_DOC_ORDER,
    moved: TEMPLATE_MOVED_DOCS,
  },
  {
    key: 'package',
    label: 'template-package',
    route: TEMPLATES_ROUTE,
    repo: 'Elnop/brutalway',
    directory: 'templates/package',
    files: ['README.md'],
    folder: 'docs',
    changelog: 'CHANGELOG.md',
    order: TEMPLATE_DOC_ORDER,
    moved: TEMPLATE_MOVED_DOCS,
  },
  PACKAGES_INDEX,
  ...PUBLISHED_PACKAGES.map((folder) => packageSource(folder, true)),
  ...PRIVATE_PACKAGES.map((folder) => packageSource(folder, false)),
];

export const OPEN_STATUSES: RoadmapStatus[] = ['triage', 'in progress', 'todo'];

export const REJECTED_LABELS = new Set(['duplicate', 'invalid', 'wontfix']);
