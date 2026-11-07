import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { DOCS_ROUTE, TEMPLATES_ROUTE } from '@/shared/LinksConfig.ts';

export const DOCS_BRANCH = 'main';

export const DOC_SOURCES: DocSource[] = [
  { key: 'brutalway', label: 'brutalway', route: DOCS_ROUTE, repo: 'Elnop/brutalway', directory: '', files: ['readme.md', 'packages/tools/create-brutal/README.md'], folder: 'docs' },
  { key: 'vite', label: 'template-vite', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates/vite', files: ['README.md'], folder: 'docs', changelog: 'CHANGELOG.md' },
  { key: 'fastify', label: 'template-fastify', route: TEMPLATES_ROUTE, repo: 'Elnop/brutalway', directory: 'templates/fastify', files: ['README.md'], folder: 'docs', changelog: 'CHANGELOG.md' },
];
