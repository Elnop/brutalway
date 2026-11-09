import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { DOCS_ROUTE, TEMPLATES_ROUTE } from '@/shared/configs/LinksConfig.ts';

export const DOCS_BRANCH = 'main';

export const DOC_SOURCES: DocSource[] = [
  { key: 'brutalway', label: 'brutalway', route: DOCS_ROUTE, repo: 'Elnop/brutalway', directory: '', files: ['README.md', 'packages/tools/create-brutal/README.md'], folder: 'docs' },
  { key: 'all', label: 'templates', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates', files: ['README.md'] },
  { key: 'vite', label: 'template-vite', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates/vite', files: ['README.md'], folder: 'docs', changelog: 'CHANGELOG.md' },
  { key: 'fastify', label: 'template-fastify', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates/fastify', files: ['README.md'], folder: 'docs', changelog: 'CHANGELOG.md' },
  { key: 'package', label: 'template-package', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates/package', files: ['README.md'], folder: 'docs', changelog: 'CHANGELOG.md' },
];
