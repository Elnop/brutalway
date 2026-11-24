#!/usr/bin/env node
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { treeViolations } from '#src/features/tree-violations/treeViolations.ts';
import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sharedFeatureViolations } from '#src/features/shared-consumers/lib/sharedFeatureViolations.ts';
import { KNOWN_VIOLATIONS_FILE } from '#src/features/known-violations/KnownViolationsConfig.ts';
import { reportedViolations } from '#src/features/known-violations/lib/reportedViolations.ts';
import {
  shrinkKnownViolations,
  unknownViolations,
  writeKnownViolations,
} from '#src/features/known-violations/lib/knownViolations.ts';
import { readTreeSettings } from '#src/features/tree-settings/readTreeSettings.ts';
import { TEST_FOLDER, UNIT_FOLDER } from '#src/features/test-mirror/TestMirrorConfig.ts';
import { testMirrorViolations } from '#src/features/test-mirror/lib/testMirrorViolations.ts';
import { applyMoves } from '#src/features/test-mirror/lib/applyMoves.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    categories: { type: 'string' },
    platforms: { type: 'string' },
    'root-entries': { type: 'boolean' },
    fix: { type: 'boolean' },
    'write-known-violations': { type: 'boolean' },
    'shrink-known-violations': { type: 'boolean' },
  },
});
const folder = positionals[0] ?? 'src';
function listFlag(flag: string | undefined): string[] | undefined {
  return flag?.split(',').map((entry) => entry.trim());
}
try {
  if (values['write-known-violations'] === true && values['shrink-known-violations'] === true) {
    throw new Error(
      'pass either --write-known-violations, which writes every current violation, or --shrink-known-violations, which only removes the fixed ones',
    );
  }
  const settings = readTreeSettings('package.json');
  const categories = listFlag(values.categories) ?? settings.categories;
  const platforms = listFlag(values.platforms) ?? settings.platforms;
  async function currentViolations(): Promise<Violation[]> {
    return [
      ...treeViolations(resolve(folder), categories, {
        rootEntries: values['root-entries'] === true || settings.rootEntries === true,
        platforms,
      }),
      ...sharedFeatureViolations(folder, await cruiseImports(folder), platforms),
      ...testMirrorViolations(resolve(folder), platforms),
    ];
  }
  let violations = await currentViolations();
  if (values.fix === true) {
    const moves = reportedViolations(violations, KNOWN_VIOLATIONS_FILE).flatMap(
      ({ move }) => move ?? [],
    );
    const base = dirname(resolve(folder));
    const keep = [resolve(folder).slice(base.length + 1), `${TEST_FOLDER}/${UNIT_FOLDER}`];
    for (const { from, to } of applyMoves(base, moves, keep)) {
      process.stdout.write(`moved ${from} to ${to}\n`);
    }
    violations = await currentViolations();
  }
  if (values['write-known-violations'] === true) {
    writeKnownViolations(violations, KNOWN_VIOLATIONS_FILE);
  } else {
    if (values['shrink-known-violations'] === true) {
      shrinkKnownViolations(violations, KNOWN_VIOLATIONS_FILE);
    }
    const reported = unknownViolations(violations, KNOWN_VIOLATIONS_FILE);
    for (const violation of reported) console.error(violation);
    process.exitCode = reported.length === 0 ? 0 : 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
