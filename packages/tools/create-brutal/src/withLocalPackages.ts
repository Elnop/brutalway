import { isRecord } from './isRecord.ts';

function pointToTarballs(dependencies: unknown, tarballs: Map<string, string>): unknown {
  if (!isRecord(dependencies)) return dependencies;
  return Object.fromEntries(Object.entries(dependencies).map(([name, range]) => [name, tarballs.has(name) ? `file:${tarballs.get(name) ?? ''}` : range]));
}

export function withLocalPackages(manifestText: string, tarballs: Map<string, string>): string {
  const manifest: unknown = JSON.parse(manifestText);
  if (!isRecord(manifest)) throw new Error('package.json is not an object');
  const overrides = isRecord(manifest['overrides']) ? manifest['overrides'] : {};
  const local = Object.fromEntries([...tarballs].map(([name, path]) => [name, `file:${path}`]));
  const rewritten = {
    ...manifest,
    dependencies: pointToTarballs(manifest['dependencies'], tarballs),
    devDependencies: pointToTarballs(manifest['devDependencies'], tarballs),
    overrides: { ...overrides, ...local },
  };
  return `${JSON.stringify(rewritten, null, 2)}\n`;
}

function restoredRecord(after: unknown, original: unknown): unknown {
  if (!isRecord(after)) return original;
  return { ...after, ...(isRecord(original) ? original : {}) };
}

export function withoutLocalPackages(manifestText: string, originalText: string): string {
  const manifest: unknown = JSON.parse(manifestText);
  const original: unknown = JSON.parse(originalText);
  if (!isRecord(manifest) || !isRecord(original)) throw new Error('package.json is not an object');
  const { overrides: _local, ...rest } = manifest;
  const restored = {
    ...rest,
    dependencies: restoredRecord(manifest['dependencies'], original['dependencies']),
    devDependencies: restoredRecord(manifest['devDependencies'], original['devDependencies']),
    ...(original['overrides'] === undefined ? {} : { overrides: original['overrides'] }),
  };
  return `${JSON.stringify(restored, null, 2)}\n`;
}
