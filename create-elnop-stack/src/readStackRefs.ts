import { existsSync, readFileSync } from 'node:fs';
import { isRecord } from './isRecord.ts';
import { STACK_REFS_URL } from './ScaffoldConfig.ts';

export function readStackRefs(): Map<string, string> {
  if (!existsSync(STACK_REFS_URL)) return new Map();
  const parsed: unknown = JSON.parse(readFileSync(STACK_REFS_URL, 'utf8'));
  if (!isRecord(parsed)) throw new Error('stackRefs.json is not an object');
  return new Map(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}
