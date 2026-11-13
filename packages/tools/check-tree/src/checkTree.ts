#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { treeViolations } from '#src/features/tree-violations/treeViolations.ts';
import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { categories: { type: 'string' }, 'root-entries': { type: 'boolean' } },
});
const folder = positionals[0] ?? 'src';
const categories = values.categories?.split(',').map((category) => category.trim());
try {
  const violations = [
    ...treeViolations(resolve(folder), categories, {
      rootEntries: values['root-entries'] === true,
    }),
    ...sharedConsumerViolations(folder, await cruiseImports(folder)),
  ];
  for (const violation of violations) console.error(violation);
  process.exitCode = violations.length === 0 ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
