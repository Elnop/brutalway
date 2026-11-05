import type { FileEdit } from './StackTypes.ts';

function headingLevel(line: string): number {
  return /^(#+) /u.exec(line)?.[1]?.length ?? 0;
}

function dropSection(text: string, heading: string): string {
  const lines = text.split('\n');
  const start = lines.indexOf(heading);
  if (start === -1) throw new Error(`section "${heading}" not found`);
  const level = headingLevel(heading);
  const length = lines.slice(start + 1).findIndex((line) => {
    const lineLevel = headingLevel(line);
    return lineLevel > 0 && lineLevel <= level;
  });
  lines.splice(start, length === -1 ? lines.length - start : length + 1);
  return `${lines.join('\n').trimEnd()}\n`;
}

function dropLines(text: string, needle: string): string {
  const lines = text.split('\n');
  const kept = lines.filter((line) => !line.includes(needle));
  if (kept.length === lines.length) throw new Error(`no line contains "${needle}"`);
  return kept.join('\n').replaceAll(/\n{3,}/gu, '\n\n');
}

function replaceOnce(text: string, search: string, replacement: string): string {
  const count = text.split(search).length - 1;
  if (count !== 1) throw new Error(`expected "${search}" once, found it ${count} times`);
  return text.replace(search, () => replacement);
}

export function applyFileEdit(text: string, edit: FileEdit): string {
  if ('replace' in edit) return replaceOnce(text, edit.replace, edit.with);
  if ('dropLines' in edit) return dropLines(text, edit.dropLines);
  return dropSection(text, edit.dropSection);
}
