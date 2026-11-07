export function classSelectors(selector: string): string[] {
  const text = selector.replaceAll(/:global\([^)]*\)|\[[^\]]*\]/gu, ' ');
  return [...text.matchAll(/\.(-?[_a-zA-Z][\w-]*)/gu)].map((match) => match[1] ?? '');
}
