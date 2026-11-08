import { externalLinks } from '#src/features/markdown-links/lib/externalLinks.ts';
import { markdownFiles } from '#src/features/markdown-links/lib/markdownFiles.ts';
import { readSettings } from '#src/features/markdown-links/lib/readSettings.ts';
import type { ExternalLink } from '#src/shared-features/links/LinksTypes.ts';

export function linksToCheck(cwd: string): ExternalLink[] {
  const settings = readSettings(cwd);
  const skipped = settings.skip.map((pattern) => new RegExp(pattern, 'u'));
  return markdownFiles(cwd, settings)
    .flatMap((doc) => externalLinks(doc))
    .filter((link) => !skipped.some((pattern) => pattern.test(link.url)));
}
