import { basename, dirname, join } from 'node:path';
import { TEST_FOLDER, UNIT_FOLDER } from '#src/features/test-mirror/TestMirrorConfig.ts';
import { testFolderViolations } from '#src/features/test-mirror/lib/testFolderViolations.ts';
import { testInSourceViolations } from '#src/features/test-mirror/lib/testInSourceViolations.ts';
import { treeEntries } from '#src/features/test-mirror/lib/treeEntries.ts';
import { unitTestViolations } from '#src/features/test-mirror/lib/unitTestViolations.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function testMirrorViolations(
  sourceRoot: string,
  platforms?: readonly string[],
): Violation[] {
  const base = dirname(sourceRoot);
  const unit = `${TEST_FOLDER}/${UNIT_FOLDER}`;
  const scan = {
    source: basename(sourceRoot),
    unit,
    sources: treeEntries(sourceRoot),
    platforms,
  };
  return [
    ...testInSourceViolations(scan.source, unit, scan.sources.files),
    ...testFolderViolations(base, scan.source),
    ...unitTestViolations(scan, treeEntries(join(base, unit))),
  ];
}
