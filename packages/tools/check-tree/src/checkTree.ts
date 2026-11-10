#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { treeViolations } from '#src/features/tree-violations/treeViolations.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { categories: { type: 'string' }, 'root-entries': { type: 'boolean' } },
});
const categories = values.categories?.split(',').map((category) => category.trim());
const violations = treeViolations(resolve(positionals[0] ?? 'src'), categories, {
  rootEntries: values['root-entries'] === true,
});
for (const violation of violations) console.error(violation);
process.exitCode = violations.length === 0 ? 0 : 1;
