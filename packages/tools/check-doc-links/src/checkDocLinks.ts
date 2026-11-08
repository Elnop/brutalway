#!/usr/bin/env node
import { projectContext } from '#src/features/local-links/lib/projectContext.ts';
import { resolveLocally } from '#src/features/local-links/lib/resolveLocally.ts';
import { linksToCheck } from '#src/features/markdown-links/lib/linksToCheck.ts';
import { checkRemoteLinks } from '#src/features/remote-links/lib/checkRemoteLinks.ts';
import type { ExternalLink, LinkResult } from '#src/shared-features/links/LinksTypes.ts';

function report(link: ExternalLink, result: LinkResult): string {
  if (result.verdict === 'dead') return `${link.doc}:${link.line} links to ${link.url}, which is gone (${result.reason}): fix the link or remove it.`;
  return `${link.doc}:${link.line} links to ${link.url}, which did not answer clearly (${result.reason}): not counted as broken, open it to check.`;
}

const cwd = process.cwd();
const links = linksToCheck(cwd);
const context = projectContext(cwd);
const results = new Map<string, LinkResult>();
const remote: string[] = [];
for (const url of new Set(links.map((link) => link.url))) {
  const local = resolveLocally(url, context);
  if (local === undefined) remote.push(url);
  else results.set(url, local);
}

const remoteCheck = await checkRemoteLinks(cwd, remote, Date.now());
if (remoteCheck.unchecked > 0) process.stderr.write(`check-doc-links: offline, ${remoteCheck.unchecked} external links not checked.\n`);
for (const [url, result] of remoteCheck.results) results.set(url, result);

let dead = 0;
for (const link of links) {
  const result = results.get(link.url);
  if (result === undefined || result.verdict === 'alive') continue;
  if (result.verdict === 'dead') dead += 1;
  process.stderr.write(`${report(link, result)}\n`);
}
process.exitCode = dead === 0 ? 0 : 1;
