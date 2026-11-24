import { basename, dirname } from 'node:path';
import { pathIn } from '#src/features/test-mirror/lib/pathIn.ts';
import type { MirrorScan } from '#src/features/test-mirror/TestMirrorTypes.ts';
import type { FileMove } from '#src/shared/violations/ViolationTypes.ts';

type OrphanHint = { hint: string; move?: FileMove };

function orphanHint(scan: MirrorScan, path: string, folders: readonly string[]): OrphanHint {
  const [folder, ...others] = folders;
  if (folder === undefined) {
    return {
      hint: `a unit test sits at the path of its source, under ${scan.unit}, move it there or delete it`,
    };
  }
  if (others.length > 0) {
    const listed = folders.map((found) => pathIn(scan.source, found)).join(', ');
    return { hint: `${listed} each hold one, move the test to the mirror of the one it tests` };
  }
  const to = pathIn(scan.unit, folder, basename(path));
  return {
    hint: `${pathIn(scan.source, folder)} holds one, run git mv ${path} ${to}`,
    move: { from: path, to },
  };
}

export function orphanTestViolation(
  scan: MirrorScan,
  test: string,
  name: string,
  folders: readonly string[],
) {
  const path = pathIn(scan.unit, test);
  const { hint, move } = orphanHint(scan, path, folders);
  const message = `${path} has no source named ${name} in ${pathIn(scan.source, dirname(test))}: ${hint}`;
  return move === undefined
    ? { rule: 'orphan-test', path, message }
    : { rule: 'orphan-test', path, message, move };
}
