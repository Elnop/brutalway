function directiveKeys(line: string): string[] {
  const [head = ''] = line.replace(/^(?:\/\/|\/\*)\s*/u, '').split(/\s--(?:\s|$)/u);
  const [directive = '', ...rules] = head
    .trim()
    .split(/[\s,]+/u)
    .filter((word) => word !== '');
  const base = directive.replace(/-(?:next-line|line)$/u, '');
  if (!base.endsWith('-disable')) return [base];
  return rules.length === 0 ? [`${base} (every rule)`] : rules.map((rule) => `${base} ${rule}`);
}

export function directiveCounts(lines: readonly string[]): [string, number][] {
  return lines.flatMap((line) => directiveKeys(line).map((key): [string, number] => [key, 1]));
}
