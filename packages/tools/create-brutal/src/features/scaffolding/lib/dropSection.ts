function headingLevel(line: string): number {
  return /^(#+) /u.exec(line)?.[1]?.length ?? 0;
}

export function dropSection(text: string, heading: string): string {
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
