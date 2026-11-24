import { isRecord } from '#src/shared/is-record/isRecord.ts';

export function npmOverrides(overrides: unknown, parent = ''): [string, string][] {
  if (!isRecord(overrides)) return [];
  return Object.entries(overrides).flatMap(([name, value]): [string, string][] => {
    const key = parent === '' ? name : `${parent}>${name}`;
    return typeof value === 'string' ? [[key, value]] : npmOverrides(value, key);
  });
}
