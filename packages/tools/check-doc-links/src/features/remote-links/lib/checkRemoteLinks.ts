import { readCache, writeCache } from '#src/features/remote-links/lib/linkCache.ts';
import { linkClient } from '#src/features/remote-links/linkClient.ts';
import { CONCURRENCY } from '#src/features/remote-links/RemoteLinksConfig.ts';
import type { RemoteCheck } from '#src/features/remote-links/RemoteLinksTypes.ts';
import type { LinkResult } from '#src/shared-features/links/LinksTypes.ts';
import { inPool } from '#src/shared/inPool.ts';

export async function checkRemoteLinks(cwd: string, urls: string[], now: number): Promise<RemoteCheck> {
  const cached = readCache(cwd, now);
  const remote = urls.filter((url) => !cached.has(url));
  const results = new Map<string, LinkResult>();
  if (remote.length > 0 && !(await linkClient.isOnline())) return { results, unchecked: remote.length };
  const answers = await inPool(remote, CONCURRENCY, (url) => linkClient.requestUrl(url));
  for (const [index, url] of remote.entries()) {
    const answer = answers[index];
    if (answer !== undefined) results.set(url, answer);
  }
  writeCache(
    cwd,
    cached,
    remote.filter((url) => results.get(url)?.verdict !== 'dead'),
    now,
  );
  return { results, unchecked: 0 };
}
