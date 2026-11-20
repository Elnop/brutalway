#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { treeViolations } from '#src/features/tree-violations/treeViolations.ts';
import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sliceViolations } from '#src/features/shared-consumers/lib/sliceViolations.ts';
import { KNOWN_VIOLATIONS_FILE } from '#src/features/known-violations/KnownViolationsConfig.ts';
import {
  unknownViolations,
  writeKnownViolations,
} from '#src/features/known-violations/knownViolations.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    categories: { type: 'string' },
    platforms: { type: 'string' },
    'root-entries': { type: 'boolean' },
    'write-known-violations': { type: 'boolean' },
  },
});
const folder = positionals[0] ?? 'src';
const categories = values.categories?.split(',').map((category) => category.trim());
const platforms = values.platforms?.split(',').map((platform) => platform.trim());
try {
  const violations = [
    ...treeViolations(resolve(folder), categories, {
      rootEntries: values['root-entries'] === true,
      platforms,
    }),
    ...sliceViolations(folder, await cruiseImports(folder), platforms),
  ];
  if (values['write-known-violations'] === true) {
    writeKnownViolations(violations, KNOWN_VIOLATIONS_FILE);
  } else {
    const reported = unknownViolations(violations, KNOWN_VIOLATIONS_FILE);
    for (const violation of reported) console.error(violation);
    process.exitCode = reported.length === 0 ? 0 : 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
