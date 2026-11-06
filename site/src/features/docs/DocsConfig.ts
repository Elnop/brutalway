import type { DocSource } from '@/features/docs/DocsTypes.ts';

export const DOCS_BRANCH = 'main';

export const DOC_SOURCES: DocSource[] = [
  { key: 'brutal', label: 'BRUTAL', repo: 'Elnop/brutal', files: ['readme.md', 'create-brutal/README.md'], folder: 'docs' },
  { key: 'template-vite', label: 'template-vite', repo: 'Elnop/template-vite', files: ['README.md'], folder: 'docs' },
  { key: 'template-fastify', label: 'template-fastify', repo: 'Elnop/template-fastify', files: ['README.md'], folder: 'docs' },
];
