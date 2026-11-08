import type { LongDoc } from '#src/features/length-check/LengthCheckTypes.ts';
import type { DocLengthSettings, WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

export function longDocs(files: WrittenFile[], settings: DocLengthSettings): LongDoc[] {
  return files.map((file) => ({ path: file.path, lines: file.content.split('\n').length - (file.content.endsWith('\n') ? 1 : 0) })).filter((doc) => doc.lines > settings.maxLines);
}
