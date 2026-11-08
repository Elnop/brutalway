import { matchesGlob } from 'node:path';
import type { Citation } from '#src/features/citations/DocSourcesTypes.ts';

export function staleCitations(cited: Citation[], changed: Set<string>, ignoreSources: string[]): Citation[] {
  return cited.filter((citation) => changed.has(citation.file) && !changed.has(citation.doc) && !ignoreSources.some((pattern) => matchesGlob(citation.file, pattern)));
}
