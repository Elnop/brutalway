import { dropSection } from '#src/features/scaffolding/lib/dropSection.ts';
import type { FileEdit } from '#src/shared-features/stack/StackTypes.ts';

function dropLines(text: string, needle: string): string {
  const lines = text.split('\n');
  const kept = lines.filter((line) => !line.includes(needle));
  if (kept.length === lines.length) throw new Error(`no line contains "${needle}"`);
  return kept.join('\n').replaceAll(/\n{3,}/gu, '\n\n');
}

function replaceText(text: string, search: string, replacement: string, all: boolean): string {
  const count = text.split(search).length - 1;
  if (all && count === 0) throw new Error(`"${search}" not found`);
  if (!all && count !== 1) throw new Error(`expected "${search}" once, found it ${count} times`);
  return all ? text.replaceAll(search, () => replacement) : text.replace(search, () => replacement);
}

function insertText(
  text: string,
  anchor: string,
  insertion: string,
  position: 'after' | 'before',
): string {
  const count = text.split(anchor).length - 1;
  if (count !== 1) throw new Error(`expected the anchor "${anchor}" once, found it ${count} times`);
  return text.replace(anchor, () =>
    position === 'after' ? `${anchor}${insertion}` : `${insertion}${anchor}`,
  );
}

export function applyFileEdit(text: string, edit: FileEdit): string {
  if ('replace' in edit) return replaceText(text, edit.replace, edit.with, edit.all === true);
  if ('after' in edit) return insertText(text, edit.after, edit.insert, 'after');
  if ('before' in edit) return insertText(text, edit.before, edit.insert, 'before');
  if ('dropLines' in edit) return dropLines(text, edit.dropLines);
  return dropSection(text, edit.dropSection);
}
