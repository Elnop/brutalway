#!/usr/bin/env node
import { CONCURRENCY } from './DocLinksConfig.ts';
import type { ExternalLink, LinkResult } from './DocLinksTypes.ts';
import { externalLinks } from './externalLinks.ts';
import { inPool } from './inPool.ts';
import { isOnline } from './isOnline.ts';
import { readCache, writeCache } from './linkCache.ts';
import { markdownFiles } from './markdownFiles.ts';
import { projectContext } from './projectContext.ts';
import { readSettings } from './readSettings.ts';
import { requestUrl } from './requestUrl.ts';
import { resolveLocally } from './resolveLocally.ts';

const cwd = process.cwd();
const now = Date.now();
const settings = readSettings(cwd);
const skipped = settings.skip.map((pattern) => new RegExp(pattern, 'u'));
const links = markdownFiles(cwd, settings)
  .flatMap((doc) => externalLinks(doc))
  .filter((link) => !skipped.some((pattern) => pattern.test(link.url)));
const context = projectContext(cwd);
const cached = readCache(cwd, now);
const results = new Map<string, LinkResult>();
const remote: string[] = [];
for (const url of new Set(links.map((link) => link.url))) {
  const local = resolveLocally(url, context);
  if (local !== undefined) results.set(url, local);
  else if (!cached.has(url)) remote.push(url);
}

if (remote.length > 0 && !(await isOnline())) {
  process.stderr.write(`check-doc-links: offline, ${remote.length} external links not checked.\n`);
} else {
  const answers = await inPool(remote, CONCURRENCY, (url) => requestUrl(url));
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
}

function report(link: ExternalLink, result: LinkResult): string {
  if (result.verdict === 'dead') return `${link.doc}:${link.line} links to ${link.url}, which is gone (${result.reason}): fix the link or remove it.`;
  return `${link.doc}:${link.line} links to ${link.url}, which did not answer clearly (${result.reason}): not counted as broken, open it to check.`;
}

let dead = 0;
for (const link of links) {
  const result = results.get(link.url);
  if (result === undefined || result.verdict === 'alive') continue;
  if (result.verdict === 'dead') dead += 1;
  process.stderr.write(`${report(link, result)}\n`);
}
process.exitCode = dead === 0 ? 0 : 1;
