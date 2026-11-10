function escaped(text: string): string {
  return text.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);
}

export function stylesImport(componentText: string, stylesheet: string): string | undefined {
  const pattern = new RegExp(
    String.raw`import\s+([A-Za-z_$][\w$]*)\s+from\s+['"][^'"]*\b${escaped(stylesheet)}['"]`,
    'u',
  );
  return pattern.exec(componentText)?.[1];
}

export function usedClassNames(componentText: string, binding: string): Set<string> {
  const name = escaped(binding);
  const dotted = new RegExp(String.raw`\b${name}\.([A-Za-z_$][\w$]*)`, 'gu');
  const bracketed = new RegExp(String.raw`\b${name}\[\s*['"]([^'"]+)['"]\s*\]`, 'gu');
  return new Set(
    [...componentText.matchAll(dotted), ...componentText.matchAll(bracketed)].map(
      (match) => match[1] ?? '',
    ),
  );
}
