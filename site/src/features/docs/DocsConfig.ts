import type { DocSource } from '@/features/docs/DocsTypes.ts';

export const DOCS_BRANCH = 'main';

export const DOC_SOURCES: DocSource[] = [
  { key: 'brutalway', label: 'BRUTAL way', repo: 'Elnop/brutalway', files: ['readme.md', 'packages/tools/create-brutal/README.md'], folder: 'docs' },
  { key: 'template-vite', label: 'template-vite', repo: 'Elnop/template-vite', files: ['README.md'], folder: 'docs' },
  { key: 'template-fastify', label: 'template-fastify', repo: 'Elnop/template-fastify', files: ['README.md'], folder: 'docs' },
];
