import {
  CHECK_TREE_FILE,
  DEPCRUISE_FILE,
  JSCPD_FILE,
  KNIP_FILE,
  KNIP_LISTS,
} from '#src/features/counts/CountsConfig.ts';
import { field } from '#src/features/counts/lib/field.ts';
import { parseJson } from '#src/features/counts/lib/parseJson.ts';
import { sizeOf } from '#src/features/counts/lib/sizeOf.ts';
import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';

function entries(snapshot: Snapshot, file: string): unknown[] {
  const parsed = parseJson(snapshot.read(file), file);
  return Array.isArray(parsed) ? parsed : [];
}

function checkTreeCount(entry: unknown): [string, number] {
  const rule = field(entry, 'rule');
  const count = field(entry, 'count');
  return [
    `check-tree ${typeof rule === 'string' ? rule : 'entry'}`,
    typeof count === 'number' ? count : 1,
  ];
}

function depcruiseCount(entry: unknown): [string, number] {
  const rule = field(field(entry, 'rule'), 'name');
  return [`dependency-cruiser ${typeof rule === 'string' ? rule : 'entry'}`, 1];
}

export function listFileCounts(snapshot: Snapshot): [string, number][] {
  const knip = parseJson(snapshot.read(KNIP_FILE), KNIP_FILE);
  const jscpd = parseJson(snapshot.read(JSCPD_FILE), JSCPD_FILE);
  return [
    ...entries(snapshot, CHECK_TREE_FILE).map(checkTreeCount),
    ...entries(snapshot, DEPCRUISE_FILE).map(depcruiseCount),
    ...[...KNIP_LISTS, 'ignoreIssues'].map((key): [string, number] => [
      `knip ${key}`,
      sizeOf(field(knip, key)),
    ]),
    ['jscpd ignore', sizeOf(field(jscpd, 'ignore'))],
  ];
}
