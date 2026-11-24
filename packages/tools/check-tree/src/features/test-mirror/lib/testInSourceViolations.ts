import { TEST_FILE } from '#src/features/test-mirror/TestMirrorConfig.ts';
import { pathIn } from '#src/features/test-mirror/lib/pathIn.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function testInSourceViolations(
  source: string,
  unit: string,
  files: readonly string[],
): Violation[] {
  return files
    .filter((file) => TEST_FILE.test(file))
    .map((file) => {
      const from = pathIn(source, file);
      const to = pathIn(unit, file);
      return {
        rule: 'test-in-source',
        path: from,
        message: `${from} is a test: move it to ${to}, where ${unit} mirrors ${source}`,
        move: { from, to },
      };
    });
}
