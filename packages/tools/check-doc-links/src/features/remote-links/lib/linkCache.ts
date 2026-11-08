import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CACHE_MAX_AGE_MS } from '#src/features/remote-links/RemoteLinksConfig.ts';

function cachePath(cwd: string): string {
  return join(cwd, 'node_modules/.cache/check-doc-links.json');
}

export function readCache(cwd: string, now: number): Set<string> {
  const path = cachePath(cwd);
  if (!existsSync(path)) return new Set();
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null) return new Set();
  return new Set(Object.entries(parsed).flatMap(([url, checkedAt]) => (typeof checkedAt === 'number' && now - checkedAt < CACHE_MAX_AGE_MS ? [url] : [])));
}

export function writeCache(cwd: string, fresh: Set<string>, checked: string[], now: number): void {
  const path = cachePath(cwd);
  const previous: unknown = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
  const kept = typeof previous === 'object' && previous !== null ? Object.entries(previous).filter(([url]) => fresh.has(url)) : [];
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(Object.fromEntries([...kept, ...checked.map((url) => [url, now])]), undefined, 2)}\n`);
}
