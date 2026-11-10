import type { TextEdit } from '#src/features/split/SplitTypes.ts';

export function applyEdits(source: string, edits: TextEdit[], offset = 0): string {
  let text = source;
  for (const edit of edits.toSorted((left, right) => right.start - left.start)) {
    text = `${text.slice(0, edit.start - offset)}${edit.text}${text.slice(edit.end - offset)}`;
  }
  return text;
}
