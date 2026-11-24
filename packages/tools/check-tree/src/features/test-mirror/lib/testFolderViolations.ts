import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TEST_FOLDER, TEST_FOLDERS } from '#src/features/test-mirror/TestMirrorConfig.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function testFolderViolations(base: string, source: string): Violation[] {
  const root = join(base, TEST_FOLDER);
  if (!existsSync(root)) return [];
  const folders = TEST_FOLDERS.map((folder) => `${folder}/`).join(', ');
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => !entry.isDirectory() || !TEST_FOLDERS.includes(entry.name))
    .map((entry) => entry.name)
    .toSorted()
    .map((name) => {
      const path = `${TEST_FOLDER}/${name}`;
      return {
        rule: 'not-a-test-folder',
        path,
        message: `${path} is not a folder of ${TEST_FOLDER}/, which holds ${folders} only: unit/ mirrors ${source}/ with its unit tests, e2e/ holds the end-to-end tests and support/ the helpers they share`,
      };
    });
}
