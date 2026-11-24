import { dirname } from 'node:path';
import { TEST_FILE } from '#src/features/test-mirror/TestMirrorConfig.ts';
import type { MirrorScan, TreeEntries } from '#src/features/test-mirror/TestMirrorTypes.ts';
import { orphanTestViolation } from '#src/features/test-mirror/lib/orphanTestViolation.ts';
import { pathIn } from '#src/features/test-mirror/lib/pathIn.ts';
import { isSource, unitName } from '#src/features/test-mirror/lib/unitName.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

function folderOf(file: string): string {
  const folder = dirname(file);
  return folder === '.' ? '' : folder;
}

function foldersByName(scan: MirrorScan): Map<string, string[]> {
  const folders = new Map<string, string[]>();
  for (const file of scan.sources.files.filter(isSource)) {
    const name = unitName(file, scan.platforms);
    const known = folders.get(name) ?? [];
    if (!known.includes(folderOf(file))) folders.set(name, [...known, folderOf(file)]);
  }
  return folders;
}

function folderViolations(scan: MirrorScan, tests: TreeEntries): Violation[] {
  const mirrored = new Set(['', ...scan.sources.folders]);
  return tests.folders.flatMap((folder) => {
    const path = pathIn(scan.unit, folder);
    if (!mirrored.has(folder)) {
      if (!mirrored.has(folderOf(folder))) return [];
      return [
        {
          rule: 'orphan-test-folder',
          path,
          message: `${path} has no counterpart ${pathIn(scan.source, folder)}: move its tests to the mirror of their sources, or delete it`,
        },
      ];
    }
    const holds = [...tests.files, ...tests.folders].some((entry) =>
      entry.startsWith(`${folder}/`),
    );
    if (holds) return [];
    return [{ rule: 'empty-folder', path, message: `${path} is empty: delete it` }];
  });
}

function fileViolations(scan: MirrorScan, tests: TreeEntries): Violation[] {
  const folders = foldersByName(scan);
  return tests.files.flatMap((test) => {
    const path = pathIn(scan.unit, test);
    if (!TEST_FILE.test(test)) {
      return [
        {
          rule: 'not-a-test',
          path,
          message: `${path} is not a test: ${scan.unit} only holds the unit tests of ${scan.source}, move it into test/support`,
        },
      ];
    }
    const name = unitName(test, scan.platforms);
    const found = folders.get(name) ?? [];
    if (found.includes(folderOf(test))) return [];
    return [orphanTestViolation(scan, test, name, found)];
  });
}

export function unitTestViolations(scan: MirrorScan, tests: TreeEntries): Violation[] {
  return [...folderViolations(scan, tests), ...fileViolations(scan, tests)];
}
