export function pathIn(...parts: string[]): string {
  return parts.filter((part) => part !== '' && part !== '.').join('/');
}
