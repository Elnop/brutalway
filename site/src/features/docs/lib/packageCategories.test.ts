import { describe, expect, it } from 'vitest';
import { packageCategories } from '@/features/docs/lib/packageCategories.ts';

const INDEX = [
  '# Packages',
  'Intro with a [link](../README.md).',
  '## Configs',
  '### Oxlint',
  '#### Base',
  '| Package | What it does |',
  '|---|---|',
  '| [`@brutalway/oxlint-config-typescript`](configs/oxlint-config-typescript) | base, see [node](configs/oxlint-config-node) |',
  '| [`@brutalway/oxlint-config-node`](configs/oxlint-config-node) | node |',
  '### TypeScript',
  '| Package | What it does |',
  '|---|---|',
  '| [`@brutalway/tsconfig`](configs/tsconfig) | strict |',
  '## AI',
  '| Package | What it does |',
  '|---|---|',
  '| [`@brutalway/agent-hook`](tools/agent-hook) | hook |',
].join('\n');

describe('packageCategories', () => {
  it('nests the headings from level 2 down, with the package of the first link of each table row', () => {
    expect(packageCategories(INDEX)).toStrictEqual([
      {
        title: 'Configs',
        slug: 'configs',
        depth: 2,
        packages: [],
        children: [
          {
            title: 'Oxlint',
            slug: 'oxlint',
            depth: 3,
            packages: [],
            children: [
              {
                title: 'Base',
                slug: 'base',
                depth: 4,
                packages: ['configs/oxlint-config-typescript', 'configs/oxlint-config-node'],
                children: [],
              },
            ],
          },
          {
            title: 'TypeScript',
            slug: 'typescript',
            depth: 3,
            packages: ['configs/tsconfig'],
            children: [],
          },
        ],
      },
      { title: 'AI', slug: 'ai', depth: 2, packages: ['tools/agent-hook'], children: [] },
    ]);
  });
});
